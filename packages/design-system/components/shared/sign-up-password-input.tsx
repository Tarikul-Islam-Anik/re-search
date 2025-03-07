'use client';

import { Check, X } from 'lucide-react';
import { useId, useMemo } from 'react';

import { cn } from '@repo/design-system/lib/utils';

import { Progress } from '../ui/progress';
import PasswordInput from './password-input';

interface SignUpPasswordProps {
  password: string;
  setPassword: (password: string) => void;
}

export default function SignUpPasswordInput({
  password,
  setPassword,
}: SignUpPasswordProps) {
  const id = useId();
  const checkStrength = (pass: string) => {
    const requirements = [
      // biome-ignore lint/performance/useTopLevelRegex: <explanation>
      { regex: /.{8,}/, text: 'At least 8 characters' },
      // biome-ignore lint/performance/useTopLevelRegex: <explanation>
      { regex: /[0-9]/, text: 'At least 1 number' },
      // biome-ignore lint/performance/useTopLevelRegex: <explanation>
      { regex: /[a-z]/, text: 'At least 1 lowercase letter' },
      // biome-ignore lint/performance/useTopLevelRegex: <explanation>
      { regex: /[A-Z]/, text: 'At least 1 uppercase letter' },
    ];

    return requirements.map((req) => ({
      met: req.regex.test(pass),
      text: req.text,
    }));
  };

  const strength = checkStrength(password);

  const strengthScore = useMemo(() => {
    return strength.filter((req) => req.met).length;
  }, [strength]);

  const getStrengthColor = (score: number) => {
    if (score === 0) {
      return 'bg-border';
    }
    if (score <= 1) {
      return 'bg-red-500';
    }
    if (score <= 2) {
      return 'bg-orange-500';
    }
    if (score === 3) {
      return 'bg-amber-500';
    }
    return 'bg-emerald-500';
  };

  const getStrengthBgColor = (score: number) => {
    if (score === 0) {
      return 'bg-border';
    }
    if (score <= 1) {
      return 'bg-red-50';
    }
    if (score <= 2) {
      return 'bg-orange-50';
    }
    if (score === 3) {
      return 'bg-amber-50';
    }
    return 'bg-emerald-50';
  };

  const getStrengthText = (score: number) => {
    if (score === 0) {
      return 'Enter a password';
    }
    if (score <= 2) {
      return 'Weak password';
    }
    if (score === 3) {
      return 'Medium password';
    }
    return 'Strong password';
  };

  return (
    <div>
      {/* Password input field with toggle visibility button */}
      <PasswordInput
        id={id}
        className="pe-9"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        aria-invalid={strengthScore < 4}
        aria-describedby={`${id}-description`}
      />

      {/* Password strength indicator */}
      <div
        className="mt-3 mb-4 w-full overflow-hidden rounded-full bg-border"
        aria-label="Password strength"
      >
        <Progress
          value={strengthScore * 25}
          className={cn(getStrengthBgColor(strengthScore))}
          indicatorClassName={cn(
            getStrengthColor(strengthScore),
            'transition-all duration-500 ease-out'
          )}
        />
      </div>

      {/* Password strength description */}
      <p
        id={`${id}-description`}
        className="mb-2 font-medium text-foreground text-sm"
      >
        {getStrengthText(strengthScore)}. Must contain:
      </p>

      {/* Password requirements list */}
      <ul className="space-y-1.5" aria-label="Password requirements">
        {strength.map((req) => (
          <li key={req.text} className="flex items-center gap-2">
            {req.met ? (
              <Check
                size={16}
                className="text-emerald-500"
                aria-hidden="true"
              />
            ) : (
              <X
                size={16}
                className="text-muted-foreground/80"
                aria-hidden="true"
              />
            )}
            <span
              className={`text-xs ${req.met ? 'text-emerald-600' : 'text-muted-foreground'}`}
            >
              {req.text}
              <span className="sr-only">
                {req.met ? ' - Requirement met' : ' - Requirement not met'}
              </span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
