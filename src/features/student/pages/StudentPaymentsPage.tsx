import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { CheckCircle2, XCircle, Loader2, ArrowRight } from 'lucide-react';
import api from '../../../core/services/api';
import { useAuth } from '../../../core/contexts/AuthContext';

const StudentPayments: React.FC = () => {
  const location = useLocation();
  const { refreshMe } = useAuth();
  const [status, setStatus] = useState<'loading' | 'success' | 'failed'>('loading');
  const [message, setMessage] = useState('Verifying your payment...');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const reference = params.get('reference') || params.get('trxref') || '';

    if (!reference) {
      setStatus('failed');
      setMessage('No payment reference found. If you completed a payment, contact support.');
      return;
    }

    let mounted = true;
    api.get(`/student/bootcamp/payments/verify?reference=${encodeURIComponent(reference)}`)
      .then(async (res) => {
        if (!mounted) return;
        const paid = res.data?.bootcampPaymentStatus === 'paid';
        if (paid) {
          await refreshMe().catch(() => {});
          setStatus('success');
          setMessage('Payment verified. Bootcamp access unlocked.');
        } else {
          setStatus('failed');
          setMessage('Payment could not be verified. Please contact support with your reference.');
        }
      })
      .catch(() => {
        if (!mounted) return;
        setStatus('failed');
        setMessage('Verification failed. Please contact support.');
      });

    return () => { mounted = false; };
  }, []);

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-bg-card border border-border rounded-2xl p-10 text-center">
        {status === 'loading' && (
          <>
            <Loader2 className="w-12 h-12 text-accent mx-auto mb-6 animate-spin" />
            <h1 className="text-xl font-black text-text-primary mb-2">Verifying Payment</h1>
            <p className="text-text-muted text-sm">{message}</p>
          </>
        )}
        {status === 'success' && (
          <>
            <CheckCircle2 className="w-12 h-12 text-accent mx-auto mb-6" />
            <h1 className="text-xl font-black text-text-primary mb-2">Payment Confirmed</h1>
            <p className="text-text-muted text-sm mb-8">{message}</p>
            <Link to="/bootcamps" className="btn-primary inline-flex items-center gap-2">
              Go to Bootcamps <ArrowRight className="w-4 h-4" />
            </Link>
          </>
        )}
        {status === 'failed' && (
          <>
            <XCircle className="w-12 h-12 text-red-400 mx-auto mb-6" />
            <h1 className="text-xl font-black text-text-primary mb-2">Verification Failed</h1>
            <p className="text-text-muted text-sm mb-8">{message}</p>
            <Link to="/dashboard" className="btn-primary inline-flex items-center gap-2">
              Back to Dashboard <ArrowRight className="w-4 h-4" />
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default StudentPayments;
