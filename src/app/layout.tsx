import type { Metadata } from "next";
import "./globals.css";
import "@fontsource/bricolage-grotesque/400.css";
import "@fontsource/bricolage-grotesque/500.css";
import "@fontsource/bricolage-grotesque/600.css";
import "@fontsource/bricolage-grotesque/700.css";
import "@fontsource/crimson-pro/400.css";
import "@fontsource/crimson-pro/500.css";
import "@fontsource/crimson-pro/600.css";
import { AuthProvider } from "./providers/AuthProvider";
import Header from "./components/Header";

export const metadata: Metadata = {
  title: "Atlas Osiągnięć - Osobisty Tracker Sportowych Osiągnięć",
  description: "Śledź swoje sportowe osiągnięcia: Korona Europy, Korona Polski, Maratony Świata i Trekkingi",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl">
      <body className="antialiased bg-white text-gray-900 min-h-screen font-sans">
        <AuthProvider>
          <Header />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
