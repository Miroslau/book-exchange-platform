"use client";

import React from "react";
import Button from "@/app/ui/button/button";
import Link from "next/link";
import { AtSymbolIcon, KeyIcon } from "@heroicons/react/24/solid";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import GoogleSignInButton from "@/app/ui/google-sign-in-button/google-sign-in-button";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

const FormSchema = z.object({
  email: z.string().min(1, "Email address is required"),
  password: z.string().min(1, "Password is required"),
});

const SignInForm = () => {
  const router = useRouter();
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [isLoadingRequest, setIsLoadingRequest] = React.useState(false);

  const signInSubmit = async (value: z.infer<typeof FormSchema>) => {
    setErrorMessage(null);
    setIsLoadingRequest(true);
    try {
      const signInData = await signIn("credentials", {
        email: value.email,
        password: value.password,
        redirect: false,
      });

      if (signInData?.error) {
        console.log(signInData.error);
        setErrorMessage("The email or password is incorrect");
      } else {
        router.push("/");
      }
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      }
    } finally {
      setIsLoadingRequest(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(signInSubmit)}>
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
          <label htmlFor="password" className="mb-2 block text-sm font-medium">
            Password
          </label>
          <div className="relative">
            <input
              {...register("password", { required: true })}
              id="password"
              type="password"
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
        Sign in
      </Button>
      <div className="before: after:ml:4 before:bg-secondary-400 after:bg-secondary-400 mx-auto my-4 mr-4 flex w-full items-center justify-evenly gap-x-2.5 before:block before:h-px before:flex-grow after:block after:h-px after:flex-grow">
        or
      </div>
      <GoogleSignInButton disabled={isLoadingRequest}>
        Sign in with Google
      </GoogleSignInButton>
      <p className="text-secondary-600 mt-2 w-full text-center text-sm">
        Don&apos;t have an account yet?&nbsp;
        <Link className="text-blue-500 hover:underline" href="/sign-up">
          Sign up
        </Link>
      </p>
    </form>
  );
};

export default SignInForm;
