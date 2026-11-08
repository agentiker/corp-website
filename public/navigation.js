document.documentElement.classList.add('js');

const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('#main-nav');
const caseMenu = nav.querySelector('.case-menu');
function closeMenu(restoreFocus = false) {
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', '打开导航菜单');
  nav.classList.remove('is-open');
  if (caseMenu) caseMenu.open = false;
  if (restoreFocus) menuToggle.focus();
}
menuToggle.addEventListener('click', () => {
  const open = menuToggle.getAttribute('aria-expanded') !== 'true';
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? '关闭导航菜单' : '打开导航菜单');
  nav.classList.toggle('is-open', open);
});
nav.addEventListener('click', (event) => {
  if (event.target.closest('a')) closeMenu();
});
caseMenu?.addEventListener('focusout', (event) => {
  if (event.relatedTarget && !caseMenu.contains(event.relatedTarget)) caseMenu.open = false;
});
document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') return;
  if (caseMenu?.open) {
    caseMenu.open = false;
    caseMenu.querySelector('summary').focus();
  } else if (nav.classList.contains('is-open')) {
    closeMenu(true);
  }
});
document.addEventListener('click', (event) => {
  if (!event.target.closest('.site-header')) closeMenu();
  else if (caseMenu?.open && !caseMenu.contains(event.target)) caseMenu.open = false;
});
matchMedia('(min-width: 721px)').addEventListener('change', (event) => { if (event.matches) closeMenu(); });

if ('IntersectionObserver' in window) {
  const sections = [...document.querySelectorAll('main section[id]')];
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      nav.querySelectorAll('a').forEach((link) => {
        if (link.hash === `#${entry.target.id}`) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    });
  }, { rootMargin: '-15% 0px -60% 0px' });
  sections.forEach((section) => observer.observe(section));
}
