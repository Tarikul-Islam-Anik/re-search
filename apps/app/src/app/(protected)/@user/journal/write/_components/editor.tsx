'use client';

import { useJournalStore } from '@/store/use-journal-store';
import type { Content } from '@tiptap/react';
import { useEffect } from 'react';
import MinimalTiptapEditor from './editor/index';

interface EditorProps {
  placeholder?: string;
  editorClassName?: string;
}

const Editor = ({ placeholder, editorClassName }: EditorProps) => {
  const { activeEntryId, getActiveEntry, updateEntry } = useJournalStore();

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
  };

  // Create a new entry if there's no active entry on component mount
  useEffect(() => {
    if (!activeEntryId) {
      // This is handled in JournalDetails component
    }
  }, [activeEntryId]);

  return (
    <MinimalTiptapEditor
      value={initialContent}
      onChange={handleChange}
      placeholder={placeholder}
      editorContentClassName={editorClassName}
      autofocus="end"
    />
  );
};

Editor.displayName = 'JournalEditor';

export default Editor;
