// Application status email notification service

export async function sendApplicationStatusNotification({
  candidateEmail,
  candidateName,
  jobTitle,
  companyName,
  oldStatus,
  newStatus,
  changedByRole = 'Recruiter',
}) {
  try {
    const timestamp = new Date().toISOString();
    const formattedDate = new Date().toLocaleString('en-NG', { timeZone: 'Africa/Lagos' });

    console.log(`\n======================================================`);
    console.log(`[Iali Email Notification] Status Change Triggered`);
    console.log(`Time:       ${formattedDate} (${timestamp})`);
    console.log(`Recipient:  ${candidateName ? `${candidateName} <${candidateEmail}>` : candidateEmail}`);
    console.log(`Subject:    Application update: "${jobTitle}" at ${companyName || 'Employer'}`);
    console.log(`Transition: ${oldStatus || 'Initial'} -> ${newStatus}`);
    console.log(`Updated by: ${changedByRole}`);
    console.log(`Body:`);
    console.log(`  Hello ${candidateName || 'Candidate'},`);
    console.log(`  The hiring team at ${companyName || 'the employer'} has updated your application`);
    console.log(`  for "${jobTitle}" to: [${newStatus}].`);
    console.log(`  Track your status timeline live at: https://iali.ng/applications`);
    console.log(`======================================================\n`);

    return {
      success: true,
      delivered: true,
      mock: true,
      timestamp,
    };
  } catch (error) {
    console.error('[Notification Service Error]:', error.message);
    return { success: false, error: error.message };
  }
}
