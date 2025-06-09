import uniqBy from "lodash/uniqBy";
import { cn } from "@/lib/utils";
import { OnboardingStep } from "@/types";

type Props = {
  steps: OnboardingStep[];
  currentStep: OnboardingStep;
  onBack(): void;
};

export function OnboardingNavbar({ steps, currentStep, onBack }: Props) {
  const groups = uniqBy(steps, "group")
    .map((s) => s.group)
    .filter((g): g is string => g != null);
  const currentGroupSteps = steps.filter(
    (step) => step.group === currentStep.group
  );
  const currentGroupIdx = groups.findIndex(
    (group) => group === currentStep?.group
  );
  const isLastGroup = currentGroupIdx === groups.length - 1;
  const hasSubsteps = currentGroupSteps.length > 1;
  const substepIdx = currentGroupSteps.findIndex(
    (substep) => substep.key === currentStep.key
  );

  return (
    <div className={cn("mx-4 md:mx-12", !hasSubsteps && "mb-10 sm:mb-20")}>
      {currentGroupSteps.length > 1 && (
        <div className="flex justify-center items-center space-x-2">
          {currentGroupSteps.map((_, idx) => (
            <div
              key={idx}
              className={cn(
                "h-2 w-10 rounded-full transition-colors",
                idx === substepIdx ? "bg-[#3e4e32]" : "bg-[#e8f5e9]"
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}
