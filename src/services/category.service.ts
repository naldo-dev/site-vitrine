import { supabase } from '@/lib/supabase/client';
import { Category } from '@/types';

export const categoryService = {
  async createCategory(name: string, description?: string): Promise<Category> {
    const slug = name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-');

    const { data, error } = await supabase
      .from('categories')
      .insert([{ name, slug, description }])
      .select()
      .single();

    if (error) {
      throw new Error(`Erro ao criar categoria: ${error.message}`);
    }

    return data;
  },

  async updateCategory(id: string, name: string, description?: string): Promise<Category> {
    const slug = name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-');

    const { data, error } = await supabase
      .from('categories')
      .update({ name, slug, description })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Erro ao atualizar categoria: ${error.message}`);
    }

    return data;
  },

  async deleteCategory(id: string): Promise<void> {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Erro ao excluir categoria (verifique se há fotos vinculadas): ${error.message}`);
    }
  },
};