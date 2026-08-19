"use client";

import Script from "next/script";

const CLARITY_ID = "xy4h271jps";

export default function MicrosoftClarity() {
  return (
    <Script id="microsoft-clarity" strategy="lazyOnload">
      {`
        (function() {
          function initClarity() {
            if (window.__clarityInitialized) return;
            window.__clarityInitialized = true;
            (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "${CLARITY_ID}");
          }
          if ('requestIdleCallback' in window) {
            requestIdleCallback(function() { setTimeout(initClarity, 3000); });
          } else {
            setTimeout(initClarity, 4000);
          }
          ['scroll', 'touchstart', 'mousemove', 'keydown'].forEach(function(evt) {
            window.addEventListener(evt, initClarity, { once: true, passive: true });
          });
        })();
      `}
    </Script>
  );
}