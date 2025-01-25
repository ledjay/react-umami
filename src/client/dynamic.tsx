"use client";

import React, { useEffect, useState } from "react";

export function createDynamicComponent<T extends React.ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  options: { ssr?: boolean } = {}
) {
  return function DynamicComponent(props: React.ComponentProps<T>) {
    const [Component, setComponent] = useState<T | null>(null);

    useEffect(() => {
      importFn().then((mod) => {
        setComponent(() => mod.default);
      });
    }, []);

    if (!Component) {
      return null;
    }

    return <Component {...props} />;
  };
}
