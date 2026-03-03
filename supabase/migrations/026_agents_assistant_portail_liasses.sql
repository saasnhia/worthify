-- ═══════════════════════════════════════════════════════════════
-- Migration 026 — Agents IA, Assistant, Portail client, Liasses
-- ═══════════════════════════════════════════════════════════════

-- ── 1. AGENTS IA SUR MESURE ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS agents (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  nom             TEXT NOT NULL,
  description     TEXT,
  trigger_type    TEXT NOT NULL DEFAULT 'manuel'
    CHECK (trigger_type IN ('facture_impayee','nouveau_document','fin_de_mois','manuel','webhook')),
  trigger_config  JSONB NOT NULL DEFAULT '{}',
  actions         JSONB NOT NULL DEFAULT '[]',
  prompt_template TEXT,
  statut          TEXT NOT NULL DEFAULT 'inactif'
    CHECK (statut IN ('actif','inactif')),
  freq_max        TEXT NOT NULL DEFAULT 'illimite'
    CHECK (freq_max IN ('1_par_jour','1_par_semaine','illimite')),
  created_at      TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE agents ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "agents_user" ON agents;
CREATE POLICY "agents_user" ON agents
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ── 2. LOGS D'EXÉCUTION AGENTS ───────────────────────────────────
CREATE TABLE IF NOT EXISTS agent_logs (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id       UUID NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
  executed_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  statut         TEXT NOT NULL DEFAULT 'running'
    CHECK (statut IN ('success','error','running')),
  input_data     JSONB,
  output_data    JSONB,
  error_message  TEXT,
  created_at     TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE agent_logs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "agent_logs_user" ON agent_logs;
CREATE POLICY "agent_logs_user" ON agent_logs
  USING (
    EXISTS (
      SELECT 1 FROM agents a
      WHERE a.id = agent_logs.agent_id AND a.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM agents a
      WHERE a.id = agent_logs.agent_id AND a.user_id = auth.uid()
    )
  );

-- ── 3. CONVERSATIONS ASSISTANT PCG/BOFIP ─────────────────────────
CREATE TABLE IF NOT EXISTS conversations_assistant (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  titre      TEXT NOT NULL DEFAULT 'Nouvelle conversation',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE conversations_assistant ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "conversations_assistant_user" ON conversations_assistant;
CREATE POLICY "conversations_assistant_user" ON conversations_assistant
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ── 4. MESSAGES ASSISTANT ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS messages_assistant (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations_assistant(id) ON DELETE CASCADE,
  role            TEXT NOT NULL CHECK (role IN ('user','assistant')),
  content         TEXT NOT NULL,
  created_at      TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE messages_assistant ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "messages_assistant_user" ON messages_assistant;
CREATE POLICY "messages_assistant_user" ON messages_assistant
  USING (
    EXISTS (
      SELECT 1 FROM conversations_assistant c
      WHERE c.id = messages_assistant.conversation_id AND c.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM conversations_assistant c
      WHERE c.id = messages_assistant.conversation_id AND c.user_id = auth.uid()
    )
  );

-- ── 5. PORTAILS CLIENT (SIMPLIFIÉ) ───────────────────────────────
CREATE TABLE IF NOT EXISTS portails_client (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cabinet_user_id   UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  client_id         UUID,
  client_nom        TEXT NOT NULL,
  token             TEXT NOT NULL UNIQUE DEFAULT replace(gen_random_uuid()::text, '-', ''),
  actif             BOOLEAN NOT NULL DEFAULT true,
  derniere_connexion TIMESTAMPTZ,
  created_at        TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE portails_client ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "portails_client_user" ON portails_client;
CREATE POLICY "portails_client_user" ON portails_client
  USING (auth.uid() = cabinet_user_id) WITH CHECK (auth.uid() = cabinet_user_id);

-- Public read by token (for client access)
DROP POLICY IF EXISTS "portails_client_public_read" ON portails_client;
CREATE POLICY "portails_client_public_read" ON portails_client
  FOR SELECT USING (actif = true);

-- ── 6. LIASSES FISCALES ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS liasses_fiscales (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type_liasse  TEXT NOT NULL CHECK (type_liasse IN ('2065','2031','2035')),
  exercice     INTEGER NOT NULL,
  donnees      JSONB NOT NULL DEFAULT '{}',
  statut       TEXT NOT NULL DEFAULT 'brouillon'
    CHECK (statut IN ('brouillon','validee')),
  created_at   TIMESTAMPTZ DEFAULT now(),
  updated_at   TIMESTAMPTZ DEFAULT now(),
  UNIQUE (user_id, type_liasse, exercice)
);

ALTER TABLE liasses_fiscales ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "liasses_fiscales_user" ON liasses_fiscales;
CREATE POLICY "liasses_fiscales_user" ON liasses_fiscales
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
