/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  BookOpen, 
  Sparkles, 
  Search, 
  History, 
  FileText, 
  Trash2, 
  Settings, 
  BookMarked,
  Printer,
  ChevronRight,
  Info,
  Layers,
  GraduationCap,
  CheckCircle
} from "lucide-react";
import { ExamBooklet, GenerationRequest } from "./types";
import BookletGeneratorForm from "./components/BookletGeneratorForm";
import BookletViewer from "./components/BookletViewer";

// Initial premium preset booklet so the app doesn't start blank! This gives a wonderful user experience.
const PRESET_BOOKLET: ExamBooklet = {
  id: "bk-inicial",
  theme: "Português - Emprego da Crase",
  banca: "FGV",
  difficulty: "Intermediário (Médio / Superior)",
  tone: "Super Explicativo e Didático",
  title: "Manual Prático de Emprego da Crase para Concursos (Foco FGV)",
  summary: "A crase costuma ser o calcanhar de Aquiles em provas da FGV. A banca preza não apenas pela memorização mecânica, mas pela compreensão sintática da preposição exigida pelo termo regente e do artigo exigido pelo termo regido.",
  sections: [
    {
      title: "A Regra Geral da Crase: Fusão Perfeita",
      content: "A crase nada mais é do que a contração da preposição **'a'** (exigida por um nome ou verbo anterior) com o artigo feminino **'a'** ou **'as'** (que acompanha o termo seguinte) ou com os pronomes demonstrativos *aquele(s)*, *aquela(s)*, *aquilo*. \n\n**Fórmula Prática:**\nSe você puder substituir a palavra feminina por uma masculina e o **'a'** se transformar em **'ao'**, haverá crase!\n\n> Exemplo: Vou **à** escola / Vou **ao** colégio.\n\n🚨 **Atenção:** Nunca ocorre crase antes de palavras masculinas, verbos no infinitivo, pronomes de tratamento (exceto senhora, senhorita e dona) e pronomes indefinidos!",
      illustration: {
        type: "flowchart",
        title: "Fórmula Essencial da Crase",
        nodes: [
          { id: "term1", label: "Termo Regente", description: "Verbo ou nome exige Preposição 'A' (Ex: Refiro-me)", type: "start" },
          { id: "term2", label: "Termo Regido", description: "Substantivo feminino aceita Artigo 'A(S)' (Ex: Diretora)", type: "info" },
          { id: "fusion", label: "Contração (Crase)", description: "Fusão Perfeita: Preposição + Artigo = À", type: "decision" }
        ],
        connections: [
          { from: "term1", to: "fusion", label: "+" },
          { from: "term2", to: "fusion", label: "+" }
        ]
      }
    },
    {
      title: "Casos Facultativos: Os Três Mosqueteiros",
      content: "Existem três situações clássicas em concursos públicos brasileiros em que o uso do acento grave é meramente facultativo. Decorar essa lista garante pontos rápidos na sua prova:\n1. Antes de nomes próprios femininos (Ex: Entreguei o livro a Maria / à Maria).\n2. Antes de pronomes possessivos femininos singulares (Ex: Refiro-me a minha irmã / à minha irmã).\n3. Após a preposição 'até' (Ex: Fomos até a praia / até à praia).\n\n💡 **Macete (Mnemônico):** Lembre-se do nome **'PRÓ-PO-ATÉ'** (Nome Próprio feminino, Possessivo feminino, preposição Até). Nesses casos, você escolhe se usa ou não!",
      illustration: {
        type: "comparison",
        title: "Análise Comparativa: Casos Facultativos",
        comparisonColumns: [
          {
            columnTitle: "Uso Facultativo (PRÓ-PO-ATÉ)",
            items: [
              "Nomes Próprios Femininos (Ex: Entreguei o livro a Maria / à Maria)",
              "Pronomes Possessivos Femininos Singulares (Ex: Refiro-me a minha irmã / à minha irmã)",
              "Após a Preposição 'Até' (Ex: Fomos até a praia / até à praia)"
            ]
          },
          {
            columnTitle: "Cuidado Com as Exceções (Proibido)",
            items: [
              "Antes de possessivos femininos posicionados no PLURAL sem artigo ('Falei a minhas tias')",
              "Antes de nomes de personalidades históricas ilustres sem preposição ('Prestei homenagem a Joana d'Arc')",
              "Depois de outras preposições genéricas ('Para a Diretoria', 'Perante a Juíza')"
            ]
          }
        ]
      }
    },
    {
      title: "As 'Pegadinhas' preferidas da FGV",
      content: "A Fundação Getulio Vargas adora criar cenários em que o artigo feminino está ausente. Cuidado com expressões de sentido genérico:\n\n* 'Refiro-me **a** discussões importantes' (discussões está no plural, o 'a' está no singular. Logo, é apenas preposição, **sem crase**).\n* 'Refiro-me **às** discussões importantes' (com crase, pois o 'as' indica que há artigo pluralizado definindo o substantivo).\n\n💡 **Bizu:** *A* no singular antes de palavra no plural, crase nem a pau!",
      illustration: {
        type: "cheatsheet",
        title: "Quadro Antitrapaça: Armadilhas Clássicas",
        comparisonColumns: [
          {
            columnTitle: "Regra Singular-Plural",
            items: [
              "'A' (singular) + Palavra no Plural = Crase Proibida de forma irrestrita.",
              "'Às' (plural) + Palavra no Plural = Crase Admitida se o termo regente exigir preposição."
            ]
          },
          {
            columnTitle: "Crases de Instrumento",
            items: [
              "Em geral, a banca FGV rejeita crase em instrumentos sem ambiguidade ('Escrever a mão', 'Matar a bala')."
            ]
          },
          {
            columnTitle: "Palavras Repetidas",
            items: [
              "Expressões com substantivos idênticos duplicados nunca levam acento grave ('Cara a cara', 'Dia a dia')."
            ]
          }
        ]
      }
    }
  ],
  questions: [
    {
      number: 1,
      context: "Assinale a alternativa em que o emprego do acento grave indicador de crase está incorreto:",
      options: [
        "A) O documento foi entregue diretamente à diretora do departamento.",
        "B) O candidato se referia a pessoas que não conheciam o edital.",
        "C) Após as análises, caminhamos até à entrada do tribunal.",
        "D) Peço silêncio à todos aqueles que desejam fazer o teste de redação.",
        "E) O documento foi enviado à minha estimada supervisora ontem de manhã."
      ],
      correctOptionIndex: 3,
      explanation: "A opção D está INCORRETA (gabarito) porque o termo 'todos' é um pronome indefinido masculino e plural. Não ocorre crase antes de pronomes indefinidos nem antes de termos masculinos.\n\nAnálise dos demais itens:\n- A: Correto. Quem entrega, entrega algo 'a' + 'a' diretora = à.\n- B: Correto. Não há crase aqui ('a' no singular diante de 'pessoas' no plural apenas preposição).\n- C: Correto. Facultativo após 'até'.\n- E: Correto. Facultativo diante de possessivo feminino singular ('minha')."
    },
    {
      number: 2,
      context: "Na frase 'Ele prestou informações valiosas ___ assessora de imprensa e ficou atento ___ todas as perguntas', as lacunas são preenchidas corretamente por:",
      options: [
        "A) à - à",
        "B) a - a",
        "C) à - a",
        "D) a - à",
        "E) às - à"
      ],
      correctOptionIndex: 2,
      explanation: "Gabarito: C.\n\nExplicação passo a passo:\n1. Na primeira lacuna: Quem presta informações, presta informações 'a' (preposição) + 'a' assessora (artigo). Portanto, temos o acento grave indicador de crase: **à**.\n2. Na segunda lacuna: 'fique atento' exige a preposição 'a'. Porém, a palavra seguinte é 'todas', pronome indefinido que repele o artigo feminino. Logo, temos apenas a preposição simples: **a**."
    },
    {
      number: 3,
      context: "O acento indicativo de crase é facultativo em todas as seguintes situações, EXCETO em:",
      options: [
        "A) Dirigi-me até a entrada principal da repartição.",
        "B) Ofereci ajuda à minha colega de equipe legislativa.",
        "C) Escreveu uma carta carinhosa à Joana durante a tarde.",
        "D) Chegamos à casa de meus pais no início do final de semana.",
        "E) Levou os relatórios finais até à recepção do andar."
      ],
      correctOptionIndex: 3,
      explanation: "Gabarito: D.\n\nNa alternativa D, a palavra 'casa' está especificada ('casa de meus pais'). Quando a palavra 'casa' (no sentido de lar, residência) vem acompanhada de termo modificador qualificativo, a crase é OBRIGATÓRIA caso haja preposição regente ('Chegamos à...'). Nos outros itens (A, B, C e E) temos os casos facultativos clássicos (preposição 'até', possessivo feminino singular e nome próprio feminino)."
    },
    {
      number: 4,
      context: "Assinale a frase em que a crase foi empregada corretamente por exigência de locução conjuntiva ou adverbial de base feminina:",
      options: [
        "A) Estávamos decididos à comprar todos os materiais do concurso.",
        "B) Sairemos às pressas logo após a divulgação oficial do resultado.",
        "C) O palestrante começou a falar sobre o edital exatamente às dez horas.",
        "D) O grupo seguiu a pé por toda a extensão da avenida principal.",
        "E) Respondeu à caneta azul conforme as regras gerais do exame."
      ],
      correctOptionIndex: 1,
      explanation: "Gabarito: B.\n\nA locução 'às pressas' é uma locução adverbial de modo de base feminina (pressas), o que exige obrigatoriamente o acento grave.\n\nNas demais alternativas:\n- A: Incorreto (antes de verbo comprar).\n- C: É indicação de hora exata, porém a pergunta pede especificamente adverbial de base feminina ligada a modo/tempo e não simples horas.\n- D: Incorreto (pé é palavra masculina).\n- E: Caneta é o instrumento, sendo o uso de crase de instrumento em geral preterido pelas bancas quando não houver ambiguidade."
    },
    {
      number: 5,
      context: "Analise: 'O governo se opõe ___ medidas de austeridade e visa ___ dar garantias ___ populações menos favorecidas'. Preenche corretamente as lacunas, respectivamente:",
      options: [
        "A) a - a - às",
        "B) às - à - as",
        "C) a - a - as",
        "D) às - a - às",
        "E) à - a - as"
      ],
      correctOptionIndex: 3,
      explanation: "Gabarito: D.\n\nAnálise:\n1. 'opõe-se' exige a preposição 'a'. Como 'medidas' está no plural, se tivéssemos apenas preposição seria 'a'. Se estivesse determinado por artigo seria 'às'. Olhando as opções, temos 'às' na primeira lacuna (indicando que foi determinado: 'opõe-se às medidas').\n2. 'visa' no sentido de pretender exige preposição 'a', mas o termo seguinte é o verbo no infinitivo 'dar'. Antes de verbo não ocorre crase. Logo, apenas 'a'.\n3. 'visa dar garantias' - garantias a alguém. 'populações' está determinado no plural, logo temos garantias 'a' + 'as' populações = **às populações**."
    }
  ],
  createdAt: "2026-06-18T06:50:58-07:00"
};

export default function App() {
  const [booklets, setBooklets] = useState<ExamBooklet[]>([]);
  const [currentBooklet, setCurrentBooklet] = useState<ExamBooklet | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"gerador" | "histórico" | "metodologia">("gerador");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Load booklet history on start
  useEffect(() => {
    const saved = localStorage.getItem("apostilas_concursos");
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as ExamBooklet[];
        setBooklets(parsed);
        if (parsed.length > 0) {
          setCurrentBooklet(parsed[0]);
        } else {
          // Fallback to beautiful preset
          setBooklets([PRESET_BOOKLET]);
          setCurrentBooklet(PRESET_BOOKLET);
        }
      } catch (e) {
        setBooklets([PRESET_BOOKLET]);
        setCurrentBooklet(PRESET_BOOKLET);
      }
    } else {
      setBooklets([PRESET_BOOKLET]);
      setCurrentBooklet(PRESET_BOOKLET);
      localStorage.setItem("apostilas_concursos", JSON.stringify([PRESET_BOOKLET]));
    }
  }, []);

  const handleGenerate = async (reqData: GenerationRequest) => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const response = await fetch("/api/generate-booklet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reqData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Houve uma falha na elaboração do material.");
      }

      const newBooklet = await response.json() as ExamBooklet;
      
      const updatedList = [newBooklet, ...booklets];
      setBooklets(updatedList);
      setCurrentBooklet(newBooklet);
      localStorage.setItem("apostilas_concursos", JSON.stringify(updatedList));
      
      // Go to gerador main tab to see it
      setActiveTab("gerador");
      setShowSuccessModal(true);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Erro de conexão com o servidor. Verifique se o backend está pronto.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBooklet = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = booklets.filter(b => b.id !== id);
    setBooklets(updated);
    localStorage.setItem("apostilas_concursos", JSON.stringify(updated));
    if (currentBooklet && currentBooklet.id === id) {
      setCurrentBooklet(updated.length > 0 ? updated[0] : null);
    }
  };

  const handleClearAllHistory = () => {
    if (window.confirm("Deseja realmente apagar todo o histórico de apostilas salvas?")) {
      setBooklets([]);
      setCurrentBooklet(null);
      localStorage.removeItem("apostilas_concursos");
    }
  };

  // Filter materials based on search query
  const filteredBooklets = booklets.filter(b => 
    b.theme.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (b.banca && b.banca.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-50 text-slate-800 font-sans antialiased overflow-x-hidden">
      
      {/* SIDEBAR */}
      <aside className="w-full md:w-72 bg-white border-b md:border-b-0 md:border-r border-slate-200 flex flex-col shrink-0 no-print">
        {/* Brand Header */}
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-md shadow-indigo-100">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <span className="font-sans font-black text-slate-800 text-xl tracking-tight">TM CONCURSOS</span>
              <p className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase">Concursos Públicos</p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="p-4 flex-1 flex flex-col gap-6">
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 mb-2">Menu Principal</p>
            <button
              onClick={() => setActiveTab("gerador")}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                activeTab === "gerador" 
                  ? "bg-indigo-50 text-indigo-700 font-bold" 
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 shrink-0 text-amber-500 animate-pulse" />
                <span>Nova Apostila</span>
              </div>
              <ChevronRight className="w-4 h-4 opacity-70" />
            </button>

            <button
              onClick={() => setActiveTab("histórico")}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                activeTab === "histórico" 
                  ? "bg-indigo-50 text-indigo-700 font-bold" 
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <BookMarked className="w-4 h-4 shrink-0 text-indigo-500" />
                <span>Meus Materiais ({booklets.length})</span>
              </div>
              <ChevronRight className="w-4 h-4 opacity-70" />
            </button>

            <button
              onClick={() => setActiveTab("metodologia")}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                activeTab === "metodologia" 
                  ? "bg-indigo-50 text-indigo-700 font-bold" 
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <GraduationCap className="w-4 h-4 shrink-0 text-emerald-500" />
                <span>Guia de Estudos</span>
              </div>
              <ChevronRight className="w-4 h-4 opacity-70" />
            </button>
          </div>

          {/* Quick history list for easy swapping */}
          <div className="flex-1 flex flex-col min-h-[220px]">
            <div className="flex items-center justify-between px-3 mb-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Apostilas Salvas</span>
              {booklets.length > 0 && (
                <button 
                  onClick={handleClearAllHistory}
                  title="Limpar histórico"
                  className="text-slate-400 hover:text-red-500 transition-colors p-1 rounded hover:bg-slate-100 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {booklets.length === 0 ? (
              <div className="bg-slate-50 border border-dashed border-slate-200 rounded-xl p-4 text-center mt-1 flex-1 flex flex-col items-center justify-center">
                <FileText className="w-6 h-6 text-slate-300 mb-1" />
                <p className="text-[11px] text-slate-400">Nenhum material gerado ainda.</p>
              </div>
            ) : (
              <div className="space-y-1.5 overflow-y-auto max-h-[280px] pr-1 flex-1">
                {booklets.map((b) => (
                  <div
                    key={b.id}
                    onClick={() => {
                      setCurrentBooklet(b);
                      setActiveTab("gerador");
                    }}
                    className={`group w-full text-left px-3 py-2 rounded-xl text-xs transition-all cursor-pointer border flex flex-col justify-between ${
                      currentBooklet?.id === b.id 
                        ? "bg-slate-100/80 border-slate-200 text-slate-900 font-semibold" 
                        : "bg-white border-transparent hover:border-slate-100 text-slate-600"
                    }`}
                  >
                    <div className="flex items-start gap-1 justify-between">
                      <span className="truncate pr-1 block font-medium w-4/5">{b.theme}</span>
                      <button
                        onClick={(e) => handleDeleteBooklet(b.id, e)}
                        className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 p-0.5 rounded transition-all shrink-0 cursor-pointer"
                        title="Apagar material"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1">
                      <span className="bg-indigo-50/50 text-indigo-600 px-1 py-0.2 rounded font-semibold text-[9px] uppercase tracking-wider">{b.banca}</span>
                      <span>{new Date(b.createdAt).toLocaleDateString("pt-BR")}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Plan & Footer Badge Removed per user request */}
      </aside>

      {/* MAIN CONTAINER */}
      <main className="flex-1 flex flex-col min-h-screen">
        
        {/* HEADER */}
        <header className="h-16 bg-white border-b border-plat-200 px-6 md:px-8 flex items-center justify-between shrink-0 no-print">
          <div>
            <h2 className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-indigo-600" />
              <span>Painel de Criação de Apostilas</span>
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-xs font-semibold text-slate-700">Estudante Concurseiro</p>
              <p className="text-[10px] text-slate-400">Preparação 2026</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-blue-600 flex items-center justify-center text-white font-sans font-bold text-xs shadow-md">
              EC
            </div>
          </div>
        </header>

        {/* CONTAINER CONTENT */}
        <div className="p-4 md:p-8 flex-1 max-w-7xl w-full mx-auto space-y-8">
          
          {errorMsg && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-800 p-4 rounded-r-xl text-sm flex items-start gap-2.5 animate-fade-in no-print">
              <span className="text-lg">⚠️</span>
              <div className="flex-1">
                <h5 className="font-bold">Ocorreu um problema ao gerar</h5>
                <p>{errorMsg}</p>
                <button 
                  onClick={() => setErrorMsg(null)}
                  className="text-xs underline mt-2 text-red-900 block font-semibold cursor-pointer"
                >
                  Fechar Alerta
                </button>
              </div>
            </div>
          )}

          {/* DYNAMIC TAB CONTROLS */}
          {activeTab === "gerador" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Form & Expert tips Column */}
              <div className="lg:col-span-4 space-y-6 no-print">
                <div className="space-y-1.5">
                  <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">O que você quer estudar?</h1>
                  <p className="text-slate-500 text-sm">Inscreva qualquer assunto ou lei para estruturar sua apostila imediata.</p>
                </div>

                <BookletGeneratorForm onSubmit={handleGenerate} isLoading={loading} />

                {/* Pedagogy Widget */}
                <div className="bg-indigo-900 text-white p-5 rounded-2xl shadow-lg border border-indigo-950 flex gap-4 items-start">
                  <Info className="w-6 h-6 text-indigo-300 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-200">Metodologia Exclusiva</h4>
                    <p className="text-xs text-indigo-100/90 leading-relaxed">
                      Todas as apostilas geradas usam conceitos estritos das principais doutrinas administrativas, constitucionais e gramaticais atualizadas para 2026.
                    </p>
                  </div>
                </div>
              </div>

              {/* Viewer Output Column */}
              <div className="lg:col-span-8 flex flex-col h-full">
                {currentBooklet ? (
                  <BookletViewer booklet={currentBooklet} />
                ) : (
                  <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center flex flex-col items-center justify-center my-6 flex-1 min-h-[400px]">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 text-slate-400">
                      <BookOpen className="w-8 h-8" />
                    </div>
                    <h3 className="font-sans font-bold text-lg text-slate-800 mb-1">Crie sua primeira apostila de concurso</h3>
                    <p className="text-slate-500 text-sm max-w-md mx-auto mb-6">
                      Preencha os dados do formulário ao lado com o tema do seu interesse para ver o conteúdo esquematizado com as 5 questões autorais comentadas.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* HISTÓRICO TAB */}
          {activeTab === "histórico" && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 space-y-6 animate-fade-in no-print">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                <div>
                  <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    <BookMarked className="w-5.5 h-5.5 text-indigo-600" />
                    Biblioteca Completa de Apostilas
                  </h2>
                  <p className="text-slate-500 text-xs mt-0.5">Veja todas as apostilas que você já solicitou e gerou nesta máquina.</p>
                </div>
                
                {/* Search Bar */}
                <div className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Pesquisar por assunto..."
                    className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs bg-slate-50/50"
                  />
                </div>
              </div>

              {filteredBooklets.length === 0 ? (
                <div className="py-12 text-center text-slate-400 font-sans">
                  <p className="font-bold">Nenhuma apostila encontrada.</p>
                  <p className="text-xs text-slate-400 mt-1">Gere novos temas para começar a preencher sua biblioteca.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredBooklets.map((b) => (
                    <div 
                      key={b.id}
                      onClick={() => {
                        setCurrentBooklet(b);
                        setActiveTab("gerador");
                      }}
                      className="bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl p-5 shadow-sm transition-all flex flex-col justify-between cursor-pointer group"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="bg-indigo-50 text-indigo-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                            {b.banca}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {new Date(b.createdAt).toLocaleDateString("pt-BR")}
                          </span>
                        </div>
                        <h4 className="font-sans font-bold text-sm text-slate-850 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                          {b.title}
                        </h4>
                        <p className="text-slate-500 text-xs line-clamp-2 leading-relaxed">
                          {b.summary}
                        </p>
                      </div>

                      <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 font-sans">
                        <span>{b.sections.length} Tópicos teóricos</span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => handleDeleteBooklet(b.id, e)}
                            className="bg-red-50 hover:bg-red-100 text-red-600 p-1.5 rounded transition-all cursor-pointer"
                            title="Apagar permanente"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                          <span className="text-indigo-600 font-semibold group-hover:underline flex items-center gap-1">
                            Estudar <ChevronRight className="w-3 h-3" />
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* METHODOLOGY STUDY GUIDE TAB */}
          {activeTab === "metodologia" && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 space-y-8 animate-fade-in no-print max-w-4xl mx-auto">
              <div>
                <h2 className="text-2xl font-sans font-black text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                  <GraduationCap className="w-6.5 h-6.5 text-emerald-600" />
                  Guia Metodológico: Como estudar por Questões de Fixação?
                </h2>
                <p className="text-slate-500 text-sm mt-1">
                  Estudos de neurociência comprovam que a recuperação ativa de memória é o vetor principal para fixar conceitos difíceis.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-sans">
                <div className="bg-slate-50 border border-slate-100 p-5 rounded-xl space-y-2">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-xs">
                    01
                  </div>
                  <h4 className="font-bold text-sm text-slate-800">Leitura Atenta (Scanneamento)</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Não queira decorar tudo de primeira. Leia as seções teóricas criadas pelo nosso robô buscando as exceções de leis e os bizus mnemônicos sinalizados.
                  </p>
                </div>

                <div className="bg-slate-50 border border-slate-100 p-5 rounded-xl space-y-2">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-800 flex items-center justify-center font-bold text-xs">
                    02
                  </div>
                  <h4 className="font-bold text-sm text-slate-800">Forçar o Erro Saudável</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Ao responder as 5 questões inéditas, simule o estresse real da sala de aula: evite pesquisar a teoria de volta antes de clicar na alternativa final.
                  </p>
                </div>

                <div className="bg-slate-50 border border-slate-100 p-5 rounded-xl space-y-2">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-850 flex items-center justify-center font-bold text-xs">
                    03
                  </div>
                  <h4 className="font-bold text-sm text-slate-800">Análise de Distratores</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    O segredo supremo reside em ler os comentários exaustivos das resoluções. Entender por que as erradas estão erradas vale ouro.
                  </p>
                </div>
              </div>

              <div className="bg-amber-50/70 border-l-4 border-amber-500 p-5 rounded-r-xl font-sans text-xs md:text-sm text-slate-700 leading-relaxed">
                <h5 className="font-bold text-amber-900 mb-1 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-amber-600" />
                  Dica de mestre para redação e discursivas
                </h5>
                Todas as explicações teóricas geradas obedecem à grafia formal do Acordo Ortográfico vigente e citam explicitamente súmulas vinculantes do STF e STJ, bem como jurisprudências recorrentes, garantindo profundidade imediata para provas objetivas ou discursivas de alto nível.
              </div>
            </div>
          )}

        </div>

        {/* Global Footer (Visible everywhere) */}
        <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-400 mt-auto no-print">
          <p>© 2026 TM CONCURSOS. Todos os direitos reservados.</p>
          <p className="mt-1.5 text-slate-500">
            Criado por{" "}
            <a
              href="https://instagram.com/lthaylonl"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 hover:text-indigo-800 hover:underline font-semibold transition-colors"
            >
              @lthaylonl
            </a>
          </p>
        </footer>

      </main>

      {showSuccessModal && currentBooklet && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in no-print" id="success-modal">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 md:p-8 shadow-2xl border border-slate-100 flex flex-col items-center text-center relative animate-scale-up">
            <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500 mb-4 shadow-inner">
              <CheckCircle className="w-10 h-10" />
            </div>
            
            <h3 className="font-sans font-black text-xl text-slate-900 leading-tight">
              Apostila Gerada com Sucesso!
            </h3>
            <p className="text-slate-500 text-xs mt-2.5 leading-relaxed font-sans">
              O material sobre <strong className="text-slate-800">"{currentBooklet.theme}"</strong> ({currentBooklet.banca}) foi estruturado e está pronto para salvar ou imprimir em formato PDF.
            </p>

            <div className="mt-6 w-full space-y-2 font-sans">
              <button
                onClick={() => {
                  setShowSuccessModal(false);
                  setTimeout(() => {
                    window.print();
                  }, 150);
                }}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-5 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 text-sm cursor-pointer animate-pulse"
              >
                <Printer className="w-4 h-4" />
                ABRIR APOSTILA
              </button>
              
              <button
                onClick={() => setShowSuccessModal(false)}
                className="w-full bg-slate-50 hover:bg-slate-100 text-slate-600 font-semibold py-2.5 px-5 rounded-xl transition-all text-xs cursor-pointer"
              >
                Visualizar no Site Primeiro
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

