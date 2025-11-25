"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Route from "@/app/constants/Route";

// ----------------------
// ✅ ZOD SCHEMA
// ----------------------
const LoginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginValues = z.infer<typeof LoginSchema>;

// ----------------------
// ✅ UI COMPONENT
// ----------------------
export default function LoginPage() {
  const form = useForm<LoginValues>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(values: LoginValues) {
    console.log("LOGIN:", values);
  }

  return (
    <div className="max-w-md mx-auto py-10 flex flex-col justify-center">
      {/* HEADER */}
      <div className="text-center space-y-2 mb-6">
        <Link href={Route.HOME}>
          <h1 className="text-5xl font-bold">
            <span className="text-black">Scan</span>
            <span className="text-[#C84501]">2Dish</span>
          </h1>
        </Link>

        <p className="text-gray-600 text-2xl text-center my-4">
          Welcome back login to continue to view your orders
        </p>
      </div>

      {/* TITLE */}
      <h2 className="text-xl font-semibold mb-4">Login</h2>

      {/* FORM */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                    className="rounded-xl border border-orange-600 bg-orange-50 p-5"
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
                    className="rounded-xl border border-orange-600 bg-orange-50 p-5"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* SUBMIT BUTTON */}
          <Button
            type="submit"
            className="w-full bg-[#C84501] hover:bg-orange-800 text-white rounded-xl p-5 text-lg"
          >
            Login
          </Button>
        </form>
      </Form>

      {/* FOOTER */}
      <p className="text-center text-gray-600 mt-4">
        Don't have an account?{" "}
        <Link href={Route.SIGNUPAGE} className="text-[#C84501] font-medium">
          Sign up
        </Link>
      </p>
    </div>
  );
}
