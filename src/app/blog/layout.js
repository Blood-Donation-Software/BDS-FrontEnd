import Header from "@/sections/header/Header";
import Footer from "@/sections/Footer/Footer";

export default function BlogLayout({ children }) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}