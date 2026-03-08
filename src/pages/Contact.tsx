import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, MapPin, Instagram } from "lucide-react";
import { toast } from "sonner";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Message sent! We'll get back to you soon.");
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <div className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-gold text-sm tracking-[0.3em] uppercase mb-4">Get in Touch</p>
          <h1 className="font-serif text-4xl md:text-5xl">Contact</h1>
        </div>

        <div className="grid md:grid-cols-2 gap-16 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-serif text-2xl mb-6">Let's Connect</h2>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Whether you're interested in acquiring a painting, commissioning a work, or simply want to
              say hello — I'd love to hear from you.
            </p>

            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <Mail className="text-gold flex-shrink-0" size={20} />
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <a href="mailto:hello@levanmosiashvili.com" className="hover:text-gold transition-colors">
                    hello@levanmosiashvili.com
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <MapPin className="text-gold flex-shrink-0" size={20} />
                <div>
                  <p className="text-sm text-muted-foreground">Studio</p>
                  <span>Vera District, Tbilisi, Georgia</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Instagram className="text-gold flex-shrink-0" size={20} />
                <div>
                  <p className="text-sm text-muted-foreground">Instagram</p>
                  <a href="#" className="hover:text-gold transition-colors">@levanmosiashvili</a>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            <div>
              <label className="text-sm text-muted-foreground block mb-2">Name</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full bg-secondary border border-border px-4 py-3 text-sm focus:outline-none focus:border-gold transition-colors"
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground block mb-2">Email</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full bg-secondary border border-border px-4 py-3 text-sm focus:outline-none focus:border-gold transition-colors"
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground block mb-2">Message</label>
              <textarea
                required
                rows={5}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full bg-secondary border border-border px-4 py-3 text-sm focus:outline-none focus:border-gold transition-colors resize-none"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-charcoal text-cream py-3.5 text-sm tracking-wider uppercase hover:bg-charcoal-light transition-colors"
            >
              Send Message
            </button>
          </motion.form>
        </div>
      </div>
    </div>
  );
}
