import Footer from "@/sections/Footer/Footer";
import Header from "@/sections/header/Header";

export default function HomeLayout({children}) {
    return(
        <main>
            <Header/>
                {children}
            <Footer/>
        </main>
    );
}