import type { StepType } from '@reactour/tour';

export const steps: StepType[] = [
  {
    selector: '[data-tour="step-1"]',
    content: 'Welcome! This is your dashboard overview.',
  },
  {
    selector: '[data-tour="step-2"]',
    content: 'Click here to create a new project.',
  },
];
