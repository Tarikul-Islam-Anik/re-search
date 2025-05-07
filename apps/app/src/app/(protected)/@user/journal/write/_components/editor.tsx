'use client';

import { useJournalStore } from '@/store/use-journal-store';
import type { Content, Editor as TiptapEditor } from '@tiptap/react';
import { useEffect, useRef } from 'react';
import MinimalTiptapEditor from './editor/index';

interface EditorProps {
  placeholder?: string;
  editorClassName?: string;
}

const Editor = ({ placeholder, editorClassName }: EditorProps) => {
  const { activeEntryId, getActiveEntry, updateEntry, updateEditorData } =
    useJournalStore();
  const editorRef = useRef<TiptapEditor | null>(null);

  // Get content from store
  const entry = getActiveEntry();
  const initialContent = entry?.content ? JSON.parse(entry.content) : undefined;

  // Handle content changes
  const handleChange = (content: Content) => {
    if (!activeEntryId) return;

    // Convert content to JSON string for storage
    const contentString = JSON.stringify(content);

    // Update the journal entry with new content
    updateEntry(activeEntryId, { content: contentString });

    // Track editor statistics
    if (editorRef.current) {
      const editor = editorRef.current;
      const characterCount = editor.storage.characterCount?.characters() || 0;
      const wordCount = editor.storage.characterCount?.words() || 0;

      // Use selection to get cursor position if available
      const cursorPosition = editor.state.selection.anchor;

      // Update editor data in store
      updateEditorData(activeEntryId, {
        characterCount,
        wordCount,
        cursorPosition,
        lastEditedAt: new Date().toISOString(),
      });
    }
  };

  // Create a new entry if there's no active entry on component mount
  useEffect(() => {
    if (!activeEntryId) {
      // This is handled in JournalDetails component
    }
  }, [activeEntryId]);

  // Save editor reference to track statistics
  const handleEditorReady = (editor: TiptapEditor) => {
    editorRef.current = editor;
  };

  return (
    <MinimalTiptapEditor
      value={initialContent}
      onChange={handleChange}
      placeholder={placeholder}
      editorContentClassName={editorClassName}
      autofocus="end"
      onEditorReady={handleEditorReady}
    />
  );
};

Editor.displayName = 'JournalEditor';

export default Editor;
