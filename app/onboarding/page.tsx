"use client";

import React, { useState } from "react";
import { SignOutButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { completeOnboarding } from "@/app/onboarding/_actions";
import { useUser } from "@clerk/nextjs";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

const onBoardingSchema = z.object({
  household: z.string().min(2).max(50),
  preferred_currency: z.string().min(2).max(50),
  preferred_language: z.string().min(2).max(50),
  country: z.string().min(2).max(50),
  date_format: z.string().min(5),
});

export default function OnboardingPage() {
  const form = useForm<z.infer<typeof onBoardingSchema>>({
    resolver: zodResolver(onBoardingSchema),
    defaultValues: {
      household: "",
      preferred_currency: "",
      preferred_language: "",
      country: "",
      date_format: "YYYY-MM-DD",
    },
  });

  const router = useRouter();
  const { user } = useUser();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: z.infer<typeof onBoardingSchema>) => {
    setLoading(true); // start loader
    try {
      const formData = new FormData();
      formData.append("household", data.household);
      formData.append("preferred_currency", data.preferred_currency);
      formData.append("preferred_language", data.preferred_language);
      formData.append("country", data.country);
      formData.append("date_format", data.date_format);

      await completeOnboarding(formData);
      await user?.reload();
      router.push("/");
    } catch (error) {
      console.error("Onboarding error:", error);
    } finally {
      setLoading(false); // stop loader
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-lg space-y-8 rounded-xl p-8 shadow-md">
        <div className={cn("px-6 mb-20 grow z-10")}>
          {/* Heading */}
          <div className="my-10">
            <h2 className="text-center text-3xl font-semibold text-gray-900">
              Let's set up your account <span className="ml-1">😃</span>
            </h2>
          </div>

          {/* Form */}
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-6"
            >
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
                        className="mt-1 text-black-1 dark:text-white"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="preferred_currency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm text-gray-600">
                      Currency
                    </FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className="w-full text-black-1 dark:text-white">
                          <SelectValue placeholder="Select your preferred currency" />
                        </SelectTrigger>
                        <SelectContent className="text-black-1 dark:text-white">
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
                        <SelectTrigger className="w-full text-black-1 dark:text-white">
                          <SelectValue placeholder="Select your preferred language" />
                        </SelectTrigger>
                        <SelectContent className="text-black-1 dark:text-white">
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
                    <FormLabel className="text-sm text-gray-600">
                      Country
                    </FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className="w-full text-black-1 dark:text-white">
                          <SelectValue placeholder="Select your country" />
                        </SelectTrigger>
                        <SelectContent className="text-black-1 dark:text-white">
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

              <FormField
                control={form.control}
                name="date_format"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm text-gray-600">
                      Date format
                    </FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className="w-full text-black-1 dark:text-white">
                          <SelectValue placeholder="Select your preferred date format" />
                        </SelectTrigger>
                        <SelectContent className="text-black-1 dark:text-white">
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

              <div className="my-5">
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#3e4e32] hover:bg-[#2e3e24] text-white flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    "Go to dashboard"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>

        <div className="flex items-center justify-center space-x-4 p-2 text-sm text-gray-600 font-bold cursor-pointer">
          <SignOutButton />
        </div>
      </div>
    </div>
  );
}
