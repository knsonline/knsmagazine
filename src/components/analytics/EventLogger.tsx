"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics/tracker";
import type { AnalyticsEventPayload } from "@/types/analytics";

export function EventLogger(props: AnalyticsEventPayload) {
  useEffect(() => {
    trackEvent(props);
  }, [props]);

  return null;
}
