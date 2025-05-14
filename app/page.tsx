import Image from "next/image";
import Button from "@/app/ui/button/button";
import Link from "next/link";
import React from "react";

export default function Home() {
  return (
    <div>
      <h1>Home</h1>
      <Link href="/admin">
        <Button size="medium">Go to admin page</Button>
      </Link>
    </div>
  );
}
