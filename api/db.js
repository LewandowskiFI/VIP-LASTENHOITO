const { sql } = require('@vercel/postgres');

// Rakenne tarkistaa, onko asennettu Vercel Postgres -pilvitietokanta (process.env.POSTGRES_URL)
// Jos ei, se lankeaa äänettömästi In-Memory välimuistiin estääkseen sivun kaatumisen Vercelissä.

const inMemoryDB = {
  users: [],
  profiles: [] // tähän voisi ladata esimerkkejä, mutta haetaan profiles.js
};

async function queryUsers(email) {
  if (process.env.POSTGRES_URL) {
    const { rows } = await sql`SELECT * FROM users WHERE email = ${email}`;
    return rows;
  }
  // In-Memory
  return inMemoryDB.users.filter(u => u.email === email);
}

async function insertUser(name, email, password) {
  if (process.env.POSTGRES_URL) {
    // Varmistetaan että taulu on olemassa livenä
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
    const { rows } = await sql`INSERT INTO users (name, email, password) VALUES (${name}, ${email}, ${password}) RETURNING id, name, email`;
    return rows[0];
  }
  
  // In-Memory Fallback
  const newUser = { id: Date.now(), name, email, password };
  inMemoryDB.users.push(newUser);
  return newUser;
}

module.exports = {
  queryUsers,
  insertUser,
  inMemoryDB
};
