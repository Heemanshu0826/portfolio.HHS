/**
 * Heemanshu Hemant Sute - AI & ML Engineer Portfolio
 * Main Application Logic: Theme Toggle, Typing, Navigation, Filters, Contact & Feedback
 */

document.addEventListener('DOMContentLoaded', () => {
  // -------------------------------------------------------------
  // 1. THEME SWITCHER (Dark & Light Mode)
  // -------------------------------------------------------------
  const themeToggleBtn = document.getElementById('theme-toggle');
  const themeIcon = themeToggleBtn ? themeToggleBtn.querySelector('i') : null;

  // Retrieve saved theme or system preference
  const savedTheme = localStorage.getItem('theme');
  const systemPrefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
  const initialTheme = savedTheme || (systemPrefersLight ? 'light' : 'dark');

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);

    if (themeIcon) {
      if (theme === 'light') {
        themeIcon.className = 'fa-solid fa-moon';
      } else {
        themeIcon.className = 'fa-solid fa-sun';
      }
    }

    // Inform Three.js 3D canvas of color shift
    if (typeof window.updateThreeTheme === 'function') {
      window.updateThreeTheme();
    }
  }

  applyTheme(initialTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme);
      showToast(`Switched to ${newTheme.toUpperCase()} mode`);
    });
  }

  // -------------------------------------------------------------
  // 2. DYNAMIC TYPING EFFECT
  // -------------------------------------------------------------
  const typedTarget = document.getElementById('typed-text');
  if (typedTarget) {
    const words = [
      'AI & Machine Learning Engineer',
      'Freelance AI Specialist (4 Mo. Exp)',
      'Vision Transformers & Deep Learning',
      'Generative AI & LLM Systems',
      'End-to-End AI Model Deployment'
    ];
    let wordIdx = 0;
    let charIdx = 0;
    let isDeleting = false;
    let typeSpeed = 100;

    function typeLoop() {
      const currentWord = words[wordIdx];
      if (isDeleting) {
        typedTarget.textContent = currentWord.substring(0, charIdx - 1);
        charIdx--;
        typeSpeed = 45;
      } else {
        typedTarget.textContent = currentWord.substring(0, charIdx + 1);
        charIdx++;
        typeSpeed = 90;
      }

      if (!isDeleting && charIdx === currentWord.length) {
        typeSpeed = 1800; // Pause at end of word
        isDeleting = true;
      } else if (isDeleting && charIdx === 0) {
        isDeleting = false;
        wordIdx = (wordIdx + 1) % words.length;
        typeSpeed = 400; // Pause before next word
      }

      setTimeout(typeLoop, typeSpeed);
    }

    typeLoop();
  }

  // -------------------------------------------------------------
  // 3. NAVBAR SCROLL EFFECT & MOBILE MENU
  // -------------------------------------------------------------
  const navbar = document.querySelector('.navbar');
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Back to top button visibility
    const backToTopBtn = document.getElementById('back-to-top');
    if (backToTopBtn) {
      if (window.scrollY > 400) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }

    // Scroll spy for active navbar link
    let currentSection = '';
    const sections = document.querySelectorAll('section[id]');
    sections.forEach((sec) => {
      const secTop = sec.offsetTop - 120;
      const secHeight = sec.offsetHeight;
      if (window.scrollY >= secTop && window.scrollY < secTop + secHeight) {
        currentSection = sec.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  });

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      const icon = mobileToggle.querySelector('i');
      if (icon) {
        icon.className = navMenu.classList.contains('open') ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
      }
    });

    // Close menu when link is clicked
    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        const icon = mobileToggle.querySelector('i');
        if (icon) icon.className = 'fa-solid fa-bars';
      });
    });
  }

  // Back to top click
  const backToTopBtn = document.getElementById('back-to-top');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // -------------------------------------------------------------
  // 4. PROJECT FILTER TABS
  // -------------------------------------------------------------
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filterVal = btn.getAttribute('data-filter');

      projectCards.forEach((card) => {
        const category = card.getAttribute('data-category');
        if (filterVal === 'all' || category === filterVal) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });
    });
  });

  // -------------------------------------------------------------
  // 4b. CERTIFICATE FILTER TABS
  // -------------------------------------------------------------
  const certFilterBtns = document.querySelectorAll('.cert-filter-btn');
  const certShowcaseCards = document.querySelectorAll('.cert-showcase-card');

  certFilterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      certFilterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filterVal = btn.getAttribute('data-filter');

      certShowcaseCards.forEach((card) => {
        const category = card.getAttribute('data-category');
        if (filterVal === 'all' || (category && category.includes(filterVal))) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });
    });
  });
  // -------------------------------------------------------------
  const toast = document.getElementById('toast-notice');
  const toastText = document.getElementById('toast-text');
  let toastTimeout;

  function showToast(msg) {
    if (!toast || !toastText) return;
    toastText.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 3200);
  }
  window.showToast = showToast;

  // -------------------------------------------------------------
  // 6. COPY TO CLIPBOARD BUTTONS
  // -------------------------------------------------------------
  const copyBtns = document.querySelectorAll('[data-copy]');
  copyBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const textToCopy = btn.getAttribute('data-copy');
      navigator.clipboard
        .writeText(textToCopy)
        .then(() => {
          showToast(`Copied "${textToCopy}" to clipboard!`);
        })
        .catch(() => {
          showToast(`Failed to copy to clipboard.`);
        });
    });
  });

  // -------------------------------------------------------------
  // -------------------------------------------------------------
  // 7. DIRECT EMAIL CONTACT FORM SUBMISSION
  // -------------------------------------------------------------
  const contactForm = document.getElementById('contact-form');
  const formFeedback = document.getElementById('form-feedback');
  const submitBtn = document.getElementById('form-submit-btn');

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('form-name');
      const emailInput = document.getElementById('form-email');
      const subjectInput = document.getElementById('form-subject');
      const messageInput = document.getElementById('form-message');
      const hiddenSubject = document.getElementById('hidden-subject');

      const name = nameInput ? nameInput.value.trim() : '';
      const email = emailInput ? emailInput.value.trim() : '';
      const subject = subjectInput ? subjectInput.value.trim() : 'Freelance AI Project Inquiry';
      const message = messageInput ? messageInput.value.trim() : '';

      if (!name || !email || !message) {
        showToast('Please fill in all required fields.');
        return;
      }

      if (hiddenSubject) {
        hiddenSubject.value = `[portfolio.HHS] ${subject} - from ${name}`;
      }

      const isFileProtocol = window.location.protocol === 'file:';

      const encodedSubject = encodeURIComponent(`[portfolio.HHS] ${subject} - from ${name}`);
      const encodedBody = encodeURIComponent(`Hi Heemanshu,\n\n${message}\n\n---\nSender: ${name}\nEmail: ${email}\nSent via portfolio.HHS`);
      const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=heemanshus588@gmail.com&su=${encodedSubject}&body=${encodedBody}`;
      const mailtoUrl = `mailto:heemanshus588@gmail.com?subject=${encodedSubject}&body=${encodedBody}`;

      // CASE 1: Browsing as local HTML file (file:///)
      // FormSubmit blocks file:/// protocol with "Unable to submit form".
      // We seamlessly open Gmail Web Composer with the message prefilled directly to heemanshus588@gmail.com!
      if (isFileProtocol) {
        if (formFeedback) {
          formFeedback.innerHTML = `
            <div style="line-height: 1.6;">
              <div style="font-weight: 600; color: #10b981; margin-bottom: 6px;">
                <i class="fa-solid fa-circle-check"></i> Opening Gmail compose to <strong>heemanshus588@gmail.com</strong>!
              </div>
              <div style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 12px;">
                Your message has been pre-filled directly. Simply click <strong>Send</strong> in Gmail.
              </div>
              <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                <a href="${gmailUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm" style="font-size: 0.8rem; padding: 6px 14px;">
                  <i class="fa-solid fa-envelope"></i> Open in Gmail
                </a>
                <a href="${mailtoUrl}" class="btn btn-secondary btn-sm" style="font-size: 0.8rem; padding: 6px 14px;">
                  <i class="fa-solid fa-paper-plane"></i> Open in Default Mail
                </a>
              </div>
            </div>
          `;
          formFeedback.className = 'form-feedback success';
        }

        showToast('Opening Gmail to Heemanshu...');
        window.open(gmailUrl, '_blank');
        return;
      }

      // CASE 2: Browsing through a web server (http://localhost:... or online https://)
      const originalBtnHTML = submitBtn ? submitBtn.innerHTML : '';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> <span>Sending to Heemanshu...</span>';
      }

      if (formFeedback) {
        formFeedback.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending message directly to <strong>heemanshus588@gmail.com</strong>...';
        formFeedback.className = 'form-feedback loading';
      }

      showToast('Sending message to Heemanshu...');

      try {
        const payload = {
          name: name,
          email: email,
          _subject: `[portfolio.HHS] ${subject} - from ${name}`,
          message: message,
          _template: 'table',
          _captcha: 'false',
          _autoresponse: `Hi ${name},\n\nThank you for reaching out through my portfolio website (portfolio.HHS)!\n\nI have received your message regarding "${subject}" and will respond to you directly as soon as possible.\n\nBest regards,\nHeemanshu Hemant Sute\nAI & Machine Learning Engineer\nEmail: heemanshus588@gmail.com\nPhone: +91 9403540826\nLinkedIn: https://linkedin.com/in/heemanshu-sute`
        };

        const response = await fetch('https://formsubmit.co/ajax/heemanshus588@gmail.com', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        const result = await response.json();

        if (response.ok && (result.success === 'true' || result.success === true)) {
          if (formFeedback) {
            formFeedback.innerHTML = `<i class="fa-solid fa-circle-check" style="color: #10b981;"></i> Thank you, <strong>${name}</strong>! Your message has been sent directly to Heemanshu's inbox (<strong>heemanshus588@gmail.com</strong>). He will respond to you shortly!`;
            formFeedback.className = 'form-feedback success';
          }
          showToast('Message sent directly to Heemanshu!');
          contactForm.reset();
        } else if (result.message && result.message.includes('Activation')) {
          if (formFeedback) {
            formFeedback.innerHTML = `<i class="fa-solid fa-envelope-circle-check" style="color: var(--accent-cyan);"></i> Form activation email sent to <strong>heemanshus588@gmail.com</strong>! Please click "Activate Form" in your Gmail to finalize 1-click delivery.`;
            formFeedback.className = 'form-feedback success';
          }
          showToast('Activation email sent to heemanshus588@gmail.com');
        } else {
          // If AJAX returned false, offer direct Gmail button instead of redirecting to error page
          if (formFeedback) {
            formFeedback.innerHTML = `
              <div style="line-height: 1.6;">
                <div style="font-weight: 600; color: var(--accent-cyan); margin-bottom: 6px;">
                  <i class="fa-solid fa-paper-plane"></i> Ready to send directly to <strong>heemanshus588@gmail.com</strong>:
                </div>
                <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-top: 8px;">
                  <a href="${gmailUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm" style="font-size: 0.8rem; padding: 6px 14px;">
                    <i class="fa-solid fa-envelope"></i> Send via Gmail
                  </a>
                  <a href="${mailtoUrl}" class="btn btn-secondary btn-sm" style="font-size: 0.8rem; padding: 6px 14px;">
                    <i class="fa-solid fa-paper-plane"></i> Send via Default Mail
                  </a>
                </div>
              </div>
            `;
            formFeedback.className = 'form-feedback success';
          }
          window.open(gmailUrl, '_blank');
        }
      } catch (err) {
        // Fallback to Gmail Web Compose without error page
        if (formFeedback) {
          formFeedback.innerHTML = `
            <div style="line-height: 1.6;">
              <div style="font-weight: 600; color: #10b981; margin-bottom: 6px;">
                <i class="fa-solid fa-check-circle"></i> Opening direct email to <strong>heemanshus588@gmail.com</strong>...
              </div>
              <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-top: 8px;">
                <a href="${gmailUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm" style="font-size: 0.8rem; padding: 6px 14px;">
                  <i class="fa-solid fa-envelope"></i> Open in Gmail
                </a>
              </div>
            </div>
          `;
          formFeedback.className = 'form-feedback success';
        }
        window.open(gmailUrl, '_blank');
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnHTML;
        }
      }
    });
  }
});
