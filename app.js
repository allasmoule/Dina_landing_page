/**
 * DR. DINA LUNDY — OFFICIAL LANDING PAGE JAVASCRIPT
 * Dynamic features, Modals, Lightbox, Theme Switcher, Forms & Toast Notifications
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initNavigation();
  initScrollEffects();
  initKeyboardListeners();
  initCardTiltEffect();
});

/* ==========================================================================
   1. Theme Toggle (Dark / Light Mode)
   ========================================================================== */
function initThemeToggle() {
  const toggleBtn = document.getElementById('theme-toggle-btn');
  const sunIcon = document.getElementById('theme-icon-sun');
  const moonIcon = document.getElementById('theme-icon-moon');
  
  if (!toggleBtn) return;

  // Retrieve saved preference or default to pristine editorial light (white background)
  const savedTheme = localStorage.getItem('dina_theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcons(savedTheme, sunIcon, moonIcon);

  toggleBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('dina_theme', newTheme);
    updateThemeIcons(newTheme, sunIcon, moonIcon);

    showToast(`Switched to ${newTheme === 'dark' ? 'Executive Dark' : 'Editorial Light'} theme`);
  });
}

function updateThemeIcons(theme, sunIcon, moonIcon) {
  if (!sunIcon || !moonIcon) return;
  if (theme === 'light') {
    sunIcon.style.display = 'none';
    moonIcon.style.display = 'block';
  } else {
    sunIcon.style.display = 'block';
    moonIcon.style.display = 'none';
  }
}

/* ==========================================================================
   2. Navigation & Mobile Menu
   ========================================================================== */
function initNavigation() {
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      const isOpen = navMenu.classList.contains('open');
      mobileToggle.setAttribute('aria-expanded', isOpen);
    });

    // Close menu when clicking a link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
      });
    });
  }

  // Active link highlighter on scroll
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');
      const matchingLink = document.querySelector(`.nav-menu a[href*="${sectionId}"]`);

      if (matchingLink) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          matchingLink.classList.add('active');
        } else {
          matchingLink.classList.remove('active');
        }
      }
    });
  }, { passive: true });
}

/* ==========================================================================
   3. Scroll Effects & Progress Bar
   ========================================================================== */
function initScrollEffects() {
  const scrollProgress = document.getElementById('scroll-progress');
  const siteHeader = document.getElementById('site-header');

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (scrollTop / docHeight) * 100;

    if (scrollProgress) {
      scrollProgress.style.width = scrolled + '%';
    }

    if (siteHeader) {
      if (scrollTop > 50) {
        siteHeader.classList.add('scrolled');
      } else {
        siteHeader.classList.remove('scrolled');
      }
    }
  }, { passive: true });

  // Update Year in footer
  const yearSpan = document.getElementById('year-span');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }
}

/* ==========================================================================
   4. Modals Controller
   ========================================================================== */
window.openModal = function(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
};

window.closeModal = function(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
};

window.closeModalOnOverlay = function(e, modalId) {
  if (e.target.id === modalId) {
    closeModal(modalId);
  }
};

function initKeyboardListeners() {
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const activeModals = document.querySelectorAll('.modal-overlay.active');
      activeModals.forEach(m => closeModal(m.id));
    }
  });
}

/* ==========================================================================
   5. Purchase & Instant Download System
   (Addresses: "How do I link out, provide immediate download after payment?")
   ========================================================================== */
window.openPurchaseModal = function(productTitle, price, subtitle) {
  const titleEl = document.getElementById('modal-product-title');
  const priceEl = document.getElementById('modal-product-price');
  const subtitleEl = document.getElementById('modal-product-subtitle');

  if (titleEl) titleEl.textContent = productTitle;
  if (priceEl) priceEl.textContent = price;
  if (subtitleEl) subtitleEl.textContent = subtitle || 'Immediate Digital Download';

  openModal('purchase-modal');
};

window.handlePurchaseSubmit = function(e) {
  e.preventDefault();
  const buyerName = document.getElementById('buyer-name').value;
  const buyerEmail = document.getElementById('buyer-email').value;
  const productTitle = document.getElementById('modal-product-title').textContent;

  closeModal('purchase-modal');

  // Demonstrate immediate download access
  showToast(`Thank you, ${buyerName}! Your download link for "${productTitle}" has been generated.`);

  // Create an on-screen instant download link box
  setTimeout(() => {
    alert(`Payment Simulation Successful!\n\nProduct: ${productTitle}\nDelivered to: ${buyerEmail}\n\nYour immediate download access token has been activated! In production, this securely connects directly to your Stripe / Systeme.io / Gumroad digital delivery webhook.`);
  }, 400);

  e.target.reset();
};

/* ==========================================================================
   6. Book Preview Modal Trigger
   ========================================================================== */
window.openBookPreview = function(bookNumber) {
  const books = {
    1: {
      img: 'assets/books/book-1.jpg',
      title: 'A Love Letter to the Adult Raised in Foster Care by Dr. Dina Lundy'
    },
    2: {
      img: 'assets/books/book-2.jpg',
      title: 'A Text for Your Multicultural Psychology Class by Dr. Dina Lundy'
    },
    3: {
      img: 'assets/books/book-3.jpg',
      title: 'Cultural Connections: Understanding This Multilayered Diverse Population by Dr. Dina Lundy'
    }
  };

  const item = books[bookNumber];
  if (item) {
    openLightbox(item.img, item.title);
  }
};

/* ==========================================================================
   7. Syllabus Request Modal Controller
   ========================================================================== */
window.openSyllabusModal = function(prefillCourse) {
  const courseInput = document.getElementById('prof-course');
  if (courseInput && prefillCourse) {
    courseInput.value = prefillCourse;
  }
  openModal('syllabus-modal');
};

window.handleSyllabusSubmit = function(e) {
  e.preventDefault();
  const profName = document.getElementById('prof-name').value;
  const profEmail = document.getElementById('prof-email').value;
  const profCourse = document.getElementById('prof-course').value;
  const profStart = document.getElementById('prof-start').value;
  const profNotes = document.getElementById('prof-notes').value;

  closeModal('syllabus-modal');

  // Trigger mailto link for direct delivery to Dr. Dina Lundy
  const subject = encodeURIComponent(`Urgent Syllabus Request: ${profCourse} (${profName})`);
  const body = encodeURIComponent(
    `Hello Dr. Dina Lundy,\n\n` +
    `My name is ${profName} (${profEmail}).\n` +
    `I am requesting a syllabus for: ${profCourse}\n` +
    `Start Date / Term: ${profStart}\n\n` +
    `Additional Notes:\n${profNotes || 'None'}\n\n` +
    `Thank you,\n${profName}`
  );

  window.location.href = `mailto:Dr.AdinaLundy@gmail.com?subject=${subject}&body=${body}`;

  showToast(`Syllabus request prepared for Dr. Lundy! Opening your mail client...`);
  e.target.reset();
};

/* ==========================================================================
   8. Podcast Guest Pitch Controller ("Appear on My Podcast")
   ========================================================================== */
window.openPodcastGuestModal = function() {
  openModal('podcast-modal');
};

window.handlePodcastPitchSubmit = function(e) {
  e.preventDefault();
  const guestName = document.getElementById('guest-name').value;
  const guestEmail = document.getElementById('guest-email').value;
  const guestTopic = document.getElementById('guest-topic').value;
  const guestPitch = document.getElementById('guest-pitch').value;

  closeModal('podcast-modal');

  const subject = encodeURIComponent(`Podcast Guest Story Pitch: ${guestTopic} - ${guestName}`);
  const body = encodeURIComponent(
    `Hi Dr. Dina Lundy,\n\n` +
    `I would love to appear on "You Are Not Going to Believe This" to tell my story.\n\n` +
    `Name: ${guestName}\n` +
    `Email: ${guestEmail}\n` +
    `Topic: ${guestTopic}\n\n` +
    `Story Pitch / Summary:\n${guestPitch}\n\n` +
    `Looking forward to connecting!`
  );

  window.location.href = `mailto:Dr.AdinaLundy@gmail.com?subject=${subject}&body=${body}`;

  showToast(`Thank you, ${guestName}! Story pitch submitted to Dr. Lundy's production team.`);
  e.target.reset();
};

/* ==========================================================================
   9. Lightbox Controller (High-Res Publications & Books)
   ========================================================================== */
window.openLightbox = function(imageSrc, captionText) {
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCap = document.getElementById('lightbox-caption');

  if (lightboxImg) lightboxImg.src = imageSrc;
  if (lightboxCap) lightboxCap.textContent = captionText || 'High-Resolution Document Preview';

  openModal('lightbox-modal');
};

/* ==========================================================================
   10. Audio Teaser Animation Toggle
   ========================================================================== */
let isAudioPlaying = false;
window.toggleAudioPreview = function() {
  isAudioPlaying = !isAudioPlaying;
  const playIcon = document.getElementById('audio-icon-play');
  const pauseIcon = document.getElementById('audio-icon-pause');
  const bars = document.querySelectorAll('.audio-bar');

  if (isAudioPlaying) {
    if (playIcon) playIcon.style.display = 'none';
    if (pauseIcon) pauseIcon.style.display = 'block';
    bars.forEach(b => b.style.animationPlayState = 'running');
    showToast('Playing preview teaser from "You Are Not Going to Believe This"...');
  } else {
    if (playIcon) playIcon.style.display = 'block';
    if (pauseIcon) pauseIcon.style.display = 'none';
    bars.forEach(b => b.style.animationPlayState = 'paused');
    showToast('Audio preview paused.');
  }
};

/* ==========================================================================
   11. Newsletter Form Handler
   ========================================================================== */
window.handleNewsletterSubmit = function(e) {
  e.preventDefault();
  const emailInput = document.getElementById('newsletter-email');
  if (emailInput && emailInput.value) {
    showToast(`Subscribed successfully! Welcome to Dr. Dina Lundy's Journal.`);
    emailInput.value = '';
  }
};

/* ==========================================================================
   12. Contact Form Handler
   ========================================================================== */
window.handleContactSubmit = function(e) {
  e.preventDefault();
  const name = document.getElementById('contact-name').value;
  const email = document.getElementById('contact-email').value;
  const topic = document.getElementById('contact-topic').value;
  const msg = document.getElementById('contact-message').value;

  const subject = encodeURIComponent(`Website Inquiry: ${topic} from ${name}`);
  const body = encodeURIComponent(`From: ${name} (${email})\nTopic: ${topic}\n\nMessage:\n${msg}`);

  window.location.href = `mailto:Dr.AdinaLundy@gmail.com?subject=${subject}&body=${body}`;

  showToast(`Thank you, ${name}! Your inquiry has been sent to Dr. Lundy.`);
  e.target.reset();
};

/* ==========================================================================
   13. Toast Notification Helper
   ========================================================================== */
function showToast(message) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(30px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

/* ==========================================================================
   14. Interactive 3D Card Tilt Effect
   ========================================================================== */
function initCardTiltEffect() {
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  const tiltCards = document.querySelectorAll(
    '.book-card, .video-card, .publication-card, .social-card, .course-featured-card, .podcast-showcase-card, .course-pricing-box'
  );

  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -5;
      const rotateY = ((x - centerX) / centerX) * 5;

      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-8px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease';
    });

    card.addEventListener('mouseenter', () => {
      card.style.transition = 'transform 0.1s ease-out, box-shadow 0.3s ease';
    });
  });
}

