"use client";

import React, { useEffect } from "react";
import { UmamiProvider } from "./provider";
import { useUmami } from "./hooks";
import type { UmamiOptions } from "../types";

export interface UmamiAnalyticsProps extends UmamiOptions {
  children: React.ReactElement | React.ReactElement[] | string | null;
  disabled?: boolean;
}

export function UmamiAnalytics({
  children,
  websiteId,
  disabled,
  ...config
}: UmamiAnalyticsProps) {
  return (
    <UmamiProvider websiteId={websiteId} disabled={disabled} {...config}>
      {children}
    </UmamiProvider>
  );
}
