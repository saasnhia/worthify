'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { DeclarationTVA, LigneCA3 } from '@/types'

// ─── Company profile shape (from user_profiles) ─────────────────────────────

interface CompanyInfo {
  raison_sociale: string
  siret: string
  tva_numero: string
  adresse_siege: string
  regime_tva: string
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatEuro(n: number | null | undefined): string {
  if (n == null) return '0,00 \u20ac'
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
  }).format(n)
}

function formatPeriode(iso: string): string {
  return new Date(iso).toLocaleDateString('fr-FR', {
    month: 'long',
    year: 'numeric',
  })
}

function regimeLabel(regime: string): string {
  switch (regime) {
    case 'reel_normal':
      return 'R\u00e9el normal'
    case 'reel_simplifie':
      return 'R\u00e9el simplifi\u00e9'
    case 'franchise':
      return 'Franchise en base de TVA'
    default:
      return regime
  }
}

// ─── TVA rate rows ───────────────────────────────────────────────────────────

interface TauxRow {
  label: string
  rate: number
  ventesHT: number
  tvaCollectee: number
  achatsHT: number
  tvaDeductible: number
}

function buildTauxRows(d: DeclarationTVA): TauxRow[] {
  const rates: { label: string; rate: number; ventesHT: number; achatsHT: number }[] = [
    { label: '20 %', rate: 0.20, ventesHT: d.ventes_tva_20, achatsHT: d.achats_tva_20 },
    { label: '10 %', rate: 0.10, ventesHT: d.ventes_tva_10, achatsHT: d.achats_tva_10 },
    { label: '5,5 %', rate: 0.055, ventesHT: d.ventes_tva_55, achatsHT: d.achats_tva_55 },
    { label: '2,1 %', rate: 0.021, ventesHT: d.ventes_tva_21, achatsHT: d.achats_tva_21 },
  ]
  return rates.map((r) => ({
    label: r.label,
    rate: r.rate,
    ventesHT: r.ventesHT || 0,
    tvaCollectee: (r.ventesHT || 0) * r.rate,
    achatsHT: r.achatsHT || 0,
    tvaDeductible: (r.achatsHT || 0) * r.rate,
  }))
}

// ─── Page component ──────────────────────────────────────────────────────────

export default function PrintCA3Page() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()

  const [declaration, setDeclaration] = useState<DeclarationTVA | null>(null)
  const [lignes, setLignes] = useState<LigneCA3[]>([])
  const [company, setCompany] = useState<CompanyInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // ── Fetch declaration + company info ──────────────────────────────────────

  useEffect(() => {
    if (!id) return

    const fetchData = async () => {
      try {
        // Fetch declaration via API
        const declRes = await fetch(`/api/tva/declarations/${id}`)
        const declData = (await declRes.json()) as {
          success: boolean
          declaration?: DeclarationTVA
          lignes?: LigneCA3[]
          error?: string
        }

        if (declData.success && declData.declaration) {
          setDeclaration(declData.declaration)
          setLignes(declData.lignes || [])
        } else {
          setError(declData.error ?? 'D\u00e9claration introuvable')
          return
        }

        // Fetch company info from user_profiles via Supabase client
        const supabase = createClient()
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (user) {
          const { data: profile } = await supabase
            .from('user_profiles')
            .select('raison_sociale, siret, tva_numero, adresse_siege, regime_tva')
            .eq('id', user.id)
            .single()

          if (profile) {
            setCompany({
              raison_sociale: (profile.raison_sociale as string) || '',
              siret: (profile.siret as string) || '',
              tva_numero: (profile.tva_numero as string) || '',
              adresse_siege: (profile.adresse_siege as string) || '',
              regime_tva: (profile.regime_tva as string) || '',
            })
          }
        }
      } catch {
        setError('Erreur r\u00e9seau')
      } finally {
        setLoading(false)
      }
    }

    void fetchData()
  }, [id])

  // ── Auto-print on load ────────────────────────────────────────────────────

  useEffect(() => {
    if (declaration) {
      const t = setTimeout(() => window.print(), 600)
      return () => clearTimeout(t)
    }
  }, [declaration])

  // ── Loading / error states ────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800" />
      </div>
    )
  }

  if (error || !declaration) {
    return <div className="p-8 text-red-600">{error ?? 'D\u00e9claration introuvable'}</div>
  }

  // ── Derived data ──────────────────────────────────────────────────────────

  const rows = buildTauxRows(declaration)
  const totalCollectee = declaration.tva_collectee
  const totalDeductible = declaration.tva_deductible
  const tvaNette = declaration.tva_nette
  const isCredit = tvaNette < 0

  const totalVentesHT = rows.reduce((s, r) => s + r.ventesHT, 0)
  const totalAchatsHT = rows.reduce((s, r) => s + r.achatsHT, 0)

  const periode = formatPeriode(declaration.periode_debut)
  const hasCompanyInfo =
    company && (company.raison_sociale || company.siret || company.tva_numero)

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <>
      <style>{`
        @media print {
          @page { size: A4; margin: 20mm; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .no-print { display: none !important; }
        }
        body { font-family: Arial, Helvetica, sans-serif; font-size: 12px; color: #1e293b; background: white; }
      `}</style>

      {/* ── Toolbar (hidden in print) ─────────────────────────────────── */}
      <div className="no-print fixed top-4 right-4 flex gap-2 z-50">
        <button
          onClick={() => window.print()}
          className="px-4 py-2 bg-gray-800 text-white rounded-lg text-sm font-medium hover:bg-gray-700"
        >
          Imprimer / Exporter PDF
        </button>
        <button
          onClick={() => router.push(`/tva/ca3/${id}`)}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50"
        >
          Retour
        </button>
      </div>

      <div className="max-w-[210mm] mx-auto bg-white p-10 min-h-screen">
        {/* ═══════════ HEADER ═══════════ */}
        <div className="text-center mb-8 border-b-2 border-gray-800 pb-4">
          <h1 className="text-2xl font-bold text-gray-900 tracking-wide">
            D\u00c9CLARATION DE TVA &mdash; CA3
          </h1>
          <p className="text-lg text-gray-700 mt-1 capitalize">{periode}</p>
        </div>

        {/* ═══════════ COMPANY INFO ═══════════ */}
        <div className="mb-6 border border-gray-300 rounded p-4">
          <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
            Identification de l&apos;entreprise
          </h2>
          {hasCompanyInfo ? (
            <div className="grid grid-cols-2 gap-x-8 gap-y-1 text-sm">
              {company.raison_sociale && (
                <div>
                  <span className="text-gray-500">Raison sociale :</span>{' '}
                  <strong>{company.raison_sociale}</strong>
                </div>
              )}
              {company.siret && (
                <div>
                  <span className="text-gray-500">SIRET :</span>{' '}
                  <strong className="font-mono">{company.siret}</strong>
                </div>
              )}
              {company.tva_numero && (
                <div>
                  <span className="text-gray-500">N&deg; TVA :</span>{' '}
                  <strong className="font-mono">{company.tva_numero}</strong>
                </div>
              )}
              {company.adresse_siege && (
                <div className="col-span-2">
                  <span className="text-gray-500">Adresse :</span>{' '}
                  <span>{company.adresse_siege}</span>
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-amber-600 italic">
              \u00c0 compl\u00e9ter dans Param\u00e8tres &gt; Entreprise
            </p>
          )}
        </div>

        {/* ═══════════ REGIME ═══════════ */}
        <div className="mb-6 text-sm">
          <span className="text-gray-500">R\u00e9gime d&apos;imposition :</span>{' '}
          <strong>{regimeLabel(company?.regime_tva || declaration.regime)}</strong>
          <span className="text-gray-400 ml-4">
            P\u00e9riode : {new Date(declaration.periode_debut).toLocaleDateString('fr-FR')}
            {' '}&ndash;{' '}
            {new Date(declaration.periode_fin).toLocaleDateString('fr-FR')}
          </span>
        </div>

        {/* ═══════════ SECTION A — TVA COLLECT\u00c9E ═══════════ */}
        <div className="mb-6">
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-2 bg-gray-100 px-3 py-1.5 border-l-4 border-gray-800">
            Section A &mdash; TVA collect\u00e9e (Ventes)
          </h2>
          <table className="w-full text-sm" style={{ borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc' }}>
                <th className="text-left py-2 px-3 border border-gray-300 font-semibold text-gray-600">
                  Taux
                </th>
                <th className="text-right py-2 px-3 border border-gray-300 font-semibold text-gray-600">
                  Base HT
                </th>
                <th className="text-right py-2 px-3 border border-gray-300 font-semibold text-gray-600">
                  TVA
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.label}>
                  <td className="py-1.5 px-3 border border-gray-300 text-gray-800">{r.label}</td>
                  <td className="py-1.5 px-3 border border-gray-300 text-right font-mono text-gray-800">
                    {formatEuro(r.ventesHT)}
                  </td>
                  <td className="py-1.5 px-3 border border-gray-300 text-right font-mono text-gray-800">
                    {formatEuro(r.tvaCollectee)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr style={{ backgroundColor: '#f1f5f9' }}>
                <td className="py-2 px-3 border border-gray-300 font-bold text-gray-900">
                  Total collect\u00e9e
                </td>
                <td className="py-2 px-3 border border-gray-300 text-right font-mono font-bold text-gray-900">
                  {formatEuro(totalVentesHT)}
                </td>
                <td className="py-2 px-3 border border-gray-300 text-right font-mono font-bold text-gray-900">
                  {formatEuro(totalCollectee)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* ═══════════ SECTION B — TVA D\u00c9DUCTIBLE ═══════════ */}
        <div className="mb-6">
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-2 bg-gray-100 px-3 py-1.5 border-l-4 border-gray-800">
            Section B &mdash; TVA d\u00e9ductible (Achats)
          </h2>
          <table className="w-full text-sm" style={{ borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc' }}>
                <th className="text-left py-2 px-3 border border-gray-300 font-semibold text-gray-600">
                  Taux
                </th>
                <th className="text-right py-2 px-3 border border-gray-300 font-semibold text-gray-600">
                  Base HT
                </th>
                <th className="text-right py-2 px-3 border border-gray-300 font-semibold text-gray-600">
                  TVA
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.label}>
                  <td className="py-1.5 px-3 border border-gray-300 text-gray-800">{r.label}</td>
                  <td className="py-1.5 px-3 border border-gray-300 text-right font-mono text-gray-800">
                    {formatEuro(r.achatsHT)}
                  </td>
                  <td className="py-1.5 px-3 border border-gray-300 text-right font-mono text-gray-800">
                    {formatEuro(r.tvaDeductible)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr style={{ backgroundColor: '#f1f5f9' }}>
                <td className="py-2 px-3 border border-gray-300 font-bold text-gray-900">
                  Total d\u00e9ductible
                </td>
                <td className="py-2 px-3 border border-gray-300 text-right font-mono font-bold text-gray-900">
                  {formatEuro(totalAchatsHT)}
                </td>
                <td className="py-2 px-3 border border-gray-300 text-right font-mono font-bold text-gray-900">
                  {formatEuro(totalDeductible)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* ═══════════ SECTION C — TVA NETTE ═══════════ */}
        <div className="mb-8">
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-2 bg-gray-100 px-3 py-1.5 border-l-4 border-gray-800">
            Section C &mdash; TVA nette
          </h2>
          <table className="w-full text-sm" style={{ borderCollapse: 'collapse' }}>
            <tbody>
              <tr>
                <td className="py-2 px-3 border border-gray-300 text-gray-700">TVA collect\u00e9e</td>
                <td className="py-2 px-3 border border-gray-300 text-right font-mono">
                  {formatEuro(totalCollectee)}
                </td>
              </tr>
              <tr>
                <td className="py-2 px-3 border border-gray-300 text-gray-700">TVA d\u00e9ductible</td>
                <td className="py-2 px-3 border border-gray-300 text-right font-mono">
                  - {formatEuro(totalDeductible)}
                </td>
              </tr>
              <tr
                style={{ backgroundColor: isCredit ? '#ecfdf5' : '#fef2f2' }}
              >
                <td className="py-3 px-3 border border-gray-300 font-bold text-base">
                  {isCredit ? 'Cr\u00e9dit de TVA' : 'TVA nette \u00e0 payer'}
                </td>
                <td
                  className={`py-3 px-3 border border-gray-300 text-right font-mono font-bold text-base ${
                    isCredit ? 'text-green-700' : 'text-red-700'
                  }`}
                >
                  {formatEuro(Math.abs(tvaNette))}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* ═══════════ LIGNES CA3 (if available) ═══════════ */}
        {lignes.length > 0 && (
          <div className="mb-8">
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-2 bg-gray-100 px-3 py-1.5 border-l-4 border-gray-800">
              D\u00e9tail des lignes CA3
            </h2>
            <table className="w-full text-sm" style={{ borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc' }}>
                  <th className="text-left py-2 px-3 border border-gray-300 font-semibold text-gray-600">
                    Ligne
                  </th>
                  <th className="text-left py-2 px-3 border border-gray-300 font-semibold text-gray-600">
                    Libell\u00e9
                  </th>
                  <th className="text-right py-2 px-3 border border-gray-300 font-semibold text-gray-600">
                    Base HT
                  </th>
                  <th className="text-right py-2 px-3 border border-gray-300 font-semibold text-gray-600">
                    TVA
                  </th>
                </tr>
              </thead>
              <tbody>
                {lignes.map((l) => (
                  <tr key={l.id}>
                    <td className="py-1.5 px-3 border border-gray-300 font-mono text-gray-600">
                      {l.ligne_numero}
                    </td>
                    <td className="py-1.5 px-3 border border-gray-300 text-gray-800">
                      {l.ligne_libelle}
                    </td>
                    <td className="py-1.5 px-3 border border-gray-300 text-right font-mono text-gray-800">
                      {l.base_ht != null ? formatEuro(l.base_ht) : '\u2014'}
                    </td>
                    <td className="py-1.5 px-3 border border-gray-300 text-right font-mono text-gray-800">
                      {formatEuro(l.montant_tva)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ═══════════ NOTES ═══════════ */}
        {declaration.notes && (
          <div className="mb-6 p-3 bg-gray-50 border border-gray-200 rounded text-sm text-gray-700">
            <strong>Notes :</strong> {declaration.notes}
          </div>
        )}

        {/* ═══════════ FOOTER ═══════════ */}
        <div className="border-t border-gray-300 pt-4 mt-8 text-xs text-gray-500 text-center space-y-1">
          <p>
            Document g\u00e9n\u00e9r\u00e9 par Worthifast le{' '}
            {new Date().toLocaleDateString('fr-FR', {
              day: '2-digit',
              month: 'long',
              year: 'numeric',
            })}
          </p>
          <p className="italic">
            Ne constitue pas un document officiel &mdash; Usage interne uniquement
          </p>
        </div>
      </div>
    </>
  )
}
