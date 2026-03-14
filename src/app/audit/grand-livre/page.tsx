'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { AppShell } from '@/components/layout'
import { Card, Button } from '@/components/ui'
import {
  BookMarked,
  Search,
  Download,
  Filter,
  Loader2,
  ArrowLeft,
  Calendar,
  ChevronRight,
} from 'lucide-react'

// ─── Types ───────────────────────────────────────────────────────────────────

interface CompteAggrege {
  compte_num: string
  compte_lib: string
  classe: number
  total_debit: number
  total_credit: number
  solde: number
  nb_ecritures: number
}

interface LigneDetail {
  id: string
  ecriture_num: string
  journal_code: string
  date_ecriture: string
  piece_ref: string | null
  compte_num: string
  compte_lib: string | null
  debit: number
  credit: number
  libelle: string
  lettrage: string | null
  solde_cumule: number
}

interface Totals {
  debit: number
  credit: number
  solde: number
  nb_comptes?: number
}

const CLASSE_LABELS: Record<number, string> = {
  1: 'Capitaux',
  2: 'Immobilisations',
  3: 'Stocks',
  4: 'Tiers',
  5: 'Financier',
  6: 'Charges',
  7: 'Produits',
}

const CLASSE_COLORS: Record<number, string> = {
  1: 'bg-purple-500/10 text-purple-400',
  2: 'bg-blue-500/10 text-blue-400',
  3: 'bg-orange-500/10 text-orange-400',
  4: 'bg-amber-500/10 text-amber-400',
  5: 'bg-cyan-500/10 text-cyan-400',
  6: 'bg-coral-500/10 text-coral-400',
  7: 'bg-emerald-500/10 text-emerald-400',
}

const formatEuro = (n: number) =>
  new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', minimumFractionDigits: 2 }).format(n)

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })

// ─── Composant ───────────────────────────────────────────────────────────────

export default function GrandLivrePage() {
  const [comptes, setComptes] = useState<CompteAggrege[]>([])
  const [lignes, setLignes] = useState<LigneDetail[]>([])
  const [totals, setTotals] = useState<Totals>({ debit: 0, credit: 0, solde: 0 })
  const [loading, setLoading] = useState(true)
  const [mode, setMode] = useState<'agrege' | 'detail'>('agrege')
  const [selectedCompte, setSelectedCompte] = useState<string>('')
  const [selectedCompteLib, setSelectedCompteLib] = useState('')

  // Parse ?compte= from URL without useSearchParams (avoids Suspense requirement)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const compteParam = params.get('compte')
    if (compteParam) {
      setSelectedCompte(compteParam)
      setMode('detail')
    }
  }, [])

  // Filtres
  const [classeFilter, setClasseFilter] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (dateFrom) params.set('date_from', dateFrom)
      if (dateTo) params.set('date_to', dateTo)

      if (mode === 'detail' && selectedCompte) {
        params.set('compte', selectedCompte)
        const res = await fetch(`/api/comptabilite/grand-livre?${params}`)
        const data = await res.json() as {
          success?: boolean
          mode?: string
          lignes?: LigneDetail[]
          totals?: Totals
          compte_lib?: string
        }
        if (data.success) {
          setLignes(data.lignes ?? [])
          setTotals(data.totals ?? { debit: 0, credit: 0, solde: 0 })
          if (data.compte_lib) setSelectedCompteLib(data.compte_lib)
        }
      } else {
        if (classeFilter) params.set('classe', classeFilter)
        const res = await fetch(`/api/comptabilite/grand-livre?${params}`)
        const data = await res.json() as {
          success?: boolean
          mode?: string
          comptes?: CompteAggrege[]
          totals?: Totals
        }
        if (data.success) {
          setComptes(data.comptes ?? [])
          setTotals(data.totals ?? { debit: 0, credit: 0, solde: 0 })
        }
      }
    } catch { /* silent */ }
    setLoading(false)
  }, [mode, selectedCompte, classeFilter, dateFrom, dateTo])

  useEffect(() => { fetchData() }, [fetchData])

  const openCompte = (num: string, lib: string) => {
    setSelectedCompte(num)
    setSelectedCompteLib(lib)
    setMode('detail')
  }

  const backToList = () => {
    setMode('agrege')
    setSelectedCompte('')
    setSelectedCompteLib('')
  }

  // Filtrer comptes agrégés par recherche
  const filteredComptes = comptes.filter(c => {
    if (!searchQuery) return true
    const q = searchQuery.toLowerCase()
    return c.compte_num.includes(q) || c.compte_lib.toLowerCase().includes(q)
  })

  // Export CSV
  const handleExportCSV = () => {
    if (mode === 'detail') {
      const header = 'Date;N° Écriture;Journal;Libellé;Pièce;Débit;Crédit;Solde cumulé'
      const rows = lignes.map(l =>
        `${l.date_ecriture};${l.ecriture_num};${l.journal_code};${l.libelle};${l.piece_ref ?? ''};${Number(l.debit).toFixed(2)};${Number(l.credit).toFixed(2)};${l.solde_cumule.toFixed(2)}`
      )
      const csv = [header, ...rows].join('\n')
      const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `grand-livre-${selectedCompte}-${new Date().toISOString().slice(0, 10)}.csv`
      link.click()
      URL.revokeObjectURL(url)
    } else {
      const header = 'Compte;Libellé;Classe;Total Débit;Total Crédit;Solde;Nb Écritures'
      const rows = filteredComptes.map(c =>
        `${c.compte_num};${c.compte_lib};${c.classe};${c.total_debit.toFixed(2)};${c.total_credit.toFixed(2)};${c.solde.toFixed(2)};${c.nb_ecritures}`
      )
      const csv = [header, ...rows].join('\n')
      const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `grand-livre-${new Date().toISOString().slice(0, 10)}.csv`
      link.click()
      URL.revokeObjectURL(url)
    }
  }

  return (
    <AppShell>
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 text-sm text-neutral-500 mb-1">
              <Link href="/dashboard" className="hover:text-brand-green-action transition-colors">Dashboard</Link>
              <span>/</span>
              {mode === 'detail' ? (
                <>
                  <button onClick={backToList} className="hover:text-brand-green-action transition-colors">Grand Livre</button>
                  <span>/</span>
                  <span className="text-neutral-300">{selectedCompte}</span>
                </>
              ) : (
                <span className="text-neutral-300">Grand Livre</span>
              )}
            </div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <BookMarked className="w-6 h-6 text-brand-green-action" />
              {mode === 'detail' ? (
                <>
                  Compte {selectedCompte}
                  <span className="text-lg font-normal text-neutral-400">— {selectedCompteLib}</span>
                </>
              ) : (
                'Grand Livre'
              )}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            {mode === 'detail' && (
              <Button variant="ghost" size="sm" onClick={backToList} icon={<ArrowLeft className="w-4 h-4" />}>
                Retour
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={handleExportCSV} icon={<Download className="w-4 h-4" />}>
              Export CSV
            </Button>
          </div>
        </div>

        {/* Filtres */}
        <Card className="mb-4">
          <div className="flex flex-wrap items-center gap-3">
            <Filter className="w-4 h-4 text-neutral-500" />
            {/* Dates */}
            <div className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-neutral-500" />
              <input
                type="date"
                value={dateFrom}
                onChange={e => setDateFrom(e.target.value)}
                className="bg-brand-dark border border-white/10 text-neutral-300 text-sm rounded-lg px-2 py-1.5"
              />
              <span className="text-neutral-500 text-xs">→</span>
              <input
                type="date"
                value={dateTo}
                onChange={e => setDateTo(e.target.value)}
                className="bg-brand-dark border border-white/10 text-neutral-300 text-sm rounded-lg px-2 py-1.5"
              />
            </div>
            {mode === 'agrege' && (
              <>
                {/* Classe PCG */}
                <div className="flex items-center gap-1">
                  {['', '1', '2', '3', '4', '5', '6', '7'].map(c => (
                    <button
                      key={c}
                      onClick={() => setClasseFilter(c)}
                      className={`px-2 py-1 text-xs rounded-lg transition-colors ${
                        classeFilter === c
                          ? 'bg-brand-green-primary/20 text-brand-green-action font-medium'
                          : 'text-neutral-500 hover:bg-white/5 hover:text-neutral-300'
                      }`}
                    >
                      {c === '' ? 'Tous' : `Cl.${c}`}
                    </button>
                  ))}
                </div>
                {/* Recherche */}
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Rechercher un compte..."
                    className="w-full pl-9 pr-3 py-1.5 bg-brand-dark border border-white/10 text-neutral-300 text-sm rounded-lg"
                  />
                </div>
              </>
            )}
          </div>
        </Card>

        {/* KPI bar */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <Card>
            <p className="text-xs text-neutral-500 mb-0.5">Total Débit</p>
            <p className="text-lg font-bold font-mono text-neutral-200">{formatEuro(totals.debit)}</p>
          </Card>
          <Card>
            <p className="text-xs text-neutral-500 mb-0.5">Total Crédit</p>
            <p className="text-lg font-bold font-mono text-neutral-200">{formatEuro(totals.credit)}</p>
          </Card>
          <Card>
            <p className="text-xs text-neutral-500 mb-0.5">Solde</p>
            <p className={`text-lg font-bold font-mono ${totals.solde >= 0 ? 'text-emerald-400' : 'text-coral-400'}`}>
              {formatEuro(totals.solde)}
            </p>
          </Card>
        </div>

        {/* Contenu */}
        <Card padding="none">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-6 h-6 text-brand-green-action animate-spin" />
            </div>
          ) : mode === 'agrege' ? (
            /* Vue agrégée — liste des comptes */
            filteredComptes.length === 0 ? (
              <div className="text-center py-16">
                <BookMarked className="w-10 h-10 text-neutral-600 mx-auto mb-3" />
                <p className="text-neutral-400 mb-2">Aucun compte avec mouvements</p>
                <p className="text-neutral-500 text-sm">Saisissez des écritures dans le journal</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/5 bg-white/[0.02]">
                      <th className="px-4 py-2.5 text-left text-xs font-medium text-neutral-500">Compte</th>
                      <th className="px-4 py-2.5 text-left text-xs font-medium text-neutral-500">Libellé</th>
                      <th className="px-4 py-2.5 text-center text-xs font-medium text-neutral-500">Classe</th>
                      <th className="px-4 py-2.5 text-right text-xs font-medium text-neutral-500">Total Débit</th>
                      <th className="px-4 py-2.5 text-right text-xs font-medium text-neutral-500">Total Crédit</th>
                      <th className="px-4 py-2.5 text-right text-xs font-medium text-neutral-500">Solde</th>
                      <th className="px-4 py-2.5 text-center text-xs font-medium text-neutral-500">Écritures</th>
                      <th className="px-4 py-2.5 w-8"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredComptes.map(c => (
                      <tr
                        key={c.compte_num}
                        className="hover:bg-white/[0.02] transition-colors cursor-pointer"
                        onClick={() => openCompte(c.compte_num, c.compte_lib)}
                      >
                        <td className="px-4 py-2.5 font-mono text-brand-green-action text-xs font-medium">{c.compte_num}</td>
                        <td className="px-4 py-2.5 text-neutral-300 text-xs">{c.compte_lib}</td>
                        <td className="px-4 py-2.5 text-center">
                          <span className={`inline-flex px-2 py-0.5 text-[10px] font-semibold rounded-full ${CLASSE_COLORS[c.classe] ?? 'bg-neutral-500/10 text-neutral-400'}`}>
                            {c.classe} - {CLASSE_LABELS[c.classe] ?? '?'}
                          </span>
                        </td>
                        <td className="px-4 py-2.5 text-right font-mono text-xs text-neutral-300">{formatEuro(c.total_debit)}</td>
                        <td className="px-4 py-2.5 text-right font-mono text-xs text-neutral-300">{formatEuro(c.total_credit)}</td>
                        <td className={`px-4 py-2.5 text-right font-mono text-xs font-medium ${c.solde >= 0 ? 'text-emerald-400' : 'text-coral-400'}`}>
                          {formatEuro(c.solde)}
                        </td>
                        <td className="px-4 py-2.5 text-center text-xs text-neutral-500">{c.nb_ecritures}</td>
                        <td className="px-4 py-2.5">
                          <ChevronRight className="w-3.5 h-3.5 text-neutral-600" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t border-white/10 bg-white/[0.03]">
                      <td colSpan={3} className="px-4 py-2.5 text-xs font-semibold text-neutral-400 text-right">
                        {filteredComptes.length} comptes
                      </td>
                      <td className="px-4 py-2.5 text-right font-mono text-xs font-bold text-neutral-200">{formatEuro(totals.debit)}</td>
                      <td className="px-4 py-2.5 text-right font-mono text-xs font-bold text-neutral-200">{formatEuro(totals.credit)}</td>
                      <td className={`px-4 py-2.5 text-right font-mono text-xs font-bold ${totals.solde >= 0 ? 'text-emerald-400' : 'text-coral-400'}`}>
                        {formatEuro(totals.solde)}
                      </td>
                      <td colSpan={2}></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )
          ) : (
            /* Vue détail — écritures d'un compte */
            lignes.length === 0 ? (
              <div className="text-center py-16">
                <BookMarked className="w-10 h-10 text-neutral-600 mx-auto mb-3" />
                <p className="text-neutral-400">Aucune écriture pour ce compte</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/5 bg-white/[0.02]">
                      <th className="px-3 py-2.5 text-left text-xs font-medium text-neutral-500">Date</th>
                      <th className="px-3 py-2.5 text-left text-xs font-medium text-neutral-500">N°</th>
                      <th className="px-3 py-2.5 text-left text-xs font-medium text-neutral-500">Journal</th>
                      <th className="px-3 py-2.5 text-left text-xs font-medium text-neutral-500">Libellé</th>
                      <th className="px-3 py-2.5 text-left text-xs font-medium text-neutral-500">Pièce</th>
                      <th className="px-3 py-2.5 text-left text-xs font-medium text-neutral-500">Lettrage</th>
                      <th className="px-3 py-2.5 text-right text-xs font-medium text-neutral-500">Débit</th>
                      <th className="px-3 py-2.5 text-right text-xs font-medium text-neutral-500">Crédit</th>
                      <th className="px-3 py-2.5 text-right text-xs font-medium text-neutral-500">Solde cumulé</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {lignes.map(l => (
                      <tr key={l.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="px-3 py-2 text-neutral-400 text-xs font-mono">{formatDate(l.date_ecriture)}</td>
                        <td className="px-3 py-2 text-neutral-300 text-xs font-mono">{l.ecriture_num}</td>
                        <td className="px-3 py-2 text-neutral-400 text-xs">{l.journal_code}</td>
                        <td className="px-3 py-2 text-neutral-300 text-xs max-w-[250px] truncate">{l.libelle}</td>
                        <td className="px-3 py-2 text-neutral-500 text-xs font-mono">{l.piece_ref ?? '-'}</td>
                        <td className="px-3 py-2 text-neutral-500 text-xs font-mono">{l.lettrage ?? ''}</td>
                        <td className="px-3 py-2 text-right font-mono text-xs">
                          {Number(l.debit) > 0 ? <span className="text-neutral-200">{formatEuro(Number(l.debit))}</span> : <span className="text-neutral-600">-</span>}
                        </td>
                        <td className="px-3 py-2 text-right font-mono text-xs">
                          {Number(l.credit) > 0 ? <span className="text-neutral-200">{formatEuro(Number(l.credit))}</span> : <span className="text-neutral-600">-</span>}
                        </td>
                        <td className={`px-3 py-2 text-right font-mono text-xs font-medium ${l.solde_cumule >= 0 ? 'text-emerald-400' : 'text-coral-400'}`}>
                          {formatEuro(l.solde_cumule)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t border-white/10 bg-white/[0.03]">
                      <td colSpan={6} className="px-3 py-2.5 text-xs font-semibold text-neutral-400 text-right">
                        Totaux
                      </td>
                      <td className="px-3 py-2.5 text-right font-mono text-xs font-bold text-neutral-200">{formatEuro(totals.debit)}</td>
                      <td className="px-3 py-2.5 text-right font-mono text-xs font-bold text-neutral-200">{formatEuro(totals.credit)}</td>
                      <td className={`px-3 py-2.5 text-right font-mono text-xs font-bold ${totals.solde >= 0 ? 'text-emerald-400' : 'text-coral-400'}`}>
                        {formatEuro(totals.solde)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )
          )}
        </Card>
      </div>
    </AppShell>
  )
}
