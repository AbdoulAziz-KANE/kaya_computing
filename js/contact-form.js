// KAYA COMPUTING — Formulaire de contact connecté à Supabase
// ------------------------------------------------------------------
// Ce script envoie chaque message du formulaire directement dans une
// table de votre projet Supabase, sans backend à héberger séparément.
//
// MISE EN ROUTE (voir aussi supabase/README.md) :
//   1. Créez un projet gratuit sur https://supabase.com
//   2. Dans l'éditeur SQL du projet, exécutez le script
//      supabase/schema.sql fourni avec ce site.
//   3. Dans Project Settings > API, récupérez :
//        - l'URL du projet ("Project URL")
//        - la clé publique ("anon public")
//   4. Collez ces deux valeurs ci-dessous, à la place des exemples.
//
// Cette clé "anon public" est faite pour être visible dans le code
// du site : elle ne donne aucun accès en lecture/suppression, grâce
// aux règles de sécurité (RLS) définies dans supabase/schema.sql, qui
// n'autorisent que l'ajout de nouveaux messages.
// N'utilisez jamais la clé "service_role" ici, elle doit rester secrète.
// ------------------------------------------------------------------

const SUPABASE_URL = 'https://oongkpfljcsqojkxpuml.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9vbmdrcGZsamNzcW9qa3hwdW1sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkzMDEwNDQsImV4cCI6MjEwNDg3NzA0NH0.B6LajEpjqZ8a8x7SXFAVyylyEPhOo2Y5IOAT91RdGos';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('#contact-form');
  if (!form) return;

  const status = document.querySelector('#form-status');
  const submitBtn = form.querySelector('button[type="submit"]');
  const submitLabel = submitBtn ? submitBtn.textContent : 'Envoyer le message →';

  const isConfigured =
    !SUPABASE_URL.includes('VOTRE-PROJET') &&
    !SUPABASE_ANON_KEY.includes('VOTRE_CLE') &&
    typeof window.supabase !== 'undefined';

  const supabaseClient = isConfigured
    ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
    : null;

  const showStatus = (message, isError = false) => {
    if (!status) return;
    status.textContent = message;
    status.style.color = isError ? '#DC2626' : 'var(--blue)';
    status.style.display = 'block';
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const name = form.querySelector('#name').value.trim();
    const email = form.querySelector('#email').value.trim();
    const projectType = form.querySelector('#project-type').value;
    const budget = form.querySelector('#budget').value;
    const message = form.querySelector('#message').value.trim();

    if (!supabaseClient) {
      showStatus(
        "Le formulaire n'est pas encore connecté. Ajoutez vos identifiants Supabase dans js/contact-form.js (voir supabase/README.md).",
        true
      );
      return;
    }

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Envoi en cours...';
    }

    const { error } = await supabaseClient.from('contact_submissions').insert([
      {
        name,
        email,
        project_type: projectType,
        budget,
        message,
      },
    ]);

    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = submitLabel;
    }

    if (error) {
      console.error('Erreur Supabase :', error);
      showStatus(
        "Une erreur est survenue lors de l'envoi. Merci de réessayer, ou de nous contacter directement via WhatsApp.",
        true
      );
      return;
    }

    showStatus(
      `Merci ${name.split(' ')[0]} ! Votre message a bien été envoyé. Nous revenons vers vous rapidement.`
    );
    form.reset();
  });
});
