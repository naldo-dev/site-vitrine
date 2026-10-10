export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  order_index: number;
  created_at: string;
}

export interface Photo {
  id: string;
  title: string;
  image_url: string;
  cloudinary_public_id?: string | null;
  category_id?: string | null;
  is_featured: boolean;
  created_at: string;
  categories?: Category | null;
}