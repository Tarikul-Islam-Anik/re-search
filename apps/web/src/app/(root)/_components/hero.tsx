'use client';

import { useEffect, useMemo, useState } from 'react';

import { Button } from '@repo/design-system/components/ui/button';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, PenLine } from 'lucide-react';
import Link from 'next/link';

export const Hero = () => {
  const [titleNumber, setTitleNumber] = useState(0);
  const titles = useMemo(
    () => [
      'researchers',
      'students',
      'academics',
      'knowledge workers',
      'scientists',
    ],
    []
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (titleNumber === titles.length - 1) {
        setTitleNumber(0);
      } else {
        setTitleNumber(titleNumber + 1);
      }
    }, 2000);
    return () => clearTimeout(timeoutId);
  }, [titleNumber, titles]);

  return (
    <div className="w-full">
      <div className="container mx-auto">
        <div className="flex flex-col items-center justify-center gap-8 py-20 lg:py-40 xl:py-60">
          <div>
            <Button variant="secondary" size="sm">
              Explore Re:Search <ArrowRight />
            </Button>
          </div>
          <div className="flex flex-col gap-4">
            <h1 className="max-w-2xl text-center font-regular text-5xl tracking-tighter md:text-7xl">
              <span className="text-spektr-cyan-50">Empowering</span>
              <span className="relative flex w-full justify-center overflow-hidden text-center md:pt-1 md:pb-4">
                &nbsp;
                {titles.map((title, index) => (
                  <motion.span
                    key={index}
                    className="absolute font-semibold capitalize"
                    initial={{ opacity: 0, y: '-100' }}
                    transition={{ type: 'spring', stiffness: 50 }}
                    animate={
                      titleNumber === index
                        ? {
                            y: 0,
                            opacity: 1,
                          }
                        : {
                            y: titleNumber > index ? -150 : 150,
                            opacity: 0,
                          }
                    }
                  >
                    {title}
                  </motion.span>
                ))}
              </span>
            </h1>

            <p className="max-w-2xl text-center text-lg text-muted-foreground leading-relaxed tracking-tight md:text-xl">
              Re:Search integrates AI-powered journaling with advanced research
              management capabilities. Capture, organize, and synthesize ideas
              and research findings, ensuring you can effortlessly navigate your
              knowledge and make meaningful connections between disparate
              insights.
            </p>
          </div>
          <div className="flex flex-row gap-3">
            <Button size="lg" className="gap-4" variant="outline">
              Learn more <BookOpen />
            </Button>
            <Link href={`${process.env.NEXT_PUBLIC_APP_URL}/signup`}>
              <Button size="lg" className="gap-4">
                <PenLine />
                Start Writing Now
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
