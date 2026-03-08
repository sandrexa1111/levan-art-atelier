import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { blogPosts } from "@/data/blogPosts";
import { format } from "date-fns";
import { fadeUp } from "@/lib/animations";

export default function Blog() {
  return (
    <div className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-gold text-sm tracking-[0.3em] uppercase mb-4">Journal</p>
          <h1 className="font-serif text-4xl md:text-5xl">News & Stories</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-5xl mx-auto">
          {blogPosts.map((post, i) => (
            <motion.div key={post.id} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}>
              <Link to={`/blog/${post.id}`} className="group block">
                <div className="overflow-hidden mb-4">
                  <img src={post.image} alt={post.title} loading="lazy" className="w-full aspect-[16/10] object-cover transition-transform duration-700 group-hover:scale-105" />
                </div>
                <p className="text-xs text-muted-foreground tracking-wider uppercase mb-2">
                  {format(new Date(post.createdAt), "MMMM d, yyyy")}
                </p>
                <h2 className="font-serif text-xl group-hover:text-gold transition-colors mb-2">{post.title}</h2>
                <p className="text-sm text-muted-foreground">{post.excerpt}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
