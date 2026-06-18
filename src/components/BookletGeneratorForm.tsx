import React, { useState, useEffect } from "react";
import { BookOpen, Server, HelpCircle, CheckCircle } from "lucide-react";
import { GenerationRequest } from "../types";

interface BookletGeneratorFormProps {
  onSubmit: (data: GenerationRequest) => void;
  isLoading: boolean;
}



const LOADING_TIPS = [
  "Pesquisando o histórico pedagógico do tema em provas de concurso...",
  "Analisando pegadinhas recorrentes utilizadas pelas bancas organizadoras...",
  "Redigindo conteúdo teórico explicativo de alto rendimento...",
  "Configurando mnemônicos funcionais para memorização veloz...",
  "Estruturando 5 questões simuladas no modelo exato das provas reais...",
  "Produzindo gabaritos ricamente detalhados para cada uma das alternativas...",
  "Quase pronto! Organizando as seções e aplicando o estilo editorial oficial...",
];

export default function BookletGeneratorForm({ onSubmit, isLoading }: BookletGeneratorFormProps) {
  const [theme, setTheme] = useState("");
  const [banca, setBanca] = useState("FGV");
  const [difficulty, setDifficulty] = useState("Intermediário (Médio / Superior)");
  const [tone, setTone] = useState("Super Explicativo e Didático");
  const [loadingTipIdx, setLoadingTipIdx] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isLoading) {
      setLoadingTipIdx(0);
      timer = setInterval(() => {
        setLoadingTipIdx((prev) => (prev + 1) % LOADING_TIPS.length);
      }, 3500);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!theme.trim()) return;
    onSubmit({ theme: theme.trim(), banca, difficulty, tone });
  };



  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6 md:p-8 max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-blue-50 text-blue-600 p-3 rounded-xl">
          <BookOpen className="w-6 h-6" />
        </div>
        <div>
          <h2 className="font-sans font-bold text-xl text-slate-800">Nova Apostila de Estudo</h2>
          <p className="text-slate-500 text-sm">Inscreva a matéria desejada e formularemos a apostila completa com teoria e questões de fixação.</p>
        </div>
      </div>

      {!isLoading ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Theme Input */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Tema ou Assunto da Apostila <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              placeholder="Ex: Direito Administrativo - Poderes da Administração, Português - Crase, Informática - Redes..."
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50/50 transition-all font-sans text-slate-800 placeholder-slate-400"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Board Selection */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Banca de Estudo
              </label>
              <select
                value={banca}
                onChange={(e) => setBanca(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-slate-800 text-sm"
              >
                <option value="FGV">FGV (Mais Explicativo)</option>
                <option value="Cebraspe">Cebraspe / CESPE</option>
                <option value="FCC">FCC (Fundação Carlos Chagas)</option>
                <option value="Cesgranrio">Cesgranrio</option>
                <option value="Vunesp">Vunesp</option>
                <option value="ENEM">ENEM (Exame Nacional do Ensino Médio)</option>
                <option value="Geral / Misto">Geral / Sem banca definida</option>
              </select>
            </div>

            {/* Difficulty Selection */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Nível de Dificuldade
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-slate-800 text-sm"
              >
                <option value="Iniciante / Intermediário (Basico / Médio)">Iniciante / Técnico</option>
                <option value="Intermediário (Médio / Superior)">Intermediário (Analista)</option>
                <option value="Aprofundado / Avançado (Juiz / Promotor / Auditor)">Dificuldade Alta (Magistratura)</option>
              </select>
            </div>

            {/* Tone Selection */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Metodologia / Tom de Voz
              </label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-slate-800 text-sm"
              >
                <option value="Super Explicativo e Didático">Super Explicativo & Didático</option>
                <option value="Focado em Macetes de Memorização e Pegadinhas">Foco em Bizus e Mnemônicos</option>
                <option value="Direto ao Ponto e Pragmático">Lei Seca & Direto na Prática</option>
              </select>
            </div>
          </div>



          {/* Prompt warning & Submit */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <span className="text-xs text-slate-400 max-w-md">
              A apostila gerada trará teoria, resumos esquematizados e ao final, 5 questões autorais comentadas segundo a banca escolhida.
            </span>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold font-sans px-6 py-3 rounded-xl shadow-lg shadow-blue-500/15 hover:shadow-blue-500/25 transition-all text-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <BookOpen className="w-4 h-4" />
              Gerar Apostila Completa
            </button>
          </div>
        </form>
      ) : (
        <div className="py-12 px-4 flex flex-col items-center text-center">
          {/* Animated Spinner with multiple bouncing pulses */}
          <div className="relative mb-6">
            <div className="w-16 h-16 border-4 border-blue-500/10 border-t-blue-600 rounded-full animate-spin"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-b-amber-500 rounded-full animate-[spin_2s_linear_infinite]"></div>
          </div>

          <h3 className="font-sans font-bold text-lg text-slate-800 mb-2">Elaborando sua Apostila Personalizada</h3>
          
          <div className="max-w-md min-h-[4rem] text-sm text-blue-600 font-medium px-4 py-2 border border-blue-100 bg-blue-50/30 rounded-xl flex items-center justify-center transition-all duration-300">
            <div className="animate-pulse text-center">
              {LOADING_TIPS[loadingTipIdx]}
            </div>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4 max-w-sm w-full text-xs text-slate-400 font-sans">
            <div className="flex items-center gap-1 bg-slate-50 px-3 py-2 rounded-lg">
              <Server className="w-3.5 h-3.5 text-blue-500 shrink-0" />
              <span>Diretrizes Oficiais de Bancas</span>
            </div>
            <div className="flex items-center gap-1 bg-slate-50 px-3 py-2 rounded-lg">
              <CheckCircle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span>5 Questões de Fixação</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
