"use client";

import React, { ReactNode } from "react";
import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

export default function SessionProviderClientComponent({
  children,
  session,
}: {
  children: ReactNode;
  session: Session | null;
}) {
  return <SessionProvider session={session}>{children}</SessionProvider>;
}
