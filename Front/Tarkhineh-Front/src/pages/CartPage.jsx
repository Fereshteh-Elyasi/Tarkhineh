import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import StarRating from "../components/StarRating";
import CheckoutStepper from "../components/CheckoutStepper";
import AuthModal from "../components/AuthModal";
import ConfirmModal from "../components/ConfirmModal";
import { toPersianDigits, formatPrice } from "../utils/format";
import { resolveImageUrl } from "../api/client";
import tar from '../assets/Images/tar.png'

function EmptyCartIllustration() {
  return (
    <img className="relative opacity-40" src={tar} alt="Empty-OrderList" />
  );
}

function CartItemRow({ item }) {
  const { removeItem, setQty } = useCart();

  return (
    <div className="flex gap-3 border-b border-line py-4 last:border-b-0">
      <div className="h-24 w-28 shrink-0 overflow-hidden rounded-md2">
        <img src={resolveImageUrl(item.image)} alt={item.title} className="h-full w-full object-cover" />
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm font-bold text-ink">{item.title}</h3>
          <button
            type="button"
            onClick={() => removeItem(item.id)}
            aria-label="حذف از سبد خرید"
            className="shrink-0 text-ink-muted hover:text-red-500"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
              <path d="M10 11v6M14 11v6M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
            </svg>
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {item.discountPercent > 0 && (
              <>
                <span className="text-xs font-bold text-red-500">٪{toPersianDigits(item.discountPercent)}</span>
                <span className="text-xs text-ink-muted line-through">{item.oldPrice}</span>
              </>
            )}
          </div>
          <StarRating rating={item.rating} />
        </div>

        {item.description && <p className="line-clamp-2 text-xs leading-6 text-ink-muted">{item.description}</p>}

        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-ink">{item.price} تومان</span>
          <div className="flex items-center gap-3 rounded-full border border-line px-2.5 py-1">
            <button
              type="button"
              onClick={() => setQty(item.id, item.qty + 1)}
              aria-label="افزایش تعداد"
              className="text-sm font-bold text-primary"
            >
              +
            </button>
            <span className="min-w-[14px] text-center text-xs">{toPersianDigits(item.qty)}</span>
            <button
              type="button"
              onClick={() => setQty(item.id, item.qty - 1)}
              aria-label="کاهش تعداد"
              className="text-sm font-bold text-ink-muted"
            >
              −
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function CartPage() {
  const { cartItems, totalCount, subtotal, discountTotal, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [confirmClearOpen, setConfirmClearOpen] = useState(false);

  const shippingCost = 0;
  const payable = subtotal + shippingCost;

  return (
    <div className="mx-auto max-w-container px-4 py-8">
      <div className="mb-8">
        <CheckoutStepper currentStep={1} />
      </div>

      {cartItems.length === 0 ? (
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 rounded-lg2 border border-line py-10 text-center">
          <EmptyCartIllustration />
          <p className=" absolute bottom-60 text-lg font-medium text-gray-500">شما در حال حاضر هیچ سفارشی ثبت نکرده‌اید!</p>
          <Link
            to="/menu/main"
            className="absolute bottom-48 rounded-md border border-primary px-8 py-1 text-sm font-bold text-primary bg-white transition-colors hover:bg-primary hover:text-white"
          >
            منوی رستوران
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[2fr_1fr]">
          <div className="max-h-[600px] overflow-y-auto rounded-lg2 border border-line px-4">
            {cartItems.map((item) => (
              <CartItemRow key={item.id} item={item} />
            ))}
          </div>

          <div className="sticky top-24 h-fit rounded-lg2 border border-line p-4">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-base font-bold text-ink">سبد خرید ({toPersianDigits(totalCount)})</h2>
              <button
                type="button"
                onClick={() => setConfirmClearOpen(true)}
                aria-label="خالی کردن سبد خرید"
                className="text-ink-muted hover:text-red-500"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                </svg>
              </button>
            </div>

            <div className="flex flex-col gap-3 text-sm">
              {discountTotal > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-ink-muted">تخفیف محصولات</span>
                  <span className="text-red-500">{formatPrice(discountTotal)} تومان</span>
                </div>
              )}

              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1 text-ink-muted">
                  هزینه ارسال
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="16" x2="12" y2="12" />
                    <line x1="12" y1="8" x2="12.01" y2="8" />
                  </svg>
                </span>
                <span className="text-ink">{formatPrice(shippingCost)} تومان</span>
              </div>
              <p className="text-xs leading-6 text-amber-600">
                هزینه ارسال بر اساس آدرس انتخابی شما محاسبه و به این مبلغ اضافه خواهد شد.
              </p>

              <div className="border-t border-line pt-3">
                <div className="flex items-center justify-between font-bold text-ink">
                  <span>مبلغ قابل پرداخت</span>
                  <span>{formatPrice(payable)} تومان</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (isAuthenticated) {
                    navigate("/checkout/info");
                    return;
                  }
                  setAuthModalOpen(true);
                }}
                className="mt-2 flex items-center justify-center gap-2 rounded-full bg-primary py-2.5 font-bold text-white transition-colors hover:bg-primary-dark"
              >
                {isAuthenticated ? (
                  <>
                    تکمیل اطلاعات
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="15 18 9 12 15 6" />
                    </svg>
                  </>
                ) : (
                  "ورود / ثبت‌نام"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {authModalOpen && (
        <AuthModal onClose={() => setAuthModalOpen(false)} onSuccess={() => navigate("/checkout/info")} />
      )}

      {confirmClearOpen && (
        <ConfirmModal
          title="حذف محصولات"
          message="همه محصولات سبد خرید شما حذف شود؟"
          onConfirm={() => {
            clearCart();
            setConfirmClearOpen(false);
          }}
          onCancel={() => setConfirmClearOpen(false)}
        />
      )}
    </div>
  );
}

export default CartPage;