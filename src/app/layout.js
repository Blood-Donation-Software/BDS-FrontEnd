import Header from "@/sections/header/Header";
import "./globals.css";
import Footer from "@/sections/Footer/Footer";
import { Toaster } from "sonner";
import { PublicEnvScript } from "next-runtime-env";
import UserProvider from "@/context/user_context";
import LanguageProvider, { useLanguage } from "@/context/language_context";
import LanguageSwitcher from "@/data/locales/LanguageSwitcher";
export const metadata = {
  title: "Blood Donation Support System",
  description: "A comprehensive blood donation management system connecting donors with those in need",
  icons: [
    {
      rel: 'icon',
      type: 'image/jpeg',
      sizes: '32x32',
      url: '/logo.jpg',
    },
    {
      rel: 'icon',
      type: 'image/jpeg', 
      sizes: '16x16',
      url: '/logo.jpg',
    },
    {
      rel: 'apple-touch-icon',
      sizes: '180x180',
      url: '/logo.jpg',
    },
  ],
};

export default function RootLayout({ children }) {

  return (
    <html >
      <head>
        <PublicEnvScript />
        <link rel="icon" type="image/jpeg" href="/logo.jpg" />
        <link rel="shortcut icon" type="image/jpeg" href="/logo.jpg" />
      </head>
      <body>
          <UserProvider>
          <LanguageProvider>
            {children}
            </LanguageProvider>
          </UserProvider>
          <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
