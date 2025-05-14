'use client';

import { ReactNode } from 'react';
import { TourProvider } from '@reactour/tour';
import { steps } from '../config/defaultTourSteps';

type Props = {
  children: ReactNode;
};

export function UserTourProvider({ children }: Props) {
  return (
    <TourProvider steps={steps} showCloseButton maskClassName="bg-black/40">
      {children}
    </TourProvider>
  );
}
