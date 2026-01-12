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

  // Track command palette usage
  const commandName = item.querySelector('.command-name')?.textContent || 'Unknown';
  trackEvent('Navigation', 'command_palette_' + action, commandName);

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

// Google Analytics & Datadog Event Tracking
function trackEvent(category, action, label) {
  // Google Analytics
  if (typeof gtag !== 'undefined') {
    gtag('event', action, {
      'event_category': category,
      'event_label': label
    });
  }

  // Datadog RUM
  if (window.DD_RUM) {
    window.DD_RUM.addAction(action, {
      category: category,
      label: label
    });
  }
}

// Track resume downloads
document.querySelectorAll('a[href*="Resume"], a[href*="resume"]').forEach(link => {
  link.addEventListener('click', () => {
    trackEvent('Engagement', 'download_resume', link.href);
  });
});

// Track email clicks
document.querySelectorAll('a[href^="mailto:"]').forEach(link => {
  link.addEventListener('click', () => {
    trackEvent('Contact', 'click_email', link.href);
  });
});

// Track external social links
document.querySelectorAll('a[href*="linkedin.com"], a[href*="github.com"], a[href*="instagram.com"]').forEach(link => {
  link.addEventListener('click', () => {
    const platform = link.href.includes('linkedin') ? 'LinkedIn'
                   : link.href.includes('github') ? 'GitHub'
                   : 'Instagram';
    trackEvent('Social', 'click_' + platform.toLowerCase(), link.href);
  });
});

// Track timeline expansions
timelineHeaders.forEach(header => {
  header.addEventListener('click', () => {
    const company = header.querySelector('.timeline-company')?.textContent || 'Unknown';
    const role = header.querySelector('.timeline-role')?.textContent || 'Unknown';
    trackEvent('Engagement', 'expand_experience', `${company} - ${role}`);
  });
});

// Scroll Depth Tracking
const scrollDepths = [25, 50, 75, 100];
const scrollDepthsReached = new Set();

function trackScrollDepth() {
  const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
  const scrolled = window.pageYOffset;
  const percentScrolled = (scrolled / scrollHeight) * 100;

  scrollDepths.forEach(depth => {
    if (percentScrolled >= depth && !scrollDepthsReached.has(depth)) {
      scrollDepthsReached.add(depth);
      trackEvent('Scroll Depth', 'scroll', depth + '%');
    }
  });
}

let scrollDepthTimeout;
window.addEventListener('scroll', () => {
  if (scrollDepthTimeout) {
    window.cancelAnimationFrame(scrollDepthTimeout);
  }
  scrollDepthTimeout = window.requestAnimationFrame(trackScrollDepth);
});

// Time-based Engagement Tracking
const engagementMilestones = [30, 60, 120, 300]; // seconds
const milestonesReached = new Set();
let startTime = Date.now();

function trackEngagementTime() {
  const timeOnPage = Math.floor((Date.now() - startTime) / 1000);

  engagementMilestones.forEach(milestone => {
    if (timeOnPage >= milestone && !milestonesReached.has(milestone)) {
      milestonesReached.add(milestone);
      trackEvent('Engagement', 'time_on_page', milestone + 's');
    }
  });
}

// Check every 5 seconds
setInterval(trackEngagementTime, 5000);

// Outbound Link Tracking (all external links)
document.querySelectorAll('a[href^="http"]').forEach(link => {
  // Skip if already tracked (social links)
  if (!link.href.includes('linkedin.com') &&
      !link.href.includes('github.com') &&
      !link.href.includes('instagram.com') &&
      !link.href.includes('jacobwilson.net')) {
    link.addEventListener('click', () => {
      trackEvent('Outbound', 'click_external_link', link.href);
    });
  }
});

// Keyboard Hint Toast
const keyboardHintToast = document.getElementById('keyboard-hint-toast');
if (keyboardHintToast) {
  const hasSeenHint = localStorage.getItem('keyboard-hint-seen');

  if (!hasSeenHint) {
    // Show toast after 2 seconds
    setTimeout(() => {
      keyboardHintToast.classList.add('show');

      // Hide after 5 seconds
      setTimeout(() => {
        keyboardHintToast.classList.remove('show');
        localStorage.setItem('keyboard-hint-seen', 'true');
      }, 5000);
    }, 2000);
  }
}

// Tech Stack Filtering
const techFilterButtons = document.querySelectorAll('.tech-filter-btn');
const techCategories = document.querySelectorAll('.tech-category');

techFilterButtons.forEach(button => {
  button.addEventListener('click', () => {
    const filter = button.dataset.filter;

    // Update active button
    techFilterButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');

    // Filter categories
    techCategories.forEach(category => {
      if (filter === 'all' || category.dataset.category === filter) {
        category.classList.remove('hidden');
      } else {
        category.classList.add('hidden');
      }
    });

    // Track filter usage
    trackEvent('Skills', 'filter_tech_stack', filter);
  });
});

