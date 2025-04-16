import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Define the editor themes
export const editorThemes = [
  { name: 'LaTeX Dark', value: 'latex-dark' },
  { name: 'LaTeX Light', value: 'latex-light' },
  { name: 'Monokai', value: 'monokai' },
  { name: 'GitHub', value: 'github' },
  { name: 'Solarized', value: 'solarized' },
];

const DEFAULT_LATEX = `\\documentclass{article}
\\usepackage{amsmath}
\\usepackage{amssymb}
\\usepackage{graphicx}

\\title{My LaTeX Document}
\\author{Your Name}
\\date{\\today}

\\begin{document}

\\maketitle

\\section{Introduction}
LaTeX is a document preparation system for high-quality typesetting. It is most often used for medium-to-large technical or scientific documents but it can be used for almost any form of publishing.

\\section{Mathematics}
LaTeX is especially good at typesetting mathematics. For example:

\\begin{align}
E &= mc^2\\\\
\\int_{0}^{\\infty} e^{-x^2} dx &= \\frac{\\sqrt{\\pi}}{2}\\\\
\\sum_{i=0}^{n} i &= \\frac{n(n+1)}{2}
\\end{align}

\\section{Figures}
You can include figures in your document:

\\begin{figure}[h]
\\centering
% Include your figure here
\\caption{A sample figure}
\\label{fig:sample}
\\end{figure}

\\section{Tables}
And tables:

\\begin{table}[h]
\\centering
\\begin{tabular}{|c|c|c|}
\\hline
Cell 1 & Cell 2 & Cell 3 \\\\
\\hline
A & B & C \\\\
\\hline
X & Y & Z \\\\
\\hline
\\end{tabular}
\\caption{A sample table}
\\label{tab:sample}
\\end{table}

\\end{document}`;

// Define the shape of the LaTeX editor state
interface LatexEditorState {
  // Content state
  content: string;
  setContent: (content: string) => void;

  // Editor theme state
  editorTheme: string;
  setEditorTheme: (theme: string) => void;

  // Action methods
  saveDocument: () => void;
  resetToDefault: () => void;
  insertSnippet: (snippet: string) => void;
}

// Create the store with persistence
export const useLatexEditorStore = create<LatexEditorState>()(
  persist(
    (set, get) => ({
      // Content state
      content: DEFAULT_LATEX,
      setContent: (content) => set({ content }),

      // Editor theme state
      editorTheme: 'latex-dark',
      setEditorTheme: (editorTheme) => set({ editorTheme }),

      // Action methods
      saveDocument: () => {
        // This is automatically handled by the persist middleware
        // But we keep this method for explicit save actions
      },

      resetToDefault: () => set({ content: DEFAULT_LATEX }),

      insertSnippet: (snippet) => {
        const { content } = get();
        // This is a simple insertion - could be enhanced to handle cursor position
        set({ content: `${content}\n${snippet}` });
      },
    }),
    {
      name: 'latex-editor-storage',
    }
  )
);
