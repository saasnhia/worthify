# TODO Worthifast — Taches priorisees

> Genere le 14 mars 2026 suite a l'audit complet du projet.

---

## P0 — Critique (a faire immediatement)

- [ ] **Fix handleSaveEdits UploadFacture** — `src/components/factures/UploadFacture.tsx:87-97`
  - Le bouton "Enregistrer" apres correction OCR ne fait rien (TODO dans le code)
  - Implementer `fetch('/api/factures/${id}', { method: 'PATCH', body: editedFields })`
  - Endpoint PATCH existe deja dans `src/app/api/factures/[id]/route.ts`
  - Effort : 30 min

---

## P1 — Important (cette semaine)

- [ ] **Fix SIRET/TVA hardcodes sur page print** — `src/app/factures/[id]/print/page.tsx:92-93`
  - Remplacer `XXXXXXXXXXXXXX` par les vraies valeurs de `user_profiles.siret` et `user_profiles.tva_numero`
  - Fetch le profil utilisateur cote serveur ou client
  - Effort : 1h

- [ ] **Securiser page admin** — `src/app/admin/users/page.tsx`
  - Option A : Deplacer sous `/settings/sessions` (c'est juste un viewer de sessions du user courant)
  - Option B : Ajouter une verification role admin
  - Option C : Supprimer si redondant avec `/settings`
  - Effort : 30 min

- [ ] **Migrer rate limiting vers Upstash Redis** — `src/lib/utils/rate-limit.ts`
  - `npm install @upstash/ratelimit @upstash/redis`
  - Creer un Redis Upstash (free tier = 10K req/jour)
  - Remplacer le `Map<string, ...>` in-memory par Upstash
  - Effort : 2h

- [ ] **Ajouter Sentry** (error tracking)
  - `npx @sentry/wizard@latest -i nextjs`
  - Configurer DSN dans `.env.local`
  - Effort : 1h

- [ ] **Nettoyer les `any` TypeScript** — 65 occurrences dans 36 fichiers
  - Priorite : les fichiers API routes (`banques/[id]`, `alerts`, `tva/*`)
  - Remplacer `catch (error: any)` par `catch (error: unknown)` + type guard
  - Remplacer `const updates: any = {}` par un type strict
  - Remplacer `importedData?: any` par `importedData?: FinancialData`
  - Effort : 2-3 jours

- [ ] **Envoyer le Welcome email au signup**
  - Template existe : `src/emails/WelcomeEmail.tsx`
  - Ajouter l'envoi dans le signup flow (post-creation Supabase ou dans l'API onboarding/complete)
  - Effort : 30 min

---

## P2 — Ameliorations (prochaines 2 semaines)

### Features a completer

- [ ] **Implementer Factur-X e-invoicing** — `src/app/comptabilite/factures/einvoicing/page.tsx`
  - Obligation legale France 2026
  - Generation PDF/A-3 + XML Factur-X
  - Integration avec les factures clients existantes
  - Effort : 5-8 jours

- [ ] **Completer page Immobilisations** — `src/app/dashboard/immobilisations/page.tsx`
  - Table DB existe (migration 025)
  - CRUD + calcul amortissement lineaire/degressif
  - Effort : 3-5 jours

- [ ] **Completer page Liasses fiscales** — `src/app/dashboard/liasses/page.tsx`
  - Table DB existe (migration 026)
  - Formulaires 2065/2031/2035
  - Effort : 5-10 jours

- [ ] **Completer page Notes de frais** — `src/app/dashboard/notes-de-frais/page.tsx`
  - Table DB existe (migration 025)
  - CRUD + upload justificatif + workflow validation
  - Effort : 3-4 jours

- [ ] **Completer page Analytique** — `src/app/dashboard/analytique/page.tsx`
  - Tables DB existent (migration 025)
  - CRUD axes/codes + affectation transactions + reporting
  - Effort : 3-5 jours

- [ ] **Completer page Achats** — `src/app/dashboard/achats/page.tsx`
  - Tables DB existent (migration 025)
  - Workflow approbation + generation BC
  - Effort : 3-5 jours

- [ ] **Brancher sparklines vraies donnees** — `src/app/dashboard/page.tsx:205`
  - Remplacer donnees hardcodees par query transactions 7 derniers jours
  - Effort : 2h

- [ ] **Verifier cron abonnements** — `/api/cron/abonnements`
  - Configure dans `vercel.json` mais route API non verifiee
  - S'assurer que la generation automatique de factures recurrentes fonctionne
  - Effort : 1 jour

### Nettoyage technique

- [ ] **Dedupliquer tables portail** — Migration 023 `portail_acces` vs Migration 026 `portails_client`
  - Determiner laquelle est utilisee
  - Supprimer ou migrer les donnees de l'autre
  - Effort : 1h

- [ ] **Dedupliquer routes legales** — `/cgu` et `/legal/cgu` (idem CGV, confidentialite)
  - Garder un seul set de routes, rediriger l'autre
  - Effort : 30 min

- [ ] **Ajouter tests Playwright**
  - Auth flow (signup → onboarding → pricing → checkout → dashboard)
  - CRUD factures (upload OCR, saisie manuelle, edit, delete)
  - Rapprochement (import CSV → match → validate)
  - Effort : 5-10 jours

### Integration

- [ ] **Open Banking (Bridge ou Powens)**
  - Sync bancaire automatique via API
  - Remplacerait l'import CSV manuel
  - Effort : 10-15 jours

---

## P3 — Nice to have (backlog)

- [ ] **Export RGPD donnees utilisateur** (Art. 20 portabilite)
  - Generer ZIP avec JSON/CSV de toutes les tables user
  - Effort : 2-3 jours

- [ ] **i18n** (internationalisation)
  - Setup `next-intl`, extraction strings francais
  - Effort : 3-5 jours (setup) + ongoing

- [ ] **Dark mode complet**
  - La palette brand.black est deja dark, mais pas de toggle user
  - Effort : 2-3 jours

- [ ] **PWA / Mode offline**
  - Service worker pour consultation hors-ligne
  - Effort : 3-5 jours

- [ ] **API publique documentee**
  - Feature `api_dedicee` existe dans le plan Premium mais pas d'API RESTful documentee
  - Effort : 5-10 jours (endpoints + auth API key + docs OpenAPI)

- [ ] **Migration Tesseract → API OCR cloud**
  - Tesseract.js a un timeout 30s et qualite variable
  - Considerer Google Vision API, Azure Document Intelligence, ou Mindee
  - Effort : 2-3 jours

---

## Resume

| Priorite | Nb taches | Effort total estime |
|----------|-----------|---------------------|
| P0 | 1 | 30 min |
| P1 | 6 | ~4 jours |
| P2 | 12 | ~30-45 jours |
| P3 | 6 | ~20-30 jours |
| **TOTAL** | **25** | **~55-80 jours** |
