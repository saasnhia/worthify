'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { useTVADeclarations } from '@/hooks/useTVADeclarations'
import { Card, Button } from '@/components/ui'
import { TVAStatusBadge } from '@/components/tva/TVAStatusBadge'
import { Plus, FileText, Calendar, Euro, Loader2 } from 'lucide-react'
import { toast } from 'react-hot-toast'

export default function TVADashboardPage() {
  const { user } = useAuth()
  const { declarations, loading } = useTVADeclarations(user?.id)

  // Stats
  const stats = {
    total: declarations.length,
    brouillons: declarations.filter(d => d.statut === 'brouillon').length,
    envoyees: declarations.filter(d => d.statut === 'envoyee').length,
    montantTotal: declarations
      .filter(d => d.statut !== 'brouillon')
      .reduce((sum, d) => sum + d.tva_nette, 0),
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-navy-900">
            Déclarations TVA
          </h1>
          <p className="text-sm text-navy-500 mt-1">
            Gérez vos déclarations CA3 automatiquement
          </p>
        </div>
        <Link href="/tva/nouvelle-declaration">
          <Button icon={<Plus className="w-4 h-4" />}>Nouvelle déclaration</Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-2xl font-bold text-navy-900">{stats.total}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-navy-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-navy-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Brouillons</p>
              <p className="text-2xl font-bold text-navy-900">{stats.brouillons}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Envoyées</p>
              <p className="text-2xl font-bold text-navy-900">{stats.envoyees}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gold-100 rounded-lg flex items-center justify-center">
              <Euro className="w-5 h-5 text-gold-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">TVA Payée</p>
              <p className="text-2xl font-bold text-navy-900">
                {stats.montantTotal.toFixed(0)}€
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Declarations List */}
      {declarations.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-navy-900 mb-2">
              Aucune déclaration TVA
            </h3>
            <p className="text-sm text-navy-500 mb-6">
              Créez votre première déclaration CA3 automatiquement
            </p>
            <Link href="/tva/nouvelle-declaration">
              <Button icon={<Plus className="w-4 h-4" />}>Créer une déclaration</Button>
            </Link>
          </div>
        </Card>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-800">
                    Période
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-800">
                    Régime
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-gray-800">
                    TVA Collectée
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-gray-800">
                    TVA Déductible
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-gray-800">
                    TVA Nette
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wider text-gray-800">
                    Statut
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-gray-800">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {declarations.map((decl, idx) => (
                  <tr key={decl.id} className={`border-b border-gray-100 hover:bg-amber-50 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                      {new Date(decl.periode_debut).toLocaleDateString('fr-FR', {
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-700">
                      {decl.regime === 'reel_normal' ? 'Réel normal' : 'Réel simplifié'}
                    </td>
                    <td className="px-6 py-4 text-sm text-right font-mono font-semibold text-emerald-700 tabular-nums">
                      +{decl.tva_collectee.toFixed(2)} €
                    </td>
                    <td className="px-6 py-4 text-sm text-right font-mono font-semibold text-rose-700 tabular-nums">
                      -{decl.tva_deductible.toFixed(2)} €
                    </td>
                    <td className="px-6 py-4 text-sm text-right font-mono font-bold text-gray-900 tabular-nums">
                      {decl.tva_nette.toFixed(2)} €
                    </td>
                    <td className="px-6 py-4 text-center">
                      <TVAStatusBadge statut={decl.statut} size="sm" />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link href={`/tva/ca3/${decl.id}`}>
                        <Button variant="outline" size="sm">
                          Voir
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  )
}
