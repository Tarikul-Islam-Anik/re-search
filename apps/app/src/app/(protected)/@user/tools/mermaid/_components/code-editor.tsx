'use client';

import Editor, { type OnMount } from '@monaco-editor/react';
import { useRef } from 'react';
import { mermaidSyntax } from './mermaid-syntax';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function CodeEditor({ value, onChange }: CodeEditorProps) {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const editorRef = useRef<any>(null);

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;

    // Register Mermaid language
    monaco.languages.register({ id: 'mermaid' });

    // Define Mermaid syntax highlighting
    // @ts-ignore
    monaco.languages.setMonarchTokensProvider('mermaid', mermaidSyntax);
  };

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      onChange(value);
    }
  };

  return (
    <Editor
      height="100%"
      defaultLanguage="mermaid"
      defaultValue={value}
      value={value}
      theme="vs-dark"
      options={{
        minimap: { enabled: false },
        automaticLayout: true,
        scrollBeyondLastLine: false,
        fontSize: 14,
        lineNumbers: 'on',
        renderLineHighlight: 'all',
        scrollbar: {
          useShadows: false,
          verticalScrollbarSize: 10,
          horizontalScrollbarSize: 10,
        },
      }}
      onMount={handleEditorDidMount}
      onChange={handleEditorChange}
      className="rounded-md border"
    />
  );
}
