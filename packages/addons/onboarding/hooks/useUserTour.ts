import { useTour } from '@reactour/tour';

export const useUserTour = () => {
  const { setIsOpen, isOpen, currentStep, setCurrentStep } = useTour();
  return { setIsOpen, isOpen, currentStep, setCurrentStep };
};
