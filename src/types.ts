export type Platform = 'facebook' | 'instagram' | 'linkedin' | 'twitter' | 'tiktok' | 'whatsapp';

export type ContentPillar =
  | 'educational'
  | 'problem_solution'
  | 'authority'
  | 'engagement'
  | 'promotional'
  | 'inspirational'
  | 'social_proof';

export type ContentType =
  | 'single_image'
  | 'quote'
  | 'educational'
  | 'promotional'
  | 'product'
  | 'service'
  | 'carousel'
  | 'testimonial'
  | 'case_study'
  | 'tips'
  | 'question'
  | 'reel_script';

export type PostStatus =
  | 'draft'
  | 'generating'
  | 'needs_review'
  | 'approved'
  | 'scheduled'
  | 'published'
  | 'failed';

export type Language = 'en' | 'ur' | 'roman_ur';

export type BrandTone =
  | 'professional'
  | 'friendly'
  | 'premium'
  | 'educational'
  | 'bold'
  | 'inspirational'
  | 'humorous'
  | 'conversational';

export interface BrandKit {
  businessName: string;
  niche: string;
  description: string;
  productsServices: string;
  targetAudience: string;
  targetLocation: string;
  contentGoals: string[];
  preferredLanguages: Language[];
  brandTone: BrandTone;
  logoUrl?: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fontHeading: string;
  fontBody: string;
  visualStyle: 'minimal_modern' | 'bold_vibrant' | 'luxury_dark' | 'clean_tech' | 'warm_editorial';
  modestImageryRule: boolean; // Full hijab if women are portrayed, no visible hair
  contentRestrictions: string;
  autoPublishApproved: boolean;
}

export interface CarouselSlide {
  slideNumber: number;
  title: string;
  body: string;
  visualNote?: string;
  imageUrl?: string;
}

export interface PostItem {
  id: string;
  title: string;
  platform: Platform;
  contentType: ContentType;
  pillar: ContentPillar;
  language: Language;
  hook: string;
  alternativeHooks?: string[];
  headline: string;
  caption: string;
  cta: string;
  hashtags: string[];
  visualPrompt: string;
  imageUrl?: string;
  carouselSlides?: CarouselSlide[];
  status: PostStatus;
  scheduledTime?: string; // ISO string
  publishedAt?: string;
  calendarEventId?: string; // Google Calendar Event ID
  createdAt: string;
  updatedAt: string;
  demoMode: boolean;
  performance?: {
    reach: number;
    impressions: number;
    engagement: number;
    likes: number;
    comments: number;
    shares: number;
    saves: number;
    clicks: number;
  };
  rejectionReason?: string;
}

export interface SocialAccount {
  id: string;
  platform: Platform;
  accountName: string;
  handle: string;
  connected: boolean;
  isMock: boolean;
  avatarUrl?: string;
  lastSync?: string;
  permissions: string[];
  followersCount: number;
}

export interface AgentChatMessage {
  id: string;
  sender: 'user' | 'agent' | 'system';
  text: string;
  timestamp: string;
  steps?: { title: string; status: 'pending' | 'in_progress' | 'completed' | 'failed' }[];
  generatedPostIds?: string[];
  suggestedActions?: string[];
}

export interface ContentTemplate {
  id: string;
  name: string;
  description: string;
  contentType: ContentType;
  pillar: ContentPillar;
  headlineStructure: string;
  captionStructure: string;
  ctaDefault: string;
  defaultHashtags: string[];
}
