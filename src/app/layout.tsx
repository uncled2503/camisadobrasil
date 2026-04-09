import type { Metadata, Viewport } from "next";
import { DM_Sans, Syne } from "next/font/google";
import { AmbientBackground } from "@/components/landing/ambient-background";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";

const sans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
  weight: ["400", "500", "600"],
});

const display = Syne({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Alpha Brasil | Camisa do Brasil Estilizada — R$ 69",
  description:
    "Alpha Brasil - Camisa premium com identidade brasileira, acabamento refinado e presença marcante. Edição limitada.",
  keywords: [
    "Alpha Brasil",
    "camisa Brasil",
    "camisa estilizada",
    "edição especial",
    "camisa premium",
    "Brasil",
  ],
  openGraph: {
    title: "Alpha Brasil | Camisa do Brasil Estilizada",
    description:
      "Peça exclusiva com visual noturno e alto valor percebido. Garanta a sua na Alpha Brasil.",
    type: "website",
    locale: "pt_BR",
  },
};

export const viewport: Viewport = {
  themeColor: "#060a12",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="dark">
      <body
        className={`${sans.variable} ${display.variable} font-sans min-h-[100dvh] bg-transparent text-foreground antialiased`}
      >
        <AmbientBackground />
        <div className="relative z-10 flex min-h-[100dvh] flex-col">{children}</div>
        <Toaster />
      </body>
    </html>
  );
}