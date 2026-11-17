import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  BookOpen,
  Download,
  ArrowRight,
  Loader2,
  Calendar,
  Sparkles,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { getUserOrders, downloadPurchasedEbook } from '@/api/orderApi';
import { useAuth } from '@/context';

export default function MyPurchases() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [downloadingId, setDownloadingId] = useState(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login', { state: { from: '/my-purchases' } });
      return;
    }

    if (isAuthenticated) {
      fetchPurchases();
    }
  }, [isAuthenticated, authLoading, navigate]);

  const fetchPurchases = async () => {
    try {
      setLoading(true);
      setError('');
      // Fetch up to 100 orders for the user
      const res = await getUserOrders({ limit: 100 });
      if (res.success) {
        // Filter only paid/completed orders
        const completedOrders = (res.orders || []).filter(
          (o) => o.paymentStatus === 'completed'
        );
        setOrders(completedOrders);
      }
    } catch (err) {
      console.error('Error fetching purchased eBooks:', err);
      setError(err.response?.data?.message || 'Failed to load your purchases.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (e, ebook, item) => {
    e.preventDefault();
    e.stopPropagation();

    const ebookId = ebook?._id || item?.ebook;
    if (!ebookId) return;

    try {
      setDownloadingId(ebookId);
      await downloadPurchasedEbook(ebookId, `${ebook?.slug || item?.slug || 'ebook'}.pdf`);
    } catch (err) {
      console.error('Download error:', err);
      const status = err.response?.status;
      if (status === 401 || status === 403) {
        navigate('/access-denied', {
          state: {
            message: err.response?.data?.message || 'Access restricted. Please complete your purchase to download.',
            ebookTitle: ebook?.title || item?.title,
            ebookSlug: ebook?.slug || item?.slug,
          },
        });
      }
    } finally {
      setDownloadingId(null);
    }
  };

  if (authLoading || (loading && !orders.length)) {
    return (
      <div className="py-24 px-4 max-w-7xl mx-auto flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 text-secondary animate-spin mb-4" />
        <p className="font-body text-gray-400 text-sm">Loading your purchased eBooks...</p>
      </div>
    );
  }

  // Flatten purchased items from all completed orders
  const purchasedItems = [];
  const seenEbookIds = new Set();

  orders.forEach((order) => {
    (order.items || []).forEach((item) => {
      const ebookObj = typeof item.ebook === 'object' && item.ebook !== null ? item.ebook : null;
      const ebookId = ebookObj?._id || item.ebook;

      if (ebookId && !seenEbookIds.has(String(ebookId))) {
        seenEbookIds.add(String(ebookId));
        purchasedItems.push({
          orderId: order._id,
          purchaseDate: order.createdAt,
          currency: order.currency || 'EUR',
          price: item.price,
          itemTitle: item.title,
          ebook: ebookObj,
          ebookId,
          slug: ebookObj?.slug || item.slug,
          coverImageUrl: item.coverImageUrl || ebookObj?.coverImage?.url,
        });
      }
    });
  });

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen font-body">
      {/* Header section */}
      <div className="max-w-3xl mb-12">
        <h1 className="font-display text-4xl sm:text-5xl text-white tracking-wider mb-4">
          My Purchases
        </h1>
      </div>

      {error && (
        <div className="mb-8 p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-center gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {purchasedItems.length === 0 ? (
        <div className="py-16 px-4 rounded-3xl bg-[#0c0c0c] border border-white/10 text-center max-w-2xl mx-auto space-y-5">
          <div className="w-16 h-16 rounded-3xl bg-secondary/10 border border-secondary/20 text-secondary flex items-center justify-center mx-auto">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <div>
            <h3 className="font-display text-2xl text-white mb-2">No Purchased eBooks Yet</h3>
            <p className="font-body text-gray-400 text-sm max-w-md mx-auto">
              You haven't purchased any eBooks on Floranextech yet. Discover our latest guides and start building your library today!
            </p>
          </div>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-body text-sm font-semibold bg-secondary text-primary hover:bg-[#00e6c5] transition-all shadow-[0_0_20px_rgba(1,255,219,0.3)]"
          >
            <span>Explore All eBooks</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
          {purchasedItems.map((p) => {
            const detailUrl = p.slug ? `/products/${p.slug}` : `/products`;
            const isDownloading = downloadingId === p.ebookId;

            return (
              <div
                key={p.ebookId}
                className="group relative flex flex-col rounded-3xl bg-[#0d0d0d] border border-white/10 overflow-hidden hover:border-secondary/50 hover:shadow-[0_10px_35px_rgba(1,255,219,0.15)] transition-all duration-300"
              >
                {/* Clickable Image & Cover Area linking to details page */}
                <Link to={detailUrl} className="block relative aspect-[3/4] w-full overflow-hidden bg-black/40">
                  {p.coverImageUrl ? (
                    <img
                      src={p.coverImageUrl}
                      alt={p.itemTitle}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-500">
                      <BookOpen className="w-12 h-12" />
                    </div>
                  )}
                </Link>

                {/* Card Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center gap-1.5 text-[11px] text-gray-500 mb-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>
                        Purchased{' '}
                        {new Date(p.purchaseDate).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>

                    <Link to={detailUrl} className="block group-hover:text-secondary transition-colors">
                      <h3 className="font-display text-lg text-white group-hover:text-secondary transition-colors line-clamp-2 leading-snug">
                        {p.itemTitle}
                      </h3>
                    </Link>
                  </div>

                  {/* Actions Bar */}
                  <div className="pt-3 border-t border-white/5 space-y-2.5">
                    <button
                      onClick={(e) => handleDownload(e, p.ebook, p)}
                      disabled={isDownloading}
                      className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-body text-xs font-semibold bg-secondary text-primary hover:bg-[#00e6c5] transition-all shadow-[0_0_15px_rgba(1,255,219,0.2)] disabled:opacity-50 cursor-pointer active:scale-[0.98]"
                    >
                      {isDownloading ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Downloading...</span>
                        </>
                      ) : (
                        <>
                          <Download className="w-3.5 h-3.5" />
                          <span>Download eBook</span>
                        </>
                      )}
                    </button>

                    <Link
                      to={detailUrl}
                      className="w-full flex items-center justify-center gap-1.5 py-2 px-4 rounded-xl font-body text-xs text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                    >
                      <span>View Details</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
