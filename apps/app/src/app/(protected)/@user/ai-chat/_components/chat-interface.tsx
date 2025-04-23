'use client';

import type React from 'react';

import { askDocumentQuestion } from '@/lib/ai-utils';
import { Avatar } from '@repo/design-system/components/ui/avatar';
import { Button } from '@repo/design-system/components/ui/button';
import { Input } from '@repo/design-system/components/ui/input';
import { ScrollArea } from '@repo/design-system/components/ui/scroll-area';
import { Send } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Typography } from './typography';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatInterfaceProps {
  documentText: string;
}

export default function ChatInterface({ documentText }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content:
        "Hello! I'm your document assistant. Ask me anything about the uploaded document.",
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) {
      return;
    }

    const userMessage = input.trim();
    setInput('');

    // Add user message to chat
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);

    // Set loading state
    setIsLoading(true);

    try {
      // Get AI response
      const response = await askDocumentQuestion(documentText, userMessage);

      // Add AI response to chat
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: response },
      ]);
    } catch (error) {
      console.error('Error getting response:', error);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            "I'm sorry, I encountered an error while processing your question. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="relative flex h-[55vh] flex-col">
      <ScrollArea className="h-full px-4">
        <div className="space-y-4 pb-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`flex max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
              >
                <Avatar
                  className={`size-8 ${message.role === 'user' ? 'ml-2' : 'mr-2'}`}
                >
                  <div className="flex h-full w-full items-center justify-center bg-primary text-primary-foreground">
                    {message.role === 'user' ? 'U' : 'AI'}
                  </div>
                </Avatar>
                <div
                  className={`rounded-lg px-3 py-2 text-sm ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  {message.role === 'assistant' ? (
                    <Typography variant="prose" className="max-w-none text-sm">
                      <ReactMarkdown>{message.content}</ReactMarkdown>
                    </Typography>
                  ) : (
                    message.content
                  )}
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex flex-row">
                <Avatar className="mr-2 size-8">
                  <div className="flex h-full w-full items-center justify-center bg-primary text-primary-foreground">
                    AI
                  </div>
                </Avatar>
                <div className="rounded-lg bg-muted px-3 py-2 text-sm">
                  <div className="mt-1 flex space-x-1">
                    <div className="size-2 animate-bounce rounded-full bg-primary" />
                    <div className="size-2 animate-bounce rounded-full bg-primary delay-75" />
                    <div className="size-2 animate-bounce rounded-full bg-primary delay-150" />
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <div className="-bottom-8 absolute left-0 flex w-full items-center space-x-2 bg-background p-4">
        <Input
          placeholder="Ask a question about the document..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
          className="flex-1"
        />
        <Button
          size="icon"
          onClick={handleSendMessage}
          disabled={isLoading || !input.trim()}
        >
          <Send />
        </Button>
      </div>
    </div>
  );
}
