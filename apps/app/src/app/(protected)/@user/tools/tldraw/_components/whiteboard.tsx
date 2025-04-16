'use client';

import { useEffect, useState } from 'react';
import { Tldraw } from 'tldraw';
import 'tldraw/tldraw.css';

import { Skeleton } from '@repo/design-system/components/ui/skeleton';

export function Whiteboard() {
  const [mounted, setMounted] = useState(false);

  // Ensure we're only rendering on the client
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex size-full items-center justify-center bg-muted">
        <Skeleton className="size-full" />
      </div>
    );
  }

  return (
    <div className="tldraw__editor size-full">
      <Tldraw persistenceKey="my-whiteboard" autoFocus />
    </div>
  );
}
