"use client";

import { useEffect } from "react";
import { disableAnalyticsForThisBrowser, getAnalyticsBrowserPreference } from "@/lib/analytics/tracker";

export function AdminAnalyticsOptOut() {
  useEffect(() => {
    if (getAnalyticsBrowserPreference() === undefined) {
      disableAnalyticsForThisBrowser();
    }
  }, []);

  return null;
}
