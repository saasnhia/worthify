-- Migration 030: Fix RLS fournisseurs_risque_cache
-- Remplace la policy ALL trop permissive par des policies granulaires

-- Supprimer la policy ALL permissive
DROP POLICY IF EXISTS "Authenticated write access on fournisseurs_risque_cache"
  ON fournisseurs_risque_cache;

-- INSERT: tout utilisateur authentifié peut ajouter au cache
CREATE POLICY "Authenticated insert on fournisseurs_risque_cache"
  ON fournisseurs_risque_cache FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- UPDATE: tout utilisateur authentifié peut rafraîchir le cache (ex: données expirées)
CREATE POLICY "Authenticated update on fournisseurs_risque_cache"
  ON fournisseurs_risque_cache FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- DELETE: réservé au service_role (nettoyage automatique via cron)
-- Pas de policy DELETE pour les utilisateurs normaux
