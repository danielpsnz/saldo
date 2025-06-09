export const useOnboarding = () => {
  return {
    data: {
      steps: [
        {
          key: "setup",
          title: "Let's set up your account",
          group: "main",
          isComplete: false,
          isMarkedComplete: false,
        },
        {
          key: "preferences_first",
          title: "Let’s set up your preferences",
          group: "main",
          isComplete: false,
          isMarkedComplete: false,
        },
        {
          key: "preferences_second",
          title: "Let’s set up your preferences",
          group: "main",
          isComplete: false,
          isMarkedComplete: false,
        },
      ],
    },
  };
};
