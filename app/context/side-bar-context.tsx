"use client";

import { createContext, ReactNode, useContext, useState } from "react";

type SideBarContent = {
  isOpen: boolean;
  toggleOpen: () => void;
};

export const SideBarContext = createContext<SideBarContent>({
  isOpen: false,
  toggleOpen: () => {},
});

export const useSideBar = () => {
  const context = useContext(SideBarContext);

  if (!context) {
    throw new Error("useSideBar must be used within a SideBarProvider");
  }
  return context;
};

export const SideBarProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => {
    console.log("toggleOpen", isOpen);
    setIsOpen(!isOpen);
  };

  return (
    <SideBarContext.Provider value={{ isOpen, toggleOpen }}>
      {children}
    </SideBarContext.Provider>
  );
};
