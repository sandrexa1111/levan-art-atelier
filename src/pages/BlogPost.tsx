import { useParams, Link } from "react-router-dom";
import { blogPosts } from "@/data/blogPosts";
import { ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";

export default function BlogPostPage() {
  const { id } = useParams();
  const post = blogPosts.find((p) => p.id === id);

  if (!post) {
    return (
      <div className="py-32 text-center">
        <p className="text-muted-foreground">Post not found.</p>
        <Link to="/blog" className="text-gold underline mt-4 inline-block">Back to Journal</Link>
      </div>
    );
  }

  return (
    <div className="py-24 bg-background">
      <div className="container mx-auto px-6 max-w-3xl">
        <Link to="/blog" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
          <ArrowLeft size={16} /> Back to Journal
        </Link>

        <motion.article initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <p className="text-xs text-muted-foreground tracking-wider uppercase mb-4">
            {format(new Date(post.createdAt), "MMMM d, yyyy")}
          </p>
          <h1 className="font-serif text-3xl md:text-4xl mb-8">{post.title}</h1>
          <img src={post.image} alt={post.title} className="w-full aspect-[16/9] object-cover mb-10" />
          <div className="text-muted-foreground leading-relaxed space-y-4">
            {post.content.split("\n\n").map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
        </motion.article>
      </div>
    </div>
  );
}
