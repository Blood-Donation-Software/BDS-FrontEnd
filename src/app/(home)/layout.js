import Footer from "@/sections/Footer/Footer";
import Header from "@/sections/header/Header"
import DonationEventProvider from "@/context/donationEvent_context";

export default function HomeLayout({ children }) {
  return (
    <main>
      <Header />
        <DonationEventProvider>{children}</DonationEventProvider>
      <Footer />
    </main>
  );
}