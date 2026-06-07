import nodemailer from 'nodemailer';

// Configure nodemailer transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT || 587,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, phone, company, abn, diameter, quantity, height, colourSelect, colourCustom, requirements } = req.body;

    // Validate required fields
    if (!name || !email || !phone || !diameter || !quantity || !height) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Determine colour to display
    const colour = colourCustom && colourSelect === 'Custom' ? colourCustom : colourSelect;

    // Build email body
    const emailBody = `
New Custom Cylinders Enquiry

CUSTOMER DETAILS:
Name: ${name}
Email: ${email}
Phone: ${phone}
Company: ${company || 'Not provided'}
ABN: ${abn || 'Not provided'}

PRODUCT SPECIFICATIONS:
Diameter: ${diameter}
Quantity: ${quantity}
Height: ${height}
Colour: ${colour}

SPECIAL REQUIREMENTS:
${requirements || 'None'}

---
This enquiry was submitted via the Custom Cylinders form at urban-pots.vercel.app
    `;

    // Send email to Urban Pots
    await transporter.sendMail({
      from: process.env.SMTP_FROM || 'noreply@urbanpots.com.au',
      to: 'info@urbanpots.com.au',
      subject: `New Custom Cylinders Enquiry from ${name}`,
      text: emailBody,
      replyTo: email,
    });

    // Optional: Send confirmation email to customer
    await transporter.sendMail({
      from: process.env.SMTP_FROM || 'noreply@urbanpots.com.au',
      to: email,
      subject: 'We received your Custom Cylinders enquiry',
      text: `Hi ${name},

Thank you for submitting your custom cylinders enquiry to Urban Pots. We've received your request and will be in touch within 24 hours to discuss your project.

Your Enquiry Details:
- Diameter: ${diameter}
- Height: ${height}
- Quantity: ${quantity}
- Colour: ${colour}

If you have any questions in the meantime, please don't hesitate to contact us:
Phone: 0433 132 406
Email: info@urbanpots.com.au

Best regards,
The Urban Pots Team
      `,
    });

    return res.status(200).json({ success: true, message: 'Enquiry submitted successfully' });
  } catch (error) {
    console.error('Error processing enquiry:', error);
    return res.status(500).json({ error: 'Failed to submit enquiry', details: error.message });
  }
}
