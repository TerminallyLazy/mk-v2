import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to read file'));
      }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export function formatMarkdownContent(content: string, type?: string): string {
  if (type === 'Med Lookup') {
    return `## Medication Analysis\n\n${content}`;
  } else if (type === 'Mental & Behavioral Health') {
    return `## Mental Health Consultation\n\n${content}`;
  }
  return content;
}

export function getMessageTypeStyles(type?: string) {
  switch (type) {
    case 'Med Lookup':
      return 'bg-blue-500/10 border-blue-500/20';
    case 'Mental & Behavioral Health':
      return 'bg-purple-500/10 border-purple-500/20';
    case 'error':
      return 'bg-destructive/10 border-destructive/20';
    default:
      return 'bg-primary/10 border-primary/20';
  }
}