// KAYA COMPUTING — script principal du site

document.addEventListener('DOMContentLoaded', () => {
  // ---- Menu mobile ----
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const isOpen = links.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  }

  // ---- Formulaire de contact ----
  // La logique d'envoi (connectée à Supabase) vit désormais dans
  // js/contact-form.js, chargé uniquement sur la page contact.html.

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---- Bouton retour en haut ----
  const scrollTopBtn = document.querySelector('.scroll-top-btn');
  if (scrollTopBtn) {
    const toggleScrollTopBtn = () => {
      scrollTopBtn.classList.toggle('is-visible', window.scrollY > 420);
    };
    toggleScrollTopBtn();
    window.addEventListener('scroll', toggleScrollTopBtn, { passive: true });
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    });
  }

  // ---- Apparition au scroll (fade + slide léger) ----
  // Coût quasi nul : IntersectionObserver ne fait rien tant qu'un
  // élément n'entre pas dans le viewport, et n'anime que opacity/transform.
  const revealEls = document.querySelectorAll('.reveal, .reveal-group');
  if (revealEls.length) {
    if (!prefersReducedMotion && 'IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
      revealEls.forEach((el) => io.observe(el));
    } else {
      // Pas de JS/observer disponible ou mouvement réduit demandé :
      // on affiche tout directement, sans animation.
      revealEls.forEach((el) => el.classList.add('is-visible'));
    }
  }

  // ---- FAQ : accordéon animé (progressive enhancement sur <details>) ----
  if (!prefersReducedMotion) {
    document.querySelectorAll('.faq-item').forEach((item) => {
      const summary = item.querySelector('summary');
      const content = item.querySelector('p');
      if (!summary || !content) return;

      content.style.overflow = 'hidden';
      content.style.transition = 'max-height .3s ease, opacity .25s ease';
      if (!item.open) {
        content.style.maxHeight = '0px';
        content.style.opacity = '0';
      }

      summary.addEventListener('click', (e) => {
        e.preventDefault();
        const opening = !item.open;

        if (opening) {
          item.setAttribute('open', '');
          const target = content.scrollHeight;
          content.style.maxHeight = '0px';
          content.style.opacity = '0';
          requestAnimationFrame(() => {
            content.style.maxHeight = target + 'px';
            content.style.opacity = '1';
          });
        } else {
          content.style.maxHeight = content.scrollHeight + 'px';
          content.style.opacity = '1';
          requestAnimationFrame(() => {
            content.style.maxHeight = '0px';
            content.style.opacity = '0';
          });
          content.addEventListener('transitionend', function onEnd(ev) {
            if (ev.propertyName === 'max-height') {
              item.removeAttribute('open');
              content.removeEventListener('transitionend', onEnd);
            }
          });
        }
      });
    });
  }
});
