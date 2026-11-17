import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Search,
  Sparkles,
  ArrowRight,
  Filter,
  DollarSign,
  Tag,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { getPublicEbooks } from '@/api/ebookApi';

export default function Products() {
  const [ebooks, setEbooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ totalPages: 1, totalEbooks: 0 });

  const fetchEbooks = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await getPublicEbooks({
        page,
        limit: 12,
        search,
      });

      if (res.success) {
        setEbooks(res.ebooks || []);
        setPagination({
          totalPages: res.pagination?.totalPages || 1,
          totalEbooks: res.pagination?.totalEbooks || 0,
        });
      }
    } catch (err) {
      console.error('Error fetching eBooks:', err);
      setError('Failed to load products. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEbooks();
  }, [page]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchEbooks();
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen">
      {/* Header section */}
      <div className="max-w-3xl mb-6">
        <h1 className="font-display text-4xl sm:text-5xl md:text-6xl text-white tracking-wider mb-4">
          Our Products
        </h1>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 pb-6 border-b border-white/10">

        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Search eBooks by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2.5 pl-10 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-secondary transition-colors"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
        </form>
      </div>

      {/* Error state */}
      {error && (
        <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm mb-8 text-center">
          {error}
        </div>
      )}

      {/* Loading state */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="h-96 rounded-3xl bg-white/[0.03] border border-white/5 animate-pulse"
            />
          ))}
        </div>
      ) : ebooks.length === 0 ? (
        <div className="text-center py-24 rounded-3xl bg-white/[0.02] border border-white/5">
          <h3 className="font-display text-2xl text-white mb-2 tracking-[).020em]">No eBooks found</h3>
          <p className="font-body text-gray-400 text-sm max-w-sm mx-auto">
            Try adjusting your search query or switching categories.
          </p>
        </div>
      ) : (
        /* eBooks Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {ebooks.map((ebook) => (
            <Link
              key={ebook._id}
              to={`/products/${ebook.slug}`}
              className="group relative flex flex-col rounded-3xl bg-[#0d0d0d] border border-white/10 overflow-hidden hover:border-secondary/50 hover:shadow-[0_10px_35px_rgba(1,255,219,0.15)] transition-all duration-300"
            >
              {/* Cover Image Container */}
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-black/40">
                {ebook.coverImage?.url ? (
                  <img
                    src={ebook.coverImage.url}
                    alt={ebook.title}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500">
                    <BookOpen className="w-12 h-12" />
                  </div>
                )}
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="font-display text-xl text-white group-hover:text-secondary transition-colors line-clamp-2 leading-snug tracking-[.022em]">
                    {ebook.title}
                  </h3>
                  <p className="font-body text-xs text-gray-400 line-clamp-2 mt-2">
                    {ebook.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-gray-500 block">
                      Price
                    </span>
                    <span className="font-display text-xl text-white group-hover:text-secondary tracking-[.020em] transition-colors">
                      €{Number(ebook.price).toFixed(2)}
                    </span>
                  </div>

                  <span className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 text-gray-300 group-hover:bg-secondary group-hover:text-primary group-hover:border-secondary flex items-center justify-center transition-all duration-300">
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Pagination controls */}
      {pagination.totalPages > 1 && (
        <div className="mt-12 flex items-center justify-center gap-3">
          <button
            disabled={page <= 1 || loading}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="p-3 rounded-2xl bg-white/5 border border-white/10 text-gray-300 hover:text-secondary hover:border-secondary/40 disabled:opacity-40 disabled:hover:text-gray-300 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="font-body text-xs text-gray-400 px-4">
            Page {page} of {pagination.totalPages}
          </span>
          <button
            disabled={page >= pagination.totalPages || loading}
            onClick={() => setPage((p) => p + 1)}
            className="p-3 rounded-2xl bg-white/5 border border-white/10 text-gray-300 hover:text-secondary hover:border-secondary/40 disabled:opacity-40 disabled:hover:text-gray-300 transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}
