import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import { AlertProvider } from "./context/AlertContext";
import { ConfirmProvider } from "./context/ConfirmContext";
import { ReduxProvider } from "./store/Provider";
import NextTopLoader from 'nextjs-toploader';

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ['300', '400', '500', '600', '700', '800'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Sheba Electronics - Best Online Shopping in Bangladesh | Electronics & Gadgets",
  description: "Shop the latest electronics, laptops, smartphones, cameras, and gadgets at Sheba Electronics. Best prices, genuine products, and fast delivery across Bangladesh.",
  keywords: "online shopping, electronics, laptops, smartphones, cameras, gadgets, Bangladesh",
  openGraph: {
    title: "Sheba Electronics - Best Online Shopping in Bangladesh",
    description: "Shop the latest electronics and gadgets with best prices and fast delivery",
    type: "website",
    locale: "en_BD",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sheba Electronics - Best Online Shopping in Bangladesh",
    description: "Shop the latest electronics and gadgets with best prices and fast delivery",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={montserrat.className} suppressHydrationWarning>
        <NextTopLoader
          color="#ffffff"
          initialPosition={0.08}
          crawlSpeed={200}
          height={2}
          crawl={true}
          showSpinner={false}
          easing="ease"
          speed={200}
          shadow="0 0 10px #ffffff,0 0 5px #ffffff"
          zIndex={99999}
        />
        <ReduxProvider>
          <AuthProvider>
            <ToastProvider>
              <AlertProvider>
                <ConfirmProvider>
                  <CartProvider>
                    <Header />
                    <main className="min-h-screen">
                      {children}
                    </main>
                    <Footer />
                  </CartProvider>
                </ConfirmProvider>
              </AlertProvider>
            </ToastProvider>
          </AuthProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
