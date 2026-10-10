import { supabase } from '@/lib/supabase/client';

interface CloudinaryUploadResponse {
  secure_url: string;
  public_id: string;
}

const uploadToCloudinary = async (file: File): Promise<CloudinaryUploadResponse> => {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new Error('Configurações do Cloudinary ausentes nas variáveis de ambiente.');
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    {
      method: 'POST',
      body: formData,
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error?.message || 'Falha ao enviar imagem para o Cloudinary.');
  }

  const data = await response.json();

  return {
    secure_url: data.secure_url,
    public_id: data.public_id,
  };
};

export const photoService = {
  async updatePhoto(params: {
    id: string;
    title: string;
    categoryId: string;
    isFeatured?: boolean;
  }) {
    const { id, title, categoryId, isFeatured = false } = params;

    const { data, error } = await supabase
      .from('photos')
      .update({
        title,
        category_id: categoryId,
        is_featured: isFeatured,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Erro ao atualizar foto: ${error.message}`);
    }

    return data;
  },

  async uploadAndSavePhoto(params: {
    file: File;
    title: string;
    categoryId: string;
    isFeatured?: boolean;
  }) {
    const { file, title, categoryId, isFeatured = false } = params;

    // 1. Upload da imagem para o Cloudinary
    const { secure_url, public_id } = await uploadToCloudinary(file);

    // 2. Registra a imagem no Supabase
    const { data, error } = await supabase
      .from('photos')
      .insert([
        {
          title,
          image_url: secure_url,
          cloudinary_public_id: public_id,
          category_id: categoryId,
          is_featured: isFeatured,
        },
      ])
      .select()
      .single();

    if (error) {
      throw new Error(`Erro ao salvar foto no banco de dados: ${error.message}`);
    }

    return data;
  },

  async deletePhoto(photoId: string) {
    const { error } = await supabase
      .from('photos')
      .delete()
      .eq('id', photoId);

    if (error) {
      throw new Error(`Erro ao excluir foto: ${error.message}`);
    }
  },
};

