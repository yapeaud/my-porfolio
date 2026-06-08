import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Calendar, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UPLOADS_BASE } from "@/lib/constants";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export function BlogCard({ post, index = 0 }) {
  const imgSrc = post.coverImageUrl
    ? post.coverImageUrl.startsWith("http") ? post.coverImageUrl : `${UPLOADS_BASE}${post.coverImageUrl}`
    : null;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Link to={`/blog/${post.slug}`}>
        <Card className="overflow-hidden hover:shadow-lg transition-shadow group h-full flex flex-col">
          <div className="h-48 bg-muted overflow-hidden">
            {imgSrc ? (
              <img src={imgSrc} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-6xl">📝</div>
            )}
          </div>
          <CardContent className="p-4 flex flex-col flex-1">
            {post.category && <Badge className="w-fit mb-2 text-xs">{post.category.name}</Badge>}
            <h3 className="font-bold text-base mb-2 group-hover:text-primary transition-colors line-clamp-2">{post.title}</h3>
            <p className="text-muted-foreground text-sm mb-3 flex-1 line-clamp-3">{post.excerpt}</p>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              {post.publishedAt && (
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {format(new Date(post.publishedAt), "d MMM yyyy", { locale: fr })}
                </span>
              )}
              {post.readingTime && (
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {post.readingTime} min
                </span>
              )}
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}
