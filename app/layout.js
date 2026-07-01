import "./globals.css";
import Navbar from "./components/Navbar";

export const metadata = {
  title: "Nova — Endless stories, one place",
  description: "Stream thousands of movies and shows on Nova. Endless stories, one place.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0b0b12",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="font-sans bg-nova-dark text-white min-h-screen">
        <Navbar />
        <main>{children}</main>
        <footer className="border-t border-white/10 mt-16 py-10 px-6 md:px-12 text-nova-gray text-sm">
          <div className="max-w-6xl mx-auto flex flex-col gap-4">
            <div className="flex items-center gap-1.5">
              <span className="text-nova-pink text-xl leading-none">✦</span>
              <span className="nova-wordmark font-black text-2xl tracking-tight">nova</span>
            </div>
            <div className="flex flex-wrap gap-x-8 gap-y-2">
              <span>About</span><span>Privacy</span><span>Terms</span>
              <span>Help</span><span>Careers</span><span>Gift Cards</span>
            </div>
            <p className="text-white/40">
              © 2026 Nova. A portfolio demo project. Movie & show metadata provided by TMDB.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
