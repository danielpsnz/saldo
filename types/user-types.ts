export type OnboardingStep = {
  key: string;
  title: string;
  isComplete: boolean;
  isMarkedComplete: boolean;
  group?: string;
  ctaPath?: string;
};

export type StepProps = {
  title: string;
  onNext(): Promise<void>;
  onPrev(): Promise<void>;
};
