/* ==========================================================================
   PORTAFOLIO INTERACTIVO - LUIS MANUEL GARCÍA RIVERO
   JavaScript Engine (Interactivity, Theme Switcher, Modals, Filters, Toast)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ----------------------------------------------------
  // 1. Dark / Light Theme Controller
  // ----------------------------------------------------
  const themeToggleBtn = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');
  const htmlDoc = document.documentElement;

  // Read saved theme or default to dark
  const savedTheme = localStorage.getItem('theme') || 'dark';
  setTheme(savedTheme);

  themeToggleBtn.addEventListener('click', () => {
    const currentTheme = htmlDoc.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  });

  function setTheme(theme) {
    htmlDoc.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    if (theme === 'dark') {
      themeIcon.className = 'fa-solid fa-moon';
      themeToggleBtn.title = 'Cambiar a Modo Claro';
    } else {
      themeIcon.className = 'fa-solid fa-sun';
      themeToggleBtn.title = 'Cambiar a Modo Oscuro';
    }
  }

  // ----------------------------------------------------
  // 2. Mobile Menu Navigation Toggle
  // ----------------------------------------------------
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      const icon = mobileToggle.querySelector('i');
      if (navMenu.classList.contains('active')) {
        icon.className = 'fa-solid fa-xmark';
      } else {
        icon.className = 'fa-solid fa-bars';
      }
    });

    // Close mobile menu when clicking a link
    navMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        mobileToggle.querySelector('i').className = 'fa-solid fa-bars';
      });
    });
  }

  // ----------------------------------------------------
  // 3. Stats Counter Animation (Count-up)
  // ----------------------------------------------------
  const statNumbers = document.querySelectorAll('.stat-number');
  let animated = false;

  function animateCounters() {
    statNumbers.forEach(stat => {
      const target = parseInt(stat.getAttribute('data-target') || '0', 10);
      const hasPercent = stat.innerText.includes('%');
      let count = 0;
      const duration = 1500;
      const stepTime = Math.abs(Math.floor(duration / (target || 1)));

      const timer = setInterval(() => {
        count += 1;
        stat.innerText = count + (hasPercent ? '%' : '+');
        if (count >= target) {
          stat.innerText = target + (hasPercent ? '%' : (target === 1 ? '' : '+'));
          clearInterval(timer);
        }
      }, Math.max(stepTime, 20));
    });
  }

  // Trigger counter when hero section comes into view
  const heroSection = document.getElementById('hero');
  if (heroSection) {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !animated) {
        animated = true;
        animateCounters();
      }
    }, { threshold: 0.3 });
    observer.observe(heroSection);
  }

  // ----------------------------------------------------
  // 4. Timeline Tab Switcher (Work vs Vida UNITEC)
  // ----------------------------------------------------
  const tabBtns = document.querySelectorAll('.timeline-controls .tab-btn');
  const workContent = document.getElementById('timeline-work-content');
  const unitecContent = document.getElementById('timeline-unitec-content');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const target = btn.getAttribute('data-target');
      if (target === 'work') {
        workContent.style.display = 'block';
        unitecContent.style.display = 'none';
      } else {
        workContent.style.display = 'none';
        unitecContent.style.display = 'block';
      }
    });
  });

  // ----------------------------------------------------
  // 5. Skills & Tools Category Filter
  // ----------------------------------------------------
  const filterBtns = document.querySelectorAll('.skills-filter .filter-btn');
  const toolCards = document.querySelectorAll('.tools-grid .tool-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      toolCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          card.style.opacity = '1';
        } else {
          card.style.display = 'none';
          card.style.opacity = '0';
        }
      });
    });
  });

  // ----------------------------------------------------
  // 6. SISPRO Modal System
  // ----------------------------------------------------
  const sisproModal = document.getElementById('sispro-modal');
  const openSisproBtn = document.getElementById('open-sispro-btn');
  const openSisproModalBtn = document.getElementById('open-sispro-modal-btn');
  const closeSisproBtn = document.getElementById('close-sispro-modal');

  function openModal() {
    if (sisproModal) sisproModal.classList.add('active');
  }

  function closeModal() {
    if (sisproModal) sisproModal.classList.remove('active');
  }

  if (openSisproBtn) openSisproBtn.addEventListener('click', openModal);
  if (openSisproModalBtn) openSisproModalBtn.addEventListener('click', openModal);
  if (closeSisproBtn) closeSisproBtn.addEventListener('click', closeModal);

  if (sisproModal) {
    sisproModal.addEventListener('click', (e) => {
      if (e.target === sisproModal) closeModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sisproModal && sisproModal.classList.contains('active')) {
      closeModal();
    }
  });

  // ----------------------------------------------------
  // 6b. Certificate Viewer Modal System
  // ----------------------------------------------------
  const certModal = document.getElementById('cert-modal');
  const certIframe = document.getElementById('cert-iframe');
  const certModalTitle = document.getElementById('cert-modal-title');
  const certDownloadLink = document.getElementById('cert-download-link');
  const closeCertBtn = document.getElementById('close-cert-modal');
  const closeCertBtnFooter = document.getElementById('close-cert-modal-btn');
  const viewCertBtns = document.querySelectorAll('.view-cert-btn');

  function openCertModal(pdfUrl, title) {
    if (!certModal) return;
    if (certIframe) certIframe.src = pdfUrl;
    if (certModalTitle) certModalTitle.innerText = title || 'Certificado Académico';
    if (certDownloadLink) certDownloadLink.href = pdfUrl;
    certModal.classList.add('active');
  }

  function closeCertModal() {
    if (!certModal) return;
    certModal.classList.remove('active');
    if (certIframe) certIframe.src = '';
  }

  viewCertBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const certUrl = btn.getAttribute('data-cert');
      const title = btn.getAttribute('data-title');
      openCertModal(certUrl, title);
    });
  });

  if (closeCertBtn) closeCertBtn.addEventListener('click', closeCertModal);
  if (closeCertBtnFooter) closeCertBtnFooter.addEventListener('click', closeCertModal);

  if (certModal) {
    certModal.addEventListener('click', (e) => {
      if (e.target === certModal) closeCertModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && certModal && certModal.classList.contains('active')) {
      closeCertModal();
    }
  });

  // ----------------------------------------------------
  // 7. Toast Notification Utility
  // ----------------------------------------------------
  const toast = document.getElementById('toast-notification');
  const toastMsg = document.getElementById('toast-message');
  let toastTimeout;

  function showToast(message) {
    if (!toast || !toastMsg) return;
    toastMsg.innerText = message;
    toast.classList.add('active');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.classList.remove('active');
    }, 3500);
  }

  // ----------------------------------------------------
  // 8. Copy to Clipboard Handlers (Email & Phone)
  // ----------------------------------------------------
  const copyEmailBtn = document.getElementById('copy-email-btn');
  const copyPhoneBtn = document.getElementById('copy-phone-btn');

  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', () => {
      navigator.clipboard.writeText('LUISMANUEL1402@GMAIL.COM').then(() => {
        showToast('¡Correo LUISMANUEL1402@GMAIL.COM copiado al portapapeles!');
      });
    });
  }

  if (copyPhoneBtn) {
    copyPhoneBtn.addEventListener('click', () => {
      navigator.clipboard.writeText('+584244598847').then(() => {
        showToast('¡Teléfono (+58) 424-4598847 copiado al portapapeles!');
      });
    });
  }

  // ----------------------------------------------------
  // 9. Contact Form Native Direct Dispatch (FormSubmit)
  // ----------------------------------------------------
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', () => {
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Enviando Correo...';
      }
    });
  }

  // ----------------------------------------------------
  // 10. PDF CV Download Notification Handler
  // ----------------------------------------------------
  const downloadCvBtn = document.getElementById('download-cv-btn');
  if (downloadCvBtn) {
    downloadCvBtn.addEventListener('click', () => {
      showToast('¡Descargando CV Completo (PDF)...!');
    });
  }

  // ----------------------------------------------------
  // 11. Active Nav Link Scroll Spy
  // ----------------------------------------------------
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 150;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });

});
