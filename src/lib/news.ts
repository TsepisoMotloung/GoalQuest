

import axios from 'axios';
import type { NewsArticle } from './types';

const MEDIASTACK_API_URL = 'http://api.mediastack.com/v1/news';
const MEDIASTACK_API_KEY = process.env.MEDIASTACK_API_KEY || '';

interface MediastackArticle {
    title: string;
    description: string;
    url: string;
    image: string;
    published_at: string;
    source: string;
    author: string;
    category: string;
    language: string;
    country: string;
}

const transformToNewsArticle = (item: MediastackArticle, index: number): NewsArticle => ({
    id: `news-${index}`,
    title: item.title,
    source: item.source,
    date: item.published_at,
    imageUrl: item.image || 'https://picsum.photos/seed/news-fallback/800/450',
    imageHint: 'news article image',
    url: item.url,
    summary: item.description,
});

export const getNews = async (): Promise<NewsArticle[]> => {
    if (!MEDIASTACK_API_KEY) {
        console.warn('MEDIASTACK_API_KEY is not set. Returning empty array.');
        return [];
    }
    try {
        const response = await axios.get<{ data: MediastackArticle[] }>(MEDIASTACK_API_URL, {
            params: {
                access_key: MEDIASTACK_API_KEY,
                keywords: 'football,soccer',
                languages: 'en',
                sort: 'published_desc',
                limit: 20,
            },
        });
        if (response.data && Array.isArray(response.data.data)) {
            return response.data.data
                .filter(article => article.image && article.description)
                .map(transformToNewsArticle);
        }
        return [];
    } catch (error) {
        console.error('Error fetching news from Mediastack:', error);
        return [];
    }
};
