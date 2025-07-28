import Footer from "@/sections/Footer/Footer";
import Header from "@/sections/header/Header";
import DonationEventProvider from "@/context/donationEvent_context";
import LanguageSwitcher from "@/data/locales/LanguageSwitcher";

export default function HomeLayout({ children }) {
  return (
    <main>
      <LanguageSwitcher />
      <Header />
      <DonationEventProvider>{children}</DonationEventProvider>
      <Footer />
    </main>
  );
}