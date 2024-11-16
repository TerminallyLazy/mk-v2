"use client";

import Image, { StaticImageData } from "next/image";
import { motion } from "framer-motion";
import "@/app/styles/article-animations.css";
import { cn } from "@/lib/utils";
import { Card } from "@/app/components/ui/card";

interface ArticleCardProps {
  article: {
    id: number;
    title: string;
    titleEs: string;
    image: string | StaticImageData;
    synopsis: string;
    synopsisEs: string;
  };
  translate: (en: string, es: string) => string;
  onClick: () => void;
  featured?: boolean;
}

export function ArticleCard({ article, translate, onClick, featured = false }: ArticleCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      onClick={onClick}
      className="cursor-pointer"
    >
      <Card className="overflow-hidden h-full">
        <div className={cn(
          "relative w-full overflow-hidden",
          featured ? "aspect-[16/10]" : "aspect-[16/9]"
        )}>
          <Image
            src={article.image}
            alt={translate(article.title, article.titleEs)}
            fill
            className="object-cover transition-transform duration-300 hover:scale-105"
            priority
          />
        </div>

        <div className="p-4 bg-card dark:bg-card">
          <h3 className={cn(
            "font-semibold text-card-foreground line-clamp-2 mb-2",
            featured ? "text-2xl" : "text-lg"
          )}>
            {translate(article.title, article.titleEs)}
          </h3>
          <p className={cn(
            "text-muted-foreground line-clamp-2",
            featured ? "text-base" : "text-sm"
          )}>
            {translate(article.synopsis, article.synopsisEs)}
          </p>
        </div>
      </Card>
    </motion.div>
  );
}
