# Brancher le formulaire de contact sur Supabase

Ce dossier contient tout ce qu'il faut pour que le formulaire de la page
`contact.html` enregistre réellement les messages reçus, dans une base de
données Supabase (gratuite jusqu'à un certain volume d'utilisation).

Aucun serveur à héberger : le site continue de fonctionner comme un site
statique classique, il communique directement avec Supabase depuis le
navigateur du visiteur.

## Étape 1 — Créer un projet Supabase

1. Allez sur https://supabase.com et créez un compte (gratuit).
2. Cliquez sur **New project**.
3. Choisissez un nom (ex. `kaya-computing`), un mot de passe de base de
   données, et une région proche de vos visiteurs (ex. Europe si vous
   ciblez le Sénégal/l'Afrique de l'Ouest).
4. Attendez 1 à 2 minutes que le projet soit prêt.

## Étape 2 — Créer la table de messages

1. Dans le menu de gauche, ouvrez **SQL Editor**.
2. Cliquez sur **New query**.
3. Ouvrez le fichier [`schema.sql`](./schema.sql) de ce dossier, copiez tout
   son contenu, collez-le dans l'éditeur, puis cliquez sur **Run**.
4. Vérifiez que la table est apparue : menu **Table Editor** >
   `contact_submissions`.

Ce script active aussi une règle de sécurité (Row Level Security) qui
autorise uniquement l'ajout de nouveaux messages depuis le site — jamais
leur lecture, modification ou suppression par un visiteur.

## Étape 3 — Récupérer vos identifiants d'API

1. Dans le menu de gauche, allez dans **Project Settings** > **API**.
2. Notez deux valeurs :
   - **Project URL** (ressemble à `https://xxxxxxxx.supabase.co`)
   - **anon public** key (une longue chaîne de caractères)

⚠️ Ne copiez jamais la clé **service_role** dans le site : elle donne un
accès complet à la base de données et doit rester strictement secrète.
Seule la clé **anon public** est conçue pour être visible dans le code
d'un site.

## Étape 4 — Renseigner les identifiants dans le site

Ouvrez le fichier [`../js/contact-form.js`](../js/contact-form.js) et
remplacez les deux lignes suivantes par vos propres valeurs :

```js
const SUPABASE_URL = 'https://VOTRE-PROJET.supabase.co';
const SUPABASE_ANON_KEY = 'VOTRE_CLE_ANON_PUBLIQUE';
```

## Étape 5 — Tester

1. Ouvrez `contact.html` dans un navigateur (ou sur votre site en ligne).
2. Remplissez le formulaire et cliquez sur **Envoyer le message**.
3. Un message de confirmation doit s'afficher sous le bouton.
4. Retournez dans Supabase > **Table Editor** > `contact_submissions` :
   votre message doit apparaître dans la table.

## Consulter les messages reçus

Pour l'instant, le moyen le plus simple de consulter les messages est le
**Table Editor** du dashboard Supabase (accessible depuis n'importe quel
navigateur, avec votre compte Supabase).

Si vous préférez recevoir un e-mail à chaque nouveau message, deux options
possibles pour la suite :
- Un **Database Webhook** Supabase (Database > Webhooks) qui déclenche un
  appel vers un service comme Zapier ou Make à chaque nouvelle ligne, pour
  vous envoyer un e-mail automatiquement.
- Une **Edge Function** Supabase qui envoie l'e-mail elle-même via un
  service comme Resend ou SendGrid.

Ces deux options demandent une configuration supplémentaire — n'hésitez
pas à demander de l'aide pour les mettre en place le moment venu.
