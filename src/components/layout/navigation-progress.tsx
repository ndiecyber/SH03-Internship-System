"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

/**
 * Top progress bar yang muncul saat navigasi antar halaman.
 * Zero-dependency — hanya CSS animation murni.
 */
export function NavigationProgress() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [width, setWidth] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const prevPathname = useRef(pathname);

  useEffect(() => {
    // Pathname sudah berubah → navigasi selesai
    if (pathname !== prevPathname.current) {
      prevPathname.current = pathname;
      // Finish the bar
      setWidth(100);
      const done = setTimeout(() => {
        setVisible(false);
        setWidth(0);
      }, 300);
      return () => clearTimeout(done);
    }
  }, [pathname]);

  // Listen for navigation start via History API interception
  useEffect(() => {
    const handleClick = (targetHref: string) => {
      // Don't trigger if it's the exact same page
      if (targetHref === window.location.href) return;
      
      // Clear any existing timer to prevent stuttering/fighting intervals
      if (timerRef.current) clearInterval(timerRef.current);

      // Start progress smoothly
      setVisible(true);
      setWidth(15);

      // Gradually increment, only moving forward
      let w = 15;
      timerRef.current = setInterval(() => {
        w = w < 85 ? w + Math.random() * 5 + 1 : w + 0.5;
        if (w >= 92) {
          if (timerRef.current) clearInterval(timerRef.current);
          w = 92;
        }
        // Force update to new width only
        setWidth(w);
      }, 250);
    };

    const handleDocumentClick = (e: MouseEvent) => {
      const target = (e.target as Element).closest("a");
      // Only trigger for valid internal links that don't open in a new tab
      if (
        target &&
        target.href &&
        target.href.startsWith(window.location.origin) &&
        target.target !== "_blank"
      ) {
        // Prevent triggering for simple anchor links or downloads
        const url = new URL(target.href);
        const currentUrl = new URL(window.location.href);
        if (url.pathname === currentUrl.pathname && url.search === currentUrl.search) {
            return;
        }
        handleClick(target.href);
      }
    };

    // Attach to all anchor clicks within the page
    document.addEventListener("click", handleDocumentClick);

    return () => {
      document.removeEventListener("click", handleDocumentClick);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className="fixed top-0 left-0 z-[9999] h-[2px] bg-blue-500 transition-all duration-200 ease-out shadow-sm shadow-blue-400/50"
      style={{ width: `${width}%` }}
    />
  );
}
