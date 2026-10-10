import Image from 'next/image';
import { Photo } from '@/types';
import { getWhatsAppUrl } from '@/utils/whatsapp';

interface PhotoCardProps {
  photo: Photo;
}

export function PhotoCard({ photo }: PhotoCardProps) {
  const whatsappUrl = getWhatsAppUrl(photo.title);

  return (
    <div className="group overflow-hidden rounded-2xl bg-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl border border-pink-100">
      <div className="relative aspect-square w-full overflow-hidden bg-pink-50">
        <Image
          src={photo.image_url}
          alt={photo.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {photo.categories && (
          <span className="absolute top-3 left-3 rounded-full bg-white/90 backdrop-blur-md px-3 py-1 text-xs font-medium text-pink-700 shadow-sm">
            {photo.categories.name}
          </span>
        )}
      </div>

      <div className="p-4 flex flex-col justify-between">
        <h3 className="text-lg font-semibold text-gray-800 line-clamp-1 mb-3">
          {photo.title}
        </h3>
        
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-emerald-700 active:scale-95 shadow-sm"
        >
          <span>Pedir no WhatsApp</span>
        </a>
      </div>
    </div>
  );
}