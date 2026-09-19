// KAYA COMPUTING — Bascule mode clair / sombre
// ------------------------------------------------------------------
// Le thème choisi est mémorisé dans le navigateur (localStorage) et
// s'applique donc automatiquement à chaque visite et sur toutes les
// pages du site. Sans choix explicite de l'utilisateur, le site suit
// la préférence système (clair/sombre) de son appareil.
// ------------------------------------------------------------------

(function () {
  const STORAGE_KEY = 'kaya-theme';

  const getStoredTheme = () => {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      return null;
    }
  };

  const getPreferredTheme = () => {
    const stored = getStoredTheme();
    if (stored === 'dark' || stored === 'light') return stored;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  };

  const applyTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
  };

  // Applique le thème le plus tôt possible, avant même le rendu
  // complet de la page, pour éviter un flash de thème incorrect.
  applyTheme(getPreferredTheme());

  const updateToggleLabel = (btn, theme) => {
    if (!btn) return;
    const label = theme === 'dark' ? 'Activer le mode clair' : 'Activer le mode sombre';
    btn.setAttribute('aria-label', label);
    btn.setAttribute('title', label);
  };

  document.addEventListener('DOMContentLoaded', () => {
    const toggleBtn = document.querySelector('.theme-toggle');
    if (!toggleBtn) return;

    updateToggleLabel(toggleBtn, document.documentElement.getAttribute('data-theme'));

    toggleBtn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
      const next = current === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      updateToggleLabel(toggleBtn, next);
      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch (e) {
        // Stockage indisponible (navigation privée, etc.) : le thème
        // reste appliqué pour la session en cours, simplement non mémorisé.
      }
    });

    // Si l'utilisateur n'a jamais choisi de thème manuellement, on
    // continue de suivre les changements de préférence système en direct.
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (getStoredTheme()) return;
      applyTheme(e.matches ? 'dark' : 'light');
    });
  });
})();
