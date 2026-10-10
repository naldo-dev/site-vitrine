'use client';

import { Category } from '@/types';

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string | null;
  onSelectCategory: (id: string | null) => void;
}

export function CategoryFilter({
  categories,
  selectedCategory,
  onSelectCategory,
}: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2 my-8 px-4">
      {/* Botão Todos os Produtos */}
      <button
        onClick={() => onSelectCategory(null)}
        className={`rounded-full px-5 py-2 text-sm font-medium transition-all duration-200 ${
          selectedCategory === null
            ? 'bg-pink-600 text-white shadow-md shadow-pink-200 scale-105'
            : 'bg-white text-gray-600 hover:bg-pink-50 hover:text-pink-600 border border-pink-100'
        }`}
      >
        Todos
      </button>

      {/* Botões das Categorias Dinâmicas */}
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onSelectCategory(category.id)}
          className={`rounded-full px-5 py-2 text-sm font-medium transition-all duration-200 ${
            selectedCategory === category.id
              ? 'bg-pink-600 text-white shadow-md shadow-pink-200 scale-105'
              : 'bg-white text-gray-600 hover:bg-pink-50 hover:text-pink-600 border border-pink-100'
          }`}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
}