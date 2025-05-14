import React, { FC } from "react";
import Button from "@/app/ui/button/button";

interface GoogleSignInButtonProps {
  children: React.ReactNode;
  disabled?: boolean;
}

const GoogleSignInButton: FC<GoogleSignInButtonProps> = ({
  children,
  disabled = false,
}) => {
  const loginWithGoogle = () => {
    console.log("login with google");
  };

  return (
    <Button
      disabled={disabled}
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
