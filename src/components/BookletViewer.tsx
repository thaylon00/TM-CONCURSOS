import React, { useState } from "react";
import { ExamBooklet } from "../types";
import { Download, Eye, EyeOff, BookOpen, AlertCircle, HelpCircle, CheckCircle, XCircle, Printer } from "lucide-react";
import MarkdownFormatter from "./MarkdownFormatter";
import EducationalDiagram from "./EducationalDiagram";

interface BookletViewerProps {
  booklet: ExamBooklet;
}

export default function BookletViewer({ booklet }: BookletViewerProps) {
  // Option selections for the 5 questions (keys are question numbers e.g. 1, 2, 3, 4, 5)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [showExplanations, setShowExplanations] = useState(false);

  const handleSelectOption = (questionNum: number, idx: number) => {
    if (submitted) return; // Prevent changing after submission
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionNum]: idx,
    }));
  };

  const handleSubmitQuiz = () => {
    setSubmitted(true);
    setShowExplanations(true);
  };

  const handleResetQuiz = () => {
    setSelectedAnswers({});
    setSubmitted(false);
    setShowExplanations(false);
  };

  const correctCount = booklet.questions.reduce((count, q) => {
    const selected = selectedAnswers[q.number];
    if (selected === q.correctOptionIndex) {
      return count + 1;
    }
    return count;
  }, 0);

  const triggerPrint = () => {
    window.print();
  };

  const letters = ["A", "B", "C", "D", "E"];

  return (
    <div className="flex flex-col gap-6 w-full animate-fade-in">
      {/* Viewer Actions and Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print border-b border-slate-200 pb-4">
        <div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700">
            Material Disponibilizado
          </span>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Prévia Interativa e Impressão</h3>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowExplanations(!showExplanations)}
            className="flex items-center gap-2 px-3.5 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-medium cursor-pointer transition-all"
          >
            {showExplanations ? <EyeOff className="w-3.5 h-3.5 text-slate-500" /> : <Eye className="w-3.5 h-3.5 text-indigo-600" />}
            {showExplanations ? "Esconder Gabaritos" : "Exibir Gabaritos"}
          </button>
          
          <button
            onClick={triggerPrint}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2.5 rounded-lg transition-all shadow-md shadow-indigo-100 flex items-center justify-center gap-2 text-xs cursor-pointer animate-pulse"
          >
            <Printer className="w-3.5 h-3.5" />
            ABRIR APOSTILA (PDF)
          </button>
        </div>
      </div>

      {/* Actual booklet content formatted as a real premium PDF doc */}
      <div id="print-section" className="bg-white rounded-2xl border border-slate-200 shadow-xl p-6 md:p-12 font-serif text-slate-800 relative transition-transform duration-300">
        
        {/* PDF Header Stripe */}
        <div className="border-b-[3px] border-slate-900 pb-6 mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-indigo-600 font-bold uppercase tracking-wider mb-2 font-sans">
              <span>Curso Preparatório Exclusivo</span>
              <span className="text-slate-300">•</span>
              <span>Banca {booklet.banca}</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold font-sans text-slate-900 tracking-tight leading-tight">
              {booklet.title}
            </h1>
            <p className="text-slate-500 text-xs mt-2 italic font-sans">
              Tema original solicitado: <span className="font-semibold text-slate-700">{booklet.theme}</span> | Dificuldade: {booklet.difficulty}
            </p>
          </div>
          <div className="shrink-0 text-left md:text-right font-sans text-xs text-slate-400 border-t md:border-t-0 pt-4 md:pt-0 border-slate-100">
            <p className="font-semibold text-slate-700">Apostila Digital Nº {booklet.id}</p>
            <p>Gerado em: {new Date(booklet.createdAt).toLocaleDateString("pt-BR")}</p>
          </div>
        </div>

        {/* Guia / Resumo Geral */}
        {booklet.summary && (
          <div className="bg-slate-50 rounded-xl p-5 border border-slate-200/60 mb-8 font-sans">
            <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-indigo-600 shrink-0" />
              Orientação Pedagógica / Análise da Banca
            </h4>
            <p className="text-slate-600 text-sm leading-relaxed">
              {booklet.summary}
            </p>
          </div>
        )}

        {/* Dynamic Study Sections */}
        <div className="space-y-10">
          {booklet.sections.map((sec, idx) => (
            <div key={idx} className="print-card-break">
              <h2 className="text-xl md:text-2xl font-bold font-sans text-slate-900 border-b border-slate-100 pb-2 mb-4 flex items-center gap-2">
                <span className="text-indigo-600 font-mono text-lg font-semibold bg-indigo-50 px-2.5 py-0.5 rounded">Tópico 0{idx + 1}</span>
                <span>{sec.title}</span>
              </h2>
              <div className="pl-0 md:pl-2">
                <MarkdownFormatter text={sec.content} />
              </div>
              
              {/* Educational diagram for visual learning */}
              {sec.illustration && (
                <div className="no-print-diagram-break pl-0 md:pl-2">
                  <EducationalDiagram illustration={sec.illustration} />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Interactive Questions Section */}
        <div className="mt-14 pt-10 border-t-2 border-slate-200 print-page-break print-card-break">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-bold font-sans text-slate-900 flex items-center gap-2">
                <HelpCircle className="w-6 h-6 text-indigo-600" />
                Questões Gabaritadas de Fixação
              </h2>
              <p className="text-slate-500 font-sans text-xs mt-1">
                Coloque em prática o conhecimento assimilado acima. Simulando a abordagem real da banca {booklet.banca}.
              </p>
            </div>

            {/* Score HUD */}
            {submitted && (
              <div className="no-print bg-slate-50 border border-slate-200 rounded-xl px-5 py-3 flex items-center gap-3 font-sans shrink-0">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${
                  correctCount === 5 ? "bg-emerald-100 text-emerald-700" :
                  correctCount >= 3 ? "bg-blue-100 text-blue-700" : "bg-amber-100 text-amber-700"
                }`}>
                  {correctCount}/5
                </div>
                <div>
                  <h5 className="font-bold text-sm text-slate-800">Resultado do Simulado</h5>
                  <p className="text-xs text-slate-500">
                    {correctCount === 5 ? "Excelente! Domínio completo." :
                     correctCount >= 3 ? "Bom desempenho! Revise os erros." : "Recomendamos ler a teoria novamente."}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-8">
            {booklet.questions.map((q, questIdx) => {
              const questionKey = q.number || (questIdx + 1);
              const isCorrectAnswer = selectedAnswers[questionKey] === q.correctOptionIndex;
              const hasAnswered = selectedAnswers[questionKey] !== undefined;

              return (
                <div key={questIdx} className="bg-slate-50/50 border border-slate-200 rounded-2xl p-5 md:p-6 print-card-break shadow-sm hover:border-slate-300 transition-all">
                  <div className="flex items-start gap-3">
                    <span className="bg-slate-900 text-white font-mono font-bold text-xs px-2.5 py-1 rounded mt-0.5 shrink-0">
                      Questão {questionKey}
                    </span>
                    <div className="space-y-4 w-full">
                      <p className="font-serif text-slate-800 text-base md:text-lg leading-relaxed font-medium">
                        {q.context}
                      </p>

                      {/* Display Radio Options */}
                      <div className="space-y-2.5 font-sans">
                        {q.options.map((opt, optIdx) => {
                          const optionLetter = letters[optIdx];
                          const isSelected = selectedAnswers[questionKey] === optIdx;
                          const showCorrectStyle = submitted && optIdx === q.correctOptionIndex;
                          const showWrongStyle = submitted && isSelected && !isCorrectAnswer;

                          let containerStyle = "border-slate-200 bg-white hover:bg-slate-100/70";
                          let badgeStyle = "bg-slate-100 text-slate-700 group-hover:bg-slate-200";

                          if (submitted) {
                            if (showCorrectStyle) {
                              containerStyle = "border-emerald-500 bg-emerald-50/70 text-emerald-900";
                              badgeStyle = "bg-emerald-500 text-white";
                            } else if (showWrongStyle) {
                              containerStyle = "border-red-500 bg-red-50/70 text-red-900";
                              badgeStyle = "bg-red-500 text-white";
                            } else {
                              containerStyle = "border-slate-200 bg-white/50 opacity-60";
                            }
                          } else if (isSelected) {
                            containerStyle = "border-indigo-600 bg-indigo-50 text-indigo-900 ring-1 ring-indigo-600";
                            badgeStyle = "bg-indigo-600 text-white";
                          }

                          return (
                            <button
                              key={optIdx}
                              type="button"
                              disabled={submitted}
                              onClick={() => handleSelectOption(questionKey, optIdx)}
                              className={`w-full group text-left px-4 py-3 rounded-xl border text-sm transition-all duration-200 flex items-start gap-3 ${
                                !submitted ? "cursor-pointer" : "cursor-default"
                              } ${containerStyle}`}
                            >
                              <span className={`w-6 h-6 rounded-lg text-xs font-bold font-mono flex items-center justify-center shrink-0 transition-colors ${badgeStyle}`}>
                                {optionLetter}
                              </span>
                              <span className="leading-relaxed leading-6 flex-1">{opt}</span>
                              {submitted && showCorrectStyle && <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 self-center" />}
                              {submitted && showWrongStyle && <XCircle className="w-5 h-5 text-red-600 shrink-0 self-center" />}
                            </button>
                          );
                        })}
                      </div>

                      {/* Commented response explanation */}
                      {showExplanations && (
                        <div className="bg-indigo-50/60 border-l-4 border-indigo-500 p-4 rounded-r-xl mt-4 font-sans text-sm animate-fade-in print-card-break">
                          <h5 className="font-bold text-indigo-900 flex items-center gap-1.5 mb-2">
                            <BookOpen className="w-4 h-4 text-indigo-700 shrink-0" />
                            Gabarito Comentado Oficial (Alternativa {letters[q.correctOptionIndex]} correta)
                          </h5>
                          <div className="text-slate-700 leading-relaxed space-y-2 whitespace-pre-line text-xs md:text-sm">
                            {q.explanation}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Submit simulation controls */}
          <div className="no-print mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 py-4 border-t border-slate-100 font-sans">
            <p className="text-xs text-slate-400">
              {submitted ? "Você concluiu o simulado! Confira acima as explicações de todas as alternativas." : "Marque suas respostas acima e valide seu nível."}
            </p>
            <div className="flex items-center gap-3">
              {submitted ? (
                <button
                  onClick={handleResetQuiz}
                  className="px-5 py-2.5 border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold rounded-xl text-xs transition-all cursor-pointer"
                >
                  Refazer Questões
                </button>
              ) : (
                <button
                  onClick={handleSubmitQuiz}
                  disabled={Object.keys(selectedAnswers).length === 0}
                  className={`px-6 py-2.5 font-semibold rounded-xl text-xs transition-all ${
                    Object.keys(selectedAnswers).length > 0
                      ? "bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer shadow-md shadow-indigo-100"
                      : "bg-slate-100 text-slate-400 cursor-not-allowed"
                  }`}
                >
                  Corrigir Respostas
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Watermarked stamp footer for print */}
        <div className="mt-16 pt-6 border-t border-slate-200 flex items-center justify-between font-sans text-[10px] text-slate-400">
          <span>Apostila Completa Gerada de Acordo com Edital e Banca via TM CONCURSOS</span>
          <span className="text-slate-300">Página 1 de 2 • Material para Uso Pessoal</span>
        </div>
      </div>
    </div>
  );
}
