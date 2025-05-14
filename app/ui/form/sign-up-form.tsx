"use client";

import React from "react";
import { AtSymbolIcon, UserIcon, KeyIcon } from "@heroicons/react/24/solid";
import Button from "@/app/ui/button/button";
import Link from "next/link";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import GoogleSignInButton from "@/app/ui/google-sign-in-button/google-sign-in-button";
import { useRouter } from "next/navigation";

export const FormSchema = z
  .object({
    username: z.string().min(1, "Username is required").max(100),
    email: z
      .string()
      .min(1, "Email address is required")
      .email("Invalid email address"),
    password: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password must have than 8 characters")
      .refine(
        (password) => /[A-Z]/.test(password),
        "Passwords must include uppercase letters",
      )
      .refine(
        (password) => /[a-z]/.test(password),
        "Passwords must include lowercase letters",
      )
      .refine(
        (password) => /[0-9]/.test(password),
        "Passwords must include numbers",
      )
      .refine(
        (password) => /[!@#$%^&*]/.test(password),
        "Passwords must special characters",
      ),
    confirmPassword: z.string().min(1, "Password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Confirm passwords must be the same as password",
    path: ["confirmPassword"],
  });

const SignUpForm = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
    },
  });
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [isLoadingRequest, setIsLoadingRequest] = React.useState(false);

  const signUpSubmit = async (value: z.infer<typeof FormSchema>) => {
    setErrorMessage(null);
    setIsLoadingRequest(true);
    try {
      const response = await fetch("/api/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: value.email,
          username: value.username,
          password: value.password,
        }),
      });
      if (response.ok) {
        router.push("/sign-in");
      } else {
        const { message }: { message: string } = await response.json();
        setErrorMessage(message);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      }
    } finally {
      setIsLoadingRequest(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(signUpSubmit)}>
      <div className="space-y-6">
        <div>
          <label htmlFor="email" className="mb-2 block text-sm font-medium">
            Email
          </label>
          <div className="relative">
            <input
              {...register("email", { required: true })}
              id="email"
              type="text"
              placeholder="jhon@doe.com"
              autoComplete="off"
              className="peer bg-athens-gray placeholder:text-secondary-300 block w-full rounded-md py-[9px] pl-10 text-sm outline-none"
            />
            <AtSymbolIcon className="pointer-events-none absolute top-1/2 left-3 h-[18px] w-[18px] -translate-y-2.5 text-gray-500 peer-focus:text-gray-900" />
          </div>
          {errors?.email && (
            <p className="text-error-600 mt-2 text-sm">
              {errors?.email?.message}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="username" className="mb-2 block text-sm font-medium">
            User Name
          </label>
          <div className="relative">
            <input
              {...register("username", { required: true })}
              id="username"
              type="text"
              placeholder="Jhon*1234"
              autoComplete="off"
              className="peer bg-athens-gray placeholder:text-secondary-300 block w-full rounded-md py-[9px] pl-10 text-sm outline-none"
            />
            <UserIcon className="pointer-events-none absolute top-1/2 left-3 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
          </div>
          {errors?.username && (
            <p className="text-error-600 mt-2 text-sm">
              {errors?.username?.message}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="password" className="mb-2 block text-sm font-medium">
            Password
          </label>
          <div className="relative">
            <input
              {...register("password", { required: true })}
              id="password"
              type="password"
              name="password"
              placeholder="Enter your password"
              autoComplete="off"
              className="peer bg-athens-gray placeholder:text-secondary-300 block w-full rounded-md py-[9px] pl-10 text-sm outline-none"
            />
            <KeyIcon className="pointer-events-none absolute top-1/2 left-3 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
          </div>
          {errors?.password && (
            <p className="text-error-600 mt-2 text-sm">
              {errors?.password?.message}
            </p>
          )}
        </div>
        <div>
          <label
            htmlFor="confirmPassword"
            className="mb-2 block text-sm font-medium"
          >
            Re-enter password
          </label>
          <div className="relative">
            <input
              {...register("confirmPassword", { required: true })}
              id="confirmPassword"
              type="password"
              name="confirmPassword"
              placeholder="Re-Enter your password"
              autoComplete="off"
              className="peer bg-athens-gray placeholder:text-secondary-300 block w-full rounded-md py-[9px] pl-10 text-sm outline-none"
            />
            <KeyIcon className="pointer-events-none absolute top-1/2 left-3 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
          </div>
          {errors?.confirmPassword && (
            <p className="text-error-600 mt-2 text-sm">
              {errors?.confirmPassword?.message}
            </p>
          )}
        </div>
      </div>
      {errorMessage && (
        <p className="text-error-600 mt-2 text-sm">{errorMessage}</p>
      )}
      <Button
        disabled={isLoadingRequest}
        customClassName="w-full mt-6"
        size="medium"
        type="submit"
      >
        Sign up
      </Button>
      <div className="before: after:ml:4 before:bg-secondary-400 after:bg-secondary-400 mx-auto my-4 mr-4 flex w-full items-center justify-evenly gap-x-2.5 before:block before:h-px before:flex-grow after:block after:h-px after:flex-grow">
        or
      </div>
      <GoogleSignInButton disabled={isLoadingRequest}>
        Sign in with Google
      </GoogleSignInButton>
      <p className="mt-2 w-full text-center text-sm text-gray-600">
        Already have an account?&nbsp;
        <Link className="text-blue-500 hover:underline" href="/sign-in">
          Sign in
        </Link>
      </p>
    </form>
  );
};

export default SignUpForm;
