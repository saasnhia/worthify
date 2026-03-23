# Worthifast — Contexte projet complet

## Description
Contexte technique complet du projet Worthifast : schema DB, architecture API, pricing, normes comptables FR, pipeline OCR, agents IA, regles de securite.

## Quand utiliser
Avant toute modification du code Worthifast. Donne le contexte necessaire pour eviter les erreurs d'architecture, de securite ou de conformite comptable.

---

## 1. Stack technique

- **Framework** : Next.js 16.1.6 (App Router), React 18.3.1, TypeScript 5.6.3 strict
- **Styling** : Tailwind CSS 3.4.14 (palette custom navy/emerald/coral/gold/finance/brand)
- **Base de donnees** : Supabase PostgreSQL 15.6.1 + RLS sur toutes les tables
- **Auth** : Supabase GoTrue v2.158.1 (email/password + Google OAuth)
- **Paiements** : Stripe (abonnements multi-tiers + Connect)
- **LLM** : Mistral AI via `@ai-sdk/mistral` (France, RGPD) + Ollama local fallback
- **OCR** : Tesseract.js 5.1.0 + pdf2json + mammoth + xlsx + papaparse
- **Email** : Resend (cloud) ou SMTP (on-premise)
- **Rate limiting** : Upstash Redis (5 req/min/IP sliding window)
- **PDF** : pdf-lib (generation + Factur-X embedding)
- **E2E** : Playwright (Chromium + Firefox)
- **Video marketing** : Remotion
- **Deploy** : Vercel (cloud) + Docker Compose 7 services (on-premise)
- **API Gateway** : Kong 3.7 (self-hosted)

---

## 2. Schema base de donnees (35 tables)

### Tables principales

| Table | Cles principales | Description |
|-------|-----------------|-------------|
| `user_profiles` | id (= auth.users.id), plan, subscription_status, stripe_customer_id | Profil utilisateur + plan |
| `clients` | id, user_id, name, email, siret | Clients du cabinet |
| `transactions` | id, user_id, date, montant, categorie | Mouvements bancaires |
| `factures` | id, user_id, fournisseur, montant_ht, montant_tva, montant_ttc, status, confidence | Factures fournisseur (OCR) |
| `factures_clients` | id, user_id, client_id, numero, montant_ht, montant_ttc, status | Factures emises |
| `ecritures_comptables` | id, user_id, date, journal, compte_debit, compte_credit, montant, libelle | Journal comptable PCG |
| `declarations_tva` | id, user_id, periode, regime, status, ca_imposable, tva_collectee, tva_deductible, tva_nette | Declarations CA3 |
| `banques` | id, user_id, nom, solde, derniere_synchro | Comptes bancaires |
| `rapprochements` | id, user_id, transaction_id, facture_id, status, confidence | Matching transactions ↔ factures |
| `dossiers` | id, user_id, nom, siren, type | Dossiers clients (cabinet) |
| `agents` | id, user_id, nom, type, system_prompt | Agents IA custom |
| `agent_logs` | id, agent_id, user_id, input, output, tokens_used, duration_ms | Logs des appels IA |
| `integrations_oauth` | id, user_id, provider (cegid/sage), access_token_encrypted, refresh_token_encrypted | Tokens ERP chiffres AES-256-GCM |
| `automation_logs` | id, user_id, action, details, reversible, reversed | Journal automatisation |
| `automation_settings` | id, user_id, categorization_confidence, matching_threshold, notifications_enabled | Config auto |
| `notifications` | id, user_id, type, title, message, read | Notifications in-app |
| `audit_logs` | id, user_id, entity_type, entity_id, action, details | Piste d'audit |
| `alertes` | id, user_id, type, severity, message, resolved | Alertes cabinet |
| `subscriptions` | id, user_id, stripe_subscription_id, plan, status | Abonnements Stripe |
| `fournisseurs_risque` | id, siren, score_risque, source | Scoring risque fournisseur (Pappers) |
| `custom_category_rules` | id, user_id, pattern, category, confidence | Regles categorisation apprises |
| `import_history` | id, user_id, type, filename, status, rows_processed | Historique imports |
| `benchmarks` | id, secteur, indicateur, valeur | Benchmarks sectoriels |
| `portal_messages` | id, client_id, user_id, message, direction | Messages portail client |
| `portal_documents` | id, client_id, filename, url | Documents portail |
| `relance_config` | id, user_id, delays, enabled | Config relances auto |
| `quote_views` | id, quote_id, viewed_at, ip | Tracking vues devis |
| `abonnements_recurrents` | id, user_id, client_id, montant, frequence, prochaine_facture | Factures recurrentes |
| `catalogue` | id, user_id, nom, description, prix_ht, tva_rate | Catalogue produits/services |
| `documents` | id, user_id, type, titre, contenu, client_id | Documents generiques |
| `immobilisations` | id, user_id, designation, valeur_achat, date_achat, duree_amortissement | Immobilisations |
| `centres_couts` | id, user_id, nom, budget | Centres de couts |
| `notes_frais` | id, user_id, montant, categorie, justificatif_url | Notes de frais |
| `features` | id, user_id, feature_key, enabled | Feature flags par user |
| `ai_usage` | id, user_id, date, tokens_used, requests_count | Tracking usage IA |

### RLS (Row Level Security)
- Toutes les tables ont des policies `users_own_*` basees sur `auth.uid() = user_id`
- Exception : `fournisseurs_risque` (lecture publique, ecriture service role)
- `signup_ips` : pas de RLS (service role only)

---

## 3. Architecture API (120 routes)

### Comptabilite
| Route | Methode | Auth | Description |
|-------|---------|------|-------------|
| `/api/comptabilite/ecritures` | GET | Session | Liste ecritures comptables |
| `/api/comptabilite/ecritures/seed` | POST | Session | Seed ecritures demo |
| `/api/comptabilite/balance` | GET | Session | Balance des comptes |
| `/api/comptabilite/grand-livre` | GET | Session | Grand livre general |

### Factures
| Route | Methode | Auth | Description |
|-------|---------|------|-------------|
| `/api/factures/upload` | POST | Session | Upload + OCR facture fournisseur |
| `/api/factures/[id]` | GET/PATCH | Session | Detail/modifier facture |
| `/api/factures/clients` | GET/POST | Session | CRUD factures clients |
| `/api/factures/clients/[id]` | GET/PATCH | Session | Detail facture client |

### Banques & Rapprochement
| Route | Methode | Auth | Description |
|-------|---------|------|-------------|
| `/api/banques` | GET/POST | Session | CRUD comptes bancaires |
| `/api/banques/[id]` | PATCH/DELETE | Session | Modifier/supprimer banque |
| `/api/banques/import-csv` | POST | Session | Import releve CSV/OFX |
| `/api/banques/confirm-import` | POST | Session | Confirmer import |
| `/api/banques/reconcile` | POST | Session | Lancer rapprochement auto |
| `/api/rapprochement/match` | POST | Session | Matcher manuellement |
| `/api/rapprochement/suggestions` | GET | Session | Suggestions matching |
| `/api/rapprochement/anomalies` | GET | Session | Anomalies detectees |
| `/api/rapprochement/stats` | GET | Session | Stats rapprochement |
| `/api/rapprochement/valider` | POST | Session | Valider un match |

### TVA
| Route | Methode | Auth | Description |
|-------|---------|------|-------------|
| `/api/tva/calculate` | POST | Session | Calculer TVA depuis ecritures |
| `/api/tva/declarations` | GET/POST | Session | CRUD declarations CA3 |
| `/api/tva/declarations/[id]` | GET/PATCH | Session | Detail declaration |
| `/api/tva/generate-ca3` | POST | Session | Generer PDF CA3 |
| `/api/tva/valider` | POST | Session | Valider declaration |

### E-invoicing
| Route | Methode | Auth | Description |
|-------|---------|------|-------------|
| `/api/einvoicing` | POST | Session | Generer XML Factur-X ou detecter dans PDF |

### Agents IA
| Route | Methode | Auth | Description |
|-------|---------|------|-------------|
| `/api/agents/run` | POST | Session | Executer un agent |
| `/api/ai/agent-audit` | POST | Session | Agent audit comptable |
| `/api/ai/agent-mail` | POST | Session | Agent redaction email |
| `/api/ai/agent-rapprochement` | POST | Session | Agent rapprochement bancaire |
| `/api/ai/agent-tva` | POST | Session | Agent TVA / fiscal |
| `/api/assistant` | POST | Session | Assistant general |
| `/api/ia/agents-custom` | GET/POST | Session | CRUD agents custom |
| `/api/ia/agents-custom/[id]` | GET/PATCH | Session | Detail agent |
| `/api/ia/agents-custom/[id]/chat` | POST | Session | Chat avec agent custom |
| `/api/ia/pcg-bofip` | POST | Session | Expert PCG & BOFIP |

### Categorisation
| Route | Methode | Auth | Description |
|-------|---------|------|-------------|
| `/api/categorization/suggest` | POST | Session | Suggerer categorie |
| `/api/categorization/learn` | POST | Session | Apprendre pattern |
| `/api/categorization/learn/batch` | POST | Session | Apprentissage batch |
| `/api/categorization/rules` | GET/POST | Session | Regles custom |
| `/api/categorization/rules/[id]` | PATCH/DELETE | Session | Modifier regle |

### Integrations ERP
| Route | Methode | Auth | Description |
|-------|---------|------|-------------|
| `/api/integrations/connexions` | GET | Session | Liste connexions |
| `/api/integrations/cegid/connect` | GET | Session | OAuth Cegid Loop |
| `/api/integrations/cegid/callback` | GET | Public | Callback OAuth |
| `/api/integrations/cegid` | GET | Session | Status Cegid |
| `/api/integrations/cegid/sync` | POST | Session | Sync manuelle |
| `/api/integrations/cegid/sync/cron` | POST | CRON_SECRET | Sync auto Cegid |
| `/api/integrations/sage/connect` | GET | Session | OAuth Sage via Chift |
| `/api/integrations/sage/sync` | POST | Session | Sync manuelle Sage |
| `/api/integrations/sage/sync/cron` | POST | CRON_SECRET | Sync auto Sage |

### Stripe
| Route | Methode | Auth | Description |
|-------|---------|------|-------------|
| `/api/stripe/checkout` | POST | Session | Creer session checkout |
| `/api/stripe/portal` | POST | Session | Portal Stripe billing |
| `/api/stripe/payment-link` | POST | Session | Lien paiement client |
| `/api/stripe/subscription-status` | GET | Session | Status abonnement |
| `/api/stripe/webhook` | POST | Webhook signature | Webhooks Stripe |

### Export
| Route | Methode | Auth | Description |
|-------|---------|------|-------------|
| `/api/export/fec` | GET | Session | FEC (norme DGFIP) TXT + CSV |

### Cron jobs
| Route | Methode | Auth | Description |
|-------|---------|------|-------------|
| `/api/cron/abonnements` | POST | CRON_SECRET | Facturation recurrente |
| `/api/cron/relances` | POST | CRON_SECRET | Relances auto |
| `/api/notifications/cron` | POST | CRON_SECRET | Notifications planifiees |
| `/api/alerts/auto` | POST | CRON_SECRET | Generation alertes auto |

### Autres routes
- `/api/clients` — CRUD clients
- `/api/contact`, `/api/contact/cabinet` — Formulaires contact
- `/api/dashboard/summary` — KPIs dashboard
- `/api/insights` — Business intelligence
- `/api/documents`, `/api/documents/[id]` — CRUD documents
- `/api/documents/[id]/convertir`, `/api/documents/[id]/envoyer` — Conversion + envoi
- `/api/dossiers`, `/api/dossiers/[id]` — CRUD dossiers cabinet
- `/api/entreprises/[siren]` — Lookup INSEE SIRENE
- `/api/entreprises/[siren]/risque` — Score risque Pappers
- `/api/benchmarks` — Benchmarks sectoriels
- `/api/catalogue`, `/api/catalogue/[id]` — Catalogue produits
- `/api/abonnements-recurrents` — Facturation recurrente
- `/api/portail/invite`, `/api/portail/liste` — Portail client
- `/api/portail/[token]/documents`, `/api/portail/[token]/messages` — Portail public
- `/api/relances/config`, `/api/relances/envoyer`, `/api/relances/retard` — Relances
- `/api/notifications/clients`, `/api/notifications/factures` — Notifications
- `/api/health` — Health check
- `/api/seed/demo` — Seed donnees demo
- `/api/settings/profile` — Profil utilisateur
- `/api/onboarding/complete` — Fin onboarding
- `/api/account/delete` — Suppression compte
- `/api/usage/ai` — Tracking usage IA
- `/api/import/detect`, `/api/import/process`, `/api/import/history` — Import generique
- `/api/automation/settings`, `/api/automation/log`, `/api/automation/stats` — Automatisation
- `/api/automation/reverse/[id]` — Annuler une action auto
- `/api/audit/accounts`, `/api/audit/thresholds` — Audit comptable
- `/api/transactions/auto-categorize` — Auto-categorisation
- `/api/metrics/comparative` — Metriques comparatives
- `/api/parse-finance` — Parsing documents financiers

---

## 4. Pricing (plans Stripe)

| Segment | Plan | Prix/mois | Prix/an | Users max | Trial |
|---------|------|-----------|---------|-----------|-------|
| **Starter** | Gratuit | 0 EUR | 0 EUR | 1 | — |
| **Independant** | Basique | 12 EUR | 115 EUR | 1 | 30j |
| **Independant** | Essentiel | 22 EUR | 211 EUR | 1 | 30j |
| **Independant** | Premium | 74 EUR | 710 EUR | 1 | 30j |
| **TPE** | Basique | 27 EUR | 259 EUR | 5 | 14j |
| **TPE** | Essentiel | 45 EUR | 432 EUR | 5 | 14j |
| **TPE** | Premium | 139 EUR | 1 334 EUR | 5 | 14j |
| **PME** | Basique | 45 EUR | 432 EUR | 15 | 14j |
| **PME** | Essentiel | 89 EUR | 854 EUR | 15 | 14j |
| **PME** | Premium | 269 EUR | 2 582 EUR | 15 | 14j |
| **Cabinet** | Essentiel | 99 EUR | 950 EUR | 10 | 30j |
| **Cabinet** | Premium | 179 EUR | 1 718 EUR | 10 | 30j |

**Plans landing page simplifies** : Solo 29 EUR, Cabinet 59 EUR, Cabinet Pro 99 EUR, Sur Mesure (contact)

---

## 5. Normes comptables francaises

### Plan Comptable General (PCG)
- 700+ comptes structures en 8 classes
- Classes 1-5 : bilan (actif/passif)
- Classes 6-7 : charges/produits (resultat)
- Journaux : VE (ventes), AC (achats), BQ (banque), OD (operations diverses)

### TVA — Declaration CA3
- **CERFA 3310** : formulaire mensuel/trimestriel
- Cases numerotees : 01 (CA imposable), 08 (taux 20%), 09 (taux 10%), 19 (TVA immobilisations), 20 (TVA ABS), 28 (TVA nette due)
- Regimes : reel normal, reel simplifie
- Echeance : 20 du mois suivant

### FEC (Fichier des Ecritures Comptables)
- Norme DGFiP — 18 colonnes obligatoires
- Format : TXT pipe-delimited ou CSV
- Colonnes : JournalCode, JournalLib, EcritureNum, EcritureDate, CompteNum, CompteLib, CompAuxNum, CompAuxLib, PieceRef, PieceDate, EcritureLib, Debit, Credit, EcritureLet, DateLet, ValidDate, Montantdevise, Idevise

### E-invoicing 2026 (Factur-X)
- **Norme** : EN16931 / ZUGFeRD 2.3
- **Format** : PDF/A-3 avec XML embarque
- **Profil** : EN16931 (full compliance)
- **Obligation** : Reception sept 2026 (toutes entreprises), emission sept 2027 (TPE/PME)
- **PPF** : Portail Public de Facturation (Chorus Pro)
- **Implementation** : `src/lib/einvoicing/facturx.ts` — generation XML, embedding PDF, detection, validation

---

## 6. Pipeline OCR (factures fournisseur)

### Flux complet
```
Upload fichier (PDF/JPG/PNG/Excel/Word/CSV, max 50 Mo)
  → Detection format (pdf2json / Tesseract.js / mammoth / xlsx)
  → Extraction texte brut
  → Regex : numero facture, dates, montants, fournisseur, SIRET
  → Si confiance < seuil : fallback Ollama IA locale (mistral:7b-instruct)
  → Calcul coherence : HT + TVA = TTC
  → Suggestion comptes PCG (606100, 445660, 401000...)
  → Categorisation auto (regles apprises + matching)
  → Generation ecritures comptables automatiques
  → Insertion en base (facture + ecritures)
  → Score confiance stocke et affiche
```

### Route API
- `POST /api/factures/upload` — auth requise, multipart/form-data
- Timeout OCR : 30 secondes
- Formats supportes : PDF (natif + scanne), JPG, PNG, Excel, Word, CSV, TXT

### Libraries
- `tesseract.js@5.1.0` — OCR (reconnaissance caracteres, support francais)
- `pdf2json@4.0.2` — Extraction texte PDF natif
- `mammoth@1.11.0` — Conversion DOCX → HTML → texte
- `xlsx@0.18.5` — Parsing Excel
- `papaparse@5.5.3` — Parsing CSV

---

## 7. Agents IA

### Orchestrateur (`src/lib/agents/orchestrator.ts`)
- LLM : Mistral AI via `@ai-sdk/mistral` + Vercel AI SDK `generateText()`
- Rate limit : 10 appels/heure/utilisateur
- Timeout : 30 secondes
- Logging : tokens utilises + duree stockes dans `agent_logs`

### Agents specialises
| Agent | Fichier | Fonction |
|-------|---------|----------|
| **Audit** | `src/lib/agents/audit-agent.ts` | Detection anomalies comptables, doublons, incoherences PCG |
| **TVA** | `src/lib/agents/tva-agent.ts` | Verification taux, calcul CA3, conseil fiscal |
| **Rapprochement** | `src/lib/agents/rapprochement-agent.ts` | Aide matching transactions ↔ factures |
| **Mail** | `src/lib/agents/mail-agent.ts` | Redaction emails professionnels (relances, notifications) |

### Agents custom
- CRUD via `/api/ia/agents-custom`
- Chat via `/api/ia/agents-custom/[id]/chat`
- System prompt personnalisable
- Historique conversations

### Expert PCG & BOFIP
- Route `/api/ia/pcg-bofip`
- Contextes : PCG 2025, BOFIP, CGI
- Suggestions contextuelles (cloture, IS, TVA) basees sur la date

### RGPD
- Badge "RGPD anonymise" sur l'interface IA
- Donnees personnelles anonymisees avant envoi au LLM
- Mistral AI heberge en France

---

## 8. Regles de securite (NON NEGOCIABLES)

### 1. Auth Supabase obligatoire
```typescript
const supabase = await createClient()
const { data: { user } } = await supabase.auth.getUser()
if (!user) return NextResponse.json({ error: 'Non authentifie' }, { status: 401 })
```
**JAMAIS** utiliser `getSession()` seul — toujours `getUser()` qui valide le JWT cote serveur.

### 2. Verification webhook Stripe
```typescript
const event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
```
**JAMAIS** parser le JSON directement sans verification de signature.

### 3. Secrets en env uniquement
Variables critiques : SUPABASE_SERVICE_ROLE_KEY, STRIPE_SECRET_KEY, MISTRAL_API_KEY, INTEGRATION_ENCRYPTION_KEY
**JAMAIS** hardcoder, **JAMAIS** exposer cote client.

### 4. Rate limiting
`checkRateLimit(request)` sur les routes sensibles (upload, IA, checkout).
Sliding window 5 req/min/IP via Upstash Redis.

### 5. Chiffrement tokens ERP
Tokens OAuth Cegid/Sage chiffres AES-256-GCM avec `INTEGRATION_ENCRYPTION_KEY`.

### 6. RLS partout
Row Level Security active sur toutes les tables. Policies `users_own_*` basees sur `auth.uid()`.
Service role uniquement pour cron jobs et operations admin.

### 7. TypeScript strict
Zero `any`. Toujours des types explicites.

### 8. Anonymisation RGPD
Donnees personnelles anonymisees avant envoi au LLM.

### 9. Anti-abus
`signup_ips` : 2 comptes max par IP par semaine.

### 10. Build
`npm run build` doit TOUJOURS passer sans erreur.

---

## 9. Deploiement

### Cloud (Vercel)
- Auto-deploy sur push `main`
- Region : `cdg1` (Paris)
- 6 cron jobs configures dans `vercel.json`

### On-premise (Docker Compose)
7 services :
1. PostgreSQL 15.6.1 (port 5432)
2. PostgREST v12.2.3 (API REST)
3. GoTrue v2.158.1 (Auth)
4. Kong 3.7 (API Gateway)
5. Ollama (LLM local, 8 Go RAM)
6. App Next.js (port 3000)
7. Volumes : postgres_data, ollama_data

### Commandes
```bash
npm run dev          # Dev server localhost:3000
npm run build        # Build production
npm run lint         # ESLint
npm run test:e2e     # Playwright (Chromium + Firefox)
```

---

## 10. MCP configures

1. **Supabase MCP** — Inspection tables, SQL validation
2. **Playwright MCP** — E2E automation headless
3. **Context7 MCP** — Docs Next.js/React/Supabase temps reel
4. **GitHub MCP** — Git history, PRs, issues
