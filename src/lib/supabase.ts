import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Turf {
  id: string;
  name: string;
  location: string;
  city: string;
  price_per_hour: number;
  rating: number;
  image_url: string;
}

export interface Booking {
  id: string;
  turf_id: string;
  booking_date: string;
  time_slot: string;
  user_name: string;
  user_email: string;
  payment_method: string;
  total_amount: number;
  status: string;
}
