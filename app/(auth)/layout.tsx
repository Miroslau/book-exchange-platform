import React, { FC } from "react";

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout: FC<AuthLayoutProps> = ({ children }) => {
  return <div className="rounded-md bg-white p-[24px]">{children}</div>;
};

export default AuthLayout;
