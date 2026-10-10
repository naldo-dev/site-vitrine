'use client';

import { useEffect, useState } from 'react';
import { catalogService } from '@/services/catalogService';
import { CategoryFilter } from '@/components/public/CategoryFilter';
import { PhotoGrid } from '@/components/public/PhotoGrid';
import { Category, Photo } from '@/types';

export default function HomePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadInitialData() {
      setLoading(true);
      try {
        const [catsData, photosData] = await Promise.all([
          catalogService.getCategories(),
          catalogService.getPhotos(),
        ]);
        setCategories(catsData);
        setPhotos(photosData);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setLoading(false);
      }
    }

    loadInitialData();
  }, []);

  // Recarrega as fotos quando o usuário altera a categoria selecionada
  const handleSelectCategory = async (categoryId: string | null) => {
    setSelectedCategory(categoryId);
    setLoading(true);
    try {
      const filteredPhotos = await catalogService.getPhotos(categoryId || undefined);
      setPhotos(filteredPhotos);
    } catch (error) {
      console.error('Erro ao filtrar fotos:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-pink-50/50 to-white pb-20">
      {/* Banner / Header Simples */}
      <header className="py-12 px-4 text-center bg-white border-b border-pink-100 shadow-sm">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
          Vitrine de Doces & Bolos
        </h1>
        <p className="mt-3 text-lg text-gray-600 max-w-2xl mx-auto">
          Escolha os seus favoritos e solicite seu orçamento diretamente pelo WhatsApp!
        </p>
      </header>

      {/* Filtro de Categorias */}
      <section className="container mx-auto">
        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={handleSelectCategory}
        />
      </section>

      {/* Grid de Fotos e Produtos */}
      <section className="container mx-auto mt-6">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
          </div>
        ) : (
          <PhotoGrid photos={photos} />
        )}
      </section>
    </main>
  );
}