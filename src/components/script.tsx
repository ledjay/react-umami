import React, { useEffect, useRef } from "react";
import type { UmamiOptions } from "../index";

export function UmamiScript(props: Omit<UmamiOptions, "children">) {
  const { websiteId, hostUrl } = props;
  const scriptRef = useRef<HTMLScriptElement | null>(null);

  useEffect(() => {
    const script = scriptRef.current || document.createElement("script");

    script.async = true;
    script.defer = true;
    script.setAttribute("data-website-id", websiteId);
    script.src = new URL("script.js", hostUrl).toString();

    if (!scriptRef.current) {
      scriptRef.current = script;
      document.body.appendChild(script);
    }

    return () => {
      if (scriptRef.current) {
        document.body.removeChild(scriptRef.current);
        scriptRef.current = null;
      }
    };
  }, [websiteId, hostUrl]);

  return null;
}
