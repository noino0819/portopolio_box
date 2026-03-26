import type {
  Profile,
  Education,
  Certification,
  Project,
  Award,
  Game,
  Album,
  Book,
  Hobby,
} from '@/data/portfolio';

export type PlanType = 'monthly' | 'yearly' | 'permanent';
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'cancelled';

export interface PortfolioRow {
  id: string;
  user_id: string;
  slug: string;
  is_active: boolean;
  youtube_playlist_id: string | null;
  youtube_first_video_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface PortfolioDataRow {
  id: string;
  portfolio_id: string;
  lang: string;
  profile: Profile;
  education: Education[];
  certifications: Certification[];
  projects: Project[];
  awards: Award[];
  games: Game[];
  albums: Album[];
  books: Book[];
  hobbies: Hobby[];
  cd_story: string[];
  updated_at: string;
}

export interface PaymentRow {
  id: string;
  user_id: string | null;
  email: string;
  plan_type: PlanType;
  amount: number;
  status: PaymentStatus;
  toss_payment_key: string | null;
  toss_order_id: string | null;
  slug_reserved: string | null;
  expires_at: string | null;
  created_at: string;
  completed_at: string | null;
}

export interface Database {
  public: {
    Tables: {
      portfolios: {
        Row: PortfolioRow;
        Insert: Omit<PortfolioRow, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<PortfolioRow, 'id' | 'created_at'>>;
      };
      portfolio_data: {
        Row: PortfolioDataRow;
        Insert: Omit<PortfolioDataRow, 'id' | 'updated_at'>;
        Update: Partial<Omit<PortfolioDataRow, 'id'>>;
      };
      payments: {
        Row: PaymentRow;
        Insert: Omit<PaymentRow, 'id' | 'created_at'>;
        Update: Partial<Omit<PaymentRow, 'id' | 'created_at'>>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
