'use client'

import Link from 'next/link'
import { CheckCircle2, X } from 'lucide-react'

interface CompRow {
  label: string
  worthifast: boolean | string
  pennylane: boolean | string
  cegid: boolean | string
}

const ROWS: CompRow[] = [
  { label: 'Prix cabinet/mois', worthifast: '49€', pennylane: '79€ min', cegid: 'Sur devis' },
  { label: 'Tarif transparent', worthifast: true, pennylane: 'partial', cegid: false },
  { label: 'OCR factures IA', worthifast: true, pennylane: true, cegid: true },
  { label: 'Journal PCG auto', worthifast: true, pennylane: true, cegid: true },
  { label: 'IA française (Mistral)', worthifast: true, pennylane: false, cegid: false },
  { label: 'E-invoicing 2026', worthifast: true, pennylane: true, cegid: true },
  { label: 'Hébergé en France', worthifast: true, pennylane: true, cegid: true },
  { label: 'Essai gratuit', worthifast: '14 jours', pennylane: '14-30j', cegid: false },
  { label: 'Support', worthifast: '24h email', pennylane: '48h', cegid: '72h+' },
]

function CellValue({ value }: { value: boolean | string }) {
  if (value === true) return <CheckCircle2 className="w-5 h-5 text-emerald-500 mx-auto" />
  if (value === false) return <X className="w-5 h-5 text-slate-600 mx-auto" />
  if (value === 'partial') return <span className="text-xs font-medium text-amber-500">⚠️</span>
  return <span className="text-xs font-medium text-slate-300">{value}</span>
}

export function ComparatifSection() {
  return (
    <section id="comparatif" className="py-24 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">Pourquoi choisir Worthifast ?</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">Comparatif transparent avec les solutions existantes.</p>
        </div>

        <div className="bg-[#0F1117] border border-white/[0.08] rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.08]">
                  <th className="text-left px-6 py-4 font-semibold text-slate-400 w-48" />
                  <th className="text-center px-4 py-4 bg-[#1B3A6B]/20 border-x border-[#00A878]/20">
                    <span className="block text-xs text-[#00A878] font-medium mb-1">Notre solution</span>
                    <span className="font-bold text-white">Worthifast</span>
                  </th>
                  <th className="text-center px-4 py-4 font-bold text-slate-500">Pennylane</th>
                  <th className="text-center px-4 py-4 font-bold text-slate-500">Cegid</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.05]">
                {ROWS.map(row => (
                  <tr key={row.label} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-3.5 text-slate-300">{row.label}</td>
                    <td className="px-4 py-3.5 text-center bg-[#1B3A6B]/10 border-x border-[#00A878]/10">
                      <CellValue value={row.worthifast} />
                    </td>
                    <td className="px-4 py-3.5 text-center"><CellValue value={row.pennylane} /></td>
                    <td className="px-4 py-3.5 text-center"><CellValue value={row.cegid} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <p className="text-xs text-slate-600 text-center mt-4">
          Comparatif indicatif — données publiques mars 2026. Prix Pennylane : pennylane.com/fr/tarifs
        </p>

        <div className="text-center mt-8">
          <Link href="/signup" className="inline-block bg-[#F59E0B] hover:bg-[#D97706] text-black font-semibold px-8 py-3.5 rounded-xl transition-colors">
            Tester Worthifast gratuitement →
          </Link>
        </div>
      </div>
    </section>
  )
}
