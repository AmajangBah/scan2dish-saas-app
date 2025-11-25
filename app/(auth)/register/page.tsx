"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Route from "@/app/constants/Route";

// ----------------------
// ✅ ZOD SCHEMA
// ----------------------
const SignupFormSchema = z
  .object({
    businessName: z.string().min(1, "Business name is required"),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Invalid email address")
      .max(255, "Email too long"),
    phone: z
      .string()
      .min(10, "Phone number must be at least 10 digits")
      .max(15, "Phone number too long"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

type SignupValues = z.infer<typeof SignupFormSchema>;

// ----------------------
// ✅ UI COMPONENT
// ----------------------
const SignupPage = () => {
  const form = useForm<SignupValues>({
    resolver: zodResolver(SignupFormSchema),
    defaultValues: {
      businessName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
  });

  function onSubmit(values: SignupValues) {
    console.log("Form Submitted:", values);
  }

  return (
    <div className="max-w-md mx-auto py-10">
      {/* HEADER */}
      <div className="text-center space-y-2 mb-10">
        <Link href={Route.HOME}>
          <h1 className="text-4xl font-bold">
            <span className="text-black">Scan</span>
            <span className="text-[#C84501]">2Dish</span>
          </h1>
        </Link>

        <p className="text-gray-600 text-center my-4 text-2xl">
          Welcome, create your account to get started
        </p>
      </div>

      {/* SIGNUP TITLE */}
      <h2 className="text-xl font-semibold mb-4">Sign Up</h2>

      {/* FORM */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Business Name */}
          <FormField
            control={form.control}
            name="businessName"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="Business Name"
                    {...field}
                    className="rounded-xl border border-[#C84501] bg-orange-50 p-5 "
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="Email"
                    {...field}
                    className="rounded-xl border border-[#C84501] bg-orange-50 p-5 "
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Phone */}
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="Phone Number"
                    {...field}
                    className="rounded-xl border border-[#C84501] bg-orange-50 p-5 "
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Password */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Password"
                    {...field}
                    className="rounded-xl border border-[#C84501] bg-orange-50 p-5 "
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Confirm Password */}
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Confirm Password"
                    {...field}
                    className="rounded-xl border border-[#C84501] bg-orange-50 p-5 "
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* SUBMIT BUTTON */}
          <Button
            type="submit"
            className="w-full bg-orange-700 hover:bg-orange-800 text-white rounded-xl p-5 text-lg"
          >
            Sign Up
          </Button>
        </form>
      </Form>

      {/* Login Link */}
      <p className="text-center text-gray-600 mt-4">
        Already have an account?{" "}
        <Link href={Route.LOGINPAGE} className="text-[#C84501] font-medium">
          Login in
        </Link>
      </p>
    </div>
  );
};
export default SignupPage;
