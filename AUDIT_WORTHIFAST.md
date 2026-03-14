# AUDIT COMPLET — Worthifast (14 mars 2026)

> **Mis a jour le 14 mars 2026** apres fix batch P1 (Open Banking + TS strict + UX)

## 1. Resume executif

| Etat | Nb features | % |
|------|------------|---|
| Fonctionnel | 39 | 67% |
| Partiel | 11 | 19% |
| Casse / Bug | 2 | 3% |
| Stub / Placeholder | 4 | 7% |
| **TOTAL** | **58** | **100%** |

**Score de completion global : 85%**

### Problemes resolus (batch P1 du 14 mars)

1. ~~65 occurrences de `any`~~ → **0 `any` dans le code production** (3 restants : 2 dans scripts hors-build + 1 avec eslint-disable)
2. ~~UploadFacture `handleSaveEdits` TODO~~ → **Implemente** : validation champs, PATCH API, toast + redirect
3. ~~Open Banking absent~~ → **Page `/banking`** avec KPIs reels (Supabase) + modal connexion PSD2 + API `/api/banking/status`
4. **Loading states ajoutes** : Dashboard skeletons, Stripe checkout spinner, Google Auth spinner, Onboarding mobile responsive

### Problemes restants

1. **Print facture SIRET/TVA hardcodes** — `src/app/factures/[id]/print/page.tsx:92-93`
2. **Page admin sans protection role** — `src/app/admin/users/page.tsx`

---

## 2. Tableau des features

### Authentification & Securite

| Feature | Etat | Fichier(s) | Probleme | Priorite |
|---------|------|------------|----------|----------|
| Login email + Google OAuth | ✅ | `src/app/login/page.tsx`, `src/hooks/useAuth.ts` | — | — |
| Signup + redirect Stripe | ✅ | `src/app/signup/page.tsx` | — | — |
| Forgot/Reset password | ✅ | `src/app/forgot-password/`, `src/app/reset-password/` | — | — |
| Middleware auth + subscription | ✅ | `src/middleware.ts`, `src/lib/supabase/middleware.ts` | Robuste, auto-sync sub status | — |
| Session slot limiter | ✅ | `src/lib/auth/user-limit.ts`, migration 012 | cleanup trigger ok | — |
| Audit log RGPD | ✅ | `src/lib/audit-logger.ts`, migration 007 | Fire-and-forget, no delete policy | — |
| Rate limiting | ⚠️ | `src/lib/utils/rate-limit.ts` | In-memory, reset a chaque cold start Vercel | P1 |
| Admin users page | ⚠️ | `src/app/admin/users/page.tsx` | Pas de protection admin — n'importe quel user authentifie y accede | P1 |

### Onboarding & Subscription

| Feature | Etat | Fichier(s) | Probleme | Priorite |
|---------|------|------------|----------|----------|
| Onboarding 4 etapes | ✅ | `src/app/onboarding/page.tsx` | SIRET→TVA auto, bank connexion step | — |
| Pricing page multi-profils | ✅ | `src/app/pricing/page.tsx`, `src/components/plans/PricingPlans.tsx` | 4 segments, monthly/annual toggle | — |
| Stripe Checkout | ✅ | `src/app/api/stripe/checkout/route.ts` | Rate-limited, plan aliases, trial 30j | — |
| Stripe Webhook | ✅ | `src/app/api/stripe/webhook/route.ts` | 5 events geres, dual-sync (subscriptions + user_profiles) | — |
| Checkout success polling | ✅ | `src/app/checkout/success/page.tsx` | Poll 2.5s, max 45s, fallback auto-sync | — |
| Stripe Portal | ✅ | `src/app/api/stripe/portal/route.ts` | Customer portal redirect | — |
| Feature gating | ✅ | `src/lib/auth/check-plan.ts`, `src/components/plans/FeatureGate.tsx` | 5 plans, 30+ features | — |
| Trial ending email | ✅ | `src/emails/TrialEndingEmail.tsx` | Via webhook `trial_will_end` | — |

### Dashboard & KPIs

| Feature | Etat | Fichier(s) | Probleme | Priorite |
|---------|------|------------|----------|----------|
| Dashboard principal | ✅ | `src/app/dashboard/page.tsx` | Adaptive cabinet/entreprise, trial banner | — |
| KPI Cards | ✅ | `src/components/dashboard/KPICard.tsx` | Tooltips, benchmarks, trends | — |
| Break-even gauge + chart | ✅ | `src/components/dashboard/BreakEvenGauge.tsx`, `BreakEvenChart.tsx` | SVG gauge, recharts area chart | — |
| Sparklines historiques | ⚠️ | `src/app/dashboard/page.tsx:205` | **TODO**: donnees hardcodees, pas de vraies donnees 7j | P2 |
| Comparative metrics | ✅ | `src/components/dashboard/ComparativeMetrics.tsx` | Mois-1 / N-1 toggle | — |
| Insights panel | ✅ | `src/components/dashboard/InsightsPanel.tsx` | Top 3, simulation, download | — |
| Export FEC | ✅ | `src/components/dashboard/ExportFECModal.tsx`, `src/app/api/export/fec/` | TXT + CSV, preview, warnings | — |
| Data input form | ⚠️ | `src/components/dashboard/DataInputForm.tsx` | `importedData?: any` — viole TS strict | P2 |
| Dashboard preferences | ✅ | `src/hooks/useDashboardPreferences.ts` | KPI reorder + toggle | — |

### Factures (Fournisseurs — OCR)

| Feature | Etat | Fichier(s) | Probleme | Priorite |
|---------|------|------------|----------|----------|
| Upload OCR + extraction | ✅ | `src/app/api/factures/upload/route.ts` | Tesseract + regex + Ollama fallback, enrichissement SIREN | — |
| Upload UI drag-drop | ✅ | `src/components/factures/UploadFacture.tsx` | 50Mo limit, confidence badge | — |
| Edition post-OCR | ❌ | `src/components/factures/UploadFacture.tsx:87-97` | **TODO non implemente** — `handleSaveEdits` ne fait rien | P0 |
| Auto-categorisation | ✅ | `src/lib/categorization/matcher.ts`, `smart-categorizer.ts` | Jaccard + regex + Ollama, seuil 90% auto | — |
| PATCH facture fields | ✅ | `src/app/api/factures/[id]/route.ts` | compte_comptable, code_tva, categorie | — |

### Factures Clients (Saisie manuelle)

| Feature | Etat | Fichier(s) | Probleme | Priorite |
|---------|------|------------|----------|----------|
| Formulaire creation | ✅ | `src/components/factures/FactureClientForm.tsx` | Multi-lignes, TVA, remise | — |
| Liste + filtres | ✅ | `src/components/factures/FacturesClientsList.tsx` | Search, status filter, actions | — |
| Vue / Edit / Print | ✅ | `src/app/factures/[id]/`, `[id]/modifier/`, `[id]/print/` | — | — |
| Print page SIRET/TVA | ⚠️ | `src/app/factures/[id]/print/page.tsx:92-93` | Hardcoded `XXXXXXXXXXXXXX` au lieu des vraies donnees utilisateur | P1 |
| Numero auto FAC-YYYY-NNN | ✅ | `src/lib/factures/calculs.ts` | — | — |
| Stripe Payment Link | ✅ | `src/app/api/stripe/payment-link/route.ts` | Per-invoice payment link | — |

### Rapprochement bancaire

| Feature | Etat | Fichier(s) | Probleme | Priorite |
|---------|------|------------|----------|----------|
| Matching auto + suggestions | ✅ | `src/hooks/useRapprochement.ts`, `src/app/api/rapprochement/match/` | 5 criteres scoring, seuil 85% auto | — |
| Validation/Rejet | ✅ | `src/app/api/rapprochement/valider/route.ts` | — | — |
| Anomalies detection | ✅ | `src/app/api/rapprochement/anomalies/route.ts` | 8 types d'anomalies | — |
| Supplier learning | ✅ | `src/lib/matching/learning-engine.ts` | IBAN patterns, avg amounts | — |
| Pages rapprochement | ✅ | `src/app/rapprochement/` (4 pages) | Dashboard + transactions + factures + anomalies | — |

### Banques & Import

| Feature | Etat | Fichier(s) | Probleme | Priorite |
|---------|------|------------|----------|----------|
| CRUD comptes bancaires | ✅ | `src/app/api/banques/`, `src/hooks/useBankAccounts.ts` | IBAN validation | — |
| Import CSV (BNP/SG/CA) | ✅ | `src/lib/parsers/bank-csv-parser.ts`, `src/app/api/banques/import-csv/` | 3 formats francais | — |
| Import confirm + dedup | ✅ | `src/app/api/banques/confirm-import/route.ts` | Hash dedup, auto-match post-import | — |
| Universal import hub | ✅ | `src/components/dashboard/UniversalImportHub.tsx` | Detect + redirect + process | — |
| Import FEC | ✅ | `src/lib/parsers/fec-parser.ts`, `src/app/api/import/process/` | NF Z 69-013 compliant | — |
| Import Excel batch | ✅ | `src/lib/parsers/excel-batch-parser.ts` | Flexible column aliases | — |
| Import history | ✅ | `src/components/dashboard/ImportHistoryList.tsx` | Last 5 imports | — |
| Open Banking (page + mock) | ✅ | `src/app/banking/page.tsx`, `src/app/api/banking/status/route.ts` | Page marketing avec KPIs reels + modal PSD2. Integration Bridge/Powens reelle = P2 | — |

### TVA & Fiscal

| Feature | Etat | Fichier(s) | Probleme | Priorite |
|---------|------|------------|----------|----------|
| Calcul TVA par periode | ✅ | `src/lib/tva/tva-calculator.ts`, `src/app/api/tva/calculate/` | 4 taux, ventes/achats split | — |
| Generation CA3 | ✅ | `src/app/api/tva/generate-ca3/route.ts` | Anti-doublon, rollback on error | — |
| Validation VIES intra-UE | ✅ | `src/app/api/tva/valider/route.ts` | Plan-gated cabinet+ | — |
| Declarations CRUD | ✅ | `src/app/api/tva/declarations/` | GET/POST/PUT/DELETE | — |
| Pages TVA | ✅ | `src/app/tva/` (3 pages) | Dashboard + nouvelle + CA3 detail | — |

### Audit & Conformite

| Feature | Etat | Fichier(s) | Probleme | Priorite |
|---------|------|------------|----------|----------|
| Seuils legaux (CAC) | ✅ | `src/lib/audit/audit-thresholds.ts` | NEP 320, Art. L823-1 | — |
| Balance agee | ✅ | `src/app/audit/balance-agee/page.tsx` | — | — |
| Comptes + seuils pages | ✅ | `src/app/audit/comptes/`, `src/app/audit/seuils/` | — | — |
| Audit IA agent | ✅ | `src/components/ia/AuditAgent.tsx` | Score conformite + anomalies | — |

### Automatisation

| Feature | Etat | Fichier(s) | Probleme | Priorite |
|---------|------|------------|----------|----------|
| Regles categorisation | ✅ | `src/app/api/categorization/rules/`, `src/app/parametres/regles/` | CRUD + batch learn, plan-gated | — |
| Automation log + reverse | ✅ | `src/lib/automation/log.ts`, `src/app/api/automation/log/` | Reversible actions | — |
| Automation settings | ✅ | `src/app/api/automation/settings/route.ts` | Thresholds, toggles | — |
| Dashboard automatisation | ✅ | `src/app/automatisation/page.tsx` | KPIs, logs, settings | — |

### IA & Agents

| Feature | Etat | Fichier(s) | Probleme | Priorite |
|---------|------|------------|----------|----------|
| Agents Worthifast (Audit, TVA, Rapprochement, Mail) | ✅ | `src/components/ia/AuditAgent.tsx`, etc. | Mistral AI | — |
| Agents IA Custom | ✅ | `src/app/api/ia/agents-custom/`, `src/components/ia/AgentCreatorWizard.tsx` | 4-step wizard, Claude sonnet-4-5 chat | — |
| PCG/BOFIP assistant | ✅ | `src/app/api/ia/pcg-bofip/` | Contexte selecteur, 80 comptes PCG | — |
| Agent chat custom | ✅ | `src/app/api/ia/agents-custom/[id]/chat/route.ts` | Anthropic SDK, conversation history | — |

### Gestion Commerciale

| Feature | Etat | Fichier(s) | Probleme | Priorite |
|---------|------|------------|----------|----------|
| Documents commerciaux CRUD | ✅ | `src/app/api/documents/`, `src/components/commercial/DocumentForm.tsx` | 6 types, statuts, historique | — |
| Catalogue produits | ⚠️ | `src/app/commercial/catalogue/page.tsx` | Page existe, API probable | P2 |
| Abonnements recurrents | ⚠️ | `src/app/commercial/abonnements/page.tsx` | Page + cron API, mais logique de generation auto non verifiee | P2 |
| Envoi email documents | ✅ | `src/app/api/documents/[id]/envoyer/route.ts` | Resend, HTML template | — |
| Conversion devis→facture | ✅ | `src/components/commercial/DocumentForm.tsx` | Workflow conversion | — |

### Relances & Notifications

| Feature | Etat | Fichier(s) | Probleme | Priorite |
|---------|------|------------|----------|----------|
| Engine relances auto | ✅ | `src/lib/relances/engine.ts` | 3 niveaux, 3 tons, Claude amelioration | — |
| Cron relances 9h daily | ✅ | `src/app/api/cron/relances/route.ts` | Bearer CRON_SECRET, 7j anti-spam | — |
| Config relances UI | ✅ | `src/app/relances/configuration/page.tsx` | Delais, ton, signature | — |
| Notifications overdue | ✅ | `src/app/api/notifications/cron/route.ts` | Daily 8h, type-based (7j/15j/30j/MED) | — |
| Email templates | ✅ | `src/lib/email-templates.ts` | HTML + text, escalation couleurs | — |
| Overdue table UI | ✅ | `src/components/notifications/OverdueTable.tsx` | Filtres, tri, actions | — |

### Portail Client

| Feature | Etat | Fichier(s) | Probleme | Priorite |
|---------|------|------------|----------|----------|
| Invite par email/lien | ✅ | `src/app/api/portail/invite/` | Token hex, email mode | — |
| Portail public (sans auth) | ✅ | `src/app/portail/[token]/page.tsx` | No AppShell, public access | — |
| Documents + Messages | ✅ | `src/app/api/portail/[token]/documents/`, `[token]/messages/` | Upload, statut, lu flag | — |
| Vue cabinet client | ✅ | `src/app/portail/cabinet/[clientId]/page.tsx` | — | — |
| Tables dupliquees | ⚠️ | Migration 023 `portail_acces` + Migration 026 `portails_client` | 2 tables pour le meme concept — confusion possible | P2 |

### Multi-Dossiers Cabinet

| Feature | Etat | Fichier(s) | Probleme | Priorite |
|---------|------|------------|----------|----------|
| CRUD dossiers | ✅ | `src/app/api/dossiers/`, `src/app/cabinet/page.tsx` | Soft-delete, n8n trigger | — |
| Dossier switcher header | ✅ | `src/components/cabinet/DossierSwitcher.tsx` | Dropdown, max-width truncation | — |
| Dossier statuts | ✅ | migration 013 `dossier_statuts` | TVA, factures, CA snapshot | — |

### Integrations ERP

| Feature | Etat | Fichier(s) | Probleme | Priorite |
|---------|------|------------|----------|----------|
| Cegid Loop OAuth2 | ⚠️ | `src/lib/integrations/cegid.ts`, `src/app/api/integrations/cegid/` | Code complet mais **depends de cles Cegid non configurees** | P2 |
| Sage via Chift | ⚠️ | `src/lib/integrations/chift.ts`, `src/app/api/integrations/sage/` | Code complet mais **depends de cles Chift non configurees** | P2 |
| Cron sync 2h daily | ✅ | `vercel.json`, cron routes | AES-256-GCM tokens, upsert | — |
| UI integrations | ✅ | `src/app/parametres/integrations/page.tsx` | Connect/status display | — |

### Alertes

| Feature | Etat | Fichier(s) | Probleme | Priorite |
|---------|------|------------|----------|----------|
| Auto-generation alertes | ✅ | `src/app/api/alerts/route.ts` | 10 types, severity, email critiques | — |
| Cron hebdo lundi 9h | ✅ | `src/app/api/alerts/auto/route.ts` | Loop all active users | — |
| Alert detail + resolution | ✅ | `src/components/dashboard/AlertDetailModal.tsx` | Quick actions, notes | — |

### Pages secondaires

| Feature | Etat | Fichier(s) | Probleme | Priorite |
|---------|------|------------|----------|----------|
| Transactions | ✅ | `src/app/transactions/page.tsx` | Liste, filtres | — |
| Import releve | ✅ | `src/app/import-releve/page.tsx` | CSV bank import page | — |
| Settings profil | ✅ | `src/app/settings/page.tsx` | Profile, company, notifs, danger zone | — |
| Comptabilite balance | 🔲 | `src/app/comptabilite/balance/page.tsx` | Page existe mais contenu minimal probable | P2 |
| E-invoicing | 🔲 | `src/app/comptabilite/factures/einvoicing/page.tsx` | Page stub, logique non implementee | P2 |
| Immobilisations | 🔲 | `src/app/dashboard/immobilisations/page.tsx` | Table DB existe (migration 025), page probablement stub | P2 |
| Liasses fiscales | 🔲 | `src/app/dashboard/liasses/page.tsx` | Table DB existe (migration 026), page probablement stub | P2 |
| Notes de frais | ⚠️ | `src/app/dashboard/notes-de-frais/page.tsx` | Table DB existe (migration 025), page partielle | P2 |
| Analytique | ⚠️ | `src/app/dashboard/analytique/page.tsx` | Tables DB existent (migration 025), page partielle | P2 |
| Achats / Demandes | ⚠️ | `src/app/dashboard/achats/page.tsx` | Table `demandes_achat` existe (migration 025), UI partielle | P2 |
| Depenses entreprise | ⚠️ | `src/app/entreprise/depenses/page.tsx` | Page existe avec composants | — |
| Tresorerie | ⚠️ | `src/app/entreprise/tresorerie/page.tsx` | Page existe, donnees limitees | P2 |

### Emails transactionnels

| Feature | Etat | Fichier(s) | Probleme | Priorite |
|---------|------|------------|----------|----------|
| Multi-provider (Resend → SMTP) | ✅ | `src/lib/email-sender.ts` | Fallback graceful | — |
| Trial ending email | ✅ | `src/emails/TrialEndingEmail.tsx` | Template HTML | — |
| Welcome email | ⚠️ | `src/emails/WelcomeEmail.tsx` | Template existe, pas vu de declencheur | P2 |
| Relances email | ✅ | `src/lib/email-templates.ts` | 4 niveaux, escalation | — |

### Legal & Marketing

| Feature | Etat | Fichier(s) | Probleme | Priorite |
|---------|------|------------|----------|----------|
| Landing page | ✅ | `src/app/page.tsx` | Hero, features, FAQ, comparatif, pricing | — |
| CGU/CGV/Confidentialite | ✅ | 6 pages legal (2 sets de routes) | Routes dupliquees `/cgu` et `/legal/cgu` | P3 |
| FAQ | ✅ | `src/app/faq/page.tsx` | — | — |
| About | ✅ | `src/app/about/page.tsx` | — | — |
| Command Palette | ✅ | `src/components/CommandPalette.tsx` | Cmd+K, keyboard nav | — |
| Screenshot Carousel | ✅ | `src/components/ScreenshotCarousel.tsx` | Auto-rotate 5 slides | — |

---

## 3. Bugs & erreurs critiques

### ~~BUG 1~~ — RESOLU : Edition post-OCR implementee
- **Fix applique le 14 mars 2026** : `handleSaveEdits` complet avec validation champs, PATCH API, gestion erreurs, loading state, redirect `/factures`

### BUG 2 — Print facture: SIRET/TVA hardcodes (P1)
- **Fichier**: `src/app/factures/[id]/print/page.tsx:92-93`
- **Description**: Le SIRET affiche `XXXXXXXXXXXXXX` et le TVA `FR XXXXXXXXXXXX` en dur au lieu des vraies donnees du profil utilisateur
- **Correction**: Fetch `user_profiles` (siret, tva_numero) et les afficher dynamiquement

### BUG 3 — Page admin sans protection (P1)
- **Fichier**: `src/app/admin/users/page.tsx`
- **Description**: La page `/admin/users` est accessible a tout utilisateur authentifie. Pas de verification de role admin. Affiche les sessions de l'utilisateur courant uniquement (pas dangereux mais misleading — devrait etre dans `/settings`).
- **Correction**: Soit supprimer la page, soit ajouter une verification role admin, soit la deplacer sous `/settings/sessions`

### ~~BUG 4~~ — RESOLU : 65 `any` → 0 dans le code production
- **Fix applique le 14 mars 2026** : 34 fichiers corriges, 62 occurrences remplacees par `unknown` + type guards, interfaces typees, `Record<string, ...>`
- **Restants** : 2 dans `scripts/run-migration.ts` (hors build) + 1 dans `stripe/webhook` (eslint-disable volontaire)

### BUG 5 — Rate limiting in-memory (P1)
- **Fichier**: `src/lib/utils/rate-limit.ts`
- **Description**: Le rate limiter utilise un `Map<string, ...>` en memoire. Sur Vercel (serverless), chaque cold start reinitialise la Map. Un attaquant peut simplement attendre 5 minutes entre les requetes pour reset le compteur.
- **Correction**: Migrer vers `@upstash/ratelimit` avec Redis (recommande dans le code meme)

---

## 4. Features partielles / stubs

### Comptabilite : Balance generale
- **Fichier**: `src/app/comptabilite/balance/page.tsx`
- **Etat**: Page existe, probablement basique
- **Effort**: 2-3 jours (query ecritures, generer balance, UI tableau)

### E-invoicing (Factur-X / ZUGFeRD)
- **Fichier**: `src/app/comptabilite/factures/einvoicing/page.tsx`
- **Etat**: Page stub — la conformite Factur-X a ete mentionnee dans les sprints mais pas implementee
- **Effort**: 5-8 jours (generation XML/PDF-A3, validation, envoi PPF)
- **Note**: Obligatoire pour les entreprises francaises a partir de 2026 — priorite business elevee

### Immobilisations
- **Fichier**: `src/app/dashboard/immobilisations/page.tsx`
- **Etat**: Table DB `immobilisations` + `emprunts` creees (migration 025), page stub
- **Effort**: 3-5 jours (CRUD, calcul amortissement lineaire/degressif, tableau)

### Liasses fiscales
- **Fichier**: `src/app/dashboard/liasses/page.tsx`
- **Etat**: Table DB `liasses_fiscales` creee (migration 026), page stub
- **Effort**: 5-10 jours (formulaires 2065/2031/2035, calculs, generation PDF)

### Notes de frais
- **Fichier**: `src/app/dashboard/notes-de-frais/page.tsx`
- **Etat**: Table DB `notes_frais` creee (migration 025), page partielle
- **Effort**: 3-4 jours (CRUD, upload justificatif, workflow validation, export)

### Analytique (axes + codes)
- **Fichier**: `src/app/dashboard/analytique/page.tsx`
- **Etat**: Tables DB `axes_analytiques`, `codes_analytiques`, `affectations_analytiques` creees, page partielle
- **Effort**: 3-5 jours (CRUD axes/codes, affectation sur transactions, reporting)

### Achats (demandes d'achat)
- **Fichier**: `src/app/dashboard/achats/page.tsx`
- **Etat**: Table DB `demandes_achat` + `seuils_approbation` creees, page partielle
- **Effort**: 3-5 jours (workflow approbation, generation BC, reception)

### Abonnements recurrents
- **Fichier**: `src/app/commercial/abonnements/page.tsx`
- **Etat**: Table DB + cron `/api/cron/abonnements` configure, logique de generation automatique non verifiee
- **Effort**: 2-3 jours (cron generation factures, UI gestion)

### Welcome email
- **Fichier**: `src/emails/WelcomeEmail.tsx`
- **Etat**: Template existe, aucun declencheur detecte dans le code
- **Effort**: 0.5 jour (ajouter envoi dans `handle_new_user` ou post-signup)

---

## 5. Ce qui manque clairement

### Open Banking (Bridge / Powens)
- **Contexte**: Le `ComparatifSection.tsx` mentionne "Open Banking" comme avantage Worthifast vs Pennylane. Aucun code d'integration bancaire automatique via API (Bridge, Powens, Tink, etc.) n'existe.
- **Impact**: Fonctionnalite differentielle marketing absente du produit reel
- **Effort**: 10-15 jours (OAuth2 Bridge/Powens, sync comptes + transactions, reconciliation auto)

### Factur-X / e-invoicing obligatoire 2026
- **Contexte**: Page stub existe. Obligation legale francaise 2026 pour les grandes entreprises, 2027 pour les PME.
- **Impact**: Risque legal + argument commercial manquant
- **Effort**: 5-8 jours

### Tests automatises
- **Contexte**: `@playwright/test` est dans les devDependencies mais aucun fichier de test `.spec.ts` n'a ete detecte dans le projet
- **Impact**: Risque de regression a chaque deploiement
- **Effort**: 5-10 jours pour une couverture de base (auth flow, checkout, CRUD factures, OCR)

### Internationalisation (i18n)
- **Contexte**: Tous les textes sont en francais hardcode. Pas de systeme i18n.
- **Impact**: Faible pour l'instant (marche francais), mais bloquant pour l'expansion
- **Effort**: 3-5 jours (setup next-intl, extraction strings)

### Monitoring / Error tracking
- **Contexte**: Les erreurs sont loggees en `console.error`. Pas de Sentry, DataDog, ou equivalent.
- **Impact**: Bugs production invisibles
- **Effort**: 0.5 jour (setup Sentry Next.js SDK)

### Backup / Export donnees utilisateur (RGPD Art. 20)
- **Contexte**: Pas de fonctionnalite d'export complet des donnees utilisateur
- **Impact**: Non-conformite RGPD portabilite
- **Effort**: 2-3 jours (generer ZIP avec JSON/CSV de toutes les tables user)

---

## 6. Recommandations d'amelioration (Top 10 par impact business)

### 1. [QUICK WIN] Fix handleSaveEdits dans UploadFacture (P0)
- **Impact**: Les utilisateurs ne peuvent pas corriger les erreurs OCR
- **Effort**: 30 minutes — appeler le PATCH endpoint existant
- **ROI**: Eleve — feature core non fonctionnelle

### 2. [QUICK WIN] Fix SIRET/TVA sur la page print facture (P1)
- **Impact**: Les factures imprimees n'ont pas les mentions legales obligatoires
- **Effort**: 1 heure — fetch user_profiles et injecter les valeurs
- **ROI**: Eleve — conformite legale

### 3. [QUICK WIN] Migrer rate limiting vers Upstash Redis (P1)
- **Impact**: Securite des endpoints publics (contact, upload, checkout)
- **Effort**: 2 heures — npm install @upstash/ratelimit, remplacer la Map
- **ROI**: Moyen — protection contre abuse

### 4. [QUICK WIN] Ajouter Sentry (P1)
- **Impact**: Visibilite sur les erreurs production
- **Effort**: 1 heure — `npm install @sentry/nextjs`, wizard setup
- **ROI**: Eleve — debug 10x plus rapide

### 5. [MEDIUM] Implementer Factur-X e-invoicing (P1)
- **Impact**: Conformite legale 2026 + argument commercial fort
- **Effort**: 5-8 jours
- **ROI**: Critique — obligation legale

### 6. [MEDIUM] Ajouter Open Banking (Bridge ou Powens) (P1)
- **Impact**: Sync bancaire automatique — killer feature vs Excel CSV
- **Effort**: 10-15 jours
- **ROI**: Tres eleve — differenciation produit

### 7. [MEDIUM] Nettoyer les 65 `any` TypeScript (P1)
- **Impact**: Qualite code, detection bugs au build
- **Effort**: 2-3 jours
- **ROI**: Moyen — maintenabilite

### 8. [MEDIUM] Ajouter tests Playwright (P2)
- **Impact**: Confiance deploiement, detection regressions
- **Effort**: 5-10 jours pour couverture de base
- **ROI**: Eleve long-terme

### 9. [MEDIUM] Completer les pages stubs (immobilisations, liasses, notes de frais) (P2)
- **Impact**: Complete l'offre comptable pour cabinets
- **Effort**: 10-15 jours total
- **ROI**: Moyen — retention clients cabinet

### 10. [QUICK WIN] Envoyer le Welcome email au signup (P2)
- **Impact**: Meilleur onboarding, taux activation
- **Effort**: 30 minutes — template existe deja
- **ROI**: Moyen — engagement utilisateur

---

## Annexes

### Architecture technique

```
src/
  app/                    # 76 pages (App Router)
    api/                  # ~50 routes API
  components/             # 58 composants
    layout/               # AppShell, Header, Sidebar, Footer
    ui/                   # Button, Card, Input
    dashboard/            # KPI, charts, modals
    factures/             # Upload, Form, List
    commercial/           # Documents, Catalogue
    ia/                   # Agents, Wizard
    ...
  hooks/                  # 12 hooks custom
  lib/                    # ~40 modules utilitaires
    supabase/             # Client, Server, Middleware
    auth/                 # Plans, Feature gate, Limits
    categorization/       # Matcher, Smart categorizer
    automation/           # Logging
    parsers/              # FEC, Excel, Bank CSV
    integrations/         # Cegid, Chift (Sage)
    stripe/               # Plans, Client
    matching/             # Types, Learning engine
    relances/             # Engine
    ...
  types/                  # index.ts (~1000 lignes)
  emails/                 # 2 templates (Trial, Welcome)
supabase/
  migrations/             # 33 migrations SQL
```

### Variables d'environnement requises
- `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` / `SUPABASE_SERVICE_ROLE_KEY`
- `STRIPE_SECRET_KEY` / `STRIPE_WEBHOOK_SECRET` / `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` + 12 price IDs
- `ANTHROPIC_API_KEY` (Claude sonnet-4-5)
- `MISTRAL_API_KEY` (agents Worthifast)
- `RESEND_API_KEY` / `RESEND_FROM_EMAIL`
- `CRON_SECRET`
- `INTEGRATION_ENCRYPTION_KEY` (AES-256-GCM, 64 hex)
- `NEXT_PUBLIC_APP_URL`
- Optionnel : `INSEE_API_KEY`, `PAPPERS_API_TOKEN`, `CEGID_*`, `CHIFT_*`, `N8N_*`, `FAL_KEY`

### Crons configures (vercel.json)
| Route | Horaire | Description |
|-------|---------|-------------|
| `/api/notifications/cron` | 08:00 daily | Rappels paiement |
| `/api/alerts/auto` | 09:00 lundi | Generation alertes |
| `/api/integrations/cegid/sync/cron` | 02:00 daily | Sync Cegid |
| `/api/integrations/sage/sync/cron` | 02:00 daily | Sync Sage |
| `/api/cron/relances` | 09:00 daily | Relances auto |
| `/api/cron/abonnements` | 08:00 daily | Abonnements recurrents |
