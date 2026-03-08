import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { ShoppingBag, Menu, X } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/gallery", label: "Gallery" },
  { to: "/shop", label: "Shop" },
  { to: "/artist", label: "Artist" },
  { to: "/blog", label: "Journal" },
  { to: "/contact", label: "Contact" },
];

export default function Header() {
  const { itemCount } = useCart();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-charcoal/95 backdrop-blur-sm">
      <div className="container mx-auto flex items-center justify-between px-6 py-4">
        <Link to="/" className="font-serif text-xl tracking-widest text-cream uppercase">
          Levan Mosiashvili
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`text-sm tracking-wider uppercase transition-colors duration-300 ${
                location.pathname === link.to
                  ? "text-gold"
                  : "text-cream/70 hover:text-cream"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link to="/cart" className="relative text-cream/70 hover:text-cream transition-colors">
            <ShoppingBag size={20} />
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-gold text-charcoal text-xs w-5 h-5 rounded-full flex items-center justify-center font-sans font-semibold">
                {itemCount}
              </span>
            )}
          </Link>
        </nav>

        {/* Mobile */}
        <div className="flex items-center gap-4 md:hidden">
          <Link to="/cart" className="relative text-cream/70">
            <ShoppingBag size={20} />
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-gold text-charcoal text-xs w-5 h-5 rounded-full flex items-center justify-center font-sans font-semibold">
                {itemCount}
              </span>
            )}
          </Link>
          <button onClick={() => setMobileOpen(!mobileOpen)} className="text-cream">
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-charcoal border-t border-cream/10 overflow-hidden"
          >
            <div className="flex flex-col px-6 py-4 gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className={`text-sm tracking-wider uppercase ${
                    location.pathname === link.to ? "text-gold" : "text-cream/70"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
