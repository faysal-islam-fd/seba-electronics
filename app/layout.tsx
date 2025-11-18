import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";

const montserrat = Montserrat({ 
  subsets: ["latin"],
  weight: ['300', '400', '500', '600', '700', '800'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Pickaboo - Best Online Shopping in Bangladesh | Electronics & Gadgets",
  description: "Shop the latest electronics, laptops, smartphones, cameras, and gadgets at Pickaboo. Best prices, genuine products, and fast delivery across Bangladesh.",
  keywords: "online shopping, electronics, laptops, smartphones, cameras, gadgets, Bangladesh",
  openGraph: {
    title: "Pickaboo - Best Online Shopping in Bangladesh",
    description: "Shop the latest electronics and gadgets with best prices and fast delivery",
    type: "website",
    locale: "en_BD",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pickaboo - Best Online Shopping in Bangladesh",
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
      <body className={montserrat.className}>
        <AuthProvider>
          <CartProvider>
        <Header />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
