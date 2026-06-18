import React from "react";
import { SectionIllustration } from "../types";
import { 
  ArrowRight, 
  Check, 
  HelpCircle, 
  AlertTriangle, 
  Info, 
  Lightbulb, 
  Cpu, 
  BookOpen, 
  Layers, 
  GitCommit,
  CheckCircle,
  Sparkles
} from "lucide-react";

interface EducationalDiagramProps {
  illustration: SectionIllustration;
}

export default function EducationalDiagram({ illustration }: EducationalDiagramProps) {
  const { type, title, nodes, connections, comparisonColumns, steps } = illustration;

  // 1. FLOWCHART RENDERER
  const renderFlowchart = () => {
    if (!nodes || nodes.length === 0) return null;
    return (
      <div className="flex flex-col items-center gap-4 py-4 w-full">
        <div className="flex flex-wrap items-center justify-center gap-4 w-full">
          {nodes.map((node, idx) => {
            let style = "bg-slate-50 border-slate-200 text-slate-800";
            let IconComp = Info;

            if (node.type === "start") {
              style = "bg-indigo-50 border-indigo-200 text-indigo-900 font-semibold ring-2 ring-indigo-100";
              IconComp = BookOpen;
            } else if (node.type === "decision") {
              style = "bg-amber-50 border-amber-300 text-amber-900 font-bold rotate-0 rounded-2xl ring-2 ring-amber-100";
              IconComp = HelpCircle;
            } else if (node.type === "alert") {
              style = "bg-rose-50 border-rose-200 text-rose-900 font-semibold";
              IconComp = AlertTriangle;
            } else if (node.type === "info") {
              style = "bg-emerald-50 border-emerald-200 text-emerald-900";
              IconComp = Lightbulb;
            }

            return (
              <React.Fragment key={node.id}>
                <div className={`flex flex-col p-4 rounded-xl border max-w-xs shadow-sm transition-all hover:shadow-md ${style}`}>
                  <div className="flex items-center gap-2 mb-1.5">
                    <IconComp className="w-4 h-4 shrink-0 opacity-80" />
                    <span className="font-sans text-xs font-bold uppercase tracking-wider">
                      {node.type || "Etapa"}
                    </span>
                  </div>
                  <h5 className="font-sans font-bold text-sm leading-tight">{node.label}</h5>
                  {node.description && (
                    <p className="font-sans text-xs opacity-80 mt-1 leading-relaxed">
                      {node.description}
                    </p>
                  )}
                </div>

                {/* Show connection arrow to next if not last and no custom connections */}
                {idx < nodes.length - 1 && (!connections || connections.length === 0) && (
                  <div className="flex items-center text-slate-300 animate-pulse shrink-0">
                    <ArrowRight className="w-5 h-5" />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Custom complex connections description list if any */}
        {connections && connections.length > 0 && (
          <div className="mt-4 w-full border-t border-slate-100 pt-3">
            <span className="text-[10px] uppercase font-bold text-slate-400 font-sans tracking-widest block mb-2">Fluxo de Relações</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-sans text-slate-600">
              {connections.map((conn, cIdx) => {
                const fromNode = nodes.find(n => n.id === conn.from);
                const toNode = nodes.find(n => n.id === conn.to);
                if (!fromNode || !toNode) return null;
                return (
                  <div key={cIdx} className="bg-slate-50/50 p-2 rounded-lg border border-slate-100 flex items-center gap-2">
                    <span className="font-semibold text-slate-800">{fromNode.label}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="font-semibold text-indigo-700">{toNode.label}</span>
                    {conn.label && (
                      <span className="text-[10px] bg-slate-200/60 text-slate-500 px-1.5 py-0.2 rounded-full font-serif font-medium ml-auto">
                        {conn.label}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  };

  // 2. COMPARISON RENDERER
  const renderComparison = () => {
    if (!comparisonColumns || comparisonColumns.length === 0) return null;
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-2 w-full font-sans">
        {comparisonColumns.map((col, idx) => {
          const isAlternate = idx % 2 === 1;
          const bgHeader = isAlternate ? "bg-rose-50 text-rose-900 border-rose-100" : "bg-emerald-50 text-emerald-950 border-emerald-100";
          const bgDot = isAlternate ? "bg-rose-500" : "bg-emerald-500";
          const borderStyle = isAlternate ? "border-rose-100 hover:border-rose-200" : "border-emerald-100 hover:border-emerald-200";

          return (
            <div key={idx} className={`bg-white rounded-xl border shadow-sm overflow-hidden transition-all duration-300 ${borderStyle}`}>
              <div className={`px-4 py-3 border-b font-bold text-sm flex items-center justify-between ${bgHeader}`}>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${bgDot}`} />
                  <span>{col.columnTitle}</span>
                </div>
                {isAlternate ? (
                  <AlertTriangle className="w-4 h-4 opacity-80" />
                ) : (
                  <CheckCircle className="w-4 h-4 opacity-80" />
                )}
              </div>
              <ul className="divide-y divide-slate-100 px-4 py-2">
                {col.items.map((item, itemIdx) => (
                  <li key={itemIdx} className="py-2.5 flex items-start gap-2.5 text-xs text-slate-600 leading-relaxed font-sans">
                    <Check className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${isAlternate ? "text-rose-500" : "text-emerald-500"}`} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    );
  };

  // 3. MINDMAP RENDERER (Tree style leaf branching)
  const renderMindmap = () => {
    if (!nodes || nodes.length === 0) return null;
    const centralNode = nodes[0];
    const branchNodes = nodes.slice(1);

    return (
      <div className="flex flex-col items-center py-4 w-full font-sans">
        {/* Central Core */}
        <div className="bg-indigo-600 text-white rounded-2xl px-6 py-3.5 text-center shadow-lg max-w-sm border border-indigo-700 ring-4 ring-indigo-50 z-10">
          <span className="text-[10px] font-bold text-indigo-200 uppercase tracking-wider block mb-1">Conceito Central</span>
          <h4 className="font-bold text-sm leading-tight">{centralNode.label}</h4>
          {centralNode.description && (
            <p className="text-[11px] opacity-90 mt-1">{centralNode.description}</p>
          )}
        </div>

        {/* Tree Connective lines placeholder or spacer */}
        {branchNodes.length > 0 && (
          <div className="w-0.5 h-6 bg-indigo-200 animate-pulse" />
        )}

        {/* Branches */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full relative">
          {branchNodes.map((node, idx) => {
            const colors = [
              "border-sky-200 bg-sky-50 text-sky-900",
              "border-emerald-200 bg-emerald-50 text-emerald-900",
              "border-violet-200 bg-violet-50 text-violet-900",
              "border-amber-200 bg-amber-50 text-amber-900",
              "border-rose-200 bg-rose-50 text-rose-900",
            ];
            const colorClass = colors[idx % colors.length];

            return (
              <div key={node.id} className={`p-4 rounded-xl border shadow-sm relative flex flex-col justify-between ${colorClass}`}>
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[9px] font-bold uppercase opacity-75">Ramificação {idx + 1}</span>
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-ping" />
                  </div>
                  <h5 className="font-bold text-xs leading-snug">{node.label}</h5>
                  {node.description && (
                    <p className="text-xs opacity-80 mt-1 leading-relaxed">{node.description}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // 4. TIMELINE RENDERER
  const renderTimeline = () => {
    if (!steps || steps.length === 0) return null;
    return (
      <div className="relative border-l-2 border-slate-200 pl-6 ml-4 py-2 space-y-6 font-sans">
        {steps.map((st, idx) => {
          const stepNum = st.stepNumber || (idx + 1);
          return (
            <div key={idx} className="relative group">
              {/* Colored outer ring indicator */}
              <div className={`absolute -left-[35px] top-0 w-6 h-6 rounded-full border bg-white flex items-center justify-center text-xs font-bold font-mono transition-transform group-hover:scale-110 shadow-sm ${
                st.alert 
                  ? "border-rose-400 text-rose-600 bg-rose-50" 
                  : "border-indigo-400 text-indigo-600 bg-indigo-50"
              }`}>
                {stepNum}
              </div>

              <div className={`p-4 rounded-xl border shadow-sm transition-all ${
                st.alert 
                  ? "bg-rose-50/40 border-rose-100" 
                  : "bg-slate-50/50 border-slate-100 hover:border-slate-200"
              }`}>
                <h5 className="font-bold text-sm text-slate-800 flex items-center gap-2">
                  <span>{st.title}</span>
                  {st.alert && (
                    <span className="bg-rose-100 text-rose-700 text-[9px] px-1.5 py-0.2 rounded uppercase font-bold tracking-wider">
                      Cuidado / Alerta
                    </span>
                  )}
                </h5>
                <p className="text-slate-600 text-xs mt-1.5 leading-relaxed">
                  {st.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // 5. CHEATSHEET / GRID OF CARDS
  const renderCheatsheet = () => {
    if (!comparisonColumns || comparisonColumns.length === 0) return null;
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 py-2 font-sans">
        {comparisonColumns.map((card, idx) => {
          const colors = [
            "border-amber-200 border-t-4 border-t-amber-500",
            "border-blue-200 border-t-4 border-t-blue-500",
            "border-emerald-200 border-t-4 border-t-emerald-500",
            "border-indigo-200 border-t-4 border-t-indigo-500",
            "border-purple-200 border-t-4 border-t-purple-500",
          ];
          const colorClass = colors[idx % colors.length];

          return (
            <div key={idx} className={`bg-slate-50/30 rounded-xl border p-4 shadow-sm hover:shadow transition-all ${colorClass}`}>
              <h5 className="font-black text-xs uppercase text-slate-800 tracking-wider mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span>{card.columnTitle}</span>
              </h5>
              <div className="space-y-1.5 font-sans">
                {card.items.map((item, itemIdx) => (
                  <p key={itemIdx} className="text-xs text-slate-600 leading-relaxed pl-3 border-l border-slate-200">
                    {item}
                  </p>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="my-6 p-5 md:p-6 bg-gradient-to-br from-indigo-50/30 to-slate-50/40 rounded-2xl border border-indigo-100/60 shadow-sm print-card-break relative overflow-hidden">
      {/* Visual background decorations */}
      <div className="absolute right-0 top-0 w-24 h-24 bg-gradient-to-bl from-indigo-200/10 to-transparent rounded-full pointer-events-none" />
      <div className="absolute left-10 bottom-0 w-16 h-16 bg-gradient-to-tr from-blue-200/10 to-transparent rounded-full pointer-events-none" />

      {/* Diagram Heading */}
      <div className="flex items-center justify-between border-b border-indigo-100/60 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-100 text-indigo-700 p-1.5 rounded-lg">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-sans font-black text-sm text-slate-800 uppercase tracking-wider">{title}</h4>
            <span className="text-[10px] font-sans text-slate-400 capitalize">Esquema Ilustrado • Formato {type}</span>
          </div>
        </div>
        <span className="text-[10px] font-mono font-bold bg-indigo-50 text-indigo-600 border border-indigo-100 px-2 py-0.5 rounded-full uppercase">
          Didático
        </span>
      </div>

      {/* Render according to diagram type */}
      <div className="w-full">
        {type === "flowchart" && renderFlowchart()}
        {type === "comparison" && renderComparison()}
        {type === "mindmap" && renderMindmap()}
        {type === "timeline" && renderTimeline()}
        {type === "cheatsheet" && renderCheatsheet()}
      </div>
    </div>
  );
}
