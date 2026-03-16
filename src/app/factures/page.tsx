'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AppShell } from '@/components/layout'
import { Card, Button } from '@/components/ui'
import { UploadFacture } from '@/components/factures/UploadFacture'
import { FacturesClientsList } from '@/components/factures/FacturesClientsList'
import { useAuth } from '@/hooks/useAuth'
import { useFactures } from '@/hooks/useFactures'
import { formatCurrency } from '@/lib/calculations'
import {
  FileText,
  Calendar,
  Loader2,
  CheckCircle,
  AlertCircle,
  XCircle,
  PenLine,
} from 'lucide-react'

type Tab = 'fournisseurs' | 'clients'

export default function FacturesPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const { factures, loading: dataLoading } = useFactures(user?.id)
  const [activeTab, setActiveTab] = useState<Tab>('fournisseurs')

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('tab') === 'clients') setActiveTab('clients')
  }, [])

  const loading = authLoading || dataLoading

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'validee': return <CheckCircle className="w-4 h-4 text-emerald-600" />
      case 'en_attente': return <Loader2 className="w-4 h-4 text-gold-600 animate-spin" />
      case 'brouillon': return <AlertCircle className="w-4 h-4 text-coral-600" />
      case 'rejetee': return <XCircle className="w-4 h-4 text-red-600" />
      default: return null
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'validee': return 'Validée'
      case 'en_attente': return 'En attente'
      case 'brouillon': return 'Brouillon'
      case 'rejetee': return 'Rejetée'
      default: return status
    }
  }

  return (
    <AppShell>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-display font-bold text-navy-900">Factures</h1>
          <p className="mt-1 text-gray-600">Gestion de vos factures fournisseurs et clients</p>
        </div>

        {/* Not Logged In Banner */}
        {!user && (
          <Card className="mb-8 bg-gradient-to-r from-emerald-500 to-emerald-600 border-none">
            <div className="flex items-center justify-between">
              <div className="text-white">
                <h3 className="font-display font-semibold text-lg">Connexion requise</h3>
                <p className="text-emerald-100 text-sm">Connectez-vous pour gérer vos factures</p>
              </div>
              <a
                href="/login"
                className="px-4 py-2 bg-white text-emerald-600 rounded-lg font-medium hover:bg-emerald-50 transition-colors"
              >
                Se connecter
              </a>
            </div>
          </Card>
        )}

        {/* Tabs */}
        <div className="flex border-b border-navy-200 mb-6">
          <button
            onClick={() => setActiveTab('fournisseurs')}
            className={`px-6 py-3 text-sm font-medium transition-colors border-b-2 -mb-px ${
              activeTab === 'fournisseurs'
                ? 'border-emerald-500 text-emerald-700'
                : 'border-transparent text-navy-500 hover:text-navy-700'
            }`}
          >
            Fournisseurs (OCR)
          </button>
          <button
            onClick={() => setActiveTab('clients')}
            className={`px-6 py-3 text-sm font-medium transition-colors border-b-2 -mb-px ${
              activeTab === 'clients'
                ? 'border-emerald-500 text-emerald-700'
                : 'border-transparent text-navy-500 hover:text-navy-700'
            }`}
          >
            Clients (Saisie manuelle)
          </button>
        </div>

        {/* Tab: Fournisseurs */}
        {activeTab === 'fournisseurs' && (
          <>
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <UploadFacture onUploadSuccess={() => window.location.reload()} />
              </div>
              <div className="lg:col-span-1">
                <Card>
                  <h3 className="text-lg font-display font-semibold text-navy-900 mb-4">Statistiques</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-navy-50 rounded-lg">
                      <span className="text-sm text-navy-600">Total factures</span>
                      <span className="font-mono font-semibold text-navy-900">{factures.length}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg">
                      <span className="text-sm text-emerald-700">Validées</span>
                      <span className="font-mono font-semibold text-emerald-900">
                        {factures.filter(f => f.statut === 'validee').length}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-coral-50 rounded-lg">
                      <span className="text-sm text-coral-700">En attente</span>
                      <span className="font-mono font-semibold text-coral-900">
                        {factures.filter(f => f.statut === 'en_attente').length}
                      </span>
                    </div>
                  </div>
                </Card>
              </div>
            </div>

            {loading ? (
              <div className="mt-8 flex items-center justify-center py-12">
                <div className="flex flex-col items-center gap-4">
                  <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
                  <p className="text-gray-600">Chargement des factures...</p>
                </div>
              </div>
            ) : factures.length > 0 ? (
              <div className="mt-8">
                <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
                        <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-800">Fournisseur</th>
                        <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-800">N° Facture</th>
                        <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-800">Date</th>
                        <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-gray-800">Montant HT</th>
                        <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-gray-800">TVA</th>
                        <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-gray-800">TTC</th>
                        <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wider text-gray-800">Confiance</th>
                        <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wider text-gray-800">Statut</th>
                      </tr>
                    </thead>
                    <tbody>
                      {factures.map((facture, idx) => {
                        const confidence = facture.ocr_confidence != null ? Math.round(facture.ocr_confidence * 100) : null
                        return (
                          <tr key={facture.id} className={`border-b border-gray-100 hover:bg-amber-50 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                            <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                              {facture.fournisseur ?? 'Inconnu'}
                            </td>
                            <td className="px-6 py-4 text-sm font-mono text-gray-800">
                              {facture.numero_facture ?? '-'}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-700">
                              {facture.date_facture ? new Date(facture.date_facture).toLocaleDateString('fr-FR') : '-'}
                            </td>
                            <td className="px-6 py-4 text-sm text-right font-mono font-medium text-gray-900 tabular-nums">
                              {facture.montant_ht != null ? formatCurrency(facture.montant_ht) : '-'}
                            </td>
                            <td className="px-6 py-4 text-sm text-right font-mono text-gray-700 tabular-nums">
                              {facture.montant_tva != null ? formatCurrency(facture.montant_tva) : '-'}
                            </td>
                            <td className="px-6 py-4 text-sm text-right font-mono font-bold text-gray-900 tabular-nums">
                              {facture.montant_ttc != null ? formatCurrency(facture.montant_ttc) : '-'}
                            </td>
                            <td className="px-6 py-4 text-center">
                              {confidence != null ? (
                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                                  confidence >= 95 ? 'bg-emerald-100 text-emerald-800' : confidence >= 85 ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                                }`}>
                                  {confidence}%
                                </span>
                              ) : '-'}
                            </td>
                            <td className="px-6 py-4 text-center">
                              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                                facture.statut === 'validee' ? 'bg-emerald-100 text-emerald-800' :
                                facture.statut === 'en_attente' ? 'bg-amber-100 text-amber-800' :
                                facture.statut === 'rejetee' ? 'bg-rose-100 text-rose-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {getStatusIcon(facture.statut)}
                                {getStatusLabel(facture.statut)}
                              </span>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : user ? (
              <div className="mt-8">
                <Card className="text-center py-12">
                  <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-700 font-medium">Aucune facture importée</p>
                  <p className="text-sm text-gray-500 mt-1 mb-4">
                    Glissez-déposez une facture ci-dessus pour commencer
                  </p>
                  <Button
                    onClick={() => router.push('/factures?tab=clients')}
                    variant="outline"
                    icon={<PenLine className="w-4 h-4" />}
                  >
                    Créer une facture client
                  </Button>
                </Card>
              </div>
            ) : null}
          </>
        )}

        {/* Tab: Clients */}
        {activeTab === 'clients' && (
          <FacturesClientsList />
        )}
      </main>
    </AppShell>
  )
}
