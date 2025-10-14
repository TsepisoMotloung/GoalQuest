
import axios from 'axios';
import type { NewsArticle } from './types';

const NEWS_API_URL = 'https://newsapi.org/v2/everything';
const NEWS_API_KEY = '0e805f77856d435bb15551357f4955b2';

interface NewsAPIArticle {
    source: {
        id: string | null;
        name: string;
    };
    author: string | null;
    title: string;
    description: string;
    url: string;
    urlToImage: string;
    publishedAt: string;
    content: string;
}

const transformToNewsArticle = (item: NewsAPIArticle, index: number): NewsArticle => ({
    id: `${item.source.id || 'news'}-${index}`,
    title: item.title,
    source: item.source.name,
    date: item.publishedAt,
    imageUrl: item.urlToImage || 'https://picsum.photos/seed/news-fallback/800/450',
    imageHint: 'news article image',
    url: item.url,
    summary: item.description,
});


export const getNews = async (): Promise<NewsArticle[]> => {
    if (!NEWS_API_KEY) {
        console.warn("NEWS_API_KEY is not set. Returning empty array.");
        return [];
    }

    try {
        const response = await axios.get<{ articles: NewsAPIArticle[] }>(NEWS_API_URL, {
            params: {
                q: 'football OR soccer',
                sortBy: 'publishedAt',
                language: 'en',
                apiKey: NEWS_API_KEY,
                pageSize: 20,
            }
        });

        if (response.data && Array.isArray(response.data.articles)) {
            return response.data.articles
                .filter(article => article.urlToImage && article.description) // Ensure basic content exists
                .map(transformToNewsArticle);
        }
        return [];
    } catch (error) {
        console.error('Error fetching news from NewsAPI:', error);
        return [];
    }
};
