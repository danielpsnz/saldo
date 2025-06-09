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

const onBoardingSetupSchema = z.object({
  household: z.string().min(2).max(50),
});

export default function OnboardingSetup({ title, onNext, onPrev }: StepProps) {
  const form = useForm<z.infer<typeof onBoardingSetupSchema>>({
    resolver: zodResolver(onBoardingSetupSchema),
    defaultValues: {
      household: "",
    },
  });

  function onSubmit(values: z.infer<typeof onBoardingSetupSchema>) {
    console.log(values);
  }

  return (
    <>
      {/* Heading */}
      <div className="my-10">
        <h2 className="text-center text-3xl font-semibold text-gray-900">
          {title} <span className="ml-1">😃</span>
        </h2>
      </div>

      {/* Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="household"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm text-gray-600">
                  Household
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter a household name"
                    {...field}
                    className="mt-1"
                  />
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
