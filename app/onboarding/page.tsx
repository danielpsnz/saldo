"use client";

import React, { JSX } from "react";
import { SignOutButton, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { completeOnboarding } from "./_actions";

import { StepProps } from "@/types";
import OnboardingSetup from "@/features/onboarding/steps/onboarding-setup";
import { cn } from "@/lib/utils";
import { OnboardingNavbar } from "@/features/onboarding/onboarding-navbar";
import { Transition } from "@headlessui/react";
import { useQueryParam } from "@/hooks/use-query-param";

import { useOnboarding } from "@/hooks/use-onboarding";
import { useUpdateOnboarding } from "@/hooks/use-update-onboarding";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import OnboardingPreferencesFirst from "@/features/onboarding/steps/onboarding-preferences-1";

function getStepComponent(stepKey?: string): (props: StepProps) => JSX.Element {
  switch (stepKey) {
    case "preferences_first":
      return OnboardingPreferencesFirst;
    case "setup":
    default:
      return OnboardingSetup;
  }
}

export default function OnboardingPage() {
  const { user } = useUser();
  const router = useRouter();
  const [error, setError] = React.useState("");

  const stepParam = useQueryParam("step", "string");
  const onboarding = useOnboarding();
  const updateOnboarding = useUpdateOnboarding();

  if (!onboarding?.data) {
    return <div>Loading onboarding...</div>;
  }

  const { steps } = onboarding.data;
  const currentStep = steps.find((step) => step.key === stepParam) ?? steps[0];
  const currentStepIdx = steps.findIndex(
    (step) => step.key === currentStep?.key
  );
  const StepComponent = getStepComponent(currentStep?.key);

  const handleSubmit = async (formData: FormData) => {
    const res = await completeOnboarding(formData);
    if (res?.message) {
      await user?.reload();
      router.push("/");
    } else if (res?.error) {
      setError(res.error);
    }
  };

  async function prev() {
    if (currentStepIdx > 0) {
      router.push(`/onboarding?step=${steps[currentStepIdx - 1].key}`);
    }
  }

  async function next() {
    await updateOnboarding.mutateAsync({
      flow: "main",
      updates: [{ key: currentStep.key, markedComplete: true }],
    });

    if (currentStepIdx < steps.length - 1) {
      router.push(`/onboarding?step=${steps[currentStepIdx + 1].key}`);
    } else {
      router.push("/");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-8 shadow-md">
        {currentStep.group && currentStep.group !== "account" && (
          <OnboardingNavbar
            steps={steps}
            currentStep={currentStep}
            onBack={prev}
          />
        )}

        <Transition
          key={currentStep.key}
          appear
          show={true}
          enter="ease-in duration-100"
          enterFrom="opacity-0 translate-y-8"
          enterTo="opacity-100 translate-y-0"
          leave="ease-in duration-100"
          leaveFrom="opacity-100 translate-y-0"
          leaveTo="opacity-0 translate-y-8"
        >
          <div className={cn("px-6 mb-20 grow z-10")}>
            <StepComponent
              title={currentStep.title}
              onNext={next}
              onPrev={prev}
            />
          </div>
        </Transition>

        <div className="flex items-center justify-center space-x-4 p-2 text-sm text-gray-600 font-bold cursor-pointer">
          {currentStepIdx > 0 && (
            <button
              onClick={prev}
              className="flex items-center space-x-1 hover:text-cactusGreen"
              aria-label="Go back"
            >
              <ArrowLeftIcon className="h-5 w-5" />
              <span>Back</span>
            </button>
          )}
          <SignOutButton />
        </div>
      </div>
    </div>
  );
}
