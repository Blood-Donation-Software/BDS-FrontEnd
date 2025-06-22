import DonationEventProvider from "@/context/donationEvent_context";

export default function DonationEventLayout({ children }) {
  return (
    <DonationEventProvider>
        {children}
    </DonationEventProvider>
  );
}