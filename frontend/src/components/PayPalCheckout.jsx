import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import {
  ShieldCheck,
  Lock,
  CheckCircle2,
  AlertTriangle,
  Download,
  Loader2,
  ExternalLink,
} from 'lucide-react';
import {
  getPayPalClientId,
  createPayPalOrder,
  capturePayPalOrder,
  downloadPurchasedEbook,
} from '@/api/orderApi';

/**
 * PayPalCheckout Component
 *
 * @param {Object} props
 * @param {string} props.orderId - The database order ID
 * @param {number} props.amount - Total amount for the order
 * @param {string} props.currency - Currency code (e.g., 'EUR')
 * @param {Array} props.items - Array of eBook items being purchased
 * @param {Function} props.onSuccess - Callback invoked when capture succeeds: (order) => void
 * @param {Function} props.onError - Callback invoked if an error occurs: (message) => void
 */
export default function PayPalCheckout({
  orderId,
  amount,
  currency = 'EUR',
  items = [],
  onSuccess,
  onError,
}) {
  const navigate = useNavigate();
  const [clientId, setClientId] = useState('');
  const [loadingClient, setLoadingClient] = useState(true);
  const [initError, setInitError] = useState('');
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [completedOrder, setCompletedOrder] = useState(null);

  const [downloadingId, setDownloadingId] = useState(null);
  const [downloadError, setDownloadError] = useState('');

  // Fetch client ID safely from VITE_PAYPAL_CLIENT_ID or backend on mount
  useEffect(() => {
    let isMounted = true;
    const initClientId = async () => {
      // Prioritize client ID defined directly in frontend env
      const envClientId = import.meta.env.VITE_PAYPAL_CLIENT_ID;
      if (envClientId) {
        if (isMounted) {
          setClientId(envClientId);
          setLoadingClient(false);
        }
        return;
      }

      // Fallback: fetch client ID securely from backend
      try {
        setLoadingClient(true);
        const res = await getPayPalClientId();
        if (isMounted) {
          if (res.success && res.clientId) {
            setClientId(res.clientId);
          } else {
            setInitError('PayPal configuration is missing.');
          }
        }
      } catch (err) {
        if (isMounted) {
          console.error('Error fetching PayPal client ID:', err);
          setInitError('Could not initialize secure payment gateway. Please try again.');
        }
      } finally {
        if (isMounted) setLoadingClient(false);
      }
    };

    initClientId();
    return () => {
      isMounted = false;
    };
  }, []);

  // 1. Create order on PayPal via backend
  const handleCreateOrder = async () => {
    try {
      setPaymentProcessing(true);
      const res = await createPayPalOrder(orderId);
      if (res.success && res.paypalOrderId) {
        return res.paypalOrderId;
      }
      throw new Error(res.message || 'Failed to create PayPal transaction');
    } catch (err) {
      setPaymentProcessing(false);
      const msg = err.response?.data?.message || err.message || 'Error initializing payment';
      if (onError) onError(msg);
      throw err;
    }
  };

  // 2. Capture payment on PayPal via backend upon buyer approval
  const handleApprove = async (data) => {
    try {
      setPaymentProcessing(true);
      const res = await capturePayPalOrder(orderId, data.orderID);

      if (res.success) {
        setPaymentSuccess(true);
        setCompletedOrder(res.order);
        if (onSuccess) onSuccess(res.order);
      } else {
        throw new Error(res.message || 'Payment capture failed');
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Payment capture failed';
      if (onError) onError(msg);
    } finally {
      setPaymentProcessing(false);
    }
  };

  const handleCancel = () => {
    setPaymentProcessing(false);
  };

  const handlePayPalError = (err) => {
    console.error('PayPal Button Error:', err);
    setPaymentProcessing(false);
    if (onError) onError('A PayPal error occurred during the transaction.');
  };

  const handleDownload = async (item) => {
    const ebookId = item.ebook?._id || item.ebook;
    if (!ebookId) return;

    try {
      setDownloadingId(ebookId);
      setDownloadError('');
      await downloadPurchasedEbook(ebookId, `${item.slug || 'ebook'}.pdf`);
    } catch (err) {
      console.error('Download error:', err);
      const status = err.response?.status;
      if (status === 401 || status === 403) {
        navigate('/access-denied', {
          state: {
            message:
              err.response?.data?.message ||
              'You cannot access or download this file because your payment has not been completed.',
            ebookTitle: item.title,
            ebookSlug: item.slug,
          },
        });
        return;
      }
      setDownloadError(err.response?.data?.message || 'Download failed. Please try again.');
    } finally {
      setDownloadingId(null);
    }
  };

  if (paymentSuccess && completedOrder) {
    // Collect all purchased items from completedOrder or props
    const purchaseList = completedOrder.items?.length ? completedOrder.items : items;

    return (
      <div className="p-6 rounded-3xl bg-secondary/10 border border-secondary/30 text-center space-y-4 animate-fadeIn">
        <div className="w-14 h-14 rounded-full bg-secondary/20 text-secondary flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <div>
          <h4 className="font-display text-2xl text-white">Payment Successful!</h4>
          <p className="font-body text-xs text-gray-300 mt-1">
            Transaction ID: <span className="font-mono text-secondary">{completedOrder.paypalDetails?.captureId || completedOrder.paypalDetails?.orderId || completedOrder._id}</span>
          </p>
        </div>

        {downloadError && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs text-center">
            {downloadError}
          </div>
        )}

        <div className="pt-2 flex flex-col gap-2.5">
          {purchaseList.map((item, idx) => {
            const ebookId = item.ebook?._id || item.ebook;
            const isDownloading = downloadingId === ebookId;
            return (
              <button
                key={ebookId || idx}
                onClick={() => handleDownload(item)}
                disabled={isDownloading}
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-body text-sm font-semibold bg-secondary text-primary hover:bg-[#00e6c5] transition-all shadow-[0_0_15px_rgba(1,255,219,0.3)] cursor-pointer disabled:opacity-60 active:scale-[0.98]"
              >
                {isDownloading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Preparing Download...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>Download {item.title || 'eBook'}</span>
                  </>
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  if (loadingClient) {
    return (
      <div className="py-8 flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-6 h-6 text-secondary animate-spin" />
        <p className="font-body text-xs text-gray-400">Connecting to secure PayPal gateway...</p>
      </div>
    );
  }

  if (initError || !clientId) {
    return (
      <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2.5">
        <AlertTriangle className="w-4 h-4 flex-shrink-0" />
        <span>{initError || 'PayPal gateway currently unavailable. Please contact support.'}</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {paymentProcessing && (
        <div className="p-3.5 rounded-xl bg-secondary/10 border border-secondary/30 flex items-center justify-center gap-2 text-xs font-semibold text-secondary">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Processing transaction with PayPal...</span>
        </div>
      )}

      <PayPalScriptProvider
        options={{
          clientId: clientId,
          currency: currency.toUpperCase(),
          intent: 'capture',
        }}
      >
        <div className="rounded-2xl overflow-hidden min-h-[140px] relative z-0">
          <PayPalButtons
            style={{
              layout: 'vertical',
              color: 'gold',
              shape: 'rect',
              label: 'pay',
              height: 48,
            }}
            createOrder={handleCreateOrder}
            onApprove={handleApprove}
            onCancel={handleCancel}
            onError={handlePayPalError}
          />
        </div>
      </PayPalScriptProvider>

      <div className="flex items-center justify-center gap-2 text-[11px] text-gray-400 pt-1">
        <Lock className="w-3.5 h-3.5 text-secondary" />
        <span>256-bit encrypted checkout via PayPal</span>
      </div>
    </div>
  );
}
