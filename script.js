const navToggle = document.querySelector('.nav-toggle');
const siteNav = document.querySelector('.site-nav');

if (navToggle && siteNav) {
  navToggle.addEventListener('click', () => {
    const isOpen = siteNav.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  siteNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      siteNav.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// Reveal animations
const revealTargets = document.querySelectorAll('.section, .hero');
revealTargets.forEach((section) => section.classList.add('reveal'));

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
      }
    });
  },
  { threshold: 0.15 }
);

revealTargets.forEach((section) => observer.observe(section));

// Smooth scroll behavior
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// Simplified card effects - only on desktop with reduced complexity
if (window.innerWidth > 768) {
  const cards = document.querySelectorAll('.card, .contact-card');

  cards.forEach(card => {
    let rafId = null;

    card.addEventListener('mouseenter', () => {
      card.style.transform = 'translateY(-6px) scale(1.02)';
    });

    card.addEventListener('mouseleave', () => {
      if (rafId) cancelAnimationFrame(rafId);
      card.style.transform = '';
    });
  });
}

const year = document.querySelector('#year');
if (year) {
  year.textContent = new Date().getFullYear();
}

// Active nav highlighting on scroll
const navLinks = document.querySelectorAll('.site-nav a');
const sections = document.querySelectorAll('section[id]');

function highlightNavOnScroll() {
  const scrollY = window.pageYOffset;

  sections.forEach(section => {
    const sectionHeight = section.offsetHeight;
    const sectionTop = section.offsetTop - 150;
    const sectionId = section.getAttribute('id');
    const navLink = document.querySelector(`.site-nav a[href="#${sectionId}"]`);

    if (navLink && scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
      navLinks.forEach(link => link.classList.remove('active'));
      navLink.classList.add('active');
    }
  });
}

// Throttle scroll event for performance
let scrollTimeout;
window.addEventListener('scroll', () => {
  if (scrollTimeout) {
    window.cancelAnimationFrame(scrollTimeout);
  }
  scrollTimeout = window.requestAnimationFrame(() => {
    highlightNavOnScroll();
  });
});

// Initial check
highlightNavOnScroll();

// Scroll to top button
const scrollToTopBtn = document.getElementById('scroll-to-top');

function toggleScrollToTopButton() {
  if (window.pageYOffset > 300) {
    scrollToTopBtn.classList.add('visible');
  } else {
    scrollToTopBtn.classList.remove('visible');
  }
}

window.addEventListener('scroll', toggleScrollToTopButton);

scrollToTopBtn.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});

// Expandable timeline items
const timelineHeaders = document.querySelectorAll('.timeline-header');

timelineHeaders.forEach(header => {
  header.addEventListener('click', () => {
    const item = header.closest('.timeline-item');
    const isExpanded = header.getAttribute('aria-expanded') === 'true';

    // Close all other items
    document.querySelectorAll('.timeline-item.expanded').forEach(openItem => {
      if (openItem !== item) {
        openItem.classList.remove('expanded');
        openItem.querySelector('.timeline-header').setAttribute('aria-expanded', 'false');
      }
    });

    // Toggle this item
    item.classList.toggle('expanded');
    header.setAttribute('aria-expanded', !isExpanded);

    // Trigger counter animation when expanded
    if (!isExpanded) {
      animateCounters(item);
    }
  });
});

// Animated counters
function animateCounters(container = document) {
  const counters = container.querySelectorAll('[data-count]');

  counters.forEach(counter => {
    if (counter.dataset.animated) return; // Already animated

    const target = parseFloat(counter.dataset.count);
    const duration = 2000; // 2 seconds
    const isDecimal = target % 1 !== 0;
    const start = 0;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function (ease-out)
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = start + (target - start) * easeOut;

      if (isDecimal) {
        counter.textContent = counter.textContent.replace(/[\d.]+/, current.toFixed(1));
      } else {
        counter.textContent = counter.textContent.replace(/\d+/, Math.floor(current));
      }

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        counter.dataset.animated = 'true';
      }
    }

    requestAnimationFrame(update);
  });
}

// Trigger counters on scroll into view
const observerForCounters = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounters(entry.target);
      observerForCounters.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.timeline-item').forEach(item => {
  observerForCounters.observe(item);
});

// Command Palette
const commandPalette = document.getElementById('command-palette');
const commandInput = document.querySelector('.command-palette-input');
const commandItems = document.querySelectorAll('.command-item');
const commandBackdrop = document.querySelector('.command-palette-backdrop');
let selectedIndex = 0;

function openCommandPalette() {
  commandPalette.classList.add('active');
  commandPalette.setAttribute('aria-hidden', 'false');
  commandInput.focus();
  selectedIndex = 0;
  updateSelection();
}

function closeCommandPalette() {
  commandPalette.classList.remove('active');
  commandPalette.setAttribute('aria-hidden', 'true');
  commandInput.value = '';
}

function updateSelection() {
  commandItems.forEach((item, index) => {
    item.classList.toggle('selected', index === selectedIndex);
  });
}

function executeCommand(item) {
  const action = item.dataset.action;
  const target = item.dataset.target;

  if (action === 'navigate' && target) {
    closeCommandPalette();
    document.querySelector(target).scrollIntoView({ behavior: 'smooth' });
  } else if (action === 'copy-email') {
    navigator.clipboard.writeText('jacob@jacobwilson.net').then(() => {
      const desc = item.querySelector('.command-desc');
      const originalText = desc.textContent;
      desc.textContent = '✓ Copied to clipboard!';
      setTimeout(() => {
        desc.textContent = originalText;
      }, 2000);
    });
  }
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
  // Cmd+K or Ctrl+K to open
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
    e.preventDefault();
    if (commandPalette.classList.contains('active')) {
      closeCommandPalette();
    } else {
      openCommandPalette();
    }
  }

  // ESC to close
  if (e.key === 'Escape' && commandPalette.classList.contains('active')) {
    closeCommandPalette();
  }

  // Arrow navigation
  if (commandPalette.classList.contains('active')) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      selectedIndex = (selectedIndex + 1) % commandItems.length;
      updateSelection();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      selectedIndex = (selectedIndex - 1 + commandItems.length) % commandItems.length;
      updateSelection();
    } else if (e.key === 'Enter') {
      e.preventDefault();
      executeCommand(commandItems[selectedIndex]);
    }
  }
});

// Click handlers
commandItems.forEach((item, index) => {
  item.addEventListener('click', () => {
    executeCommand(item);
  });

  item.addEventListener('mouseenter', () => {
    selectedIndex = index;
    updateSelection();
  });
});

commandBackdrop.addEventListener('click', closeCommandPalette);

// Search functionality
commandInput.addEventListener('input', (e) => {
  const query = e.target.value.toLowerCase();
  let visibleCount = 0;

  commandItems.forEach(item => {
    const name = item.querySelector('.command-name').textContent.toLowerCase();
    const desc = item.querySelector('.command-desc').textContent.toLowerCase();
    const matches = name.includes(query) || desc.includes(query);

    item.style.display = matches ? 'flex' : 'none';
    if (matches) visibleCount++;
  });

  // Reset selection to first visible item
  selectedIndex = 0;
  updateSelection();
});
