-- ============================================================
-- 035 : Fix SECURITY DEFINER → SECURITY INVOKER sur 2 vues
-- Vulnérabilité : les vues sans security_invoker bypass le RLS
-- ============================================================

-- 1) ai_usage_monthly — agrégation tokens par mois
DROP VIEW IF EXISTS public.ai_usage_monthly;
CREATE VIEW public.ai_usage_monthly
WITH (security_invoker = true) AS
SELECT
  user_id,
  SUM(tokens_used) AS total_tokens,
  date_trunc('month', created_at) AS month
FROM public.ai_usage
GROUP BY user_id, date_trunc('month', created_at);

-- 2) notifications_factures — factures en retard avec infos client
DROP VIEW IF EXISTS public.notifications_factures;
CREATE VIEW public.notifications_factures
WITH (security_invoker = true) AS
SELECT
  fc.id,
  fc.user_id,
  fc.montant_ttc AS montant,
  fc.date_echeance,
  c.nom AS client_nom,
  c.email AS client_email,
  fc.numero_facture,
  GREATEST(0, EXTRACT(DAY FROM now() - fc.date_echeance::timestamp)::int) AS jours_retard,
  CASE
    WHEN fc.date_echeance::date < (now() - INTERVAL '30 days')::date THEN 'tres_en_retard'
    WHEN fc.date_echeance::date < now()::date THEN 'en_retard'
    ELSE 'a_jour'
  END AS statut
FROM factures_clients fc
LEFT JOIN clients c ON c.id = fc.client_id
WHERE fc.statut_paiement IN ('en_attente', 'en_retard', 'partiellement_payee');
