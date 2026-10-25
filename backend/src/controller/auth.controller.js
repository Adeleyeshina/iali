import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../db.js';
import { calculateProfileCompleteness } from '../service/completeness.service.js';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';
const JWT_EXPIRES_IN = '7d';

const setAuthCookies = (res, user, token) => {
  // Role cookie accessible by client
  res.cookie('role', user.role, {
    httpOnly: false,
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  // Authentication token cookie
  res.cookie('token', token, {
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

// Register a new user: POST /api/auth/signup
export const signup = async (req, res) => {
  try {
    const {
      email,
      password,
      role = 'candidate',
      phone,
      name,
      availability,
      companyName: customCompanyName,
      city,
    } = req.body;
    const normalizedEmail = email.toLowerCase().trim();

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: 'A user with this email already exists',
        message: 'A user with this email already exists',
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const confirmToken = crypto.randomBytes(24).toString('hex');

    // Create user in database
    const user = await prisma.user.create({
      data: {
        email: normalizedEmail,
        password: hashedPassword,
        name: name || null,
        role,
        phone: phone || null,
        confirmToken,
        isConfirmed: false,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        phone: true,
        confirmToken: true,
        createdAt: true,
      },
    });

    // If candidate, automatically set up initial profile with employment status
    let createdProfile = null;
    if (role === 'candidate') {
      createdProfile = await prisma.profile.create({
        data: {
          userId: user.id,
          availability: availability || 'Actively looking for a job',
          city: city ? city.trim() : 'Nigeria',
          searchable: true,
        },
      });
    }

    // If recruiter, automatically set up initial company and membership
    if (role === 'recruiter') {
      const domain = normalizedEmail.split('@')[1] || 'company.ng';
      const companyName = customCompanyName?.trim() || (domain.split('.')[0].toUpperCase() + ' Ltd');

      const company = await prisma.company.create({
        data: {
          name: companyName,
          verificationLevel: 'L2',
        },
      });

      await prisma.membership.create({
        data: {
          userId: user.id,
          companyId: company.id,
          role: 'admin',
          verified: true,
        },
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    // Set role and token cookies
    setAuthCookies(res, user, token);

    const safeUser = {
      ...user,
      profile: createdProfile,
    };

    return res.status(201).json({
      success: true,
      message: 'Account created successfully',
      id: user.id,
      email: user.email,
      confirmToken: user.confirmToken,
      token,
      user: safeUser,
    });
  } catch (error) {
    console.error('[Signup Error]:', error);
    return res.status(500).json({
      success: false,
      error: 'An error occurred during signup',
      message: 'An error occurred during signup',
    });
  }
};

// Confirm user email: POST /api/auth/confirm
export const confirm = async (req, res) => {
  try {
    const { token } = req.body;

    const user = await prisma.user.findFirst({
      where: { confirmToken: token },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        error: 'Invalid or expired confirmation token',
        message: 'Invalid or expired confirmation token',
      });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        isConfirmed: true,
        confirmToken: null,
      },
    });

    return res.status(200).json({
      success: true,
      ok: true,
      message: 'Email confirmed successfully',
    });
  } catch (error) {
    console.error('[Confirm Error]:', error);
    return res.status(500).json({
      success: false,
      error: 'An error occurred confirming email',
      message: 'An error occurred confirming email',
    });
  }
};

// Authenticate existing user: POST /api/auth/login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = email.toLowerCase().trim();

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      include: {
        profile: true,
        memberships: {
          include: {
            company: true,
          },
        },
      },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password',
        message: 'Invalid email or password',
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password',
        message: 'Invalid email or password',
      });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    // Set role and token cookies
    setAuthCookies(res, user, token);

    const safeUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      phone: user.phone,
      isConfirmed: user.isConfirmed,
      createdAt: user.createdAt,
      profile: user.profile,
      memberships: user.memberships,
    };

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: safeUser,
    });
  } catch (error) {
    console.error('[Login Error]:', error);
    // Graceful Neon PostgreSQL cold start / connection recovery
    if (error.code === 'P1001' || error.message?.includes("Can't reach database server")) {
      return res.status(503).json({ success: false, error: 'Database service is warming up. Please retry in a few seconds.' });
    }
    return res.status(500).json({
      success: false,
      error: 'An error occurred during login',
      message: 'An error occurred during login',
    });
  }
};

// Get current user profile: GET /api/me & GET /api/auth/me
export const getMe = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        phone: true,
        isConfirmed: true,
        createdAt: true,
        updatedAt: true,
        profile: true,
        memberships: {
          include: {
            company: true,
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
        message: 'User not found',
      });
    }

    // Refresh role cookie
    res.cookie('role', user.role, {
      httpOnly: false,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    if (user.profile) {
      user.profile.completeness = calculateProfileCompleteness(user.profile, user);
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error('[GetMe Error]:', error);
    // Graceful Neon PostgreSQL cold start / connection recovery
    if (error.code === 'P1001' || error.message?.includes("Can't reach database server")) {
      return res.status(503).json({ success: false, error: 'Database service is warming up. Please retry shortly.' });
    }
    return res.status(500).json({
      success: false,
      error: 'An error occurred fetching profile',
      message: 'An error occurred fetching profile',
    });
  }
};
