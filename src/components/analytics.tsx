"use client";

import React from "react";
import { UmamiProvider } from "../client";
import type { UmamiOptions } from "../types";

export function UmamiAnalytics({
  children,
  ...config
}: UmamiOptions & { children: React.ReactNode }) {
  return <UmamiProvider {...config}>{children}</UmamiProvider>;
}
