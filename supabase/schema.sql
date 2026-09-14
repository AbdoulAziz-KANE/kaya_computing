-- ============================================================
-- KAYA COMPUTING — Schéma Supabase pour le formulaire de contact
-- ============================================================
-- À exécuter une seule fois dans votre projet Supabase :
-- Dashboard > SQL Editor > New query > coller ce script > Run

-- Extension nécessaire pour générer des identifiants uniques
create extension if not exists pgcrypto;

-- Table qui stocke chaque message envoyé depuis le formulaire de contact
create table if not exists public.contact_submissions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  email text not null,
  project_type text,
  budget text,
  message text not null
);

-- Active la sécurité au niveau des lignes (obligatoire avant de définir des règles)
alter table public.contact_submissions enable row level security;

-- Autorise n'importe quel visiteur du site (rôle "anon", utilisé par la
-- clé publique "anon public") à AJOUTER un message, mais jamais à lire,
-- modifier ou supprimer les messages existants.
create policy "Autoriser l'envoi de messages de contact"
  on public.contact_submissions
  for insert
  to anon
  with check (true);

-- (Optionnel) Autorise uniquement un utilisateur connecté à votre projet
-- Supabase (vous, via une future interface d'administration) à consulter
-- les messages reçus. Sans cette règle, vous pouvez toujours consulter
-- la table directement depuis le Table Editor du dashboard Supabase.
create policy "Lecture réservée aux utilisateurs authentifiés"
  on public.contact_submissions
  for select
  to authenticated
  using (true);
