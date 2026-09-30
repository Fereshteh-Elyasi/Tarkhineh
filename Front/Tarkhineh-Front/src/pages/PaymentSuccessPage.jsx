import { useLocation, useNavigate } from "react-router-dom";
import { toPersianDigits } from "../utils/format";

// نقطه‌ها و روبان‌های رنگی پراکنده دور آیکون - فقط تزئینیه و روی چیدمان اثر نداره
function ConfettiDots() {
  const dots = [
    { top: "4%", left: "6%", size: 10, color: "#3b82f6" },
    { top: "14%", left: "20%", size: 8, color: "#f59e0b" },
    { top: "2%", left: "42%", size: 7, color: "#22c55e" },
    { top: "10%", right: "18%", size: 9, color: "#3b82f6" },
    { top: "0%", right: "4%", size: 8, color: "#22c55e" },
    { top: "38%", left: "2%", size: 8, color: "#22c55e" },
    { top: "55%", left: "10%", size: 7, color: "#ef4444" },
    { top: "70%", left: "4%", size: 9, color: "#22c55e" },
    { top: "42%", right: "3%", size: 8, color: "#ef4444" },
    { top: "62%", right: "10%", size: 8, color: "#f59e0b" },
    { top: "80%", right: "2%", size: 7, color: "#ec4899" },
    { top: "88%", left: "26%", size: 7, color: "#3b82f6" },
  ];

  return (
    <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
      {dots.map((d, i) => (
        <span
          key={i}
          className="absolute rounded-full"
          style={{
            top: d.top,
            left: d.left,
            right: d.right,
            width: d.size,
            height: d.size,
            backgroundColor: d.color,
          }}
        />
      ))}

      {/* روبان‌های فرفری */}
      <svg className="absolute top-[18%] left-[14%] text-red-500" width="26" height="40" viewBox="0 0 26 40" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
        <path d="M20 2c-10 4-14 10-8 14s-2 12-10 14" />
      </svg>
      <svg className="absolute bottom-[10%] left-[18%] text-emerald-500" width="24" height="36" viewBox="0 0 24 36" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
        <path d="M4 2c8 4 12 10 6 14s4 12 10 16" />
      </svg>
      <svg className="absolute top-[6%] right-[26%] text-amber-500" width="30" height="16" viewBox="0 0 30 16" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round">
        <path d="M2 14 28 2" />
      </svg>
    </div>
  );
}

function PaymentSuccessPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // TODO: وقتی بک‌اند PHP وصل شد، بعد از تایید واقعی تراکنش باید کد پیگیری واقعی سفارش
  // (که از سرور برمی‌گرده) از طریق navigate(..., { state: { trackingCode } }) به این صفحه پاس داده بشه.
  // فعلاً اگه چیزی پاس داده نشده باشه، یک کد نمونه ساخته می‌شه که فقط جنبه نمایشیه.
  const trackingCode = location.state?.trackingCode || String(Math.floor(10000000 + Math.random() * 89999999));

  return (
    <div className="mx-auto flex max-w-container flex-col items-center px-4 py-16 text-center">
      <div className="relative flex flex-col items-center">
        <ConfettiDots />

        <div className="mb-6 flex h-28 w-28 items-center justify-center rounded-2xl border-4 border-primary text-primary">
          <svg width="140" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>

        <h1 className="text-xl font-bold text-primary sm:text-2xl">پرداخت شما با موفقیت انجام شد!</h1>
        <p className="mt-3 text-sm text-ink-muted">کد پیگیری سفارش شما: {toPersianDigits(trackingCode)}</p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => navigate("/profile", { state: { tab: "orders" } })}
            className="rounded-full bg-primary px-8 py-2.5 text-sm font-bold text-white transition-colors hover:bg-primary-dark"
          >
            پیگیری سفارش
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
    </div>
  );
}

export default PaymentSuccessPage;
