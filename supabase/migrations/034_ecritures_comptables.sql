-- Migration 034: Journal comptable — écritures PCG
-- Dépend de: pcg_sources (migration 023)

-- ─── Table écritures comptables ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS ecritures_comptables (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Identification
  ecriture_num TEXT NOT NULL,           -- Numéro séquentiel (ex: EC-2026-0001)
  journal_code TEXT NOT NULL CHECK (journal_code IN ('VE','AC','BQ','OD','AN','SA','CA')),
  -- VE=Ventes, AC=Achats, BQ=Banque, OD=Opérations Diverses, AN=A-Nouveau, SA=Salaires, CA=Caisse

  -- Date et pièce
  date_ecriture DATE NOT NULL,
  date_piece DATE,
  piece_ref TEXT,                        -- Référence pièce (n° facture, relevé, etc.)

  -- Compte PCG
  compte_num TEXT NOT NULL,              -- Numéro de compte PCG (ex: 411, 607000)
  compte_lib TEXT,                       -- Libellé du compte (dénormalisé pour perf)

  -- Montants (une écriture = une ligne débit OU crédit)
  debit NUMERIC(15, 2) NOT NULL DEFAULT 0,
  credit NUMERIC(15, 2) NOT NULL DEFAULT 0,

  -- Libellé de l'écriture
  libelle TEXT NOT NULL,

  -- Lettrage (pour rapprochement tiers)
  lettrage TEXT,
  date_lettrage DATE,

  -- Lien avec entités source (optionnel)
  facture_fournisseur_id UUID REFERENCES factures(id) ON DELETE SET NULL,
  facture_client_id UUID REFERENCES factures_clients(id) ON DELETE SET NULL,
  transaction_id UUID REFERENCES transactions(id) ON DELETE SET NULL,

  -- Validation
  is_validated BOOLEAN DEFAULT FALSE,
  validated_at TIMESTAMPTZ,
  validated_by UUID REFERENCES auth.users(id),

  -- Métadonnées
  source TEXT DEFAULT 'manual' CHECK (source IN ('manual','auto_facture','auto_transaction','import_fec','import_csv')),
  metadata JSONB DEFAULT '{}',

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Contrainte: une ligne = débit XOR crédit (pas les deux)
  CONSTRAINT chk_debit_credit CHECK (
    (debit > 0 AND credit = 0) OR (debit = 0 AND credit > 0) OR (debit = 0 AND credit = 0)
  )
);

-- ─── Index ───────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_ecritures_user_date ON ecritures_comptables(user_id, date_ecriture);
CREATE INDEX IF NOT EXISTS idx_ecritures_journal ON ecritures_comptables(user_id, journal_code);
CREATE INDEX IF NOT EXISTS idx_ecritures_compte ON ecritures_comptables(user_id, compte_num);
CREATE INDEX IF NOT EXISTS idx_ecritures_num ON ecritures_comptables(user_id, ecriture_num);
CREATE INDEX IF NOT EXISTS idx_ecritures_piece ON ecritures_comptables(user_id, piece_ref);

-- ─── RLS ─────────────────────────────────────────────────────────────────────
ALTER TABLE ecritures_comptables ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS ecritures_comptables_user_policy ON ecritures_comptables;
CREATE POLICY ecritures_comptables_user_policy ON ecritures_comptables
  FOR ALL USING (auth.uid() = user_id);

-- ─── Trigger updated_at ─────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION update_ecritures_comptables_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_ecritures_comptables_updated ON ecritures_comptables;
CREATE TRIGGER trg_ecritures_comptables_updated
  BEFORE UPDATE ON ecritures_comptables
  FOR EACH ROW EXECUTE FUNCTION update_ecritures_comptables_updated_at();

-- ─── Séquence pour numérotation auto ─────────────────────────────────────────
-- (gérée côté applicatif pour être user-scoped)
