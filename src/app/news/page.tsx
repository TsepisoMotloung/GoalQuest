import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { getNews } from '@/lib/news';
import { getPlaceholderImage } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';

export const revalidate = 3600; // Revalidate every hour

export default async function NewsPage() {
  const heroImage = getPlaceholderImage('hero-highlights');
  const articles = await getNews();

  const mainArticle = articles[0];
  const otherArticles = articles.slice(1);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {mainArticle && (
          <div className="lg:col-span-2">
            <Link href={mainArticle.url} target="_blank" rel="noopener noreferrer">
              <Card className="overflow-hidden group h-full flex flex-col">
                <div className="relative w-full h-64 md:h-96">
                  <Image
                    src={mainArticle.imageUrl}
                    alt={mainArticle.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    data-ai-hint={mainArticle.imageHint}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-6">
                    <Badge variant="destructive" className="mb-2">Featured</Badge>
                    <h2 className="font-headline text-2xl md:text-4xl font-bold text-white shadow-xl">
                      {mainArticle.title}
                    </h2>
                  </div>
                </div>
                <CardContent className="p-6 flex-1">
                  <p className="text-muted-foreground">{mainArticle.summary}</p>
                </CardContent>
                <CardFooter className="p-6 pt-0 text-sm text-muted-foreground flex justify-between">
                  <span>{mainArticle.source}</span>
                  <span>{formatDistanceToNow(new Date(mainArticle.date), { addSuffix: true })}</span>
                </CardFooter>
              </Card>
            </Link>
          </div>
        )}

        <div className="space-y-6">
           {otherArticles.slice(0, 2).map((article) => (
             <Link href={article.url} key={article.id} target="_blank" rel="noopener noreferrer">
                <Card className="overflow-hidden group flex h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                    <div className="relative w-1/3">
                         <Image src={article.imageUrl} alt={article.title} fill className="object-cover" data-ai-hint={article.imageHint} />
                    </div>
                    <div className="w-2/3 flex flex-col">
                        <CardContent className="p-4 flex-1">
                            <CardTitle className="text-base font-semibold leading-snug group-hover:text-primary transition-colors">
                                {article.title}
                            </CardTitle>
                        </CardContent>
                        <CardFooter className="p-4 pt-0 text-xs text-muted-foreground flex justify-between items-center">
                           <span>{article.source}</span>
                           <span>{formatDistanceToNow(new Date(article.date), { addSuffix: true })}</span>
                        </CardFooter>
                    </div>
                </Card>
            </Link>
           ))}
        </div>
      </div>
      
      <h3 className="font-headline text-2xl font-bold mb-6">More News</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {otherArticles.slice(2).map(article => (
            <Link href={article.url} key={article.id} target="_blank" rel="noopener noreferrer">
              <Card className="overflow-hidden h-full flex flex-col group transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                <CardHeader className="p-0 relative">
                  <div className="aspect-video relative">
                    <Image
                      src={article.imageUrl}
                      alt={article.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      data-ai-hint={article.imageHint}
                    />
                     <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300" />
                  </div>
                </CardHeader>
                <CardContent className="flex-1 p-4">
                  <CardTitle className="text-lg font-semibold leading-snug group-hover:text-primary transition-colors">
                    {article.title}
                  </CardTitle>
                </CardContent>
                <CardFooter className="p-4 pt-0 text-sm text-muted-foreground flex justify-between">
                  <span>{article.source}</span>
                  <span>{formatDistanceToNow(new Date(article.date), { addSuffix: true })}</span>
                </CardFooter>
              </Card>
            </Link>
        ))}
      </div>
    </div>
  );
}
