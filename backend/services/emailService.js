const nodemailer = require('nodemailer');

// SOLUTION 2: Alternative Configuration (Port 465 - SSL)
const createSSLTransporter = () => {
    const user = process.env.EMAIL_USER.trim();
    const pass = process.env.EMAIL_PASSWORD.trim();

    return nodemailer.createTransport({
        host: process.env.EMAIL_HOST || 'smtp.hostinger.com',
        port: 465,
        secure: true, // true for 465
        auth: {
            user: user,
            pass: pass
        },
        tls: {
            rejectUnauthorized: false
        }
    });
};

// SOLUTION 3: Using Domain SMTP
const createDomainTransporter = () => {
    const user = process.env.EMAIL_USER.trim();
    const pass = process.env.EMAIL_PASSWORD.trim();
    
    // Extract domain from email
    const domain = user.split('@')[1];

    return nodemailer.createTransport({
        host: `mail.${domain}`, // e.g., mail.booksnpdf.com
        port: 587,
        secure: false,
        auth: {
            user: user,
            pass: pass
        },
        tls: {
            rejectUnauthorized: false
        }
    });
};

// Send OTP email with retry logic
exports.sendOTPEmail = async (email, otp, fullName) => {
    
    const mailOptions = {
        from: `"PDF eBooks Marketplace" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Password Reset OTP - PDF eBooks Marketplace',
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        line-height: 1.6;
                        color: #333;
                    }
                    .container {
                        max-width: 600px;
                        margin: 0 auto;
                        padding: 20px;
                        background-color: #f9f9f9;
                    }
                    .content {
                        background-color: white;
                        padding: 30px;
                        border-radius: 10px;
                        box-shadow: 0 2px 5px rgba(0,0,0,0.1);
                    }
                    .header {
                        text-align: center;
                        margin-bottom: 30px;
                    }
                    .header h1 {
                        color: #4F46E5;
                        margin: 0;
                    }
                    .otp-box {
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        color: white;
                        padding: 20px;
                        border-radius: 10px;
                        text-align: center;
                        margin: 30px 0;
                    }
                    .otp-code {
                        font-size: 36px;
                        font-weight: bold;
                        letter-spacing: 8px;
                        margin: 10px 0;
                    }
                    .footer {
                        text-align: center;
                        margin-top: 30px;
                        color: #666;
                        font-size: 12px;
                    }
                    .warning {
                        background-color: #FEF3C7;
                        padding: 15px;
                        border-radius: 5px;
                        margin-top: 20px;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="content">
                        <div class="header">
                            <h1>🔐 Password Reset Request</h1>
                        </div>
                        
                        <p>Hello ${fullName || 'User'},</p>
                        
                        <p>We received a request to reset your password for your PDF eBooks Marketplace account.</p>
                        
                        <p>Your One-Time Password (OTP) is:</p>
                        
                        <div class="otp-box">
                            <div style="font-size: 14px; opacity: 0.9;">Your OTP Code</div>
                            <div class="otp-code">${otp}</div>
                            <div style="font-size: 12px; opacity: 0.8;">Valid for 10 minutes</div>
                        </div>
                        
                        <p>Please enter this OTP on the password reset page to continue.</p>
                        
                        <div class="warning">
                            <strong>⚠️ Important:</strong>
                            <ul>
                                <li>This OTP will expire in 10 minutes</li>
                                <li>You have 5 attempts to enter the correct OTP</li>
                                <li>If you didn't request this, please ignore this email</li>
                                <li>Do not share this OTP with anyone</li>
                            </ul>
                        </div>
                        
                        <p>Best regards,<br>PDF eBooks Marketplace Team</p>
                    </div>
                    
                    <div class="footer">
                        <p>This is an automated email, please do not reply.</p>
                        <p>&copy; 2025 BooksnPDF. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
        `
    };
    
    // Only try the two main configurations (skip domain SMTP)
    const transporters = [
        { name: 'Port 465 (SSL)', create: createSSLTransporter }
    ];

    let lastError = null;

    for (const config of transporters) {
        try {
            const transporter = config.create();
            
            // Verify connection
            await transporter.verify();
            
            
            // Send email
            const info = await transporter.sendMail(mailOptions);
            return { success: true, messageId: info.messageId, method: config.name };
            
        } catch (error) {
            lastError = error;
            continue; // Try next configuration
        }
    }

    // If all configurations failed
    throw new Error('Failed to send email: ' + lastError.message);
};

// Test email connection
exports.testEmailConnection = async () => {
    
    const configs = [
        { name: 'Port 465 (SSL)', create: createSSLTransporter },
        { name: 'Domain SMTP', create: createDomainTransporter }
    ];

    const results = [];

    for (const config of configs) {
        try {
            const transporter = config.create();
            await transporter.verify();
            results.push({ name: config.name, status: 'success' });
        } catch (error) {
            results.push({ name: config.name, status: 'failed', error: error.message });
        }
    }

    return results;
};
