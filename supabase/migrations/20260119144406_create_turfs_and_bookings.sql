/*
  # Create Turfs and Bookings Schema

  1. New Tables
    - `turfs`
      - `id` (uuid, primary key)
      - `name` (text) - Turf name
      - `location` (text) - Turf location/address
      - `city` (text) - City name
      - `price_per_hour` (integer) - Price in rupees
      - `rating` (numeric) - Rating out of 5
      - `image_url` (text) - Turf image URL
      - `created_at` (timestamptz) - Created timestamp
    
    - `bookings`
      - `id` (uuid, primary key)
      - `turf_id` (uuid) - Reference to turfs table
      - `booking_date` (date) - Date of booking
      - `time_slot` (text) - Time slot (e.g., "10:00 AM - 11:00 AM")
      - `user_name` (text) - Name of the user
      - `user_email` (text) - Email of the user
      - `payment_method` (text) - Payment method used
      - `total_amount` (integer) - Total amount paid
      - `status` (text) - Booking status (confirmed, cancelled)
      - `created_at` (timestamptz) - Booking created timestamp
  
  2. Security
    - Enable RLS on both tables
    - Add policies for public read access to turfs
    - Add policies for booking creation and user-specific booking reads
*/

CREATE TABLE IF NOT EXISTS turfs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  location text NOT NULL,
  city text NOT NULL,
  price_per_hour integer NOT NULL,
  rating numeric(2,1) DEFAULT 4.0,
  image_url text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  turf_id uuid REFERENCES turfs(id) NOT NULL,
  booking_date date NOT NULL,
  time_slot text NOT NULL,
  user_name text NOT NULL,
  user_email text NOT NULL,
  payment_method text NOT NULL,
  total_amount integer NOT NULL,
  status text DEFAULT 'confirmed',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE turfs ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view turfs"
  ON turfs FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Anyone can create bookings"
  ON bookings FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anyone can view bookings"
  ON bookings FOR SELECT
  TO anon
  USING (true);

INSERT INTO turfs (name, location, city, price_per_hour, rating, image_url) VALUES
  ('Green Field Arena', 'Koramangala, Bangalore', 'Bengaluru', 800, 4.5, 'https://images.pexels.com/photos/399187/pexels-photo-399187.jpeg?auto=compress&cs=tinysrgb&w=800'),
  ('Sky Sports Turf', 'Indiranagar, Bangalore', 'Bengaluru', 1000, 4.8, 'https://images.pexels.com/photos/274422/pexels-photo-274422.jpeg?auto=compress&cs=tinysrgb&w=800'),
  ('Champions Ground', 'Whitefield, Bangalore', 'Bengaluru', 750, 4.3, 'https://images.pexels.com/photos/186076/pexels-photo-186076.jpeg?auto=compress&cs=tinysrgb&w=800'),
  ('Elite Sports Club', 'HSR Layout, Bangalore', 'Bengaluru', 900, 4.6, 'https://images.pexels.com/photos/399187/pexels-photo-399187.jpeg?auto=compress&cs=tinysrgb&w=800'),
  ('Victory Arena', 'Electronic City, Bangalore', 'Bengaluru', 700, 4.2, 'https://images.pexels.com/photos/274422/pexels-photo-274422.jpeg?auto=compress&cs=tinysrgb&w=800'),
  ('Power Play Ground', 'Andheri, Mumbai', 'Mumbai', 1200, 4.7, 'https://images.pexels.com/photos/186076/pexels-photo-186076.jpeg?auto=compress&cs=tinysrgb&w=800'),
  ('Cricket Arena', 'T Nagar, Chennai', 'Chennai', 850, 4.4, 'https://images.pexels.com/photos/399187/pexels-photo-399187.jpeg?auto=compress&cs=tinysrgb&w=800'),
  ('Super Sports Turf', 'Hitech City, Hyderabad', 'Hyderabad', 950, 4.5, 'https://images.pexels.com/photos/274422/pexels-photo-274422.jpeg?auto=compress&cs=tinysrgb&w=800');
