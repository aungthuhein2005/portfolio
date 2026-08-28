// Dark mode toggle
function toggleDarkMode() {
  document.documentElement.classList.toggle('dark');
  localStorage.theme = document.documentElement.classList.contains('dark')
    ? 'dark'
    : 'light';
  updateDarkModeControls();
}

// Mobile menu toggle
function toggleMobileMenu() {
  const menu = document.getElementById('mobile-menu');
  const button = document.getElementById('mobile-menu-button');
  if (!menu || !button) return;

  const isOpen = menu.classList.toggle('hidden') === false;
  button.setAttribute('aria-expanded', String(isOpen));
  button.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
}

function closeMobileMenu() {
  const menu = document.getElementById('mobile-menu');
  const button = document.getElementById('mobile-menu-button');
  if (!menu || !button) return;

  menu.classList.add('hidden');
  button.setAttribute('aria-expanded', 'false');
  button.setAttribute('aria-label', 'Open navigation menu');
}

function updateDarkModeControls() {
  const isDark = document.documentElement.classList.contains('dark');
  document.querySelectorAll('[onclick="toggleDarkMode()"]')
    .forEach((button) => button.setAttribute('aria-pressed', String(isDark)));
}

function setupContactForm() {
  const form = document.getElementById('contact-form');
  const status = document.getElementById('contact-status');
  if (!form) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const data = new FormData(form);
    const name = String(data.get('name') || '').trim();
    const email = String(data.get('email') || '').trim();
    const message = String(data.get('message') || '').trim();
    const subject = encodeURIComponent(`Portfolio inquiry from ${name}`);
    const body = encodeURIComponent(`${message}\n\nFrom: ${name}\nEmail: ${email}`);

    if (status) status.textContent = 'Opening your email app...';
    window.location.href = `mailto:aungthuhein.ath05@gmail.com?subject=${subject}&body=${body}`;
  });
}

// Load projects from JSON and render cards
async function loadProjects() {
  const grid = document.getElementById('projects-grid');
  if (!grid) return;

  try {
    const res = await fetch('data/projects.json', { cache: 'no-cache' });
    if (!res.ok) throw new Error('Failed to load projects.json');
    const projects = await res.json();

    grid.innerHTML = projects
      .map((project) => {
        const hasImage = Boolean(project.image);
        const hasBadge = Boolean(project.badge);
        const links = project.links || {};

        const overlayButtons = [
          links.demo
            ? `<a href="${links.demo}" target="_blank" rel="noopener noreferrer" class="px-3 py-1 bg-primary text-white text-sm rounded-full hover:bg-secondary transition-colors">Demo</a>`
            : '',
          links.live
            ? `<a href="${links.live}" target="_blank" rel="noopener noreferrer" class="px-3 py-1 bg-primary text-white text-sm rounded-full hover:bg-secondary transition-colors">Live</a>`
            : '',
          links.codeFrontend
            ? `<a href="${links.codeFrontend}" target="_blank" rel="noopener noreferrer" class="px-3 py-1 bg-white/20 text-white text-sm rounded-full hover:bg-white/30 transition-colors">Frontend</a>`
            : '',
          links.codeBackend
            ? `<a href="${links.codeBackend}" target="_blank" rel="noopener noreferrer" class="px-3 py-1 bg-white/20 text-white text-sm rounded-full hover:bg-white/30 transition-colors">Backend</a>`
            : '',
          links.code
            ? `<a href="${links.code}" target="_blank" rel="noopener noreferrer" class="px-3 py-1 bg-white/20 text-white text-sm rounded-full hover:bg-white/30 transition-colors">Code</a>`
            : ''
        ]
          .filter(Boolean)
          .join('');

        const tagChips = (project.tags || [])
          .map(
            (tag) => `<span
              class="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-md text-xs text-gray-600 dark:text-gray-300"
            >
              ${tag}
            </span>`
          )
          .join('');

        const imageFitClass = project.imageFit === 'contain'
          ? 'object-contain bg-gray-100 dark:bg-gray-900'
          : 'object-cover';

        const imageOrGradient = hasImage
          ? `<img
              src="${project.image}"
              alt="${project.title}"
              loading="lazy"
              decoding="async"
              class="w-full h-48 ${imageFitClass} transform group-hover:scale-110 transition-transform duration-300"
            />`
          : `<div
              class="w-full h-48 bg-gradient-to-br from-primary/30 via-secondary/20 to-black/10 dark:to-white/5 flex items-end"
            >
              ${
                hasBadge
                  ? `<div class="p-5">
                      <span class="inline-flex items-center px-3 py-1 rounded-full bg-white/30 dark:bg-white/10 text-gray-900 dark:text-white text-xs font-semibold tracking-wide backdrop-blur">
                        ${project.badge}
                      </span>
                    </div>`
                  : ''
              }
            </div>`;

        const primaryLink =
          links.live ||
          links.demo ||
          links.codeFrontend ||
          links.code ||
          links.codeBackend ||
          null;

        const primaryCtaLabel = links.live
          ? 'Visit Website'
          : links.demo
          ? 'Watch Demo'
          : links.codeFrontend
          ? 'View Frontend Repository'
          : links.code
          ? 'View Repository'
          : links.codeBackend
          ? 'View Backend Repository'
          : null;

        const primaryCta =
          primaryLink && primaryCtaLabel
            ? `<a
                href="${primaryLink}"
                target="_blank"
                rel="noopener noreferrer"
                class="mt-4 block text-center w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-primary hover:text-white transition-all duration-300"
              >
                ${primaryCtaLabel}
              </a>`
            : '';

        return `
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden group hover:shadow-xl transition-all">
            <div class="relative overflow-hidden">
              ${imageOrGradient}
              <div
                class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <div class="absolute bottom-4 left-4 right-4">
                  <div class="flex flex-wrap gap-2">
                    ${overlayButtons}
                  </div>
                </div>
              </div>
            </div>
            <div class="p-6">
              <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                ${project.title}
              </h4>
              ${
                project.subtitle
                  ? `<p class="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-1">
                       ${project.subtitle}
                     </p>`
                  : ''
              }
              <p class="text-gray-600 dark:text-gray-300 text-sm mb-4">
                ${project.description}
              </p>
              <div class="flex flex-wrap gap-2">
                ${tagChips}
              </div>
              ${primaryCta}
            </div>
          </div>
        `;
      })
      .join('');
  } catch (err) {
    console.error('Error loading projects:', err);
  }
}

// Initialize Three.js backgrounds and projects
document.addEventListener('DOMContentLoaded', () => {
  // Hero background
  new ThreeBackground('hero-canvas');

  // About section background
  new ThreeBackground('about-canvas');

  // Projects
  loadProjects();

  setupContactForm();
  updateDarkModeControls();
});

// Check for saved user preference, respect OS preference
if (
  localStorage.theme === 'dark' ||
  (!('theme' in localStorage) &&
    window.matchMedia('(prefers-color-scheme: dark)').matches)
) {
  document.documentElement.classList.add('dark');
} else {
  document.documentElement.classList.remove('dark');
}

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth'
      });
      closeMobileMenu();
    }
  });
});
