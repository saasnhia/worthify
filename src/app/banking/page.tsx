'use client'

import { useState, useEffect, useCallback } from 'react'
import { AppShell } from '@/components/layout'
import { Card, Button } from '@/components/ui'
import {
  Landmark, Receipt, CheckCircle, PiggyBank, Link2, X,
  Loader2, Shield, ArrowRight, Building2, RefreshCw,
} from 'lucide-react'

interface BankingStatus {
  accounts: number
  balance: number
  pending_invoices: number
  reconciliation_rate: number
  connected: boolean
}

const BANKS = [
  { name: 'BNP Paribas', logo: '🏦', color: 'bg-green-50 border-green-200' },
  { name: 'Crédit Agricole', logo: '🌿', color: 'bg-emerald-50 border-emerald-200' },
  { name: 'Société Générale', logo: '🔴', color: 'bg-red-50 border-red-200' },
  { name: 'Banque Populaire', logo: '🏛️', color: 'bg-blue-50 border-blue-200' },
  { name: 'CIC', logo: '💼', color: 'bg-indigo-50 border-indigo-200' },
  { name: 'LCL', logo: '🟡', color: 'bg-yellow-50 border-yellow-200' },
]

export default function BankingPage() {
  const [status, setStatus] = useState<BankingStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [connecting, setConnecting] = useState(false)
  const [selectedBank, setSelectedBank] = useState<string | null>(null)
  const [connectStep, setConnectStep] = useState<'select' | 'auth' | 'success'>('select')

  const fetchStatus = useCallback(async () => {
    try {
      const res = await fetch('/api/banking/status')
      if (res.ok) {
        const data: BankingStatus = await res.json()
        setStatus(data)
      }
    } catch {
      // silent
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchStatus() }, [fetchStatus])

  const handleConnect = (bankName: string) => {
    setSelectedBank(bankName)
    setConnecting(true)
    setConnectStep('auth')

    // Simulate PSD2 authentication flow (2s)
    setTimeout(() => {
      setConnecting(false)
      setConnectStep('success')
    }, 2000)
  }

  const handleCloseModal = () => {
    setModalOpen(false)
    setSelectedBank(null)
    setConnectStep('select')
    setConnecting(false)
    if (connectStep === 'success') {
      fetchStatus()
    }
  }

  const fmt = (n: number) =>
    new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(n)

  const kpis = [
    {
      label: 'Solde total',
      value: status ? fmt(status.balance) : '—',
      icon: Landmark,
      color: 'text-emerald-600 bg-emerald-100',
    },
    {
      label: 'Factures en attente',
      value: status ? String(status.pending_invoices) : '—',
      icon: Receipt,
      color: 'text-amber-600 bg-amber-100',
    },
    {
      label: 'Auto-réconciliées',
      value: status ? `${Math.round(status.reconciliation_rate * 100)}%` : '—',
      icon: CheckCircle,
      color: 'text-blue-600 bg-blue-100',
    },
    {
      label: 'Comptes connectés',
      value: status ? String(status.accounts) : '—',
      icon: PiggyBank,
      color: 'text-purple-600 bg-purple-100',
    },
  ]

  return (
    <AppShell>
      <div className="p-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-display font-bold text-navy-900">
              Comptes bancaires synchronisés
            </h1>
            <p className="text-sm text-navy-500 mt-1">
              Connexion sécurisée PSD2 — synchronisation automatique
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={fetchStatus} icon={<RefreshCw className="w-4 h-4" />}>
              Actualiser
            </Button>
            <Button variant="primary" onClick={() => setModalOpen(true)} icon={<Link2 className="w-4 h-4" />}>
              Connecter une banque
            </Button>
          </div>
        </div>

        {/* KPIs Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-6 border border-navy-100">
                <div className="animate-pulse space-y-3">
                  <div className="h-3 bg-navy-100 rounded w-2/3" />
                  <div className="h-8 bg-navy-100 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {kpis.map((kpi) => (
              <Card key={kpi.label}>
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${kpi.color}`}>
                    <kpi.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm text-navy-500">{kpi.label}</p>
                    <p className="text-xl font-bold text-navy-900 mt-0.5">{kpi.value}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Info card */}
        <Card>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0">
              <Shield className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <h3 className="font-display font-semibold text-navy-900">Connexion sécurisée PSD2</h3>
              <p className="text-sm text-navy-500 mt-1">
                Worthifast utilise le protocole PSD2 européen pour se connecter à vos banques.
                Vos identifiants ne transitent jamais par nos serveurs. La synchronisation
                est automatique et chiffrée de bout en bout.
              </p>
              <div className="flex flex-wrap gap-3 mt-4">
                <span className="text-xs px-3 py-1 bg-navy-50 rounded-full text-navy-600">
                  Chiffrement AES-256
                </span>
                <span className="text-xs px-3 py-1 bg-navy-50 rounded-full text-navy-600">
                  Agréé ACPR
                </span>
                <span className="text-xs px-3 py-1 bg-navy-50 rounded-full text-navy-600">
                  RGPD conforme
                </span>
                <span className="text-xs px-3 py-1 bg-navy-50 rounded-full text-navy-600">
                  Lecture seule
                </span>
              </div>
            </div>
          </div>
        </Card>

        {/* Modal — Connect Bank */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
              {/* Header */}
              <div className="flex items-center justify-between p-5 border-b border-navy-100">
                <div className="flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-emerald-600" />
                  <h2 className="font-display font-semibold text-navy-900">
                    {connectStep === 'select' && 'Choisir votre banque'}
                    {connectStep === 'auth' && `Connexion à ${selectedBank}`}
                    {connectStep === 'success' && 'Connexion réussie'}
                  </h2>
                </div>
                <button
                  onClick={handleCloseModal}
                  className="p-2 text-navy-400 hover:text-navy-600 hover:bg-navy-50 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="p-5">
                {connectStep === 'select' && (
                  <div className="space-y-2">
                    <p className="text-sm text-navy-500 mb-4">
                      Sélectionnez votre établissement bancaire pour initier la connexion sécurisée.
                    </p>
                    {BANKS.map((bank) => (
                      <button
                        key={bank.name}
                        onClick={() => handleConnect(bank.name)}
                        className={`w-full flex items-center gap-3 p-3 rounded-xl border ${bank.color} hover:shadow-md transition-all text-left`}
                      >
                        <span className="text-2xl">{bank.logo}</span>
                        <span className="font-medium text-navy-900 flex-1">{bank.name}</span>
                        <ArrowRight className="w-4 h-4 text-navy-400" />
                      </button>
                    ))}
                  </div>
                )}

                {connectStep === 'auth' && (
                  <div className="text-center py-8">
                    <Loader2 className="w-12 h-12 text-emerald-600 animate-spin mx-auto" />
                    <p className="font-medium text-navy-900 mt-4">
                      Connexion sécurisée PSD2...
                    </p>
                    <p className="text-sm text-navy-500 mt-1">
                      Authentification auprès de {selectedBank}
                    </p>
                    <div className="flex items-center justify-center gap-2 mt-4 text-xs text-navy-400">
                      <Shield className="w-3 h-3" />
                      Chiffré de bout en bout
                    </div>
                  </div>
                )}

                {connectStep === 'success' && (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto">
                      <CheckCircle className="w-8 h-8 text-emerald-600" />
                    </div>
                    <p className="font-display font-semibold text-navy-900 mt-4 text-lg">
                      Comptes synchronisés !
                    </p>
                    <p className="text-sm text-navy-500 mt-1">
                      {selectedBank} est maintenant connectée. Vos transactions seront
                      synchronisées automatiquement.
                    </p>
                    <Button
                      variant="primary"
                      onClick={handleCloseModal}
                      className="mt-6"
                    >
                      Fermer
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  )
}
