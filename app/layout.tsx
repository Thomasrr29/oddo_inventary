import type { Metadata } from "next";
import { Outfit, Inter, Montserrat } from "next/font/google";
import "./globals.css";
import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Essential Da El Paso | Catálogo Digital",
  description: "Tienda multimarca con las mejores marcas: Nike, Adidas, Puma, Under Armour, Totto, New Balance, Skechers. Productos 100% originales con garantía.",
  keywords: ["essential", "calzado", "morrales", "accesorios", "nike", "adidas", "puma", "under armour", "totto", "new balance", "skechers"],
  authors: [{ name: "Essential Da El Paso" }],
  openGraph: {
    title: "Essential Da El Paso",
    description: "Tienda multimarca - Productos 100% originales con garantía",
    type: "website",
    locale: "es_CO",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${outfit.variable} ${inter.variable} ${montserrat.variable} antialiased font-sans`}
      >
        <Header />
        <main>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
