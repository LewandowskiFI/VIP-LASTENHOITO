const { createBooking } = require('./db.js');

module.exports = async (req, res) => {
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST-pyyntö vaaditaan' });

  try {
    let body = req.body;
    if (typeof body === 'string') body = JSON.parse(body);
    
    const { parentEmail, caretakerEmail, dateBooking } = body;
    
    if (!parentEmail || !caretakerEmail || !dateBooking) {
      return res.status(400).json({ success: false, message: 'Tiedot puuttuvat varauksesta.' });
    }
    
    await createBooking(parentEmail, caretakerEmail, dateBooking);
    return res.status(200).json({ success: true });
    
  } catch(err) {
    return res.status(500).json({ success: false, message: 'Varausta ei voitu luoda: ' + err.message });
  }
};
