import React from "react";
import { AtSymbolIcon, UserIcon, KeyIcon } from "@heroicons/react/24/solid";
import Button from "@/app/ui/button/button";
import Link from "next/link";

const SignUpForm = () => {
  return (
    <form>
      <div className="space-y-6">
        <div>
          <label htmlFor="email" className="mb-2 block text-sm font-medium">
            Email
          </label>
          <div className="relative">
            <input
              id="email"
              type="text"
              placeholder="jhon@doe.com"
              autoComplete="off"
              className="peer bg-athens-gray placeholder:text-secondary-300 block w-full rounded-md py-[9px] pl-10 text-sm outline-none"
            />
            <AtSymbolIcon className="pointer-events-none absolute top-1/2 left-3 h-[18px] w-[18px] -translate-y-2.5 text-gray-500 peer-focus:text-gray-900" />
          </div>
          {/*errors{errors?.email && (
            <p className="text-error-600 mt-2 text-sm">
              {errors?.email?.message}
            </p>
          )}*/}
        </div>
        <div>
          <label htmlFor="username" className="mb-2 block text-sm font-medium">
            User Name
          </label>
          <div className="relative">
            <input
              id="username"
              type="text"
              placeholder="Jhon*1234"
              autoComplete="off"
              className="peer bg-athens-gray placeholder:text-secondary-300 block w-full rounded-md py-[9px] pl-10 text-sm outline-none"
            />
            <UserIcon className="pointer-events-none absolute top-1/2 left-3 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
          </div>
          {/*errors{errors?.email && (
            <p className="text-error-600 mt-2 text-sm">
              {errors?.email?.message}
            </p>
          )}*/}
        </div>
        <div>
          <label htmlFor="password" className="mb-2 block text-sm font-medium">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type="password"
              name="password"
              placeholder="Enter your password"
              autoComplete="off"
              className="peer bg-athens-gray placeholder:text-secondary-300 block w-full rounded-md py-[9px] pl-10 text-sm outline-none"
            />
            <KeyIcon className="pointer-events-none absolute top-1/2 left-3 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
          </div>
          {/*errors{errors?.email && (
            <p className="text-error-600 mt-2 text-sm">
              {errors?.email?.message}
            </p>
          )}*/}
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
              id="confirmPassword"
              type="password"
              name="confirmPassword"
              placeholder="Re-Enter your password"
              autoComplete="off"
              className="peer bg-athens-gray placeholder:text-secondary-300 block w-full rounded-md py-[9px] pl-10 text-sm outline-none"
            />
            <KeyIcon className="pointer-events-none absolute top-1/2 left-3 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
          </div>
          {/*errors{errors?.email && (
            <p className="text-error-600 mt-2 text-sm">
              {errors?.email?.message}
            </p>
          )}*/}
        </div>
      </div>
      <Button customClassName="w-full mt-6" size="medium" type="submit">
        Sign up
      </Button>
      <div className="before: after:ml:4 before:bg-secondary-400 after:bg-secondary-400 mx-auto my-4 mr-4 flex w-full items-center justify-evenly gap-x-2.5 before:block before:h-px before:flex-grow after:block after:h-px after:flex-grow">
        or
      </div>
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
