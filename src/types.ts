export interface SectionIllustration {
  type: "flowchart" | "comparison" | "mindmap" | "cheatsheet" | "timeline";
  title: string;
  nodes?: { id: string; label: string; description?: string; type?: "start" | "process" | "decision" | "alert" | "info" }[];
  connections?: { from: string; to: string; label?: string }[];
  comparisonColumns?: { columnTitle: string; items: string[]; icon?: string }[];
  steps?: { stepNumber: number; title: string; description: string; alert?: boolean }[];
}

export interface BookletSection {
  title: string;
  content: string;
  illustration?: SectionIllustration;
}

export interface BookletQuestion {
  number: number;
  context: string;
  options: string[]; // Exactly 5 options
  correctOptionIndex: number; // 0 to 4
  explanation: string; // commented answer
}

export interface ExamBooklet {
  id: string;
  theme: string;
  banca?: string;
  difficulty?: string;
  tone?: string;
  title: string;
  summary: string;
  sections: BookletSection[];
  questions: BookletQuestion[];
  createdAt: string;
}

export interface GenerationRequest {
  theme: string;
  banca: string;
  difficulty: string;
  tone: string;
}
