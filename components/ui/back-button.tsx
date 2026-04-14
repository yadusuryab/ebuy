"use client";

import { IconArrowLeft } from "@tabler/icons-react";
import { Button } from "./button";

export default function BackButton() {
  return (
    <Button
      onClick={() => window.history.back()}
      size={'icon'}
      variant={'outline'}
      className="rounded-full"
    >
      <IconArrowLeft/>
      
    </Button>
  );
}