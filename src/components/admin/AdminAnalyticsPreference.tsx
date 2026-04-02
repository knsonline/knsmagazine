"use client";

import { useEffect, useReducer } from "react";
import {
  disableAnalyticsForThisBrowser,
  enableAnalyticsForThisBrowser,
  getAnalyticsBrowserPreference,
} from "@/lib/analytics/tracker";

export function AdminAnalyticsPreference() {
  const [{ isDisabled, isReady }, setPreferenceState] = useReducer(
    (_state: { isDisabled: boolean; isReady: boolean }, nextState: { isDisabled: boolean; isReady: boolean }) =>
      nextState,
    { isDisabled: true, isReady: false },
  );

  useEffect(() => {
    const savedPreference = getAnalyticsBrowserPreference();

    if (savedPreference === undefined) {
      disableAnalyticsForThisBrowser();
      setPreferenceState({ isDisabled: true, isReady: true });
      return;
    }

    setPreferenceState({ isDisabled: savedPreference, isReady: true });
  }, []);

  if (!isReady) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-40 max-w-[280px] rounded-2xl border border-black/8 bg-white/95 p-4 shadow-[0_18px_44px_-28px_rgba(27,42,74,0.28)] backdrop-blur">
      <p className="text-xs font-semibold tracking-[0.03em] text-text-secondary">분석 수집 설정</p>
      <p className="mt-2 text-sm leading-6 text-text-primary">
        이 브라우저의 퍼블릭 테스트 트래픽은{" "}
        <span className="font-semibold text-navy">{isDisabled ? "기본 제외" : "수집 허용"}</span> 상태입니다.
      </p>
      <button
        type="button"
        onClick={() => {
          if (isDisabled) {
            enableAnalyticsForThisBrowser();
            setPreferenceState({ isDisabled: false, isReady: true });
            return;
          }

          disableAnalyticsForThisBrowser();
          setPreferenceState({ isDisabled: true, isReady: true });
        }}
        className="mt-3 inline-flex min-h-11 items-center rounded-full border border-black/10 px-4 text-sm font-semibold text-text-primary transition hover:border-navy/20 hover:text-navy"
      >
        {isDisabled ? "퍼블릭 테스트 수집 허용" : "퍼블릭 테스트 다시 제외"}
      </button>
    </div>
  );
}
