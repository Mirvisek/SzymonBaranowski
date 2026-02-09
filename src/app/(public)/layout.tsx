
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function PublicLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        // Używamy fragmentu, aby strony same definiowały swoje tło i sekcje,
        // ale Navbar i Footer są globalne dla tej sekcji.
        <>
            <Navbar />
            {children}
            <Footer />
        </>
    );
}
