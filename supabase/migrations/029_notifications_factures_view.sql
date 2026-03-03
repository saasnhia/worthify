-- Migration 029: Vue notifications_factures
-- Utilisée par le mail-agent pour récupérer les factures en retard avec infos client

CREATE OR REPLACE VIEW notifications_factures AS
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
