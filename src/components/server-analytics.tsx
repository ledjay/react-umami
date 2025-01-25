"use client";

import * as React from "react";
import type { UmamiOptions } from "../types";
import { UmamiProvider } from "../client/provider";
import { NoSSR } from "../utils/dynamic";
import Logger from "../utils/logger";

export interface UmamiAnalyticsProps extends Omit<UmamiOptions, "children"> {
  websiteId: string;
  disabled?: boolean;
  children: React.ReactElement | React.ReactElement[] | string | null;
}

export function UmamiAnalytics(props: UmamiAnalyticsProps) {
  const { children, disabled, ...config } = props;

  Logger.log("debug", "[UmamiAnalytics] Props:", {
    hasChildren: children !== undefined,
    childrenType: children ? typeof children : "undefined",
    config,
    disabled,
  });

  if (!config.websiteId) {
    Logger.log("error", "[UmamiAnalytics] Missing required websiteId");
    return null;
  }

  return (
    <NoSSR>
      <UmamiProvider {...config} disabled={disabled}>
        {children}
      </UmamiProvider>
    </NoSSR>
  );
}

UmamiAnalytics.displayName = "UmamiAnalytics";
