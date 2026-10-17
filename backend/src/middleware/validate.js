// Validate incoming request against a Zod schema
export const validate = (schema) => (req, res, next) => {
  try {
    if (schema.body) {
      req.body = schema.body.parse(req.body);
    }
    if (schema.query) {
      req.query = schema.query.parse(req.query);
    }
    if (schema.params) {
      req.params = schema.params.parse(req.params);
    }
    return next();
  } catch (err) {
    if (err.errors) {
      const formattedErrors = err.errors.map((errorItem) => ({
        field: errorItem.path.join('.'),
        message: errorItem.message,
      }));
      const firstErrorMessage = formattedErrors[0]?.message || 'Validation error';
      return res.status(400).json({
        success: false,
        error: firstErrorMessage,
        message: firstErrorMessage,
        errors: formattedErrors,
      });
    }
    return next(err);
  }
};
