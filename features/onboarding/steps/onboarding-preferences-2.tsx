"use client";

import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { StepProps } from "@/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUser } from "@clerk/nextjs";
import { completeOnboarding } from "@/app/onboarding/_actions";

const onBoardingPreferencesSecondSchema = z.object({
  date_format: z.string().min(5),
  theme: z.string().min(2).max(50),
});

const themes = [
  {
    id: "light",
    name: "Light",
    image: "/icons/light-theme.svg",
  },
  {
    id: "dark",
    name: "Dark",
    image: "/icons/dark-theme.svg",
  },
  {
    id: "system",
    name: "System",
    image: "/icons/system-theme.svg",
  },
];

export default function OnboardingPreferencesSecond({
  title,
  onNext,
  onPrev,
}: StepProps) {
  const form = useForm<z.infer<typeof onBoardingPreferencesSecondSchema>>({
    resolver: zodResolver(onBoardingPreferencesSecondSchema),
    defaultValues: {
      date_format: "YYYY-MM-DD",
      theme: "system",
    },
  });

  const { user } = useUser();

  const handleSubmit = async (
    data: z.infer<typeof onBoardingPreferencesSecondSchema>
  ) => {
    try {
      // Convertir el objeto a FormData
      const formData = new FormData();
      formData.append("date_format", data.date_format);
      formData.append("theme", data.theme);

      // Llamar a la función que espera FormData
      await completeOnboarding(formData);

      if (user?.reload) {
        await user.reload();
      }

      onNext();
    } catch (err) {
      console.error("Error saving data:", err);
    }
  };

  return (
    <>
      {/* Heading */}
      <div className="my-10">
        <h2 className="text-center text-3xl font-semibold text-gray-900">
          {title} <span className="ml-1">😉</span>
        </h2>
      </div>

      {/* Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          {/* Date Format Selector */}
          <FormField
            control={form.control}
            name="date_format"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm text-gray-600">
                  Date format
                </FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select your preferred date format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MM/DD/YYYY">
                        MM/DD/YYYY (e.g., 06/09/2025)
                      </SelectItem>
                      <SelectItem value="DD/MM/YYYY">
                        DD/MM/YYYY (e.g., 09/06/2025)
                      </SelectItem>
                      <SelectItem value="YYYY-MM-DD">
                        YYYY-MM-DD (e.g., 2025-06-09)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
              </FormItem>
            )}
          />

          {/* Theme Selector */}
          <FormField
            control={form.control}
            name="theme"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm text-gray-600">Theme</FormLabel>
                <FormControl>
                  <div className="flex justify-center gap-4">
                    {themes.map((theme) => (
                      <button
                        type="button"
                        key={theme.id}
                        onClick={() => field.onChange(theme.id)}
                        className={cn(
                          "rounded-xl border p-2 transition-all hover:ring-2 hover:ring-offset-2 hover:ring-miniGreen",
                          field.value === theme.id
                            ? "ring-2 ring-cactusGreen dark:ring-miniGreen"
                            : "border-gray-300 dark:border-gray-600"
                        )}
                      >
                        <div className="relative">
                          <img
                            src={theme.image}
                            alt={theme.name}
                            className="w-[120px] h-[80px] rounded-md object-cover"
                          />
                          {field.value === theme.id && (
                            <Check className="absolute top-2 right-2 h-5 w-5 text-green-500" />
                          )}
                        </div>
                        <p className="mt-2 text-center text-sm">{theme.name}</p>
                      </button>
                    ))}
                  </div>
                </FormControl>
              </FormItem>
            )}
          />

          <div className="my-5">
            <Button
              type="submit"
              className="w-full bg-[#3e4e32] hover:bg-[#2e3e24] text-white"
            >
              Go to dashboard
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}
