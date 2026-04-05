const { getCaretakers } = require('./db.js');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const profiles = await getCaretakers();
    return res.status(200).json(profiles);
  } catch(err) {
    return res.status(500).json({ error: err.message });
  }
};
