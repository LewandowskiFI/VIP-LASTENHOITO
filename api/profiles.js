// Tietokanta-korvike hoitajaprofiileille
const profiles = [
  {
    id: 1,
    name: "Anna K.",
    role: "Askartelu",
    roleName: "Askartelumestari",
    avatar: "👩🏻",
    rating: 5,
    reviews: 24,
    location: "Jyväskylä",
    description: "Olen tehnyt lastenhoitoa yli 5 vuotta ja taustani on visuaalisissa taiteissa. Tarjoan perushoidon lomassa ohjattuja maalaus- ja askartelutuokioita.",
    price: "35€/h",
    verified: true
  },
  {
    id: 2,
    name: "Mikko L.",
    role: "Musiikki",
    roleName: "Musiikkipedagogi",
    avatar: "👨🏽",
    rating: 4,
    reviews: 18,
    location: "Äänekoski",
    description: "Varhaisiän musiikkikasvatukseen erikoistunut hoitaja. Tuon kitaran mukanani ja järjestän ikätasolle sopivan musisointituokion päivän aikana.",
    price: "40€/h",
    verified: true
  },
  {
    id: 3,
    name: "Sofia H.",
    role: "Perushoito",
    roleName: "VIP Perushoito",
    avatar: "👱🏼‍♀️",
    rating: 5,
    reviews: 42,
    location: "Palokka",
    description: "Luotettavaa ja erittäin rauhallista läsnäoloa. Olen sairaanhoitajaopiskelija ja minulla on rautainen kokemus kaiken ikäisten lasten huolenpidosta.",
    price: "30€/h",
    verified: true
  },
  {
    id: 4,
    name: "Jussi V.",
    role: "Perushoito",
    roleName: "VIP Perushoito",
    avatar: "🧑🏻",
    rating: 4,
    reviews: 9,
    location: "Jyväskylä",
    description: "Luokanopettajaopiskelija ja innokas ulkoilma-ihminen. Lähden mielelläni lasten kanssa metsäretkelle tai leikkipuistoon!",
    price: "25€/h",
    verified: true
  }
];

module.exports = async (req, res) => {
  // Sallitaan CORS demoa varten
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Palautetaan profiilit viiveellä, jotta se simuloi oikeaa tietokantaa ja saamme asynkronisen efektin
  return new Promise(resolve => {
    setTimeout(() => {
      res.status(200).json(profiles);
      resolve();
    }, 400); // 400ms viive
  });
};
