// Meta Conversions API (server-side) endpoint for BLISSS.ENG
// Receives events from the browser and forwards them to Meta Graph API.
// Token is read from the FB_CAPI_TOKEN environment variable (never hardcoded).

const crypto = require('crypto');

const PIXEL_ID = '1668176501666152';
const API_VERSION = 'v21.0';

const sha256 = (v) => crypto.createHash('sha256').update(String(v)).digest('hex');

const hashEmail = (e) => {
  const v = String(e || '').trim().toLowerCase();
  return v ? sha256(v) : undefined;
};

const hashPhone = (p) => {
  const digits = String(p || '').replace(/[^0-9]/g, '');
  return digits ? sha256(digits) : undefined;
};

function readBody(req) {
  return new Promise((resolve) => {
    if (req.body && typeof req.body === 'object') return resolve(req.body);
    let raw = '';
    req.on('data', (c) => (raw += c));
    req.on('end', () => {
      try { resolve(JSON.parse(raw || '{}')); } catch { resolve({}); }
    });
    req.on('error', () => resolve({}));
  });
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'method_not_allowed' });

  const token = process.env.FB_CAPI_TOKEN;
  if (!token) return res.status(500).json({ error: 'missing_token' });

  const body = await readBody(req);
  const {
    event_name = 'PageView',
    event_id,
    event_source_url,
    email,
    phone,
    custom_data = {},
    fbp,
    fbc,
    test_event_code,
  } = body;

  const xff = (req.headers['x-forwarded-for'] || '').split(',')[0].trim();
  const ip = xff || (req.socket && req.socket.remoteAddress) || undefined;
  const ua = req.headers['user-agent'];

  const user_data = {
    client_ip_address: ip,
    client_user_agent: ua,
  };
  const em = hashEmail(email); if (em) user_data.em = [em];
  const ph = hashPhone(phone); if (ph) user_data.ph = [ph];
  if (fbp) user_data.fbp = fbp;
  if (fbc) user_data.fbc = fbc;

  const payload = {
    data: [{
      event_name,
      event_time: Math.floor(Date.now() / 1000),
      event_id,
      event_source_url,
      action_source: 'website',
      user_data,
      custom_data,
    }],
  };
  if (test_event_code) payload.test_event_code = test_event_code;

  try {
    const url = `https://graph.facebook.com/${API_VERSION}/${PIXEL_ID}/events?access_token=${encodeURIComponent(token)}`;
    const r = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const json = await r.json();
    if (!r.ok) return res.status(502).json({ error: 'fb_error', detail: json });
    return res.status(200).json({ ok: true, fb: json });
  } catch (e) {
    return res.status(500).json({ error: 'server_error', detail: String(e) });
  }
};
