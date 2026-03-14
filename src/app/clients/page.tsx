'use client'

import { useEffect, useState, useMemo, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { AppShell } from '@/components/layout'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import {
  Users,
  Plus,
  Search,
  Eye,
  Pencil,
  Loader2,
  TrendingUp,
  AlertTriangle,
  Receipt,
  X,
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

// ---------- Types ----------

interface ClientEnriched {
  id: string
  user_id: string
  nom: string
  email: string | null
  telephone: string | null
  adresse: string | null
  siren: string | null
  notes: string | null
  created_at: string
  updated_at: string
  factures_ouvertes: number
  ca_12_mois: number
  retard_max_jours: number
  montant_impaye: number
}

type HealthFilter = 'tous' | 'a_jour' | 'en_retard' | 'critique'
type PageSize = 20 | 50 | 'all'

interface NewClientForm {
  nom: string
  email: string
  telephone: string
  adresse: string
  siren: string
  notes: string
}

// ---------- Helpers ----------

const formatEUR = (n: number) =>
  new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(n)

function healthLabel(retardMax: number): { text: string; bg: string; text_color: string } {
  if (retardMax === 0) return { text: 'A jour', bg: 'bg-emerald-100', text_color: 'text-emerald-800' }
  if (retardMax <= 30) return { text: 'En retard', bg: 'bg-amber-100', text_color: 'text-amber-800' }
  return { text: 'Critique', bg: 'bg-red-100', text_color: 'text-red-800' }
}

// ---------- Component ----------

export default function ClientsPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()

  const [clients, setClients] = useState<ClientEnriched[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<HealthFilter>('tous')
  const [pageSize, setPageSize] = useState<PageSize>(20)

  // Modal state
  const [showModal, setShowModal] = useState(false)
  const [creating, setCreating] = useState(false)
  const [createError, setCreateError] = useState('')
  const [form, setForm] = useState<NewClientForm>({
    nom: '', email: '', telephone: '', adresse: '', siren: '', notes: '',
  })

  // Fetch clients
  const fetchClients = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/clients')
      const data = await res.json()
      if (data.success) {
        setClients(data.clients as ClientEnriched[])
      }
    } catch {
      /* silent */
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!authLoading && user) {
      void fetchClients()
    }
  }, [authLoading, user, fetchClients])

  // Filtering and search
  const filtered = useMemo(() => {
    let list = clients

    // Health filter
    if (filter === 'a_jour') list = list.filter(c => c.retard_max_jours === 0)
    else if (filter === 'en_retard') list = list.filter(c => c.retard_max_jours > 0 && c.retard_max_jours <= 30)
    else if (filter === 'critique') list = list.filter(c => c.retard_max_jours > 30)

    // Search
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(c =>
        c.nom.toLowerCase().includes(q) ||
        (c.email && c.email.toLowerCase().includes(q)) ||
        (c.siren && c.siren.includes(q))
      )
    }

    return list
  }, [clients, filter, search])

  // Pagination
  const displayed = useMemo(() => {
    if (pageSize === 'all') return filtered
    return filtered.slice(0, pageSize)
  }, [filtered, pageSize])

  // KPIs
  const kpis = useMemo(() => {
    const total = clients.length
    const caTotal = clients.reduce((s, c) => s + c.ca_12_mois, 0)
    const facturesRetard = clients.filter(c => c.retard_max_jours > 0).reduce((s, c) => s + c.factures_ouvertes, 0)
    const montantImpaye = clients.reduce((s, c) => s + c.montant_impaye, 0)
    return { total, caTotal, facturesRetard, montantImpaye }
  }, [clients])

  // Create client
  const handleCreate = async () => {
    if (!form.nom.trim()) {
      setCreateError('Le nom est requis')
      return
    }
    setCreating(true)
    setCreateError('')
    try {
      const res = await fetch('/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (data.success) {
        setShowModal(false)
        setForm({ nom: '', email: '', telephone: '', adresse: '', siren: '', notes: '' })
        void fetchClients()
      } else {
        setCreateError(data.error || 'Erreur lors de la creation')
      }
    } catch {
      setCreateError('Erreur reseau')
    } finally {
      setCreating(false)
    }
  }

  // Filter buttons config
  const filterButtons: { key: HealthFilter; label: string }[] = [
    { key: 'tous', label: 'Tous' },
    { key: 'a_jour', label: 'A jour' },
    { key: 'en_retard', label: 'En retard' },
    { key: 'critique', label: 'Critique' },
  ]

  return (
    <AppShell>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-navy-900 flex items-center gap-2">
              <Users className="w-6 h-6 text-emerald-500" />
              Clients
            </h1>
            <p className="text-navy-500 text-sm mt-1">
              Gerez vos clients et suivez leur sante financiere
            </p>
          </div>
          <Button
            icon={<Plus className="w-4 h-4" />}
            onClick={() => setShowModal(true)}
          >
            Nouveau client
          </Button>
        </div>

        {/* KPI Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card padding="sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                <Users className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-xs text-navy-500 font-medium">Total clients</p>
                <p className="text-xl font-bold text-navy-900">{kpis.total}</p>
              </div>
            </div>
          </Card>

          <Card padding="sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-navy-500 font-medium">CA total 12 mois</p>
                <p className="text-xl font-bold text-navy-900">{formatEUR(kpis.caTotal)}</p>
              </div>
            </div>
          </Card>

          <Card padding="sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                <Receipt className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-xs text-navy-500 font-medium">Factures en retard</p>
                <p className="text-xl font-bold text-navy-900">{kpis.facturesRetard}</p>
              </div>
            </div>
          </Card>

          <Card padding="sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-xs text-navy-500 font-medium">Montant impaye</p>
                <p className="text-xl font-bold text-navy-900">{formatEUR(kpis.montantImpaye)}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Search + Filters */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-6">
          <div className="w-full sm:w-80">
            <Input
              placeholder="Rechercher par nom, email ou SIREN..."
              icon={<Search className="w-4 h-4" />}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            {filterButtons.map(fb => (
              <button
                key={fb.key}
                onClick={() => setFilter(fb.key)}
                className={`
                  px-3 py-2 rounded-xl text-sm font-medium transition-colors
                  ${filter === fb.key
                    ? 'bg-emerald-500 text-white shadow-sm'
                    : 'bg-white border border-navy-200 text-navy-600 hover:bg-navy-50'
                  }
                `}
              >
                {fb.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 text-emerald-500 animate-spin" />
          </div>
        ) : clients.length === 0 ? (
          /* Empty state */
          <Card className="text-center py-16">
            <Users className="w-12 h-12 text-navy-300 mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-navy-900 mb-2">Aucun client</h2>
            <p className="text-navy-500 mb-6">Ajoutez votre premier client pour commencer</p>
            <Button
              icon={<Plus className="w-4 h-4" />}
              onClick={() => setShowModal(true)}
            >
              Ajouter un client
            </Button>
          </Card>
        ) : filtered.length === 0 ? (
          <Card className="text-center py-12">
            <Search className="w-10 h-10 text-navy-300 mx-auto mb-3" />
            <p className="text-navy-500">Aucun client ne correspond a votre recherche</p>
          </Card>
        ) : (
          <>
            {/* Table */}
            <Card padding="none" className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-navy-100 bg-navy-50/50">
                      <th className="text-left px-5 py-3 text-xs font-semibold text-navy-500 uppercase tracking-wider">Nom</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-navy-500 uppercase tracking-wider">SIREN</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-navy-500 uppercase tracking-wider">Email</th>
                      <th className="text-center px-5 py-3 text-xs font-semibold text-navy-500 uppercase tracking-wider">Factures ouvertes</th>
                      <th className="text-right px-5 py-3 text-xs font-semibold text-navy-500 uppercase tracking-wider">CA 12 mois</th>
                      <th className="text-center px-5 py-3 text-xs font-semibold text-navy-500 uppercase tracking-wider">Retard max</th>
                      <th className="text-center px-5 py-3 text-xs font-semibold text-navy-500 uppercase tracking-wider">Sante</th>
                      <th className="text-center px-5 py-3 text-xs font-semibold text-navy-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-navy-100">
                    {displayed.map(client => {
                      const health = healthLabel(client.retard_max_jours)
                      return (
                        <tr key={client.id} className="hover:bg-navy-50/30 transition-colors">
                          <td className="px-5 py-4">
                            <span className="font-semibold text-navy-900">{client.nom}</span>
                          </td>
                          <td className="px-5 py-4 text-sm text-navy-600 font-mono">
                            {client.siren || '-'}
                          </td>
                          <td className="px-5 py-4 text-sm text-navy-600">
                            {client.email || '-'}
                          </td>
                          <td className="px-5 py-4 text-center">
                            {client.factures_ouvertes > 0 ? (
                              <span className="inline-flex items-center justify-center min-w-[24px] h-6 px-2 rounded-full bg-amber-100 text-amber-800 text-sm font-semibold">
                                {client.factures_ouvertes}
                              </span>
                            ) : (
                              <span className="text-sm text-navy-400">0</span>
                            )}
                          </td>
                          <td className="px-5 py-4 text-right text-sm font-medium text-navy-900">
                            {formatEUR(client.ca_12_mois)}
                          </td>
                          <td className="px-5 py-4 text-center text-sm">
                            {client.retard_max_jours > 0 ? (
                              <span className="font-semibold text-red-600">{client.retard_max_jours}j</span>
                            ) : (
                              <span className="text-navy-400">-</span>
                            )}
                          </td>
                          <td className="px-5 py-4 text-center">
                            <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${health.bg} ${health.text_color}`}>
                              {health.text}
                            </span>
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex items-center justify-center gap-1">
                              <button
                                onClick={() => router.push(`/factures?tab=clients&client_id=${client.id}`)}
                                className="p-2 rounded-lg hover:bg-emerald-50 text-navy-500 hover:text-emerald-600 transition-colors"
                                title="Voir les factures"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => router.push(`/portail/cabinet/${client.id}`)}
                                className="p-2 rounded-lg hover:bg-blue-50 text-navy-500 hover:text-blue-600 transition-colors"
                                title="Modifier"
                              >
                                <Pencil className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </Card>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-4 text-sm text-navy-500">
              <p>
                {displayed.length} sur {filtered.length} client{filtered.length !== 1 ? 's' : ''}
              </p>
              <div className="flex items-center gap-2">
                <span>Afficher :</span>
                {([20, 50, 'all'] as PageSize[]).map(size => (
                  <button
                    key={String(size)}
                    onClick={() => setPageSize(size)}
                    className={`
                      px-2.5 py-1 rounded-lg transition-colors
                      ${pageSize === size
                        ? 'bg-emerald-500 text-white'
                        : 'bg-white border border-navy-200 hover:bg-navy-50'
                      }
                    `}
                  >
                    {size === 'all' ? 'Tous' : size}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Create Client Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-navy-900">Nouveau client</h2>
              <button
                onClick={() => { setShowModal(false); setCreateError('') }}
                className="p-1.5 rounded-lg hover:bg-navy-100 text-navy-500 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <Input
                label="Nom *"
                placeholder="Nom du client ou de l'entreprise"
                value={form.nom}
                onChange={(e) => setForm(prev => ({ ...prev, nom: e.target.value }))}
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Email"
                  type="email"
                  placeholder="email@exemple.fr"
                  value={form.email}
                  onChange={(e) => setForm(prev => ({ ...prev, email: e.target.value }))}
                />
                <Input
                  label="Telephone"
                  type="tel"
                  placeholder="06 12 34 56 78"
                  value={form.telephone}
                  onChange={(e) => setForm(prev => ({ ...prev, telephone: e.target.value }))}
                />
              </div>
              <Input
                label="Adresse"
                placeholder="Adresse postale"
                value={form.adresse}
                onChange={(e) => setForm(prev => ({ ...prev, adresse: e.target.value }))}
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="SIREN"
                  placeholder="123 456 789"
                  value={form.siren}
                  onChange={(e) => setForm(prev => ({ ...prev, siren: e.target.value }))}
                />
                <Input
                  label="Notes"
                  placeholder="Notes internes"
                  value={form.notes}
                  onChange={(e) => setForm(prev => ({ ...prev, notes: e.target.value }))}
                />
              </div>
            </div>

            {createError && (
              <p className="mt-3 text-sm text-red-600">{createError}</p>
            )}

            <div className="flex justify-end gap-3 mt-6">
              <Button
                variant="outline"
                onClick={() => { setShowModal(false); setCreateError('') }}
              >
                Annuler
              </Button>
              <Button
                loading={creating}
                icon={<Plus className="w-4 h-4" />}
                onClick={() => void handleCreate()}
              >
                Creer le client
              </Button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  )
}
