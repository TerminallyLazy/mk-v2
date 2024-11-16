interface ShareData {
  title?: string;
  text?: string;
  url?: string;
}

interface Navigator {
  share?: (data?: ShareData) => Promise<void>;
}

export interface RequestBody {
  prompt: string;
  type: string;
  image?: string;
  location?: {
    lat: number;
    lng: number;
  };
  extractSources?: boolean;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  type?: string;
  images?: string[];
  sources?: {
    title: string;
    url?: string;
    citation?: string;
  }[];
} 