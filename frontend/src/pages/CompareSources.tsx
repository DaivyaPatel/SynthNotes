import React from 'react';
import { useSession } from '../context/SessionContext';
import { Scale, Layers, CheckCircle2, FileText, ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '../components/Button';
import { SourceBadge } from '../components/SourceBadge';

export const CompareSources: React.FC = () => {
  const { currentNotes, currentSession, setActiveNav } = useSession();

  const sources = currentSession?.sources || [];
  const contributions = currentNotes?.source_contributions || [];
  const terminology = currentNotes?.terminology_map || [];

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <button
            onClick={() => setActiveNav('home')}
            className="inline-flex items-center gap-1 text-xs font-semibold text-[#8A94A6] hover:text-[#2E2E2E] mb-1 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Dashboard</span>
          </button>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-[#2E2E2E]">Source Comparison &amp; Overlap</h1>
            <span className="font-mono text-xs px-2 py-0.5 rounded bg-[#EDF1EF] text-[#5B7C73] font-bold">
              Multi-Source Synthesis
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#5A5A5A] mt-0.5">
            Cross-document analysis showing terminology discrepancies, contribution weights, and unique concepts.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setActiveNav('notes')}
          icon={<ArrowRight className="w-3.5 h-3.5" />}
          iconPosition="right"
        >
          Return to Notes
        </Button>
      </div>

      {/* Grid of sources side by side */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {sources.map((src, idx) => {
          const contrib = contributions.find((c) => c.source_id === src.source_id);
          const percent = contrib?.percentage || Math.round(100 / sources.length);

          return (
            <div
              key={src.source_id}
              className="bg-white rounded-2xl border border-[#E4E7E2] p-5 shadow-xs space-y-4"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#EDF1EF] text-[#5B7C73] font-mono font-bold text-xs flex items-center justify-center">
                    {src.source_id}
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-[#2E2E2E] truncate max-w-[170px]" title={src.filename}>
                      {src.filename}
                    </h3>
                    <span className="text-[10px] text-[#8A94A6] uppercase">{src.type}</span>
                  </div>
                </div>
                <span className="font-mono text-xs font-bold text-[#5B7C73] bg-[#EDF1EF] px-2 py-0.5 rounded">
                  {percent}%
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded-lg bg-[#F8F9F7] border border-[#E4E7E2]">
                  <span className="text-[10px] font-semibold text-[#8A94A6] block uppercase tracking-wider">
                    Primary Academic Focus:
                  </span>
                  <span className="text-[#2E2E2E] font-medium mt-0.5 block">
                    {idx === 0
                      ? 'Theoretical mathematical proofs, bounds & asymptotic convergence'
                      : idx === 1
                      ? 'Practical implementation heuristics, step-size tuning & batching'
                      : 'Visual intuition, landscape geometry & architectural comparisons'}
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-[#F8F9F7] border border-[#E4E7E2]">
                  <span className="text-[10px] font-semibold text-[#8A94A6] block uppercase tracking-wider">
                    Preferred Terminology:
                  </span>
                  <span className="text-[#5B7C73] font-mono font-semibold text-[11px] mt-0.5 block">
                    {idx === 0 ? 'Steepest Descent, Cost Function J(θ)' : idx === 1 ? 'Step Size α, Gradient Method' : 'First-Order Optimizer, Loss Surface'}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Cross-Document Terminology Matrix */}
      <div className="bg-white rounded-2xl border border-[#E4E7E2] p-6 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-[#2E2E2E]">
          Terminology Normalization Matrix
        </h3>
        <p className="text-xs text-[#5A5A5A]">
          How different authors refer to the identical conceptual mechanism:
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-[#E4E7E2] bg-[#F8F9F7]">
                <th className="p-3 font-bold text-[#2E2E2E]">Canonical Concept</th>
                {sources.map((s) => (
                  <th key={s.source_id} className="p-3 font-semibold text-[#5A5A5A]">
                    [{s.source_id}] {s.filename.split('_')[0]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E4E7E2]">
              {terminology.map((tm) => (
                <tr key={tm.id} className="hover:bg-[#F8F9F7]/60">
                  <td className="p-3 font-bold text-[#2E2E2E]">{tm.canonical}</td>
                  {sources.map((s) => {
                    const match = tm.variants.find((v) => v.source_id === s.source_id);
                    return (
                      <td key={s.source_id} className="p-3 font-mono text-[11px] text-[#5B7C73]">
                        {match ? `"${match.term}"` : '—'}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
