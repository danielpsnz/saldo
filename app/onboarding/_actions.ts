"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";

export const completeOnboarding = async (formData: FormData) => {
    const client = await clerkClient()
  const { userId } = await auth();

  if (!userId) {
    return { message: "User not authenticated" };
  }

  try {
    const res = await client.users.updateUser(userId, {
      publicMetadata: {
        onboardingComplete: true,
        household: formData.get("household"),
        preferred_currency: formData.get("preferred_currency"),
        preferred_language: formData.get("preferred_language"),
        country: formData.get("country"),
        date_format: formData.get("date_format"),
        theme: formData.get("theme"),
      },
    });
    return { message: res.publicMetadata };
  } catch (err) {
    return { error: "There was an error updating the user metadata." };
  }
};
