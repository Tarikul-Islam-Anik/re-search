'use client';

import Editor, { type Monaco } from '@monaco-editor/react';
import { Skeleton } from '@repo/design-system/components/ui/skeleton';
import { useEffect, useState } from 'react';
import { useLatexEditorStore } from '../../store/use-latex-editor-store';

// Define LaTeX syntax highlighting regex patterns
const LATEX_COMMANDS = /\\[a-zA-Z]+/;
const LATEX_BEGIN_ENV = /\\begin\{([^}]*)\}/;
const LATEX_END_ENV = /\\end\{([^}]*)\}/;
const LATEX_MATH_DOUBLE = /\$\$/;
const LATEX_MATH_SINGLE = /\$/;
const LATEX_COMMENT = /%.*$/;
const LATEX_OPEN_BRACE = /\{/;
const LATEX_CLOSE_BRACE = /\}/;
const LATEX_OPEN_BRACKET = /\[/;
const LATEX_CLOSE_BRACKET = /\]/;
const LATEX_AMPERSAND = /&/;
const LATEX_NEWLINE = /\\\\/;
const LATEX_PARAMETER = /[a-zA-Z0-9_]+(?==)/;

const handleEditorDidMount = (editor: unknown, monaco: Monaco) => {
  // Make sure monaco is defined before trying to configure the language
  if (monaco?.languages) {
    // Register the LaTeX language
    monaco.languages.register({ id: 'latex' });

    // Set the LaTeX language tokens provider
    monaco.languages.setMonarchTokensProvider('latex', {
      tokenizer: {
        root: [
          // Commands
          [LATEX_COMMANDS, 'keyword'],

          // Environments
          [LATEX_BEGIN_ENV, 'type'],
          [LATEX_END_ENV, 'type'],

          // Math delimiters
          [LATEX_MATH_DOUBLE, 'string'],
          [LATEX_MATH_SINGLE, 'string'],

          // Comments
          [LATEX_COMMENT, 'comment'],

          // Braces
          [LATEX_OPEN_BRACE, 'delimiter.curly'],
          [LATEX_CLOSE_BRACE, 'delimiter.curly'],

          // Brackets
          [LATEX_OPEN_BRACKET, 'delimiter.square'],
          [LATEX_CLOSE_BRACKET, 'delimiter.square'],

          // Special characters
          [LATEX_AMPERSAND, 'operator'],
          [LATEX_NEWLINE, 'operator'],

          // Parameters
          [LATEX_PARAMETER, 'attribute.name'],
        ],
      },
    });

    // Define custom themes
    defineCustomThemes(monaco);
  }
};

const defineCustomThemes = (monaco: Monaco) => {
  if (!monaco || !monaco.editor) {
    return;
  }

  try {
    monaco.editor.defineTheme('latex-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'keyword', foreground: '569CD6', fontStyle: 'bold' },
        { token: 'type', foreground: '4EC9B0', fontStyle: 'bold' },
        { token: 'string', foreground: 'CE9178' },
        { token: 'comment', foreground: '6A9955', fontStyle: 'italic' },
        { token: 'delimiter.curly', foreground: 'D4D4D4', fontStyle: 'bold' },
        { token: 'delimiter.square', foreground: 'D4D4D4' },
        { token: 'operator', foreground: 'D4D4D4' },
        { token: 'attribute.name', foreground: '9CDCFE' },
      ],
      colors: {
        'editor.background': '#1E1E1E',
        'editor.foreground': '#D4D4D4',
        'editorLineNumber.foreground': '#858585',
        'editor.lineHighlightBackground': '#2D2D30',
        'editorCursor.foreground': '#A6A6A6',
        'editor.selectionBackground': '#264F78',
      },
    });

    monaco.editor.defineTheme('latex-light', {
      base: 'vs',
      inherit: true,
      rules: [
        { token: 'keyword', foreground: '0000FF', fontStyle: 'bold' },
        { token: 'type', foreground: '267F99', fontStyle: 'bold' },
        { token: 'string', foreground: 'A31515' },
        { token: 'comment', foreground: '008000', fontStyle: 'italic' },
        { token: 'delimiter.curly', foreground: '000000', fontStyle: 'bold' },
        { token: 'delimiter.square', foreground: '000000' },
        { token: 'operator', foreground: '000000' },
        { token: 'attribute.name', foreground: '001080' },
      ],
      colors: {
        'editor.background': '#FFFFFF',
        'editor.foreground': '#000000',
        'editorLineNumber.foreground': '#909090',
        'editor.lineHighlightBackground': '#F7F7F7',
        'editorCursor.foreground': '#000000',
        'editor.selectionBackground': '#ADD6FF',
      },
    });

    monaco.editor.defineTheme('monokai', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'keyword', foreground: 'F92672', fontStyle: 'bold' },
        { token: 'type', foreground: '66D9EF', fontStyle: 'italic' },
        { token: 'string', foreground: 'E6DB74' },
        { token: 'comment', foreground: '75715E', fontStyle: 'italic' },
        { token: 'delimiter.curly', foreground: 'F8F8F2', fontStyle: 'bold' },
        { token: 'delimiter.square', foreground: 'F8F8F2' },
        { token: 'operator', foreground: 'F8F8F2' },
        { token: 'attribute.name', foreground: 'A6E22E' },
      ],
      colors: {
        'editor.background': '#272822',
        'editor.foreground': '#F8F8F2',
        'editorLineNumber.foreground': '#8F908A',
        'editor.lineHighlightBackground': '#3E3D32',
        'editorCursor.foreground': '#F8F8F0',
        'editor.selectionBackground': '#49483E',
      },
    });
  } catch (error) {
    console.error('Error defining custom themes:', error);
  }
};

export function CodeEditor() {
  const [mounted, setMounted] = useState(false);
  const content = useLatexEditorStore((state) => state.content);
  const setContent = useLatexEditorStore((state) => state.setContent);
  const editorTheme = useLatexEditorStore((state) => state.editorTheme);

  // Set mounted state
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex h-[calc(100vh-8rem)] w-full flex-col bg-muted/20">
        <div className="flex flex-1 items-center justify-center">
          <Skeleton className="h-[80%] w-[90%]" />
        </div>
      </div>
    );
  }

  return (
    <Editor
      height="calc(100vh - 10rem)"
      defaultLanguage="latex"
      value={content}
      onChange={(value) => setContent(value || '')}
      options={{
        minimap: { enabled: false },
        fontSize: 14,
        wordWrap: 'on',
        scrollBeyondLastLine: false,
        automaticLayout: true,
        lineNumbers: 'on',
        renderLineHighlight: 'all',
        tabSize: 2,
        cursorBlinking: 'smooth',
        cursorSmoothCaretAnimation: 'on',
        smoothScrolling: true,
      }}
      theme={editorTheme}
      onMount={handleEditorDidMount}
    />
  );
}
