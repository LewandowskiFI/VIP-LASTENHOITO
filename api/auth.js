const { queryUsers, insertUser } = require('./db.js');

module.exports = async (req, res) => {
  // CORS Tuki
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Vain POST-pyynnöt sallittu' });
  }

  try {
    let body = req.body;
    if (typeof body === 'string') {
      body = JSON.parse(body);
    }
    const { action, email, password, name } = body;

    // Rekisteröityminen
    if (action === 'register') {
      if (!email || !password || !name) {
        return res.status(400).json({ success: false, message: 'Puuttuvia tietoja.' });
      }
      if (password.length < 6) {
        return res.status(400).json({ success: false, message: 'Salasanan on oltava väh. 6 merkkiä.' });
      }
      
      const existing = await queryUsers(email);
      if (existing && existing.length > 0) {
        return res.status(400).json({ success: false, message: 'Käyttäjä on jo olemassa.' });
      }
      
      const newUser = await insertUser(name, email, password);
      
      return res.status(200).json({
        success: true,
        token: `token-${newUser.id}`,
        user: { name: newUser.name, email: newUser.email }
      });
    }
    
    // Kirjautuminen
    if (action === 'login') {
      if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Sähköposti ja salasana vaaditaan.' });
      }
      
      const rows = await queryUsers(email);
      const user = rows[0];
      
      if (user && user.password === password) {
        return res.status(200).json({
          success: true,
          token: `token-${user.id}`,
          user: { name: user.name, email: user.email }
        });
      }
      
      return res.status(400).json({ success: false, message: 'Sähköpostia tai salasanaa ei tunnistettu.' });
    }

    return res.status(400).json({ success: false, message: 'Tuntematon toiminto' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Tietokantavirhe: ' + err.message });
  }
};
