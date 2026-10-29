document.addEventListener('DOMContentLoaded', () => {
  'use strict';
  // --------------------------------------------------------------------------
  // 1. GESTION DU THÈME (SOMBRE / CLAIR)
  // --------------------------------------------------------------------------
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const currentTheme = localStorage.getItem('portfolio-theme') || 'dark';

  // Appliquer le thème initial
  document.documentElement.setAttribute('data-theme', currentTheme);
  updateThemeIcon(currentTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const activeTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = activeTheme === 'dark' ? 'light' : 'dark';
      
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('portfolio-theme', newTheme);
      updateThemeIcon(newTheme);
    });
  }

  function updateThemeIcon(theme) {
    if (!themeToggleBtn) return;
    const icon = themeToggleBtn.querySelector('i');
    if (!icon) return;
    
    if (theme === 'light') {
      icon.className = 'bi bi-moon-stars-fill';
      themeToggleBtn.setAttribute('title', 'Activer le mode sombre');
      themeToggleBtn.setAttribute('aria-label', 'Activer le mode sombre');
    } else {
      icon.className = 'bi bi-sun-fill';
      themeToggleBtn.setAttribute('title', 'Activer le mode clair');
      themeToggleBtn.setAttribute('aria-label', 'Activer le mode clair');
    }
  }

  // --------------------------------------------------------------------------
  // 2. NAVBAR SCROLL & FERMETURE MENU MOBILE
  // --------------------------------------------------------------------------
  const navbar = document.querySelector('.navbar-custom');
  const navbarCollapse = document.getElementById('navbarNav');
  const navLinks = document.querySelectorAll('.nav-link-custom');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Fermer le menu mobile lors d'un clic sur un lien de navigation
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navbarCollapse && navbarCollapse.classList.contains('show')) {
        const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
        if (bsCollapse) {
          bsCollapse.hide();
        }
      }
    });
  });

  // --------------------------------------------------------------------------
  // 3. EFFET DE MACHINE À ÉCRIRE (TYPING EFFECT) DANS LE HERO
  // --------------------------------------------------------------------------
  const typingElement = document.getElementById('typingRole');
  const roles = [
    'Développeuse Web',
    'Passionnée Front-End & UI',
    'Étudiante à l\'UNCHK',
    'Créatrice de solutions numériques'
  ];

  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 100;

  function typeEffect() {
    if (!typingElement) return;

    const currentRole = roles[roleIndex];

    if (isDeleting) {
      typingElement.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 50;
    } else {
      typingElement.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 110;
    }

    if (!isDeleting && charIndex === currentRole.length) {
      typingSpeed = 1800; // Pause à la fin du mot
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      typingSpeed = 400; // Pause avant le prochain mot
    }

    setTimeout(typeEffect, typingSpeed);
  }

  typeEffect();

  // --------------------------------------------------------------------------
  // 4. ANIMATION DES STATISTIQUES AU SCROLL (COMPTEURS)
  // --------------------------------------------------------------------------
  const statNumbers = document.querySelectorAll('.stat-number');
  let statsCounted = false;

  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !statsCounted) {
        statsCounted = true;
        statNumbers.forEach(stat => {
          const target = parseInt(stat.getAttribute('data-target'), 10);
          const suffix = stat.getAttribute('data-suffix') || '';
          animateCounter(stat, target, suffix);
        });
      }
    });
  }, { threshold: 0.5 });

  const statsSection = document.querySelector('.stats-container');
  if (statsSection) {
    statsObserver.observe(statsSection);
  }

  function animateCounter(element, target, suffix) {
    let current = 0;
    const duration = 1600;
    const stepTime = Math.abs(Math.floor(duration / target));
    const timer = setInterval(() => {
      current += 1;
      element.textContent = current + suffix;
      if (current >= target) {
        element.textContent = target + suffix;
        clearInterval(timer);
      }
    }, Math.max(stepTime, 20));
  }

  // --------------------------------------------------------------------------
  // 5. ANIMATION DES BARRES DE COMPÉTENCES AU DÉFILEMENT
  // --------------------------------------------------------------------------
  const skillBars = document.querySelectorAll('.skill-progress-fill');
  
  const skillsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        const targetPercent = bar.getAttribute('data-level');
        bar.style.width = targetPercent + '%';
        skillsObserver.unobserve(bar);
      }
    });
  }, { threshold: 0.3 });

  skillBars.forEach(bar => skillsObserver.observe(bar));

  // --------------------------------------------------------------------------
  // 6. FILTRAGE DYNAMIQUE DES PROJETS
  // --------------------------------------------------------------------------
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectItems = document.querySelectorAll('.project-item');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Activer le bouton sélectionné
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectItems.forEach(item => {
        const categories = item.getAttribute('data-category').split(' ');

        if (filterValue === 'all' || categories.includes(filterValue)) {
          item.style.display = 'block';
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          }, 50);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.95)';
          setTimeout(() => {
            item.style.display = 'none';
          }, 300);
        }
      });
    });
  });

  // --------------------------------------------------------------------------
  // 7. DONNÉES DÉTAILLÉES & MODALE DES PROJETS
  // --------------------------------------------------------------------------
 

  const projectModalEl = document.getElementById('projectModal');
  const projectModal = projectModalEl ? new bootstrap.Modal(projectModalEl) : null;

  document.querySelectorAll('.btn-project-view').forEach(button => {
    button.addEventListener('click', (e) => {
      const projectId = e.currentTarget.getAttribute('data-project');
      const project = projectsData[projectId];

      if (project && projectModal) {
        document.getElementById('modalProjectTitle').textContent = project.title;
        document.getElementById('modalProjectImage').src = project.image;
        document.getElementById('modalProjectImage').alt = project.title;
        document.getElementById('modalProjectCategory').textContent = project.category;
        document.getElementById('modalProjectDescription').textContent = project.description;

        // Remplir la liste des fonctionnalités
        const featuresContainer = document.getElementById('modalProjectFeatures');
        featuresContainer.innerHTML = '';
        project.features.forEach(feat => {
          const li = document.createElement('li');
          li.innerHTML = `<i class="bi bi-check-circle-fill"></i> <span>${feat}</span>`;
          featuresContainer.appendChild(li);
        });

        // Remplir les tags de technologies
        const tagsContainer = document.getElementById('modalProjectTags');
        tagsContainer.innerHTML = '';
        project.techs.forEach(t => {
          const span = document.createElement('span');
          span.className = 'tag-badge';
          span.textContent = t;
          tagsContainer.appendChild(span);
        });

        // Mettre à jour les liens
        const liveBtn = document.getElementById('modalProjectLive');
        const codeBtn = document.getElementById('modalProjectCode');

        liveBtn.onclick = (ev) => {
          ev.preventDefault();
          showNotification(`Aperçu du projet « ${project.title} » ouvert dans une nouvelle fenêtre simulée !`);
        };

        codeBtn.href = project.codeLink;
        codeBtn.target = '_blank';

        projectModal.show();
      }
    });
  });

  // --------------------------------------------------------------------------
  // 8. VALIDATION ET ENVOI DU FORMULAIRE DE CONTACT
  // --------------------------------------------------------------------------
  const FORMSPREE_URL = 'https://formspree.io/f/xaeeblgl'; 
  
  const contactForm = document.getElementById('contactForm');
  const toastEl = document.getElementById('contactToast');
  const toastMessageEl = document.getElementById('toastMessage');

  if (contactForm) {
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const subjectInput = document.getElementById('subject');
    const messageInput = document.getElementById('message');

    // Validation à la saisie pour un feedback fluide
    [nameInput, emailInput, subjectInput, messageInput].forEach(input => {
      input.addEventListener('input', () => {
        validateField(input);
      });
    });

    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const isNameValid = validateField(nameInput);
      const isEmailValid = validateField(emailInput);
      const isSubjectValid = validateField(subjectInput);
      const isMessageValid = validateField(messageInput);

      if (isNameValid && isEmailValid && isSubjectValid && isMessageValid) {
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;

        // État de chargement élégant
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="bi bi-arrow-repeat spin"></i> Envoi en cours...';

        try {
          const response = await fetch(FORMSPREE_URL, {
            method: 'POST',
            body: new FormData(contactForm),
            headers: { 'Accept': 'application/json' }
          });

          if (response.ok) {
            contactForm.reset();

            // Retirer les classes de validation
            [nameInput, emailInput, subjectInput, messageInput].forEach(inp => {
              inp.classList.remove('is-valid', 'is-invalid');
            });

            // Afficher la notification de succès
            showNotification('Merci ! Votre message a été transmis avec succès à Salimata Ka.');
          } else {
            showNotification("Une erreur est survenue. Veuillez réessayer ou m'écrire directement par e-mail.");
          }
        } catch (error) {
          showNotification("Impossible d'envoyer le message. Vérifiez votre connexion internet.");
        } finally {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
        }
      }
    });
  }

  function validateField(input) {
    let isValid = true;
    const value = input.value.trim();

    if (input.id === 'name') {
      isValid = value.length >= 2;
    } else if (input.id === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      isValid = emailRegex.test(value);
    } else if (input.id === 'subject') {
      isValid = value.length >= 3;
    } else if (input.id === 'message') {
      isValid = value.length >= 10;
    }

    if (isValid) {
      input.classList.remove('is-invalid');
      input.classList.add('is-valid');
    } else {
      input.classList.remove('is-valid');
      input.classList.add('is-invalid');
    }

    return isValid;
  }

  function showNotification(msg) {
    if (!toastEl) return;
    toastMessageEl.textContent = msg;
    toastEl.classList.add('show');

    setTimeout(() => {
      toastEl.classList.remove('show');
    }, 4500);
  }

  // --------------------------------------------------------------------------
  // 9. BOUTON RETOUR EN HAUT (BACK TO TOP)
  // --------------------------------------------------------------------------
  const backToTopBtn = document.getElementById('backToTopBtn');

  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    });

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // --------------------------------------------------------------------------
  // 10. EFFET D'APPARITION AU DÉFILEMENT (REVEAL ON SCROLL)
  // --------------------------------------------------------------------------
  const revealElements = document.querySelectorAll('.reveal-fade');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealElements.forEach(el => revealObserver.observe(el));

  // --------------------------------------------------------------------------
  // 11. TÉLÉCHARGEMENT DU CV (CV MODAL / TRIGGER)
  // --------------------------------------------------------------------------
  const cvButtons = document.querySelectorAll('.btn-download-cv');
  const cvModalEl = document.getElementById('cvModal');
  const cvModal = cvModalEl ? new bootstrap.Modal(cvModalEl) : null;

  cvButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (cvModal) {
        cvModal.show();
      }
    });
  });

  const printCvBtn = document.getElementById('printCvBtn');
  if (printCvBtn) {
    printCvBtn.addEventListener('click', () => {
      window.print();
    });
  }
});