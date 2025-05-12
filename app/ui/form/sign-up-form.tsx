import React from "react";
import { AtSymbolIcon, UserIcon } from "@heroicons/react/24/solid";

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
      </div>
    </form>
  );
};

export default SignUpForm;
