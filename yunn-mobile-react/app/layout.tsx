import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "YUNN | Skin Analysis",
  description: "Personalized K-Beauty skin routine in 3 minutes",
};

// 레거시 vanilla 사이트(index.html 등)와 동일한 GTM 컨테이너를 재사용한다.
// 같은 GA4 프로퍼티로 이벤트가 모여야 어드민 대시보드가 전체 유저를 한 곳에서 볼 수 있다.
const GTM_ID = "GTM-P2NX3N5K";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full bg-white">
        <Script id="gtm-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            (function(w,d,s,l,i){
              w[l]=w[l]||[];
              w[l].push({'gtm.start': new Date().getTime(), event:'gtm.js'});
              var f=d.getElementsByTagName(s)[0], j=d.createElement(s);
              j.async=true; j.src='https://www.googletagmanager.com/gtm.js?id='+i;
              f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${GTM_ID}');
          `}
        </Script>
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {children}
        <Script
          src="https://unpkg.com/@phosphor-icons/web"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
