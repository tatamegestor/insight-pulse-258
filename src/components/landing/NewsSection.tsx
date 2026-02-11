import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Newspaper, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useFinanceNews } from "@/hooks/useNews";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

function NewsCardSkeleton() {
  return (
    <Card className="overflow-hidden flex-shrink-0 w-[240px] sm:w-[280px]">
      <Skeleton className="h-40 w-full" />
      <CardContent className="p-4">
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-3/4" />
      </CardContent>
    </Card>
  );
}

function FeaturedNewsSkeleton() {
  return (
    <Card className="overflow-hidden">
      <div className="grid md:grid-cols-2 gap-0">
        <Skeleton className="h-64 md:h-80 w-full" />
        <CardContent className="p-6 flex flex-col justify-center">
          <Skeleton className="h-8 w-full mb-3" />
          <Skeleton className="h-8 w-3/4 mb-4" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-2/3" />
        </CardContent>
      </div>
    </Card>
  );
}

export function NewsSection() {
  const { data: news, isLoading, error } = useFinanceNews(5);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), {
        addSuffix: true,
        locale: ptBR,
      });
    } catch {
      return "";
    }
  };

  const featuredNews = news?.[0];
  const otherNews = news?.slice(1) || [];

  return (
    <section className="py-6 bg-muted/30" aria-labelledby="news-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Newspaper className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 id="news-heading" className="text-xl sm:text-2xl font-bold text-foreground">Notícias do Mercado</h2>
              <p className="text-sm text-muted-foreground">
                As últimas notícias do mercado financeiro
              </p>
            </div>
          </div>
        </div>

        {/* Featured News */}
        {isLoading ? (
          <FeaturedNewsSkeleton />
        ) : featuredNews ? (
          <a
            href={featuredNews.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block group"
          >
            <Card className="overflow-hidden mb-8 transition-shadow hover:shadow-lg">
              <div className="grid md:grid-cols-2 gap-0">
                <div className="relative h-64 md:h-80 overflow-hidden">
                  <img
                    src={featuredNews.urlToImage || "/placeholder.svg"}
                    alt={featuredNews.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/placeholder.svg";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </div>
                <CardContent className="p-6 flex flex-col justify-center bg-card">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                    <span className="font-medium text-primary">
                      {featuredNews.source.name}
                    </span>
                    <span>•</span>
                    <span>{formatDate(featuredNews.publishedAt)}</span>
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors line-clamp-3">
                    {featuredNews.title}
                  </h3>
                  <p className="text-muted-foreground line-clamp-3 mb-4">
                    {featuredNews.description}
                  </p>
                  <div className="flex items-center gap-2 text-primary font-medium">
                    <span>Ler mais</span>
                    <ExternalLink className="h-4 w-4" />
                  </div>
                </CardContent>
              </div>
            </Card>
          </a>
        ) : null}

        {/* News Carousel */}
        <div className="relative">
          {/* Navigation Buttons */}
          {canScrollLeft && (
            <Button
              variant="secondary"
              size="icon"
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 shadow-lg hidden md:flex"
              onClick={() => scroll("left")}
              aria-label="Notícias anteriores"
            >
              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            </Button>
          )}
          {canScrollRight && (
            <Button
              variant="secondary"
              size="icon"
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 shadow-lg hidden md:flex"
              onClick={() => scroll("right")}
              aria-label="Próximas notícias"
            >
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            </Button>
          )}

          {/* Scrollable Container */}
          <div
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {isLoading ? (
              <>
                <NewsCardSkeleton />
                <NewsCardSkeleton />
                <NewsCardSkeleton />
                <NewsCardSkeleton />
              </>
            ) : (
              otherNews.map((article, index) => (
                <a
                  key={index}
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex-shrink-0"
                >
                  <Card className="overflow-hidden w-[240px] sm:w-[280px] h-full transition-shadow hover:shadow-lg">
                    <div className="relative h-40 overflow-hidden">
                      <img
                        src={article.urlToImage || "/placeholder.svg"}
                        alt={article.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/placeholder.svg";
                        }}
                      />
                    </div>
                    <CardContent className="p-4">
                      <p className="text-xs text-muted-foreground mb-2">
                        {article.source.name} • {formatDate(article.publishedAt)}
                      </p>
                      <h4 className="font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                        {article.title}
                      </h4>
                    </CardContent>
                  </Card>
                </a>
              ))
            )}
          </div>
        </div>

        {/* View More Link */}
        <div className="text-right mt-4">
          <Link to="/blog">
            <Button variant="link" className="text-primary font-medium">
              Mostrar outros artigos
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
