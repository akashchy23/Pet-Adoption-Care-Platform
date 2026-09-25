import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, BookOpen, User, ArrowRight } from 'lucide-react';
import { formatDate } from '../../utils/formatters';

export const ArticleCard = ({ article }) => {
  return (
    <article className="group rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden">
      <div className="relative aspect-16/9 w-full overflow-hidden bg-slate-100">
        <img
          src={article.image}
          alt={article.title}
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute top-3 left-3">
          <span className="px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-teal-300 text-xs font-bold">
            {article.category}
          </span>
        </div>
      </div>

      <div className="p-6 flex flex-col flex-1 justify-between space-y-4">
        <div>
          <div className="flex items-center gap-3 text-xs text-slate-400 mb-2">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-teal-600" />
              {article.readTime}
            </span>
            <span>•</span>
            <span>{formatDate(article.date)}</span>
          </div>

          <h3 className="text-lg font-bold text-slate-900 font-heading leading-snug group-hover:text-teal-700 transition-colors">
            <Link to={`/learning/${article.id}`}>{article.title}</Link>
          </h3>

          <p className="mt-2 text-xs text-slate-500 line-clamp-2 leading-relaxed">
            {article.excerpt}
          </p>
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-700">{article.author}</span>
          <Link
            to={`/learning/${article.id}`}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-700 hover:text-teal-900 group-hover:translate-x-1 transition-transform"
          >
            <span>Read Guide</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </article>
  );
};
