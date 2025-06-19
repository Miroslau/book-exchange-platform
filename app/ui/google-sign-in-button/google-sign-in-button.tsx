import React, { FC, useState } from "react";
import Button from "@/app/ui/button/button";
import { signIn } from "next-auth/react";

interface GoogleSignInButtonProps {
  children: React.ReactNode;
  disabled?: boolean;
}

const GoogleSignInButton: FC<GoogleSignInButtonProps> = ({
  children,
  disabled = false,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const loginWithGoogle = async () => {
    setIsLoading(true);
    try {
      const response = await signIn("google", {
        callbackUrl: "http://localhost:3000/books",
      });
      console.log("response: ", response);
    } catch (error: unknown) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      disabled={isLoading}
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
