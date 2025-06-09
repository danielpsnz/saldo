"use client";

import { Button } from "@/components/ui/button";
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

const onBoardingPreferencesFirstSchema = z.object({
  preferred_currency: z.string().min(2).max(50),
  preferred_language: z.string().min(2).max(50),
  country: z.string().min(2).max(50),
});

export default function OnboardingPreferencesFirst({
  title,
  onNext,
  onPrev,
  saveStepData,
}: StepProps) {
  const form = useForm<z.infer<typeof onBoardingPreferencesFirstSchema>>({
    resolver: zodResolver(onBoardingPreferencesFirstSchema),
    defaultValues: {
      preferred_currency: "",
      preferred_language: "",
      country: "",
    },
  });

  const { user } = useUser();

  const handleSubmit = async (
    data: z.infer<typeof onBoardingPreferencesFirstSchema>
  ) => {
    try {
      // Guardar localmente si quieres
      saveStepData?.(data);

      // Convertir el objeto a FormData
      const formData = new FormData();
      formData.append("preferred_currency", data.preferred_currency);
      formData.append("preferred_language", data.preferred_language);
      formData.append("country", data.country);

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
          <FormField
            control={form.control}
            name="preferred_currency"
            render={() => (
              <FormItem>
                <FormLabel className="text-sm text-gray-600">
                  Currency
                </FormLabel>
                <FormControl>
                  <Select>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select your preferred currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="usd">USD Dollar ($)</SelectItem>
                      <SelectItem value="gbp">British Pound (£)</SelectItem>
                      <SelectItem value="eur">Euro (€)</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="preferred_language"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm text-gray-600">
                  Preferred Language
                </FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select your preferred language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                      <SelectItem value="zh">Chinese</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm text-gray-600">Country</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select your country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="us">United States</SelectItem>
                      <SelectItem value="gb">United Kingdom</SelectItem>
                      <SelectItem value="fr">France</SelectItem>
                      <SelectItem value="de">Germany</SelectItem>
                      <SelectItem value="es">Spain</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
              </FormItem>
            )}
          />

          <div className="my-5">
            <Button
              type="submit"
              onClick={onNext}
              className="w-full bg-[#3e4e32] hover:bg-[#2e3e24] text-white"
            >
              Continue
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}
