'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { photoService } from '@/services/photo.service';
import { catalogService } from '@/services/catalogService';
import { categoryService } from '@/services/category.service';
import { Category, Photo } from '@/types';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  // Form states (Fotos)
  const [editingPhotoId, setEditingPhotoId] = useState<string | null>(null);
  const [photoTitle, setPhotoTitle] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [photoMessage, setPhotoMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form states (Categorias) - Isolados
  const [categoryName, setCategoryName] = useState('');
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [catMessage, setCatMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  useEffect(() => {
    checkUserAndLoadData();
  }, []);

  const checkUserAndLoadData = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      router.push('/admin/login');
      return;
    }
    await loadData();
    setLoading(false);
  };

  const loadData = async () => {
    const cats = await catalogService.getCategories();
    const phts = await catalogService.getPhotos();
    setCategories(cats);
    setPhotos(phts);
    if (cats.length > 0 && !categoryId) {
      setCategoryId(cats[0].id);
    }
  };

  const handlePhotoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!photoTitle || !categoryId) {
      setPhotoMessage({ type: 'error', text: 'Preencha o título e selecione uma categoria.' });
      return;
    }

    if (!editingPhotoId && !file) {
      setPhotoMessage({ type: 'error', text: 'Selecione uma imagem para o novo cadastro.' });
      return;
    }

    setUploading(true);
    setPhotoMessage(null);

    try {
      if (editingPhotoId) {
        await photoService.updatePhoto({
          id: editingPhotoId,
          title: photoTitle,
          categoryId,
          isFeatured,
        });
        setPhotoMessage({ type: 'success', text: 'Foto atualizada com sucesso!' });
        setEditingPhotoId(null);
      } else if (file) {
        await photoService.uploadAndSavePhoto({
          file,
          title: photoTitle,
          categoryId,
          isFeatured,
        });
        setPhotoMessage({ type: 'success', text: 'Foto enviada e cadastrada com sucesso!' });
      }

      setPhotoTitle('');
      setFile(null);
      setIsFeatured(false);
      await loadData();
    } catch (err: any) {
      setPhotoMessage({ type: 'error', text: err.message || 'Erro ao salvar foto.' });
    } finally {
      setUploading(false);
    }
  };

  const handleEditPhoto = (photo: Photo) => {
    setEditingPhotoId(photo.id);
    setPhotoTitle(photo.title);
    setCategoryId(photo.category_id ?? '');
    setIsFeatured(photo.is_featured || false);
    setFile(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEditPhoto = () => {
    setEditingPhotoId(null);
    setPhotoTitle('');
    setIsFeatured(false);
    setFile(null);
  };

  const handleDeletePhoto = async (photoId: string) => {
    if (!confirm('Deseja realmente excluir esta foto?')) return;

    try {
      await photoService.deletePhoto(photoId);
      setPhotoMessage({ type: 'success', text: 'Foto excluída com sucesso!' });
      await loadData();
    } catch (err: any) {
      setPhotoMessage({ type: 'error', text: err.message || 'Erro ao excluir foto.' });
    }
  };

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryName.trim()) return;

    try {
      if (editingCategoryId) {
        await categoryService.updateCategory(editingCategoryId, categoryName);
        setCatMessage({ type: 'success', text: 'Categoria renomeada com sucesso!' });
        setEditingCategoryId(null);
      } else {
        await categoryService.createCategory(categoryName);
        setCatMessage({ type: 'success', text: 'Categoria cadastrada com sucesso!' });
      }
      setCategoryName('');
      await loadData();
    } catch (err: any) {
      setCatMessage({ type: 'error', text: err.message || 'Erro ao salvar categoria.' });
    }
  };

  const handleEditCategory = (cat: Category) => {
    setEditingCategoryId(cat.id);
    setCategoryName(cat.name);
  };

  const handleCancelEditCategory = () => {
    setEditingCategoryId(null);
    setCategoryName('');
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm('Deseja excluir esta categoria? As fotos vinculadas a ela também serão removidas.')) return;
    try {
      await categoryService.deleteCategory(id);
      setCatMessage({ type: 'success', text: 'Categoria excluída com sucesso!' });
      await loadData();
    } catch (err: any) {
      setCatMessage({ type: 'error', text: err.message || 'Erro ao excluir categoria.' });
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/admin/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500 font-medium">Carregando painel...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      {/* Header */}
      <div className="max-w-6xl mx-auto flex justify-between items-center mb-8 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-amber-900">Painel Administrativo</h1>
          <p className="text-sm text-gray-500">Gerencie seu catálogo de fotos, produtos e categorias</p>
        </div>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-50 text-red-600 font-medium text-sm rounded-lg hover:bg-red-100 transition-colors"
        >
          Sair
        </button>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Formulário de Cadastro / Edição de Foto */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 lg:col-span-1 h-fit">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-800">
              {editingPhotoId ? 'Editar Foto' : 'Nova Foto'}
            </h2>
            {editingPhotoId && (
              <button
                onClick={handleCancelEditPhoto}
                className="text-xs text-gray-500 hover:text-gray-700 underline"
              >
                Cancelar Edição
              </button>
            )}
          </div>

          {photoMessage && (
            <div
              className={`mb-4 p-3 text-sm rounded-lg border ${
                photoMessage.type === 'success'
                  ? 'bg-green-50 text-green-700 border-green-200'
                  : 'bg-red-50 text-red-700 border-red-200'
              }`}
            >
              {photoMessage.text}
            </div>
          )}

          <form onSubmit={handlePhotoSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Título / Nome do Produto</label>
              <input
                type="text"
                required
                value={photoTitle}
                onChange={(e) => setPhotoTitle(e.target.value)}
                placeholder="Ex: Torta de Morango"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {!editingPhotoId && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Imagem</label>
                <input
                  type="file"
                  accept="image/*"
                  required
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100"
                />
              </div>
            )}

            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="isFeatured"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
              />
              <label htmlFor="isFeatured" className="text-sm text-gray-700 font-medium">
                Destaque na página inicial
              </label>
            </div>

            <button
              type="submit"
              disabled={uploading}
              className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-lg transition-colors text-sm disabled:opacity-50 mt-4"
            >
              {uploading ? 'Salvando...' : editingPhotoId ? 'Salvar Alterações' : 'Cadastrar Foto'}
            </button>
          </form>
        </div>

        {/* Gerenciamento de Categorias */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 lg:col-span-2 h-fit">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Gerenciar Categorias</h2>

          {catMessage && (
            <div
              className={`mb-4 p-3 text-sm rounded-lg border ${
                catMessage.type === 'success'
                  ? 'bg-green-50 text-green-700 border-green-200'
                  : 'bg-red-50 text-red-700 border-red-200'
              }`}
            >
              {catMessage.text}
            </div>
          )}

          <form onSubmit={handleCategorySubmit} className="flex gap-2 mb-6">
            <input
              type="text"
              required
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder="Nome da nova categoria (ex: Bolos Festivos)"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-lg transition-colors text-sm whitespace-nowrap"
            >
              {editingCategoryId ? 'Salvar' : 'Adicionar'}
            </button>
            {editingCategoryId && (
              <button
                type="button"
                onClick={handleCancelEditCategory}
                className="px-3 py-2 bg-gray-100 text-gray-600 hover:bg-gray-200 text-sm font-medium rounded-lg transition-colors"
              >
                Cancelar
              </button>
            )}
          </form>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase">
                  <th className="py-2 px-3">Nome</th>
                  <th className="py-2 px-3">Slug</th>
                  <th className="py-2 px-3 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-sm">
                {categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-gray-50/50">
                    <td className="py-3 px-3 font-medium text-gray-800">{cat.name}</td>
                    <td className="py-3 px-3 text-gray-400 text-xs font-mono">{cat.slug}</td>
                    <td className="py-3 px-3 text-right space-x-2">
                      <button
                        onClick={() => handleEditCategory(cat)}
                        className="text-amber-600 hover:text-amber-800 font-medium text-xs px-2 py-1 bg-amber-50 rounded"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(cat.id)}
                        className="text-red-600 hover:text-red-800 font-medium text-xs px-2 py-1 bg-red-50 rounded"
                      >
                        Excluir
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Lista de Fotos Cadastradas com Botão de Editar */}
      <div className="max-w-6xl mx-auto bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Fotos Cadastradas ({photos.length})</h2>

        {photos.length === 0 ? (
          <p className="text-sm text-gray-500">Nenhuma foto cadastrada ainda.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {photos.map((photo) => (
              <div key={photo.id} className="relative group border border-gray-100 rounded-lg overflow-hidden bg-gray-50 flex flex-col justify-between">
                <div>
                  <img
                    src={photo.image_url}
                    alt={photo.title}
                    className="w-full h-32 object-cover"
                  />
                  <div className="p-2">
                    <p className="text-xs font-semibold text-gray-800 truncate">{photo.title}</p>
                  </div>
                </div>
                <div className="p-2 pt-0 grid grid-cols-2 gap-1">
                  <button
                    onClick={() => handleEditPhoto(photo)}
                    className="py-1 bg-amber-50 text-amber-700 hover:bg-amber-100 text-xs font-medium rounded transition-colors"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDeletePhoto(photo.id)}
                    className="py-1 bg-red-50 text-red-600 hover:bg-red-100 text-xs font-medium rounded transition-colors"
                  >
                    Excluir
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}