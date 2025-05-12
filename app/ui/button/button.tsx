import { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  size?: "small" | "medium" | "large";
  variant?: "primary" | "secondary" | "minimal";
  customClassName?: string;
}

export default function Button({
  children,
  size = "small",
  variant = "primary",
  customClassName,
  ...rest
}: ButtonProps) {
  const defaultStyles = {
    small:
      "px-[16px] py-[5px] rounded-[4px] text-[12px] font-semibold cursor-pointer",
    medium:
      "px-[16px] py-[9px] rounded-[6px] text-[12px] font-semibold cursor-pointer",
    large:
      "px-[20.5px] py-[14px] rounded-[8px] text-[16px] font-semibold cursor-pointer",
  };
  const variantStyles = {
    primary:
      "border bg-primary-netural-palette-500 text-white hover:bg-primary-netural-palette-600 active:bg-primary-netural-palette-700 focus:border-purle-100 disabled:bg-primary-netural-palette-200 disabled:hover:bg-primary-netural-palette-200 disabled:active:bg-primary-netural-palette-200",
    secondary:
      "bg-transparent border border-secondary-300 text-secondary-400 hover:border-secondary-400 hover:text-secondary-500 active:border-secondary-300 active:bg-primary-netural-palette-100 active:text-secondary-500 focus:bg-white focus:border-primary-netural-palette-100 focus:text-secondary-400 disabled: bg-white disabled:border-primary-netural-palette-100 disabled:text-secondary-200 disabled:active:bg-white",
    minimal: "",
  };
  return (
    <button
      className={`${defaultStyles[size]} ${variantStyles[variant]} ${customClassName}`}
      {...rest}
    >
      {children}
    </button>
  );
}
