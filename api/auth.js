// In-Memory tietokanta demoa varten
// Huom: Vercelissä muisti tyhjentyy kylmäkäynnistyksissä (cold start)
let users = [];

module.exports = async (req, res) => {
  // Sallitaan vain POST
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
      const exists = users.find(u => u.email === email);
      if (exists) {
        return res.status(400).json({ success: false, message: 'Käyttäjä on jo olemassa.' });
      }
      
      const newUser = { id: Date.now(), name, email, password };
      users.push(newUser);
      
      return res.status(200).json({
        success: true,
        token: `demo-token-${newUser.id}`,
        user: { name, email }
      });
    }
    
    // Kirjautuminen
    if (action === 'login') {
      if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Sähköposti ja salasana vaaditaan.' });
      }
      
      const user = users.find(u => u.email === email && u.password === password);
      if (user) {
        return res.status(200).json({
          success: true,
          token: `demo-token-${user.id}`,
          user: { name: user.name, email: user.email }
        });
      }
      
      // Fallback: sallitaan mikä vain syöte "feikki" käyttäjänä, jos ei löydy in-mem datasta
      return res.status(200).json({
        success: true,
        token: `demo-token-999`,
        user: { name: "Lokaali Demo-käyttäjä", email: email },
        warning: "Huom: Kirjauduit sisään tunnistamattomalla tilillä (Vercelin demo-ominaisuus sallii testaamisen)."
      });
    }

    return res.status(400).json({ success: false, message: 'Tuntematon toiminto' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Palvelinvirhe: ' + err.message });
  }
};
