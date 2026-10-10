import { siteConfig } from '@/config/site';

export const getWhatsAppUrl = (productTitle: string): string => {
  const phone = siteConfig.whatsappNumber; // Vai puxar '5581992961871'
  const message = `${siteConfig.whatsappDefaultMessage} "${productTitle}"`;
  
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
};