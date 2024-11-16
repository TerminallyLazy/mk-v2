"use client";

import React from 'react';
import Image, { StaticImageData } from 'next/image';
import { formatDate } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import { Button } from "@/app/components/ui/button";
import { ScrollArea } from "@/app/components/ui/scroll-area";
import { X } from "lucide-react";

interface Article {
  id: number;
  title: string;
  titleEs: string;
  image: string | StaticImageData;
  synopsis: string;
  synopsisEs: string;
  content?: string;
  contentEs?: string;
}

interface ArticleModalProps {
  isOpen: boolean;
  onClose: () => void;
  article: Article;
  translate: (en: string, es: string) => string;
}

export function ArticleModal({ isOpen, onClose, article, translate }: ArticleModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[90vh] p-0">
        <DialogHeader className="px-6 py-4 border-b relative">
          <div className="pr-12">
            <DialogTitle className="text-2xl font-serif">
              {translate(article.title, article.titleEs)}
            </DialogTitle>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        <ScrollArea className="h-full">
          <div className="relative h-[300px] w-full">
            <Image
              src={article.image}
              alt={translate(article.title, article.titleEs)}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
          </div>

          <div className="px-6 py-4">
            <div className="prose dark:prose-invert max-w-none">
              <p className="text-sm text-muted-foreground">
                {formatDate(new Date().toISOString())}
              </p>
              <p className="text-lg leading-relaxed">
                {translate(article.synopsis, article.synopsisEs)}
              </p>
              {article.content && (
                <div className="mt-6">
                  {translate(article.content, article.contentEs || '')}
                </div>
              )}
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
