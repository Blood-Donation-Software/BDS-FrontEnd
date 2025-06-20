import Header from "@/sections/header/Header";
import "./globals.css";
import Footer from "@/sections/Footer/Footer";
import { Toaster } from "sonner";

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
            {children}
            <Toaster position="top-center" richColors/>
      </body>
    </html>
  );
}
