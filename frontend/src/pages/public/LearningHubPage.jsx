import React, { useState, useEffect } from 'react';
import { learningApi } from '../../api/learningApi';
import { ArticleCard } from '../../components/cards/ArticleCard';
import { TabView } from '../../components/common/TabView';
import { Input } from '../../components/common/Input';
import { EmptyState } from '../../components/common/EmptyState';
import { LEARNING_CATEGORIES } from '../../utils/constants';
import { BookOpen, Search, Sparkles } from 'lucide-react';
import { useDebounce } from '../../hooks/useDebounce';

export const LearningHubPage = () => {
  const [articles, setArticles] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const debouncedSearch = useDebounce(search, 300);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const data = await learningApi.getArticles({
        category: selectedCategory,
        search: debouncedSearch
      });
      setArticles(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, [selectedCategory, debouncedSearch]);

  const tabs = LEARNING_CATEGORIES.map((cat) => ({
    id: cat,
    label: cat
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 text-left">
      <div>
        <span className="text-xs uppercase tracking-wider font-bold text-teal-600">
          Knowledge & Best Practices
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-heading mt-1">
          Pet Care Learning Hub
        </h1>
        <p className="text-sm text-slate-500 mt-1 max-w-xl">
          Expert articles, veterinary recommendations, and step-by-step training guides from certified professionals.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-5 rounded-3xl bg-white border border-slate-100 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="overflow-x-auto w-full md:w-auto pb-1">
            <TabView
              tabs={tabs}
              activeTab={selectedCategory}
              onTabChange={setSelectedCategory}
            />
          </div>
          <div className="w-full md:w-72">
            <Input
              icon={Search}
              placeholder="Search guides, vaccines..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Articles Grid */}
      {loading ? (
        <div className="py-20 text-center">
          <div className="w-12 h-12 rounded-full border-4 border-teal-500/20 border-t-teal-600 animate-spin mx-auto mb-3" />
          <p className="text-xs font-semibold text-slate-500">Loading educational guides...</p>
        </div>
      ) : articles.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No articles found"
          description="Try selecting a different category or refining your search keywords."
          actionLabel="View All Guides"
          onAction={() => {
            setSelectedCategory('All Categories');
            setSearch('');
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((art) => (
            <ArticleCard key={art.id} article={art} />
          ))}
        </div>
      )}
    </div>
  );
};
