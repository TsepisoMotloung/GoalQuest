import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { PlaceHolderImages, type ImagePlaceholder } from "./placeholder-images"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getPlaceholderImage(id: string): ImagePlaceholder {
    return PlaceHolderImages.find(img => img.id === id) || {
        id: 'not-found',
        description: 'Image not found',
        imageUrl: `https://picsum.photos/seed/${id}/400/300`,
        imageHint: 'placeholder',
    }
}
