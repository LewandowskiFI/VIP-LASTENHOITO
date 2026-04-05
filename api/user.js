const { getUserBookings, queryUsers, updateUser } = require('./db.js');

module.exports = async (req, res) => {
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    if (req.method === 'GET') {
      const email = req.query.email;
      if (!email) return res.status(400).json({ error: 'Email puuttuu' });
      
      const rows = await queryUsers(email);
      let user = rows[0];
      
      // Korjaus Vercelin serverless-arkkitehtuurin muistinmenetyksiin (in-memory demo-tilassa)
      if (!user && !process.env.POSTGRES_URL) {
          user = { 
              email: email, 
              name: req.query.name || email.split('@')[0], 
              role: req.query.role || 'parent',
              avatar: '👤',
              price: '25€/h',
              service_role: 'Perushoito'
          };
      } else if (!user) {
          return res.status(404).json({ error: 'Käyttäjää ei löydy' });
      }
      
      const bookings = await getUserBookings(email, user.role);
      
      return res.status(200).json({ user, bookings });
    }
    
    if (req.method === 'POST') {
      let body = req.body;
      if (typeof body === 'string') body = JSON.parse(body);
      
      const { email, description, price, avatar, service_role } = body;
      await updateUser(email, { description, price, avatar, service_role });
      
      return res.status(200).json({ success: true });
    }
    
    return res.status(405).json({ error: 'Method not allowed' });
  } catch(err) {
    return res.status(500).json({ error: err.message });
  }
};
