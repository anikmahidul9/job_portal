import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user:process.env.GMAIL_USER,
        pass:process.env.GMAIL_APP_PASSWORD,
    }
});


const statusTemplates = {
    interview_invited: (data) => ({
        subject: `Interview Invitation for ${data.jobTitle}`,
        html: `
            <p>Dear ${data.userName},</p>
            <p>We're pleased to invite you for an interview for ${data.jobTitle}.</p>
            ${data.interviewDetails ? `
            <p><strong>Interview Details:</strong></p>
            <ul>
                <li>Date: ${data.interviewDetails.date}</li>
                <li>Time: ${data.interviewDetails.time}</li>
                <li>Location: ${data.interviewDetails.location}</li>
                ${data.interviewDetails.notes ? `<li>Notes: ${data.interviewDetails.notes}</li>` : ''}
            </ul>
            ` : ''}
            <p>Best regards,<br>Hiring Team</p>
        `
    }),
    hired: (data) => ({
        subject: `Congratulations! You've been hired for ${data.jobTitle}`,
        html: `
            <p>Dear ${data.userName},</p>
            <p>We're thrilled to inform you that you've been selected for ${data.jobTitle}!</p>
            <p>Our HR team will contact you shortly with next steps.</p>
            <p>Welcome aboard!</p>
            <p>Best regards,<br>Hiring Team</p>
        `
    }),
    rejected: (data) => ({
        subject: `Application Update for ${data.jobTitle}`,
        html: `
            <p>Dear ${data.userName},</p>
            <p>Thank you for applying for ${data.jobTitle}.</p>
            <p>After careful consideration, we've decided to move forward with other candidates.</p>
            <p>We appreciate your time and interest in our company.</p>
            <p>Best regards,<br>Hiring Team</p>
        `
    })
};

export const sendStatusEmail = async ({ to, userName, jobTitle, status, interviewDetails }) => {
    if (!statusTemplates[status]) return;
    
    const template = statusTemplates[status]({ userName, jobTitle, interviewDetails });
    
    await transporter.sendMail({
        from: `"Hiring Team" <${"franco37@ethereal.email"}>`,
        to,
        subject: template.subject,
        html: template.html
    });
};