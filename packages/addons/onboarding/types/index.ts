import type { StepType as ReactourStepType } from '@reactour/tour';

// Re-export the StepType from @reactour/tour
export type StepType = ReactourStepType;

// Extended tour step with additional properties if needed
export interface TourStep extends ReactourStepType {
  // Add any custom properties here
}
