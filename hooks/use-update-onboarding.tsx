export const useUpdateOnboarding = () => {
  return {
    mutateAsync: async (data: any) => {
      console.log("Updating onboarding", data);
    },
  };
};
