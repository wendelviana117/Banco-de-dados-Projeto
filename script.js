/* Dark mode toggle */
const themeToggle = document.getElementById('theme-toggle');
const html = document.documentElement;

function applyTheme(theme) {
  html.setAttribute('data-theme', theme);
  localStorage.setItem('dd-theme', theme);
  themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
  themeToggle.setAttribute('aria-label', theme === 'dark' ? 'Modo claro' : 'Modo escuro');
}

const saved = localStorage.getItem('dd-theme') || 'light';
applyTheme(saved);

themeToggle.addEventListener('click', () => {
  const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  applyTheme(next);
});

/* Sidebar mobile */
const sidebar = document.getElementById('sidebar');
const sidebarToggle = document.getElementById('sidebar-toggle');
sidebarToggle.addEventListener('click', () => {
  sidebar.classList.toggle('open');
});

document.querySelectorAll('.sidebar a').forEach(a => {
  a.addEventListener('click', () => {
    if (window.innerWidth <= 900) sidebar.classList.remove('open');
  });
});

/* Real-time search */
const searchInput = document.getElementById('search-input');
searchInput.addEventListener('input', () => {
  const q = searchInput.value.trim().toLowerCase();
  document.querySelectorAll('.table-section').forEach(sec => {
    const tableName = sec.id.toLowerCase();
    const rows = sec.querySelectorAll('tbody tr');
    let anyVisible = false;
    rows.forEach(row => {
      const text = row.textContent.toLowerCase();
      const match = !q || text.includes(q) || tableName.includes(q);
      row.style.display = match ? '' : 'none';
      if (match) anyVisible = true;
    });
    sec.style.display = anyVisible || tableName.includes(q) ? '' : 'none';
  });
});

/* Modal DER + Panzoom */
const modal = document.getElementById('der-modal');
const openDerBtn = document.getElementById('open-der');
const closeDerBtn = document.getElementById('close-der');
const derImg = document.getElementById('der-img');
let panzoomInstance = null;

openDerBtn.addEventListener('click', () => {
  modal.classList.add('open');
  if (!panzoomInstance && window.Panzoom) {
    panzoomInstance = Panzoom(derImg, {
      maxScale: 5,
      minScale: 0.3,
      contain: 'outside'
    });
    derImg.parentElement.addEventListener('wheel', panzoomInstance.zoomWithWheel);
  }
});

closeDerBtn.addEventListener('click', () => {
  modal.classList.remove('open');
});

modal.addEventListener('click', (e) => {
  if (e.target === modal) modal.classList.remove('open');
});

document.getElementById('zoom-in').addEventListener('click', () => {
  if (panzoomInstance) panzoomInstance.zoomIn();
});
document.getElementById('zoom-out').addEventListener('click', () => {
  if (panzoomInstance) panzoomInstance.zoomOut();
});
document.getElementById('zoom-reset').addEventListener('click', () => {
  if (panzoomInstance) panzoomInstance.reset();
});

/* Highlight active sidebar link on scroll */
const sections = document.querySelectorAll('.table-section');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      document.querySelectorAll('.sidebar a').forEach(a => a.classList.remove('active'));
      const link = document.querySelector(`.sidebar a[href="#${entry.target.id}"]`);
      if (link) link.classList.add('active');
    }
  });
}, { rootMargin: '-20% 0px -70% 0px' });

sections.forEach(s => observer.observe(s));
