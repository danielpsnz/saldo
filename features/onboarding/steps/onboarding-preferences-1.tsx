"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

const onBoardingPreferencesFirstSchema = z.object({
  preferred_currency: z.string().min(2).max(50),
  preferred_language: z.string().min(2).max(50),
  country: z.string().min(2).max(50),
});

export default function OnboardingPreferencesFirst({ title, onNext, onPrev }: StepProps) {
  const form = useForm<z.infer<typeof onBoardingPreferencesFirstSchema>>({
    resolver: zodResolver(onBoardingPreferencesFirstSchema),
    defaultValues: {
      preferred_currency: "",
      preferred_language: "",
      country: "",
    },
  });

  function onSubmit(values: z.infer<typeof onBoardingPreferencesFirstSchema>) {
    console.log(values);
  }

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
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="preferred_currency"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm text-gray-600">
                  Currency
                </FormLabel>
                <FormControl>
                  <Select>
                    <SelectTrigger className="w-[280px]">
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
