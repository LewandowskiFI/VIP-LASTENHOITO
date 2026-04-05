// Yleinen logiikka (Scroll and Load)
document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.querySelector('.navbar');
  
    window.addEventListener('scroll', () => {
        if (window.scrollY > 10) {
            navbar.style.boxShadow = '0 4px 24px rgba(0,0,0,0.06)';
        } else {
            navbar.style.boxShadow = 'none';
            navbar.style.borderBottom = '1px solid rgba(0,0,0,0.05)';
        }
    });
  
    // Hae asiantuntijat oikealta backend-tietokannalta!
    fetchProfilesFromAPI();
  });
  
  // Modaalin logiikka (Demovaroituksia varten)
  const modalOverlay = document.getElementById('demoModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalDesc = document.getElementById('modalDesc');
  
  function openModal(title, desc) {
    if(!modalOverlay) return;
    modalTitle.textContent = title;
    modalDesc.textContent = desc;
    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  
  function closeModal() {
    if(!modalOverlay) return;
    modalOverlay.classList.remove('active');
    document.body.style.overflow = 'auto';
  }
  
  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
        if(e.target === modalOverlay) closeModal();
    });
  }
  
  // Globaalit muuttujat asiantuntijadatasta
  let allProfiles = [];
  
  // Hakee datan Vercelin Backendistä
  async function fetchProfilesFromAPI() {
    const grid = document.getElementById('profilesGrid');
    if (!grid) return; // Emme ole etusivulla
    
    grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--text-secondary);">Ladataan asiantuntijoita palvelimelta...</p>';
    
    try {
      const response = await fetch('/api/profiles');
      if (!response.ok) throw new Error('Network error');
      allProfiles = await response.json();
      renderProfiles(allProfiles);
    } catch (err) {
    grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 3rem; color: #ff3b30;"><b>Tietokantayhteys katkesi:</b> Varmista, että olet julkaissut sovelluksen Vercelissä. Paikallinen kehityspalvelin ei tue Node.js rajapintoja.</p>';
    }
  }
  
  // Renders profiles to HTML
  function renderProfiles(profilesArray) {
    const grid = document.getElementById('profilesGrid');
    if (!grid) return;
    grid.innerHTML = '';
  
    profilesArray.forEach(p => {
      const isVerified = p.verified ? `<span class="badge verified">✓ Taustatarkistettu</span>` : '';
      
      const cardHTML = `
        <div class="profile-card" data-role="${p.role}">
            <div class="profile-header">
              <div class="avatar">${p.avatar}</div>
              <div class="profile-info">
                <h3>${p.name}</h3>
                <div class="rating">
                  <span class="star">★</span><span class="star">★</span><span class="star">★</span><span class="star">★</span><span class="star">${p.rating === 5 ? '★' : '☆'}</span>
                  (${p.reviews}) • ${p.location}
                </div>
              </div>
            </div>
            <div class="badge-row">
              ${isVerified}
              <span class="badge">${p.avatar} ${p.roleName}</span>
            </div>
            <p class="profile-desc">${p.description}</p>
            <div class="price-row">
              <div class="price">${p.price}</div>
              <button class="btn btn-outline" style="padding: 8px 16px;" onclick="openModal('${p.name}', '${p.description} Hinta on ${p.price}. Kirjaudu sisään varataksesi tarkan ajan.')">Näytä profiili</button>
            </div>
        </div>
      `;
      grid.insertAdjacentHTML('beforeend', cardHTML);
    });
  }
  
  // Hakukoneen suodattimen logiikka (Client-side filtering for immediate snappy feeling)
  function filterProfiles() {
    const filterValue = document.getElementById('roleFilter').value;
    const cards = document.querySelectorAll('.profile-card');
    const noResults = document.getElementById('noResults');
    let matchCount = 0;
  
    cards.forEach(card => {
      const role = card.getAttribute('data-role');
      if (filterValue === 'Kaikki' || role === filterValue) {
        card.style.display = 'block';
        setTimeout(() => { card.style.opacity = '1'; }, 10);
        matchCount++;
      } else {
        card.style.opacity = '0';
        setTimeout(() => { card.style.display = 'none'; }, 300);
      }
    });
  
    setTimeout(() => {
      if (matchCount === 0) {
        noResults.style.display = 'block';
        document.getElementById('resultTitle').style.display = 'none';
      } else {
        noResults.style.display = 'none';
        document.getElementById('resultTitle').style.display = 'block';
        document.getElementById('resultTitle').textContent = `Löysimme ${matchCount} asiantuntijaa!`;
      }
    }, 310);
  }
  
  function resetSearch() {
    document.getElementById('roleFilter').value = 'Kaikki';
    document.getElementById('searchInput').value = '';
    filterProfiles();
  }
