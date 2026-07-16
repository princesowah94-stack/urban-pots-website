import nodemailer from 'nodemailer';

// Shared SMTP transporter (same pattern as the other /api routes).
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT || 587,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Fields we don't want echoed back in the email body.
const HIDDEN = new Set(['confirm', 'designs', 'submittedAt', 'source']);

// Turn a flat enquiry object into a readable "Label: value" list.
function formatFields(obj) {
  return Object.entries(obj)
    .filter(([k, v]) => !HIDDEN.has(k) && v !== undefined && v !== null && String(v).trim() !== '')
    .map(([k, v]) => {
      const label = k
        .replace(/([a-z])([A-Z])/g, '$1 $2')
        .replace(/[_-]/g, ' ')
        .replace(/\b\w/g, (c) => c.toUpperCase());
      return `${label}: ${v}`;
    })
    .join('\n');
}

// Optional configurator "designs" array (from the design-quote flow).
function formatDesigns(designs) {
  if (!Array.isArray(designs) || designs.length === 0) return '';
  const lines = designs
    .map((d, i) => {
      const parts = [
        d.diameter && d.height ? `Dimensions: ⌀${d.diameter} × H${d.height} mm` :
        d.length && d.width && d.height ? `Dimensions: ${d.length} × ${d.width} × ${d.height} mm` : null,
        d.thickness ? `Wall Thickness: ${d.thickness} mm` : null,
        d.material ? `Material: ${d.material}` : null,
        d.colour ? `Colour: ${d.colour}` : null,
        d.quantity ? `Quantity: ${d.quantity}` : null,
        d.price != null ? `Price: $${(Number(d.price) / 100).toFixed(2)}` : null,
      ].filter(Boolean).map((l) => `  - ${l}`).join('\n');
      return `Design ${i + 1}:\n${parts}`;
    })
    .join('\n\n');
  return `\n\nDESIGNS REQUESTED:\n${lines}`;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const payload = req.body || {};
    // Accept both a flat enquiry object and a { formData, designs } shape.
    const data = payload.formData && typeof payload.formData === 'object' ? payload.formData : payload;
    const designs = payload.designs;

    if (!data.name || !data.email) {
      return res.status(400).json({ error: 'Missing required fields (name, email).' });
    }

    const source = data.source || data.projectType || 'Website enquiry';
    const to = process.env.SMTP_TO || 'info@urbanpots.com.au';
    const from = process.env.SMTP_FROM || 'noreply@urbanpots.com.au';

    const body = `New enquiry from the Urban Pots website\n\n${formatFields(data)}${formatDesigns(designs)}\n\n---\nSubmitted via urban-pots.vercel.app`;

    // Notify Urban Pots.
    await transporter.sendMail({
      from,
      to,
      subject: `New enquiry — ${data.name} (${source})`,
      text: body,
      replyTo: data.email,
    });

    // Confirmation to the customer.
    await transporter.sendMail({
      from,
      to: data.email,
      subject: 'We received your enquiry — Urban Pots',
      text: `Hi ${data.name},\n\nThanks for getting in touch with Urban Pots. We've received your enquiry and our team will be back to you within 24 hours.\n\nIf it's urgent, call us on 0433 132 406 or reply to this email.\n\nBest regards,\nThe Urban Pots Team\nurbanpots.com.au`,
    });

    return res.status(200).json({ success: true, message: 'Enquiry submitted successfully' });
  } catch (error) {
    console.error('Error processing enquiry:', error);
    return res.status(500).json({ error: 'Failed to submit enquiry', details: error.message });
  }
}
