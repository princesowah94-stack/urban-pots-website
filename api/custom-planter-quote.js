import nodemailer from 'nodemailer';

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
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { designs, formData } = req.body;

    if (!formData?.name || !formData?.email || !formData?.phone) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (!designs || designs.length === 0) {
      return res.status(400).json({ error: 'No designs provided' });
    }

    // Build designs summary
    const designsSummary = designs.map((d, idx) => `
Design ${idx + 1}:
- Dimensions: ${d.length} × ${d.width} × ${d.height} mm
- Wall Thickness: ${d.thickness} mm
- Material: ${d.material === 'fibre-cement' ? 'Fibre Cement' : 'Fibreglass'}
- Colour: ${d.colour}
- Quantity: ${d.quantity}
- Price: $${(d.price / 100).toFixed(2)}
`).join('\n');

    // Email to Urban Pots
    const emailBody = `
New Custom Planter Boxes Quote Request

CUSTOMER DETAILS:
Name: ${formData.name}
Email: ${formData.email}
Phone: ${formData.phone}
Company: ${formData.company || 'Not provided'}
ABN: ${formData.abn || 'Not provided'}

PROJECT DETAILS:
Project Type: ${formData.projectType || 'Not specified'}
Timeline: ${formData.timeline || 'Not specified'}
Notes: ${formData.notes || 'None'}

DESIGNS REQUESTED:
${designsSummary}

TOTAL DESIGNS: ${designs.length}

---
This quote request was submitted via the Custom Planter Boxes configurator at urban-pots.vercel.app
    `;

    // Send to Urban Pots
    await transporter.sendMail({
      from: process.env.SMTP_FROM || 'noreply@urbanpots.com.au',
      to: 'info@urbanpots.com.au',
      subject: `New Custom Planter Quote Request from ${formData.name}`,
      text: emailBody,
      replyTo: formData.email,
    });

    // Confirmation to customer
    await transporter.sendMail({
      from: process.env.SMTP_FROM || 'noreply@urbanpots.com.au',
      to: formData.email,
      subject: 'We received your custom planter quote request',
      text: `Hi ${formData.name},

Thank you for submitting your custom planter boxes quote request to Urban Pots. We've received your request and will review your ${designs.length} design(s).

Our team will contact you within 24 hours to discuss your project, confirm specifications, and provide a detailed quote.

Your Quote Details:
${designsSummary}

If you have any questions in the meantime, please don't hesitate to contact us:
Phone: 0433 132 406
Email: info@urbanpots.com.au

Best regards,
The Urban Pots Team
      `,
    });

    return res.status(200).json({ success: true, message: 'Quote submitted successfully' });
  } catch (error) {
    console.error('Error processing quote:', error);
    return res.status(500).json({ error: 'Failed to submit quote', details: error.message });
  }
}
