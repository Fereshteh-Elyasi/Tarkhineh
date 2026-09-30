import { useLocation, useNavigate } from "react-router-dom";
import { toPersianDigits } from "../utils/format";

function PaymentFailedPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // TODO: وقتی بک‌اند PHP وصل شد، بعد از پاسخ ناموفق درگاه، کد پیگیری/تراکنش واقعی
  // باید از طریق navigate(..., { state: { trackingCode } }) به این صفحه پاس داده بشه.
  const trackingCode = location.state?.trackingCode || String(Math.floor(10000000 + Math.random() * 89999999));

  return (
    <div className="mx-auto flex max-w-container flex-col items-center px-4 py-16 text-center">
      <div className="mb-6 flex h-28 w-28 items-center justify-center rounded-2xl border-4 border-red-500 text-red-500">
        <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </div>

      <h1 className="text-xl font-bold text-red-500 sm:text-2xl">پرداخت شما ناموفق بود!</h1>
      <p className="mt-3 text-sm text-ink-muted">کد پیگیری تراکنش شما: {toPersianDigits(trackingCode)}</p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => navigate("/checkout/payment")}
          className="rounded-full border border-primary px-8 py-2.5 text-sm font-bold text-primary transition-colors hover:bg-primary-light"
        >
          پرداخت مجدد
        </button>
        <button
          type="button"
          onClick={() => navigate("/")}
          className="rounded-full border border-primary px-8 py-2.5 text-sm font-bold text-primary transition-colors hover:bg-primary-light"
        >
          بازگشت به صفحه اصلی
        </button>
      </div>
    </div>
  );
}

export default PaymentFailedPage;
