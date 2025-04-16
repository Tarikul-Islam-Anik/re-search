'use client';

import { Button } from '@repo/design-system/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@repo/design-system/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@repo/design-system/components/ui/tooltip';
import {
  AlignCenter,
  Binary,
  Book,
  BookOpen,
  BookText,
  ChevronDown,
  CircleDot,
  DivideCircle,
  Download,
  FileImage,
  FileUp,
  SquareFunction as Functions,
  InfinityIcon,
  LayoutGrid,
  Library,
  List,
  ListOrdered,
  Save,
  Sigma,
  Radical as SquareRoot,
  SwatchBook,
  Table,
} from 'lucide-react';
import type React from 'react';
import { toast } from 'sonner';
import {
  editorThemes,
  useLatexEditorStore,
} from '../../store/use-latex-editor-store';

export function LatexToolbar() {
  // Get all needed state and actions from the store
  const content = useLatexEditorStore((state) => state.content);
  const setContent = useLatexEditorStore((state) => state.setContent);
  const editorTheme = useLatexEditorStore((state) => state.editorTheme);
  const setEditorTheme = useLatexEditorStore((state) => state.setEditorTheme);
  const insertSnippet = useLatexEditorStore((state) => state.insertSnippet);
  const saveDocument = useLatexEditorStore((state) => state.saveDocument);

  const mathCommands = [
    {
      label: 'Fraction',
      value: '\\frac{a}{b}',
      icon: DivideCircle,
    },
    {
      label: 'Square Root',
      value: '\\sqrt{x}',
      icon: SquareRoot,
    },
    {
      label: 'Summation',
      value: '\\sum_{i=1}^{n} i',
      icon: Sigma,
    },
    {
      label: 'Integral',
      value: '\\int_{a}^{b} f(x) dx',
      icon: Functions,
    },
    {
      label: 'Limit',
      value: '\\lim_{x \\to \\infty} f(x)',
      icon: InfinityIcon,
    },
    {
      label: 'Matrix',
      value: '\\begin{pmatrix}\na & b \\\\\nc & d\n\\end{pmatrix}',
      icon: LayoutGrid,
    },
  ];

  const environments = [
    {
      label: 'Equation',
      value: '\\begin{equation}\n\n\\end{equation}',
      icon: Binary,
    },
    {
      label: 'Align',
      value: '\\begin{align}\n\n\\end{align}',
      icon: AlignCenter,
    },
    {
      label: 'Itemize',
      value: '\\begin{itemize}\n\\item Item 1\n\\item Item 2\n\\end{itemize}',
      icon: List,
    },
    {
      label: 'Enumerate',
      value:
        '\\begin{enumerate}\n\\item Item 1\n\\item Item 2\n\\end{enumerate}',
      icon: ListOrdered,
    },
    {
      label: 'Figure',
      value:
        '\\begin{figure}[h]\n\\centering\n% Include figure\n\\caption{Caption}\n\\label{fig:label}\n\\end{figure}',
      icon: FileImage,
    },
    {
      label: 'Table',
      value:
        '\\begin{table}[h]\n\\centering\n\\begin{tabular}{|c|c|}\n\\hline\nHeader 1 & Header 2 \\\\\n\\hline\nCell 1 & Cell 2 \\\\\n\\hline\n\\end{tabular}\n\\caption{Caption}\n\\label{tab:label}\n\\end{table}',
      icon: Table,
    },
  ];

  const sections = [
    {
      label: 'Section',
      value: '\\section{Section Title}',
      icon: Book,
    },
    {
      label: 'Subsection',
      value: '\\subsection{Subsection Title}',
      icon: BookOpen,
    },
    {
      label: 'Subsubsection',
      value: '\\subsubsection{Subsubsection Title}',
      icon: BookText,
    },
  ];

  const symbols = [
    {
      label: 'Alpha',
      value: '\\alpha',
      icon: <div className="mr-2 w-4 text-center">α</div>,
    },
    {
      label: 'Beta',
      value: '\\beta',
      icon: <div className="mr-2 w-4 text-center">β</div>,
    },
    {
      label: 'Gamma',
      value: '\\gamma',
      icon: <div className="mr-2 w-4 text-center">γ</div>,
    },
    {
      label: 'Delta',
      value: '\\delta',
      icon: <div className="mr-2 w-4 text-center">δ</div>,
    },
    {
      label: 'Epsilon',
      value: '\\epsilon',
      icon: <div className="mr-2 w-4 text-center">ε</div>,
    },
    {
      label: 'Theta',
      value: '\\theta',
      icon: <div className="mr-2 w-4 text-center">θ</div>,
    },
    {
      label: 'Pi',
      value: '\\pi',
      icon: <div className="mr-2 w-4 text-center">π</div>,
    },
    {
      label: 'Sigma',
      value: '\\sigma',
      icon: <div className="mr-2 w-4 text-center">σ</div>,
    },
    {
      label: 'Omega',
      value: '\\omega',
      icon: <div className="mr-2 w-4 text-center">ω</div>,
    },
  ];

  const handleSave = () => {
    saveDocument();
    toast.message('Document saved', {
      description: 'Your LaTeX document has been saved.',
    });
  };

  const handleDownload = () => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'document.tex';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const uploadedContent = e.target?.result as string;
        setContent(uploadedContent);
      };
      reader.readAsText(file);
    }
  };

  // Get current theme name for display
  const getCurrentThemeName = () => {
    const theme = editorThemes.find((t) => t.value === editorTheme);
    return theme ? theme.name : 'Theme';
  };

  return (
    <div className="scrollbar-hide flex items-center justify-between space-x-1 overflow-x-auto p-4">
      <div className="flex items-center gap-x-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Functions className="mr-1 size-3" />
              Math <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {mathCommands.map((command) => (
              <DropdownMenuItem
                key={command.label}
                onClick={() => insertSnippet(command.value)}
              >
                <command.icon />
                {command.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Library className="mr-1 size-3" />
              Environments <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {environments.map((env) => (
              <DropdownMenuItem
                key={env.label}
                onClick={() => insertSnippet(env.value)}
              >
                <env.icon />
                {env.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Book className="mr-1 size-3" />
              Sections <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {sections.map((section) => (
              <DropdownMenuItem
                key={section.label}
                onClick={() => insertSnippet(section.value)}
              >
                <section.icon />
                {section.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <CircleDot className="mr-1 size-3" />
              Symbols <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {symbols.map((symbol) => (
              <DropdownMenuItem
                key={symbol.label}
                onClick={() => insertSnippet(symbol.value)}
              >
                {symbol.icon}
                {symbol.label} ({symbol.value})
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Theme selector dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <SwatchBook className="mr-1 size-3" />
              {getCurrentThemeName()} <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {editorThemes.map((theme) => (
              <DropdownMenuItem
                key={theme.value}
                onClick={() => setEditorTheme(theme.value)}
              >
                {theme.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex items-center gap-x-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="icon" onClick={handleSave}>
              <Save className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Save</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="icon" onClick={handleDownload}>
              <Download className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Download</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="icon" asChild>
              <label>
                <FileUp className="size-4" />
                <input
                  type="file"
                  accept=".tex"
                  className="sr-only"
                  onChange={handleUpload}
                />
              </label>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Upload</TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
}
