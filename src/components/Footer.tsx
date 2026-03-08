import { Link } from "react-router-dom";
import { Instagram, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-charcoal text-cream/60">
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-2">
            <h3 className="font-serif text-2xl text-cream mb-4">Levan Mosiashvili</h3>
            <p className="text-sm leading-relaxed max-w-md">
              Contemporary artist exploring the boundaries between abstraction and emotion.
              Based in Tbilisi, Georgia. Works available worldwide.
            </p>
          </div>
          <div>
            <h4 className="text-cream text-sm tracking-wider uppercase mb-4">Navigate</h4>
            <div className="flex flex-col gap-2 text-sm">
              <Link to="/gallery" className="hover:text-cream transition-colors">Gallery</Link>
              <Link to="/shop" className="hover:text-cream transition-colors">Shop</Link>
              <Link to="/artist" className="hover:text-cream transition-colors">About the Artist</Link>
              <Link to="/blog" className="hover:text-cream transition-colors">Journal</Link>
              <Link to="/contact" className="hover:text-cream transition-colors">Contact</Link>
            </div>
          </div>
          <div>
            <h4 className="text-cream text-sm tracking-wider uppercase mb-4">Connect</h4>
            <div className="flex gap-4">
              <a href="#" className="hover:text-cream transition-colors" aria-label="Instagram">
                <Instagram size={20} />
              </a>
              <a href="mailto:hello@levanmosiashvili.com" className="hover:text-cream transition-colors" aria-label="Email">
                <Mail size={20} />
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-cream/10 mt-12 pt-8 text-sm text-center">
          © {new Date().getFullYear()} Levan Mosiashvili. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
