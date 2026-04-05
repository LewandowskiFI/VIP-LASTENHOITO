const { sql } = require('@vercel/postgres');

// Oletusprofiilit muistinvaraisena "kellukkeena" demovaihetta varten, etteivät listat ole tyhjiä
const prefilledCaretakers = [
  { id: 101, name: "Anna K.", email: "anna@esimerkki.fi", password: "demo", role: "caretaker", avatar: "👩🏻", description: "Tarjoan perushoidon lomassa ohjattuja maalaus- ja askartelutuokioita.", price: "35€/h", service_role: "Askartelu", verified: true, rating: 5, reviews: 24, location: "Jyväskylä" },
  { id: 102, name: "Mikko L.", email: "mikko@esimerkki.fi", password: "demo", role: "caretaker", avatar: "👨🏽", description: "Tuon kitaran mukanani ja järjestän ikätasolle sopivan musisointituokion.", price: "40€/h", service_role: "Musiikki", verified: true, rating: 4, reviews: 18, location: "Äänekoski" },
  { id: 103, name: "Sofia H.", email: "sofia@esimerkki.fi", password: "demo", role: "caretaker", avatar: "👱🏼‍♀️", description: "Olen sairaanhoitajaopiskelija ja minulla on kokemus lasten huolenpidosta.", price: "30€/h", service_role: "Perushoito", verified: true, rating: 5, reviews: 42, location: "Palokka" }
];

const inMemoryDB = {
  users: [...prefilledCaretakers],
  bookings: []
};

async function initDB() {
  if (process.env.POSTGRES_URL) {
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'parent',
        avatar TEXT DEFAULT '👤',
        description TEXT DEFAULT '',
        price VARCHAR(50) DEFAULT '25€/h',
        service_role VARCHAR(100) DEFAULT 'Perushoito',
        location VARCHAR(100) DEFAULT 'Etänä',
        verified BOOLEAN DEFAULT false,
        rating FLOAT DEFAULT 0,
        reviews INTEGER DEFAULT 0,
        "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
    await sql`
      CREATE TABLE IF NOT EXISTS bookings (
        id SERIAL PRIMARY KEY,
        parent_email VARCHAR(255) NOT NULL,
        caretaker_email VARCHAR(255) NOT NULL,
        date_booking VARCHAR(255) NOT NULL,
        status VARCHAR(50) DEFAULT 'pending',
        "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
  }
}

async function queryUsers(email) {
  if (process.env.POSTGRES_URL) {
    const { rows } = await sql`SELECT * FROM users WHERE email = ${email}`;
    return rows;
  }
  return inMemoryDB.users.filter(u => u.email === email);
}

async function getCaretakers() {
  if (process.env.POSTGRES_URL) {
    const { rows } = await sql`SELECT * FROM users WHERE role = 'caretaker'`;
    return rows;
  }
  return inMemoryDB.users.filter(u => u.role === 'caretaker');
}

async function insertUser(userData) {
  const { name, email, password, role } = userData;
  if (process.env.POSTGRES_URL) {
    await initDB();
    const { rows } = await sql`
      INSERT INTO users (name, email, password, role) 
      VALUES (${name}, ${email}, ${password}, ${role}) 
      RETURNING id, name, email, role
    `;
    return rows[0];
  }
  
  const newUser = { id: Date.now(), name, email, password, role, avatar: '👤', description: 'Uusi käyttäjä', price: '20€/h', service_role: 'Perushoito', location: 'Jyväskylä', verified: false, rating: 0, reviews: 0 };
  inMemoryDB.users.push(newUser);
  return newUser;
}

async function updateUser(email, updates) {
  if (process.env.POSTGRES_URL) {
    await sql`
      UPDATE users 
      SET description = ${updates.description}, price = ${updates.price}, avatar = ${updates.avatar}, service_role = ${updates.service_role}
      WHERE email = ${email}
    `;
    return { success: true };
  }
  
  const userIndex = inMemoryDB.users.findIndex(u => u.email === email);
  if(userIndex > -1) {
    inMemoryDB.users[userIndex] = { ...inMemoryDB.users[userIndex], ...updates };
  }
  return { success: true };
}

async function createBooking(parentEmail, caretakerEmail, dateBooking) {
  if (process.env.POSTGRES_URL) {
    await initDB();
    await sql`INSERT INTO bookings (parent_email, caretaker_email, date_booking) VALUES (${parentEmail}, ${caretakerEmail}, ${dateBooking})`;
    return { success: true };
  }
  inMemoryDB.bookings.push({ id: Date.now(), parent_email: parentEmail, caretaker_email: caretakerEmail, date_booking: dateBooking, status: 'pending' });
  return { success: true };
}

async function getUserBookings(email, role) {
  if (process.env.POSTGRES_URL) {
    const { rows } = await sql`SELECT * FROM bookings WHERE parent_email = ${email} OR caretaker_email = ${email}`;
    return rows;
  }
  return inMemoryDB.bookings.filter(b => b.parent_email === email || b.caretaker_email === email);
}

module.exports = {
  initDB,
  queryUsers,
  getCaretakers,
  insertUser,
  updateUser,
  createBooking,
  getUserBookings,
  inMemoryDB
};
