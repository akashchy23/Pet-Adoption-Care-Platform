import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { learningApi } from '../../api/learningApi';
import { formatDate } from '../../utils/formatters';
import { ArrowLeft, Clock, User, Calendar, BookOpen, Share2, Sparkles } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const ArticleDetailPage = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const { success } = useToast();

  useEffect(() => {
    const loadArticle = async () => {
      setLoading(true);
      try {
        const data = await learningApi.getArticleById(id);
        setArticle(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadArticle();
  }, [id]);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      success('Article link copied to clipboard!');
    }
  };

  if (loading || !article) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-12 h-12 rounded-full border-4 border-teal-500/20 border-t-teal-600 animate-spin mx-auto mb-3" />
        <p className="text-xs font-semibold text-slate-500">Loading guide...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 text-left">
      <div className="flex items-center justify-between">
        <Link
          to="/learning"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-teal-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Learning Hub</span>
        </Link>
        <button
          onClick={handleShare}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>Share Article</span>
        </button>
      </div>

      {/* Article Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-teal-50 text-teal-800 border border-teal-100 text-xs font-bold">
            {article.category}
          </span>
          <span className="text-xs text-slate-400 font-semibold">•</span>
          <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-teal-600" />
            {article.readTime}
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-heading leading-tight">
          {article.title}
        </h1>

        <div className="flex items-center gap-3 pt-2 text-xs text-slate-500 border-b border-slate-100 pb-4">
          <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center font-bold">
            {article.author?.[0] || 'V'}
          </div>
          <div>
            <p className="font-bold text-slate-800">{article.author}</p>
            <p className="text-[11px] text-slate-400">Published {formatDate(article.date)}</p>
          </div>
        </div>
      </div>

      {/* Featured Banner */}
      <div className="aspect-16/9 w-full rounded-3xl overflow-hidden shadow-md bg-slate-100">
        <img
          src={article.image}
          alt={article.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Article Body */}
      <div className="prose prose-slate max-w-none text-slate-700 text-sm sm:text-base leading-relaxed space-y-4 bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm whitespace-pre-line">
        {article.content}
      </div>

      {/* Author Footer Card */}
      <div className="p-6 rounded-3xl bg-teal-50/60 border border-teal-100 flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white flex items-center justify-center font-bold text-lg">
          {article.author?.[0] || 'V'}
        </div>
        <div>
          <h4 className="font-bold text-slate-900 text-sm">Written by {article.author}</h4>
          <p className="text-xs text-teal-900/80 mt-0.5">
            Verified veterinary contributor & pet wellness educator on the PetHaven panel.
          </p>
        </div>
      </div>
    </div>
  );
};
