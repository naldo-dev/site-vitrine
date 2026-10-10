import { supabase } from '@/lib/supabase/client';
import { Category, Photo } from '@/types';

export const catalogService = {
  // Busca todas as categorias ordenadas
  async getCategories(): Promise<Category[]> {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('order_index', { ascending: true });

    if (error) {
      console.error('Erro ao buscar categorias:', error);
      return [];
    }
    return data || [];
  },

  // Busca todas as fotos (opcionalmente filtradas por categoria)
  async getPhotos(categoryId?: string): Promise<Photo[]> {
    let query = supabase
      .from('photos')
      .select('*, categories(*)')
      .order('created_at', { ascending: false });

    if (categoryId) {
      query = query.eq('category_id', categoryId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Erro ao buscar fotos:', error);
      return [];
    }
    return data || [];
  },

  // Busca fotos destacadas para a Home
  async getFeaturedPhotos(): Promise<Photo[]> {
    const { data, error } = await supabase
      .from('photos')
      .select('*, categories(*)')
      .eq('is_featured', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erro ao buscar fotos destacadas:', error);
      return [];
    }
    return data || [];
  }
};