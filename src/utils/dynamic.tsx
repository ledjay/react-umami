import React, { useEffect, useState } from "react";
import Logger from "./logger";

const isBrowser = typeof window !== "undefined";

export function NoSSR({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  Logger.log("debug", "NoSSR", {
    mounted,
    isBrowser,
    hasChildren: children !== undefined,
    childrenType: children ? typeof children : "undefined",
  });

  if (!mounted || !isBrowser) {
    return null;
  }

  return <>{children}</>;
}
