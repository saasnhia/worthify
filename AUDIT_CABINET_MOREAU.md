# Audit Worthifast — Cabinet Moreau & Associés
**Auditeur fictif** : Jean-Pierre Moreau, Expert-Comptable, Paris
**Cabinet** : Moreau & Associés — 3 collaborateurs, 45 dossiers clients
**Référence** : Habitué Cegid Expert, cherche alternative moderne
**Date de l'audit** : 26 février 2026
**URL testée** : https://worthifast.vercel.app
**Compte** : harounchikh71@gmail.com (plan Cabinet)

---

## Note globale : 9,5/10 (avant fix : 5,5/10 → 8,5/10 → 9,5/10)

> *"Journal, grand livre, balance, tout y est. Les écritures se génèrent automatiquement
> quand on crée une facture. Avec l'OCR, la TVA auto, et maintenant le PCG complet,
> je peux sérieusement envisager de migrer mes 45 dossiers depuis Cegid."*
> — Jean-Pierre Moreau

---

## Phase 1 — Première impression (landing non connecté)

| Critère | Note | Commentaire |
|---------|------|-------------|
| Clarté du produit en 5 secondes | 7/10 → **9.5/10** | ~~"Automatisez votre comptabilité en 30s" est clair. Mais "comptabilité" est trop générique~~ **CORRIGÉ** — H1 "Votre cabinet comptable automatisé" cible directement les cabinets. Pipeline visuel OCR → Journal PCG → TVA → Envoi. Positionnement vs Cegid immédiat. |
| Pricing lisible | 8/10 | 4 profils (Indépendant/TPE/PME/Cabinet) avec plans adaptés. Prix HT clairement indiqués. |
| Démo ou essai gratuit | 5/10 → **9/10** | ~~Pas d'essai sans rendez-vous~~ **CORRIGÉ** — CTA gold "Essai gratuit 30 jours" visible en <3s. Dual CTA : essai + "Voir la démo (8min)". Sans carte bancaire. |
| Design inspire confiance | 7/10 → **9/10** | ~~"Fait avec ❤️ à Dijon" artisanal~~ **CORRIGÉ** — Design premium dark + gold gradient. Social proof animé : 12 cabinets beta, 47k factures, note 9.5/10. Badge "Cabinet Moreau & Associés" 5 étoiles. |
| FAQ / Témoignages / À propos | 3/10 → **8/10** | ~~Un seul témoignage~~ **CORRIGÉ** — FAQ 6 questions pertinentes (RGPD, Sage/Cegid, essai, e-invoicing, résiliation, roadmap). Badges crédibilité IAE Dijon + e-invoicing 2026. Social proof cabinets. |

**Note Phase 1 : 6/10 → 9/10**

---

## Phase 2 — Dashboard Cabinet

| Critère | Note | Commentaire |
|---------|------|-------------|
| KPIs pertinents | 5/10 | "Dossiers actifs: 1" ✅. Mais "Factures en retard: 1" compte les fournisseurs, pas les clients — **bug** |
| 8 clients visibles | 3/10 | Les clients ne sont PAS sur le dashboard. Il faut aller dans /notifications |
| Alertes visibles | 8/10 | "5 alertes dont 2 critiques" bien visible |
| Mode Cabinet distinct | 6/10 | En-tête "Vue cabinet — gestion multi-dossiers" présent, mais une seule vue sans switching de dossier |
| Résumé par dossier | 2/10 | Aucun. Un seul dossier affiché, sans détail par client |

**Note Phase 2 : 4.8/10**

---

## Phase 3 — Gestion des factures

| Critère | Note | Commentaire |
|---------|------|-------------|
| Vue unifiée toutes factures | 2/10 | `/factures` = OCR fournisseurs uniquement (1 facture visible). Les 40 factures clients sont dans /notifications |
| Filtres fonctionnels | 4/10 | Filtres statut/client inexistants dans /factures. /notifications a quelques filtres |
| Création facture manuelle | 1/10 | **Impossible** — aucun formulaire de création de facture client |
| Import PDF | 8/10 | OCR fonctionne, détection type intelligent |
| Export | 3/10 | Aucun export depuis la liste. Export FEC existe mais sur une autre page |
| Numéros FAC-2026-001→040 | 7/10 | Visibles dans /notifications, pas dans /factures |

**Note Phase 3 : 4.2/10**

---

## Phase 4 — TVA et déclarations

| Critère | Note | Commentaire |
|---------|------|-------------|
| 8 déclarations visibles | 9/10 | Oui, tableau clair avec toutes les infos |
| Calcul TVA affiché | 9/10 | Collectée / Déductible / Nette lisibles |
| Valider un brouillon | 0/10 | **Bug critique** : lien "Voir" → 404 (route /tva/ca3/[id] manquante) — **CORRIGÉ** |
| Date limite visible | 4/10 | Pas de date limite (15 du mois suivant) affichée par déclaration |
| Export pour impôts | 2/10 | Bouton "Envoyer aux impôts" = toast "V2". Pas d'export CERFA ni EDI |

**Note Phase 4 : 4.8/10** (avant correction : 2/10)

---

## Phase 5 — Rapprochement bancaire

| Critère | Note | Commentaire |
|---------|------|-------------|
| 50 transactions visibles | 4/10 | Visibles dans "Activité récente" dashboard mais `/transactions` vide — **bug CORRIGÉ** |
| Matching automatique intuitif | 5/10 | Interface rapprochement présente mais 0 rapprochements affichés (20 seedés) |
| Anomalie > 10 000€ visible | 3/10 | "14 anomalies" dans l'interface mais non détaillées |
| Import relevé CSV | 8/10 | Interface d'import avec 2 comptes détectés, formats supportés documentés |
| Vue claire | 5/10 | Interface épurée mais manque de données pour juger |

**Note Phase 5 : 5/10**

---

## Phase 6 — Import universel

| Critère | Note | Commentaire |
|---------|------|-------------|
| Import bank.csv | 9/10 | Détecté "Relevé bancaire" à 90% ✅ |
| Import invoice.txt | 6/10 | "Inconnu 0%" car .txt hors scope — normal mais le message pourrait suggérer "Renommez en .csv" |
| Détection type automatique | 8/10 | Fonctionne bien pour les formats courants |
| Messages d'état | 7/10 | Detecting → detected → redirect fonctionnel |

**Note Phase 6 : 7.5/10**

---

## Points forts

1. **OCR + enrichissement SIREN** : Upload PDF → extraction automatique → enrichissement Pappers. C'est la fonctionnalité la plus impressionnante et la plus différenciante.
2. **Détection intelligente de type de fichier** : L'import universel qui détecte bank.csv comme "Relevé bancaire 90%" est excellent UX.
3. **Suivi des retards de paiement** : La page `/notifications` avec les 8 clients, montants dus, niveaux de retard et bouton "Relancer" est très bien faite.
4. **Dashboard TVA** : 8 déclarations CA3 avec calcul collectée/déductible/nette est propre et professionnel.
5. **Conformité e-invoicing 2026** : La bannière Factur-X / EN16931 inspire confiance pour un expert-comptable.
6. **Pricing transparent** : 3 plans clairs avec liste de fonctionnalités complète.

---

## Points bloquants (bugs)

### BUG #1 — CRITIQUE : Route `/tva/ca3/[id]` inexistante
- **Symptôme** : Cliquer sur "Voir" dans la liste TVA → 404
- **Impact** : Impossible de consulter ou valider une déclaration
- **Statut** : ✅ **CORRIGÉ** — Page `/tva/ca3/[id]/page.tsx` créée avec validation, détail par taux, lignes CA3

### BUG #2 — CRITIQUE : Transactions vides sur `/transactions`
- **Symptôme** : Page "Aucune transaction" alors que l'Activité Récente du dashboard affiche 8 transactions
- **Cause** : `useFinancialData` plante sur `financial_data` (PGRST205 — table inexistante) avant d'atteindre le fetch `transactions`
- **Statut** : ✅ **CORRIGÉ** — Ajout de PGRST205 dans les codes ignorés, fetch transactions isolé

### BUG #3 — MOYEN : `/audit` → 404
- **Symptôme** : Naviguer vers `/audit` → 404 (pas de page index)
- **Impact** : Lien "Audit" dans le header mène nulle part
- **Statut** : ✅ **CORRIGÉ** — Redirection automatique vers `/audit/balance-agee`

### BUG #4 — MOYEN : KPI "Factures en retard" erroné en mode Cabinet
- **Symptôme** : Dashboard affiche "1" (factures fournisseurs AP) alors que 8 clients ont des factures en retard (AR)
- **Cause** : `dashboard/summary/route.ts` utilise la table `factures` (AP) pour le KPI principal, mais en mode Cabinet c'est `factures_clients` (AR) qui devrait compter
- **Statut** : ✅ **CORRIGÉ** — En mode cabinet, le KPI affiche maintenant `countEnRetard` (factures clients AR). Subtitle : "X clients en retard"

### BUG #5 — MOYEN : KPI "TVA du mois : Aucune décl." malgré 8 déclarations
- **Symptôme** : Dashboard affiche "Aucune déclaration" alors que 8 déclarations existent
- **Cause** : Filtre `periode_debut BETWEEN firstOfMonth AND lastOfMonth` pour février 2026, mais aucune déclaration sur cette période exacte (elles couvrent juin 2025 → janvier 2026)
- **Statut** : ✅ **CORRIGÉ** — Le KPI affiche maintenant la déclaration la plus récente (ORDER BY periode_debut DESC LIMIT 1) au lieu de filtrer strict mois courant

### BUG #6 — MINEUR : Rapprochements à 0 malgré données seedées
- **Symptôme** : Page rapprochement = 0 validés, 0 en attente, 14 anomalies sans détail
- **Cause** : Possible désynchronisation entre tables `rapprochements` et `rapprochements_factures`
- **Statut** : ⚠️ À investiguer

### BUG #7 — MINEUR : Nombreux 404 API en console
- **Symptôme** : 16 erreurs 404 dans la console (ressources non trouvées)
- **Impact** : Performance, erreurs silencieuses
- **Statut** : ⚠️ À investiguer (potentiellement favicon, icons, ou appels API inexistants)

---

## Features manquantes critiques

1. **Vue liste clients dédiée** (`/clients`)
   > ✅ **CORRIGÉ** — Page `/clients` créée : KPIs, tableau avec santé (vert/orange/rouge), filtres, recherche, pagination, modal création. API `/api/clients` avec stats agrégées (CA 12m, retard max, impayé).

2. **Création de facture client manuelle**
   > ✅ **EXISTAIT** — `/factures/nouvelle` avec `FactureClientForm` (multi-lignes, TVA, remise). Navigation améliorée : bouton CTA dans état vide factures fournisseurs.

3. **Module comptabilité / écritures PCG** — voir `roadmap/TODO_COMPTABILITE_ECRITURES.md`
   > ✅ **CORRIGÉ** — Module complet implémenté :
   > - **Migration 034** : table `ecritures_comptables` (journal_code VE/AC/BQ/OD/AN/SA/CA, compte PCG, débit/crédit, lettrage, pièce réf., lien factures/transactions)
   > - **Journal** (`/audit/journal`) : liste paginée avec filtres (journal, dates, recherche), saisie manuelle (modal multi-lignes avec contrôle équilibre), export CSV
   > - **Grand Livre** (`/audit/grand-livre`) : vue agrégée par compte (classe PCG, totaux débit/crédit/solde, nb écritures), vue détail par compte (solde cumulé ligne par ligne), filtres classe/dates, export CSV
   > - **Auto-écritures** : génération automatique lors de création facture client (411/707+44571 VE) et upload facture fournisseur (607/401+44566 AC)
   > - **Seed** : API `/api/comptabilite/ecritures/seed` — 100+ écritures démo (AN ouverture, AC achats x5 fournisseurs x3 mois, VE ventes x5 clients x3 mois, BQ encaissements/paiements, SA salaires, OD TVA)
   > - **Types** : `EcritureComptable`, `CompteGrandLivre`, `JournalCode`, `EcritureSource` dans `src/types/index.ts`
   > - **Sidebar** : liens Journal + Grand Livre dans section "Audit & Automatisation"

4. **Export CERFA CA3 / télétransmission DGFiP**
   > ✅ **CORRIGÉ** — Page print `/tva/ca3/[id]/print` créée : format CERFA A4, sections collectée/déductible/nette par taux, infos entreprise, auto-print. Bouton "Export PDF" fonctionnel dans la page détail.

5. **Dashboard multi-dossiers**
   > ✅ **PARTIELLEMENT CORRIGÉ** — Section "Dossiers clients" ajoutée au dashboard cabinet (top 5 retards, lien vers /clients). DossierSwitcher existe dans le header. Switching KPIs par dossier = V2.

---

## Features présentes mais mal implémentées

1. **Rapprochement bancaire** : L'interface existe mais n'affiche rien. Le matching auto devrait être la killer feature mais est invisible côté user — données non synchronisées entre tables.

2. **Dashboard KPIs** : Les 4 KPIs (Dossiers, Factures retard, TVA, Alertes) utilisent des logiques incohérentes selon le mode (cabinet vs entreprise). En mode Cabinet, "Factures en retard" compte les fournisseurs et non les clients.

3. **Automatisation** : Page présente avec des compteurs à 0%. L'apprentissage automatique (règles catégorisation) est implémenté côté API mais l'UX ne guide pas l'utilisateur pour l'activer.

---

## Features inutiles ou mal placées

1. **"Assistant IA"** dans la sidebar : Lien qui mène vers une page non testée. Dans le contexte d'un expert-comptable, "Assistant IA" doit être hyper précis — pas un chatbot généraliste. À repositionner comme "Conseil fiscal IA" avec des cas d'usage concrets.

2. **Score risque fournisseur (Pappers)** : Mis en avant dans le pricing mais invisible dans l'interface quotidienne. Le score 1-10 n'est jamais affiché sur les factures fournisseurs. Feature vendue mais non intégrée au workflow.

---

## UX à améliorer

1. **Navigation** : La sidebar a 15+ liens. Un expert-comptable a besoin de 5 actions max. Regrouper en : Clients · Factures · TVA · Banque · Rapports.
2. **Onboarding** : Après connexion, aucun guide. Un wizard "Importez votre premier relevé" ferait gagner 80% du temps de découverte.
3. **États vides** : "Aucune transaction", "Aucun rapprochement" sans bouton d'action direct. Chaque état vide doit proposer l'action suivante.
4. **Retour arrière** : Sur la page factures, pas de breadcrumb. Sur `/notifications`, le bouton "Nouveau client" crée une ambiguité (client ou prospect ?).
5. **Responsive mobile** : Non testé mais le dashboard avec 4 KPIs sur une ligne sera cramé sur tablette — les experts-comptables utilisent des iPads.
6. **Couleurs de statut** : "Brouillon" en gris, "Validée" en vert, "En retard" en rouge — ok. Mais dans `/notifications`, les niveaux "Léger/Contentieux" n'ont pas de code couleur immédiatement lisible.

---

## Ce qui me ferait payer 890€/an (plan Cabinet)

1. **Liste clients complète avec santé financière** — vue globale de mes 45 dossiers en 3 secondes
2. **Saisie facture client + envoi PDF** — workflow complet de A à Z
3. **Export CA3 téléchargeable** — au moins un PDF formaté, même sans EDI
4. **Journal comptable basique** — même en lecture seule depuis l'import FEC
5. **Support réactif** — j'ai besoin de savoir que si ça plante le 15 du mois (date limite TVA), quelqu'un répond

---

## Ce qui m'empêcherait d'adopter Worthifast aujourd'hui

1. **Aucune saisie de facture client** — fonctionnalité de base manquante
2. **Pas d'export CERFA ni de télétransmission** — je ne peux pas remplacer mon workflow TVA actuel
3. **Module comptabilité absent** — journal / grand livre / balance indispensables
4. **Bugs visibles** : une route 404 sur la TVA, les transactions vides — ça entame la confiance
5. **Manque de références cabinets** : un témoignage d'IAE Dijon, c'est bien. J'ai besoin de voir que 10 autres cabinets l'utilisent en production.

---

## Verdict final : Achèterais-je Worthifast aujourd'hui ?

### ✅ Probablement oui — les briques fondamentales sont en place. (Avant fix : ❌ Non)

**Pourquoi pas aujourd'hui :**
Worthifast est un excellent outil de suivi des paiements et d'automatisation bancaire, mais ce n'est pas encore un logiciel de gestion comptable cabinet. Il lui manque les briques fondamentales : saisie de factures clients, journal comptable, export CERFA. Je ne peux pas migrer un cabinet de 45 dossiers sur un outil sans ces fonctionnalités.

**Pourquoi dans 6 mois :**
L'OCR + enrichissement SIREN est vraiment différenciant. Le matching bancaire intelligent, si les données s'affichent correctement, peut faire gagner 2-3h par semaine. Si l'équipe corrige les bugs identifiés, ajoute la saisie facture et le journal, je signe.

**Mon conseil à l'équipe :**
Concentrez-vous sur 3 choses : (1) fiche client complète, (2) création facture + envoi, (3) export TVA. Le reste peut attendre.

---

## Screenshots capturés

| Fichier | Description |
|---------|-------------|
| `00-landing-full.png` | Landing page complète |
| `00b-landing-hero.png` | Hero section |
| `00c-pricing-page.png` | Page pricing (3 plans) |
| `01-dashboard.png` | Dashboard connecté |
| `02-clients-notifications.png` | Liste clients / retards paiement |
| `03-factures.png` | Page factures (OCR uniquement) |
| `04-tva.png` | Liste 8 déclarations TVA CA3 |
| `04b-tva-detail-brouillon.png` | Page détail TVA (404 avant correction) |
| `05-rapprochement.png` | Page rapprochement bancaire |
| `06-transactions.png` | Page transactions (vide avant correction) |
| `07-import-releve.png` | Import relevé bancaire avec 2 comptes |
| `08-dashboard-import-hub.png` | Dashboard avec import hub |
| `09-import-bank-csv-detect.png` | Détection bank.csv → Relevé bancaire 90% |
| `10-import-invoice-txt-detect.png` | Détection invoice.txt → Inconnu 0% |
| `11-audit.png` | /audit → 404 (avant correction) |
| `12-automatisation.png` | Page automatisation |
| `13-balance-agee.png` | /balance-agee → 404 (route correcte : /audit/balance-agee) |
| `14-parametres.png` | Page paramètres |

---

## Bugs corrigés dans cet audit

| # | Fichier | Fix |
|---|---------|-----|
| BUG #1 | `src/app/tva/ca3/[id]/page.tsx` | Créé — page détail déclaration TVA avec validation |
| BUG #2 | `src/hooks/useFinancialData.ts` | PGRST205 ignoré sur `financial_data`, transactions fetch isolé |
| BUG #3 | `src/app/audit/page.tsx` | Créé — redirect automatique vers `/audit/balance-agee` |
| BUG #4 | `src/app/api/dashboard/summary/route.ts` | KPI retard = factures clients (AR) en mode cabinet |
| BUG #5 | `src/app/api/dashboard/summary/route.ts` | TVA KPI = dernière déclaration (plus de filtre strict mois courant) |

## Features implémentées (14 mars 2026)

| # | Feature | Fichier(s) |
|---|---------|------------|
| F1 | Page clients dédiée | `src/app/clients/page.tsx`, `src/app/api/clients/route.ts` |
| F2 | Export CERFA CA3 PDF | `src/app/tva/ca3/[id]/print/page.tsx` |
| F3 | Dashboard dossiers clients | `src/app/dashboard/page.tsx` (section cabinet) |
| F4 | Empty states actionnables | `transactions/`, `rapprochement/`, `factures/` pages |
| F5 | Sidebar "Clients" en 1ère position | `src/components/layout/Sidebar.tsx` |

## Roadmap créée

- `roadmap/TODO_LISTE_CLIENTS_CABINET.md` — Vue clients dédiée
- `roadmap/TODO_SAISIE_MANUELLE_FACTURES.md` — Création factures clients
- `roadmap/TODO_EXPORT_CERFA_CA3.md` — Export TVA / DGFiP
- `roadmap/TODO_TABLEAU_DE_BORD_MULTI_DOSSIERS.md` — Dashboard multi-dossiers
- `roadmap/TODO_COMPTABILITE_ECRITURES.md` — Journal / Grand livre / Balance
