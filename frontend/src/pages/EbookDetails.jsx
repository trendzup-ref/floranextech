import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context';
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  DollarSign,
  ShieldCheck,
  Download,
  Share2,
  Sparkles,
  Layers,
  Clock,
  FileText,
} from 'lucide-react';
import { getPublicEbookBySlug } from '@/api/ebookApi';
import { createOrder, downloadPurchasedEbook } from '@/api/orderApi';
import PayPalCheckout from '@/components/PayPalCheckout.jsx';

export default function EbookDetails() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const [ebook, setEbook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  // Checkout states
  const [showCheckout, setShowCheckout] = useState(false);
  const [orderInitiating, setOrderInitiating] = useState(false);
  const [activeOrder, setActiveOrder] = useState(null);
  const [checkoutError, setCheckoutError] = useState('');
  const [hasPurchased, setHasPurchased] = useState(false);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await getPublicEbookBySlug(slug);
        if (res.success && res.ebook) {
          setEbook(res.ebook);
          if (res.hasPurchased) {
            setHasPurchased(true);
          }
        } else {
          setError('eBook not found.');
        }
      } catch (err) {
        console.error('Error fetching eBook:', err);
        setError(err.response?.data?.message || 'Failed to load eBook details.');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchDetails();
    }
  }, [slug]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: ebook?.title || 'eBook',
        url: window.location.href,
      }).catch(() => { });
    } else {
      navigator.clipboard.writeText(window.location.href);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    }
  };

  const handleDirectDownload = async () => {
    if (!ebook?._id) return;
    try {
      setDownloading(true);
      setCheckoutError('');
      await downloadPurchasedEbook(ebook._id, `${ebook.slug || 'ebook'}.pdf`);
    } catch (err) {
      console.error('Download error:', err);
      const status = err.response?.status;
      if (status === 401 || status === 403) {
        navigate('/access-denied', {
          state: {
            message: err.response?.data?.message || 'You cannot access or download this file because you have not completed a purchase.',
            ebookTitle: ebook.title,
            ebookSlug: ebook.slug,
          },
        });
        return;
      }
      setCheckoutError(err.response?.data?.message || 'Download failed. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  const handleBuyNow = async () => {
    if (!isAuthenticated) {
      // Redirect unauthenticated user to register page with return destination
      navigate('/register', { state: { from: location.pathname } });
      return;
    }

    if (hasPurchased) {
      await handleDirectDownload();
      return;
    }

    if (showCheckout && activeOrder) {
      return;
    }

    setCheckoutError('');
    setOrderInitiating(true);
    try {
      const res = await createOrder({ ebookId: ebook._id });
      if (res.success && res.order) {
        if (res.alreadyPurchased) {
          setHasPurchased(true);
          await handleDirectDownload();
        } else {
          setActiveOrder(res.order);
          setShowCheckout(true);
        }
      } else {
        setCheckoutError(res.message || 'Could not initiate checkout.');
      }
    } catch (err) {
      setCheckoutError(err.response?.data?.message || 'Could not initiate checkout.');
    } finally {
      setOrderInitiating(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 px-4 max-w-5xl mx-auto flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-secondary border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="font-body text-gray-400 text-sm">Loading eBook details...</p>
      </div>
    );
  }

  if (error || !ebook) {
    return (
      <div className="py-24 px-4 max-w-2xl mx-auto text-center min-h-[60vh]">
        <div className="w-16 h-16 rounded-3xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center mx-auto mb-4">
          <BookOpen className="w-8 h-8" />
        </div>
        <h2 className="font-display text-3xl text-white mb-2">eBook Not Found</h2>
        <p className="font-body text-gray-400 text-sm mb-6">
          {error || "The eBook you are looking for does not exist or may have been unlisted."}
        </p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-body text-sm font-semibold bg-secondary text-primary hover:bg-[#00e6c5] transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Products</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto min-h-screen font-body">
      {/* Back button & Category Breadcrumb */}
      <div className="flex items-center justify-between pb-6 border-b border-white/10 mb-10">
        <Link
          to="/products"
          className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-secondary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to all products</span>
        </Link>

        <button
          onClick={handleShare}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-gray-300 hover:text-white hover:border-secondary/40 transition-colors"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>{isCopied ? 'Link Copied!' : 'Share'}</span>
        </button>
      </div>

      {/* Main eBook Showcase Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
        {/* Left Column: Cover Image */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="relative group w-full max-w-md rounded-3xl overflow-hidden bg-black/50 border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
            {ebook.coverImage?.url ? (
              <img
                src={ebook.coverImage.url}
                alt={ebook.title}
                className="w-full aspect-[3/4] object-cover"
              />
            ) : (
              <div className="w-full aspect-[3/4] flex items-center justify-center text-gray-600">
                <BookOpen className="w-20 h-20" />
              </div>
            )}
            <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-3xl pointer-events-none" />
          </div>

          {/* Quick highlights */}
          <div className="w-full max-w-md mt-6 p-4 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-around text-center text-xs">
            <div>
              <span className="text-gray-500 block uppercase text-[10px] tracking-wider">Format</span>
              <span className="text-white font-semibold uppercase">{ebook.digitalFile?.fileType || 'PDF'}</span>
            </div>
            <div className="w-[1px] h-8 bg-white/10" />
            <div>
              <span className="text-gray-500 block uppercase text-[10px] tracking-wider">Delivery</span>
              <span className="text-secondary font-semibold">Instant Download</span>
            </div>
            <div className="w-[1px] h-8 bg-white/10" />
            <div>
              <span className="text-gray-500 block uppercase text-[10px] tracking-wider">License</span>
              <span className="text-white font-semibold">Lifetime Access</span>
            </div>
          </div>
        </div>

        {/* Right Column: Information & Buy Now CTA */}
        <div className="lg:col-span-7 space-y-8">
          <div>
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl text-white tracking-wide leading-tight">
              {ebook.title}
            </h1>

            {/* Description Section */}
            <div className="space-y-4 pt-4 border-t border-white/10">
              <h3 className="font-display text-2xl text-white tracking-wide">About This eBook</h3>
              <div className="text-gray-300 text-sm sm:text-base leading-relaxed whitespace-pre-line bg-white/[0.02] p-6 rounded-2xl border border-white/5 max-h-64 sm:max-h-80 overflow-y-auto">
                {ebook.description}
              </div>
            </div>
          </div>

          {/* CTA / Checkout Box */}
          <div className="p-6 rounded-3xl bg-[#0e0e0e] border border-secondary/30 shadow-[0_10px_35px_rgba(1,255,219,0.12)] space-y-4">
            {checkoutError && (
              <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs text-center">
                {checkoutError}
              </div>
            )}

            {!showCheckout ? (
              hasPurchased ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 p-3 rounded-xl border border-secondary/20 text-secondary text-xs font-semibold justify-center">
                    <span>You already own this eBook</span>
                  </div>
                  <button
                    onClick={handleDirectDownload}
                    disabled={downloading}
                    className="w-full flex items-center justify-center gap-3 py-4 px-8 rounded-2xl font-body text-base sm:text-lg font-bold bg-secondary text-primary hover:bg-[#00e6c5] transition-all hover:bg-white transition-all duration-300 ease-out cursor-pointer disabled:opacity-50"
                  >
                    <Download className="w-5 h-5" />
                    <span>{downloading ? 'Downloading...' : 'Download eBook Now'}</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleBuyNow}
                  disabled={orderInitiating}
                  className="w-full flex items-center justify-center gap-3 py-4 px-8 rounded-2xl font-body text-base sm:text-lg font-bold bg-secondary text-primary hover:bg-white transition-all duration-300 ease-out cursor-pointer disabled:opacity-50"
                >
                  <span>{orderInitiating ? 'Preparing Checkout...' : `Buy Now for € ${Number(ebook.price).toFixed(2)}`}</span>
                </button>
              )
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <span className="text-xs uppercase tracking-wider text-gray-400 font-semibold">
                    Complete with PayPal
                  </span>
                  <button
                    onClick={() => setShowCheckout(false)}
                    className="text-xs text-gray-400 hover:text-white underline cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>

                <PayPalCheckout
                  orderId={activeOrder.id}
                  amount={activeOrder.totalAmount}
                  currency={activeOrder.currency || 'EUR'}
                  items={activeOrder.items}
                  onError={(msg) => setCheckoutError(msg)}
                  onSuccess={(fulfilledOrder) => {
                    setActiveOrder(fulfilledOrder);
                  }}
                />
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
