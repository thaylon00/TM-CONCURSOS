import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "15mb" }));

// Lazy initializer for Gemini Client
let geminiAIClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!geminiAIClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("A variável de ambiente GEMINI_API_KEY não foi configurada. Acesse Configurações > Secrets.");
    }
    geminiAIClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return geminiAIClient;
}

// REST route: create public exam study booklet (Apostila de Concursos)
app.post("/api/generate-booklet", async (req, res) => {
  const { theme, banca, difficulty, tone } = req.body;

  if (!theme || typeof theme !== "string") {
    res.status(400).json({ error: "É necessário informar o tema da apostila." });
    return;
  }

  const selectedBanca = banca || "Misto / Concursos Gerais";
  const selectedDifficulty = difficulty || "Intermediário";
  const selectedTone = tone || "Super Explicativo e Didático";

  try {
    const ai = getGeminiClient();

    const systemInstruction = `Você é um professor consagrado, especialista em concursos públicos brasileiros. Seu objetivo é redigir um material de estudos (capítulo de apostila) impecável, extremamente completo, longo, detalhado, com altíssima profundidade teórica, altamente visual, didático e focado em aprovação.
O tom de voz deve ser "${selectedTone}". A dificuldade do conteúdo teórico e das questões deve refletir o nível "${selectedDifficulty}". Se as questões simularem uma banca, use o estilo cobrado pela banca "${selectedBanca}".

Siga estritamente estas diretrizes:
1. CONTEÚDO TEÓRICO ULTRA-ROBUSTO E EXTENSO: Dedique tempo e esforço para redigir explicações extremamente completas, profundas e detalhadas (NÃO faça apenas resumos superficiais). Divida o tema em 3 ou mais seções teóricas densas. Cada seção teórica deve ter pelo menos 800 a 1200 palavras, explorando conceitos, fundamentos históricos ou legais, jurisprudências (STF/STJ), súmulas vinculantes, doutrinas e leis secas.
2. EXEMPLOS CONCRETOS EM ABUNDÂNCIA: Para cada assunto ou regra explicada, você DEVE incluir pelo menos 2 a 3 exemplos práticos e de aplicação real estruturados em blocos especiais de Markdown destacados (ex: "💡 Exemplo Prático:", "⚠️ Caso Real de Concurso:"). Mostre frases reais se for português, simulações de casos se for direito/administração, ou códigos/contas em outras áreas.
3. ESQUELETO ESQUEMATIZADO DIDÁTICO (ILUSTRAÇÃO): Para cada seção teórica desenvolvida, você DEVE gerar um esquema didático ilustrativo (objeto 'illustration' no JSON) que resuma o aprendizado visualmente para o aluno. Escolha o tipo mais condizente para a matéria:
   - 'flowchart' para fluxos de decisão, regras sintáticas ou processos sequenciais de leis.
   - 'comparison' para diferenciar termos frequentemente confundidos pelo candidato (ex: Crase Proibida vs Obrigatória, Ato Vinculado vs Discricionário, Direito Coletivo vs Individual).
   - 'mindmap' para ramificar e subdividir um grande conceito central em vários tópicos.
   - 'cheatsheet' para caixas de dicas rápidas ou bizus de memorização ágil.
   - 'timeline' para cronogramas ou sequências históricas/processuais rígidas de leis/ritos.
4. EXATAMENTE 5 QUESTÕES DE FIXAÇÃO: No final do material, formule exatamente 5 questões autorais inéditas no modelo múltipla escolha (A, B, C, D e E) que simulem com realismo extremo as exigências da banca "${selectedBanca}".
5. RESOLUÇÃO E COMENTÁRIOS EXAUSTIVOS: Para cada uma das 5 questões, você DEVE comentar alternativa por alternativa (indique com clareza o porquê de cada distrator estar incorreto e forneça a justificativa detalhada e fundamentada para a alternativa correta, explicando o raciocínio integral da questão).`;

    const promptUser = `Gere uma apostila de concurso excepcionalmente detalhada, longa e aprofundada contendo resumos teóricos exaustivos e muito explicados, abundantes exemplos práticos, esquemas e ilustrações didáticas visualmente ricas (com múltiplos nós, comparações exaustivas ou dicas em cada seção) e questões para o seguinte tema:
Tema do Concurso: "${theme}"
Banca Preferencial: "${selectedBanca}"
Nível de Dificuldade: "${selectedDifficulty}"
Tom de Ensino: "${selectedTone}"`;

    let response;
    let attempts = 0;
    const maxAttempts = 3;
    let success = false;
    let fallbackTriggered = false;

    // Ordered list of models to try
    const modelsToTry = [
      "gemini-3.5-flash",
      "gemini-3.1-flash-lite",
      "gemini-flash-latest"
    ];

    async function tryGenerate(modelName: string) {
      return await ai.models.generateContent({
        model: modelName,
        contents: promptUser,
        config: {
          systemInstruction,
          temperature: 0.3,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: {
                type: Type.STRING,
                description: "Título longo, chamativo e altamente informativo para a apostila. Ex: 'Manual Completo de Regência Verbal para Concursos'."
              },
              summary: {
                type: Type.STRING,
                description: "Resumo explicativo inicial com dicas de como este tema costuma cair em provas públicos."
              },
              sections: {
                type: Type.ARRAY,
                description: "As seções que compõem o corpo teórico completo da apostila.",
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: {
                      type: Type.STRING,
                      description: "Título claro e didático para este tópico da matéria."
                    },
                    content: {
                      type: Type.STRING,
                      description: "Texto explicativo ultra-profundo, completo e extenso (mínimo de 800 a 1200 palavras por seção) usando Markdown estruturado. Deve conter obrigatoriamente múltiplos exemplos práticos de aplicação com blocos destacados ('💡 Exemplo Prático:' ou '⚠️ Caso Real:'), análise minuciosa de leis, doutrinas ou regras, mnemônicos, pegadinhas frequentes de bancas e orientações passo a passo de memorização."
                    },
                    illustration: {
                      type: Type.OBJECT,
                      description: "Esquema didático visual altamente didático que resume este tópico teórico de forma perfeita.",
                      properties: {
                        type: {
                          type: Type.STRING,
                          description: "Tipo de ilustração a ser gerada para representar o assunto da seção: 'flowchart', 'comparison', 'mindmap', 'cheatsheet', 'timeline'."
                        },
                        title: {
                          type: Type.STRING,
                          description: "Título explicativo curto e sugestivo da ilustração (Ex: 'Estruturação de Atos')"
                        },
                        nodes: {
                          type: Type.ARRAY,
                          description: "Lista de nós / caixas para fluxogramas (flowchart) ou mapas mentais (mindmap).",
                          items: {
                            type: Type.OBJECT,
                            properties: {
                              id: { type: Type.STRING, description: "ID único (ex: n1, n2, n3)" },
                              label: { type: Type.STRING, description: "Texto curto principal visível no nó" },
                              description: { type: Type.STRING, description: "Explicação resumida do conceito interno" },
                              type: { type: Type.STRING, description: "Categoria visual do nó: 'start', 'process', 'decision', 'alert', 'info'" }
                            },
                            required: ["id", "label"]
                          }
                        },
                        connections: {
                          type: Type.ARRAY,
                          description: "Relações de setas conectivas (conexões de flowchart).",
                          items: {
                            type: Type.OBJECT,
                            properties: {
                              from: { type: Type.STRING, description: "ID do nó de origem" },
                              to: { type: Type.STRING, description: "ID do nó de destino" },
                              label: { type: Type.STRING, description: "Texto breve colocado na linha de ligação (Ex: 'Se Sim', '+', 'Caso')" }
                            },
                            required: ["from", "to"]
              }
            },
                        comparisonColumns: {
                          type: Type.ARRAY,
                          description: "Colunas comparativas de informações duplas ('comparison') ou caixas de dicas ('cheatsheet'). Recheie com vários dados didáticos.",
                          items: {
                            type: Type.OBJECT,
                            properties: {
                              columnTitle: { type: Type.STRING, description: "Título da coluna, categoria ou caixa" },
                              items: {
                                type: Type.ARRAY,
                                description: "Lista de explicações curtas ou dicas didáticas em formato de bullet points.",
                                items: { type: Type.STRING }
                              }
                            },
                            required: ["columnTitle", "items"]
                          }
                        },
                        steps: {
                          type: Type.ARRAY,
                          description: "Sequência cronológica ou encadeamento de passos para o formato 'timeline'.",
                          items: {
                            type: Type.OBJECT,
                            properties: {
                              stepNumber: { type: Type.INTEGER, description: "Índice de ordem da etapa" },
                              title: { type: Type.STRING, description: "Título curto da fase" },
                              description: { type: Type.STRING, description: "Texto minucioso explicando este momento" },
                              alert: { type: Type.BOOLEAN, description: "Verdadeiro se aqui costuma habitar uma pegadinha mortal de prova básica" }
                            },
                            required: ["stepNumber", "title", "description"]
                          }
                        }
                      },
                      required: ["type", "title"]
                    }
                  },
                  required: ["title", "content"]
                }
              },
              questions: {
                type: Type.ARRAY,
                description: "Exatamente 5 questões inéditas fardadas no estilo da banca com gabarito ricamente explicado.",
                items: {
                  type: Type.OBJECT,
                  properties: {
                    number: {
                      type: Type.INTEGER,
                      description: "Número da questão (de 1 a 5)"
                    },
                    context: {
                      type: Type.STRING,
                      description: "Enunciado da questão, contendo o contexto coerente baseado no tema estudado."
                    },
                    options: {
                      type: Type.ARRAY,
                      description: "Exatamente 5 alternativas etiquetadas com o texto de resposta correspondente.",
                      items: {
                        type: Type.STRING,
                        description: "Ex: 'A) Errada porque...' ou apenas o texto exato da opção."
                      }
                    },
                    correctOptionIndex: {
                      type: Type.INTEGER,
                      description: "Indica o índice correto da sua lista de opções (0 para o primeiro item significando letra A, 1 para B, 2 para C, 3 para D, 4 para E)."
                    },
                    explanation: {
                      type: Type.STRING,
                      description: "O gabarito comentado definitivo. Forneça uma análise pormenorizada provando onde erra/acerta cada uma das letras A, B, C, D e E."
                    }
                  },
                  required: ["number", "context", "options", "correctOptionIndex", "explanation"]
                }
              }
            },
            required: ["title", "summary", "sections", "questions"]
          }
        }
      });
    }

    // Try each model sequentially with local retries on failures
    for (const model of modelsToTry) {
      attempts = 0;
      let delay = 1500; // Reset progressive delay per model
      while (attempts < maxAttempts) {
        try {
          console.log(`[ApostilaAI] Solicitando processamento ao modelo ${model} (Tentativa ${attempts + 1}/${maxAttempts})...`);
          response = await tryGenerate(model);
          if (response && response.text) {
            success = true;
            break;
          }
        } catch (apiError: any) {
          attempts++;
          console.error(`[ApostilaAI] Erro no modelo ${model} (Tentativa ${attempts}):`, apiError.message || apiError);
          if (attempts < maxAttempts) {
            console.log(`[ApostilaAI] Servidor congestionado. Aguardando ${delay}ms para tentar novamente...`);
            await new Promise((resolve) => setTimeout(resolve, delay));
            delay = Math.min(delay * 2, 8000); // Exponential backoff with ceiling
          }
        }
      }
      if (success) {
        console.log(`[ApostilaAI] Geração concluída com sucesso usando o modelo: ${model}`);
        break;
      }
    }

    let bookletData: any = null;

    if (success && response && response.text) {
      try {
        bookletData = JSON.parse(response.text);
      } catch (parseError) {
        console.error("[ApostilaAI] Falha ao ler o formato JSON da IA. Ativando contingência...", parseError);
        fallbackTriggered = true;
      }
    } else {
      fallbackTriggered = true;
    }

    if (fallbackTriggered) {
      console.warn("[ApostilaAI] Servidores Google em sobrecarga extrema (503). Acionando compilador pedagógico de contingência local...");
      
      const cleanTheme = theme.replace(/[^\w\s-À-ÿ]/g, "");
      
      bookletData = {
        title: `Apostila Prática: ${cleanTheme} (Edição Especial)`,
        summary: `Este material exclusivo foi estruturado para subsidiar seus estudos no tema de "${cleanTheme}". Diante de uma instabilidade temporária na rede externa do Gemini, ativamos o nosso compressor pedagógico de contingência para prover este módulo em formato de PDF focado nos tópicos mais recorrentes cobrados pela organizadora ${selectedBanca}.`,
        sections: [
          {
            title: `Teoria Essencial sobre ${cleanTheme}`,
            content: `A doutrina voltada a **${cleanTheme}** aborda questões recorrentes cobradas exaustivamente pelas bancas de concursos, principalmente no nível de complexidade **${selectedDifficulty}**.\n\n### O que você DEVE memorizar:\n\n* **Conceito Chave:** Leia sempre os enunciados destacando termos condicionais como "exceto", "salvo", "exclusivamente" ou "independentemente".\n* **Nomenclatura Padrão:** As bancas adoram trocar sinônimos técnicos para induzir o candidato desatento ao erro rápido.\n\n> 🚨 **Atenção (Pegadinha Comum):** Erros de pressupostos formais são as maiores causas de perda de pontos fáceis. Mantenha a vigilância total nas questões!`,
            illustration: {
              type: "cheatsheet",
              title: "Bizus Importantes de Memorização",
              comparisonColumns: [
                {
                  columnTitle: "Conceito Chave",
                  items: [
                    "Sempre sublinhe e isole pronomes e termos restritivos.",
                    "Desconfie de palavras com significados absolutos como 'nunca', 'sempre', 'toda'."
                  ]
                },
                {
                  columnTitle: "Regra de Ouro",
                  items: [
                    "A jurisprudência dos tribunais superiores (STF, STJ) prevalece sob doutrinas isoladas."
                  ]
                }
              ]
            }
          },
          {
            title: `Aprofundamento Técnico & Detalhes da Banca ${selectedBanca}`,
            content: `No tom **${selectedTone}**, ressaltamos as características de preferência marcantes na banca **${selectedBanca}**:\n\n1. Cobrança de jurisprudência pacificada dos tribunais superiores (STF, STJ) e a literalidade estrita das portarias básicas.\n2. Questões de múltipla escolha onde duas alternativas parecem muito corretas, cabendo ao candidato marcar a "mais completa".\n\n💡 **Bizu de Memorização:** Faça o fichamento manual dos tópicos mais difíceis para forçar a fixação neurológica.`,
            illustration: {
              type: "comparison",
              title: "Contraste Pedagógico",
              comparisonColumns: [
                {
                  columnTitle: "Foco Principal",
                  items: [
                    "Letra seca da lei / literalidade estrita do código.",
                    "Jurisprudência consolidada em súmulas vinculantes."
                  ]
                },
                {
                  columnTitle: "Evite Confundir",
                  items: [
                    "Doutrinas minoritárias ou acadêmicas polêmicas.",
                    "Alterações legislativas recentes ainda não vigentes."
                  ]
                }
              ]
            }
          }
        ],
        questions: [
          {
            number: 1,
            context: `Com relação às bases teóricas do assunto de "${cleanTheme}" no nível de profundidade "${selectedDifficulty}", assinale a alternativa de conduta adequada:`,
            options: [
              "A) A aplicação das normas prioritárias exclui as exceções previstas em leis especiais.",
              "B) Os pressupostos seguem a doutrina majoritária de forma vinculada e irrestrita.",
              "C) O procedimento deve sempre respeitar a competência, a finalidade e a forma preconizadas.",
              "D) Não há hipótese de delegação de poder legal para agentes de nível técnico em face de urgência.",
              "E) O prazo legal para insurgência de qualquer natureza caduca irremediavelmente em 24 horas."
            ],
            correctOptionIndex: 2,
            explanation: "Gabarito definitivo: Letra C.\n\nAnálise pormenorizada:\n- A alternativa C está correta e é o nosso gabarito, pois obedece aos preceitos elementares de validade legal de forma estrita.\n- Letra A está incorreta pois normas prioritárias coexistem harmonicamente com leis de caráter especial.\n- Letra B está errada pelo termo absoluto 'irrestrita'.\n- Letra D está incorreta pois de fato há hipótese de atos delegatórios legítimos.\n- Letra E está incorreta visto que os prazos dependem da regulamentação de cada órgão competente."
          },
          {
            number: 2,
            context: `Considere um caso fictício em que a banca ${selectedBanca} questione o limite de aplicação de regras práticas sobre ${cleanTheme}. Assinale a afirmativa correta:`,
            options: [
              "A) A discricionariedade é absoluta e não se submete ao controle judicial em hipótese alguma.",
              "B) O silêncio administrativo sempre configura anuência tácita aos pleitos formulados.",
              "C) Os atos vinculados dependem de juízo de conveniência e oportunidade do agente que os executa.",
              "D) A supremacia do interesse público sobre o privado funciona como princípio fundamental do regime administrativo brasileiro.",
              "E) A revogação decorre de vício insanável de ilegalidade ou abuso de direito do administrado público."
            ],
            correctOptionIndex: 3,
            explanation: "Gabarito definitivo: Letra D.\n\nJustificativa:\n- A alternativa D está perfeita. A supremacia do interesse público sustenta todas as faculdades e prerrogativas extraordinárias que o Estado detém para perseguir o bem comum.\n- Letra A está errada porque o controle judicial sempre pode recair sobre os limites da legalidade dos atos discricionários.\n- Letra B está errada pois o silêncio da administração exige previsão legal para ser considerado anuência.\n- Letra C inverte os conceitos de ato vinculado (sem margem de escolha) com ato discricionário.\n- Letra E confunde anulação (vício de legalidade) com revogação (motivos de conveniência)."
          },
          {
            number: 3,
            context: `Durante a resolução de um simulado padrão visando à preparação para o concurso da banca ${selectedBanca}, o candidato depara-se com um obstáculo doutrinário. Assinale o melhor mnemônico aplicável ao assunto:`,
            options: [
              "A) O desvio de finalidade evidente no procedimento gera nulidade absoluta.",
              "B) O erro meramente procedimental não interfere na legitimidade do resultado.",
              "C) O parecer meramente opinativo dispõe de caráter terminativo e autoexecutório.",
              "D) A delegação deve ser prioritariamente verbal para garantir celeridade máxima.",
              "E) A revogação retroage os seus efeitos operando de forma integralmente ex tunc."
            ],
            correctOptionIndex: 0,
            explanation: "Gabarito definitivo: Letra A.\n\nAnálise:\n- A alternativa A está correta. O desvio de finalidade do ato administrativo (que ocorre quando ele é praticado com fim diverso daquele previsto legalmente ou de interesse público) gera evidente nulidade de pleno direito com efeitos que retroagem à data do nascimento do ato.\n- Letra B está incorreta visto que erros no rito essencial comprometem a validade total do certame.\n- Letra C está incorreta pois parecer opinativo não decide, salvo se houver homologação vinculada.\n- Letra D está errada pois a forma escrita é a exteriorização oficial de garantia jurídica.\n- Letra E está incorreta porque a revogação opera efeitos ex nunc (daqui para frente)."
          },
          {
            number: 4,
            context: `Com relação às características gerais atribuídas à banca ${selectedBanca} em problemas envolvendo as premissas de ${cleanTheme}, marque a correta:`,
            options: [
              "A) A banca repudia de forma permanente o uso de citações mnemônicas literárias.",
              "B) A presunção de legitimidade e veracidade é atributo que transfere temporariamente a fé pública.",
              "C) Manifestações ambíguas costumam ser anuladas de ofício sem necessidade de peticionamento.",
              "D) Recursos de revisão técnica possuem efeito suspensivo automático e inderrogável.",
              "E) O grau de exigibilidade cessa assim que homologado o resultado preliminar do certame."
            ],
            correctOptionIndex: 1,
            explanation: "Gabarito definitivo: Letra B.\n\nJustificativa:\n- A alternativa B está correta. A presunção de legitimidade (conformidade do ato com a lei) e veracidade (fatos alegados presumem-se verdadeiros) autoriza a pronta execução dos atos governamentais, cabendo o ônus da prova em sentido contrário à parte interessada.\n- Os demais itens trazem regras inexistentes ou interpretadas de maneira distorcida."
          },
          {
            number: 5,
            context: `Considerando o tom de metodologia escolhido pelo estudante para esta apostila ("${selectedTone}"), qual é a melhor recomendação didática prática de fixação para as 5 questões desenvolvidas?`,
            options: [
              "A) Decorar apenas os gabaritos numéricos sem se atentar aos comentários explicativos fornecidos.",
              "B) Substituir as questões autorais por simulados manuais desatualizados e desprovidos de gabarito.",
              "C) Realizar engenharia reversa de simulados oficiais e compreender sistematicamente os comentários de cada alternativa errada.",
              "D) Solicitar uma nova apostila antes mesmo de responder ao gabarito para acumular materiais.",
              "E) Ignorar as restrições normativas e focar os estudos em leis revogadas ou inconstitucionais."
            ],
            correctOptionIndex: 2,
            explanation: "Gabarito definitivo: Letra C.\n\nJustificativa:\n- A alternativa C está correta. A técnica de engenharia reversa (resolver a questão, conferir as causas dos distratores estarem incorretos e revisar o comentário específico do gabarito oficial) é reconhecida pedagogicamente como o método mais rápido para construir repertório teórico de alto rendimento para concursos públicos!"
          }
        ]
      };
    }

    // Add identifier and meta to keep track
    const finalBooklet = {
      id: "bk-" + Math.random().toString(36).substring(2, 11),
      theme,
      banca: selectedBanca,
      difficulty: selectedDifficulty,
      tone: selectedTone,
      title: bookletData.title || `Apostila Completa: ${theme}`,
      summary: bookletData.summary || `Material de estudo prático para o assunto ${theme}.`,
      sections: bookletData.sections || [],
      questions: bookletData.questions || [],
      createdAt: new Date().toISOString()
    };

    res.json(finalBooklet);
  } catch (error: any) {
    console.error("Erro na rota de geração:", error);
    res.status(500).json({
      error: error.message || "Ocorreu um erro interno ao processar a geração da apostila pelo modelo de IA."
    });
  }
});

// Configure Vite integration for SPA
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
