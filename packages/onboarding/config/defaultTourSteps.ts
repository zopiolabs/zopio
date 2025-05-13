import type { TourStep } from '../types';

export const steps: TourStep[] = [
  {
    selector: '[data-tour="step-1"]',
    content: 'Welcome! This is your dashboard overview.',
  },
  {
    selector: '[data-tour="step-2"]',
    content: 'Click here to create a new project.',
  },
];
