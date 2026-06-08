import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { UPLOADS_BASE } from "@/lib/constants";

export function TestimonialCard({ testimonial }) {
  const avatarSrc = testimonial.avatarUrl
    ? testimonial.avatarUrl.startsWith("http") ? testimonial.avatarUrl : `${UPLOADS_BASE}${testimonial.avatarUrl}`
    : null;
  return (
    <Card className="h-full">
      <CardContent className="p-6 flex flex-col h-full">
        <div className="flex mb-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className={`h-4 w-4 ${i < testimonial.rating ? "text-yellow-400 fill-yellow-400" : "text-muted"}`} />
          ))}
        </div>
        <p className="text-muted-foreground italic flex-1 mb-6">"{testimonial.content}"</p>
        <div className="flex items-center gap-3">
          {avatarSrc ? (
            <img src={avatarSrc} alt={testimonial.name} className="w-10 h-10 rounded-full object-cover" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
              {testimonial.name[0]}
            </div>
          )}
          <div>
            <p className="font-semibold text-sm">{testimonial.name}</p>
            <p className="text-xs text-muted-foreground">{testimonial.position}{testimonial.company ? `, ${testimonial.company}` : ""}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
