import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string, locale: string = 'en') {
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(new Date(date));
}

export function getMessageTypeStyles(type?: string) {
  switch (type) {
    case 'error':
      return 'bg-destructive/10 border-destructive/20 text-destructive dark:text-destructive-foreground';
    case 'success':
      return 'bg-success/10 border-success/20 text-success dark:text-success-foreground';
    case 'warning':
      return 'bg-warning/10 border-warning/20 text-warning dark:text-warning-foreground';
    case 'Med Lookup':
      return 'bg-primary/10 border-primary/20';
    case 'Mental & Behavioral Health':
      return 'bg-secondary/10 border-secondary/20';
    default:
      return 'bg-primary/10 border-primary/20';
  }
}

export function extractLocationFromMessage(message: string) {
  const locationRegex = /in ([\w\s,]+)/i;
  const match = message.match(locationRegex);
  if (match) {
    return match[1].trim();
  }
  return null;
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

export function calculateReadingTime(text: string, wordsPerMinute: number = 200): number {
  const words = text.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

export function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function formatMarkdownContent(text: string, type?: string): string {
  if (!text) return '';
  
  // Add specific formatting based on message type
  switch (type) {
    case 'Med Lookup':
      return `### Medication Analysis\n\n${text}`;
    case 'Mental & Behavioral Health':
      return `### Mental Health Consultation\n\n${text}`;
    default:
      return text;
  }
}
