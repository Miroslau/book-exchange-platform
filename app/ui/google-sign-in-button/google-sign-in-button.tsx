import React, { FC } from "react";
import Button from "@/app/ui/button/button";

interface GoogleSignInButtonProps {
  children: React.ReactNode;
}

const GoogleSignInButton: FC<GoogleSignInButtonProps> = ({ children }) => {
  const loginWithGoogle = () => {
    console.log("login with google");
  };

  return (
    <Button
      customClassName="w-full mt-6"
      size="medium"
      type="button"
      onClick={loginWithGoogle}
    >
      {children}
    </Button>
  );
};

export default GoogleSignInButton;
