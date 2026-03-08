import { motion } from "framer-motion";
import artistPortrait from "@/assets/artist-portrait.jpg";
import studio from "@/assets/studio.jpg";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function Artist() {
  return (
    <div className="py-24 bg-background">
      <div className="container mx-auto px-6">
        {/* Hero */}
        <div className="grid md:grid-cols-2 gap-16 items-center max-w-5xl mx-auto mb-24">
          <motion.img
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            src={artistPortrait}
            alt="Levan Mosiashvili"
            className="w-full aspect-[3/4] object-cover"
          />
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <p className="text-gold text-sm tracking-[0.3em] uppercase mb-4">Biography</p>
            <h1 className="font-serif text-4xl md:text-5xl mb-6">Levan Mosiashvili</h1>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Born in Tbilisi, Georgia, Levan Mosiashvili is a contemporary abstract artist whose work
                has been exhibited across Europe and Asia. His paintings are held in private collections
                in over a dozen countries.
              </p>
              <p>
                Trained at the Tbilisi State Academy of Arts, Levan developed a distinctive approach that
                combines the bold gestural energy of Abstract Expressionism with the rich visual heritage
                of Georgian and Byzantine art. His use of gold leaf connects to centuries of Georgian
                artistic tradition while speaking a decisively contemporary language.
              </p>
              <p>
                His work explores the tension between structure and chaos, stillness and movement — seeking
                to capture the moments of transformation that exist just beyond the visible world.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Philosophy */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="max-w-3xl mx-auto text-center mb-24"
        >
          <p className="text-gold text-sm tracking-[0.3em] uppercase mb-4">Artistic Philosophy</p>
          <h2 className="font-serif text-3xl md:text-4xl mb-6">Between Worlds</h2>
          <blockquote className="font-serif text-xl md:text-2xl italic text-muted-foreground leading-relaxed">
            "I paint the spaces between things — between light and dark, between the ancient and the new,
            between what we see and what we feel. The canvas is where these opposites meet, and something
            unexpected is born."
          </blockquote>
        </motion.section>

        {/* Studio */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="mb-24"
        >
          <img src={studio} alt="Artist studio" className="w-full aspect-[16/7] object-cover mb-8" />
          <div className="max-w-3xl mx-auto">
            <p className="text-gold text-sm tracking-[0.3em] uppercase mb-4">The Studio</p>
            <h2 className="font-serif text-3xl mb-4">Where It Happens</h2>
            <p className="text-muted-foreground leading-relaxed">
              Located in the historic Vera district of Tbilisi, Levan's studio occupies a converted
              industrial space flooded with natural light. The high ceilings accommodate his large-scale
              works, while the surrounding neighborhood — with its mix of 19th-century architecture and
              contemporary energy — provides constant inspiration.
            </p>
          </div>
        </motion.section>

        {/* Exhibitions */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="max-w-3xl mx-auto"
        >
          <p className="text-gold text-sm tracking-[0.3em] uppercase mb-4">Selected Exhibitions</p>
          <h2 className="font-serif text-3xl mb-8">Exhibitions & Achievements</h2>
          <div className="space-y-4">
            {[
              { year: "2024", title: "Oceanic — Solo Exhibition", venue: "Gallery Vernissage, Tbilisi" },
              { year: "2023", title: "Crossroads — Group Show", venue: "Contemporary Art Museum, Istanbul" },
              { year: "2023", title: "Color Fields — Solo Exhibition", venue: "Galerie Moderne, Berlin" },
              { year: "2022", title: "East Meets West — Collective", venue: "Saatchi Gallery, London" },
              { year: "2022", title: "New Horizons — Solo Exhibition", venue: "National Gallery, Tbilisi" },
              { year: "2021", title: "Abstract Expressions — Group Show", venue: "MAMM, Moscow" },
            ].map((ex, i) => (
              <div key={i} className="flex items-baseline gap-6 border-b border-border pb-4">
                <span className="text-gold font-serif text-lg w-16 flex-shrink-0">{ex.year}</span>
                <div>
                  <span className="font-serif">{ex.title}</span>
                  <span className="text-muted-foreground text-sm ml-2">— {ex.venue}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.section>
      </div>
    </div>
  );
}
