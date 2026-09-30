import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import CheckoutStepper from "../components/CheckoutStepper";
import { formatPrice } from "../utils/format";
import { createOrder } from "../api/orderApi";
import { applyDiscountCode, confirmPayment } from "../api/discountApi";
import samanlogo from "../assets/Images/saman.jpg";
import mellatlogo from "../assets/Images/mellat.jpg";
import parsianlogo from "../assets/Images/parsian.jpg";

const GATEWAYS = [
  { id: "saman", label: "بانک سامان", logo: samanlogo },
  { id: "mellat", label: "بانک ملت", logo: mellatlogo },
  { id: "parsian", label: "بانک پارسیان", logo: parsianlogo },
];

function GatewayOption({ gateway, selected, onSelect }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`flex h-20 flex-1 items-center justify-center rounded-md2 border-2 bg-surface transition-colors ${
        selected ? "border-primary" : "border-line"
      }`}
    >
      {gateway.logo ? (
        <img
          src={gateway.logo}
          alt={gateway.label}
          className={`max-h-full max-w-full object-contain transition-all duration-200 ${
            selected ? "grayscale-0" : "grayscale"
          }`}
        />
      ) : (
        <span className="text-xs font-bold text-ink-muted">
          {gateway.label}
        </span>
      )}
    </button>
  );
}

function PaymentPage() {
  const { cartItems, subtotal, discountTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [discountCode, setDiscountCode] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);
  const [discountMessage, setDiscountMessage] = useState("");
  const [applyingDiscount, setApplyingDiscount] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("online");
  const [selectedGateway, setSelectedGateway] = useState("saman");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const deliveryType =
    sessionStorage.getItem("checkout_delivery_type") || "courier";
  const addressId = sessionStorage.getItem("checkout_address_id");
  const note = sessionStorage.getItem("checkout_note") || "";

  const shippingCost = deliveryType === "pickup" ? 0 : 29000;
  const payable = Math.max(0, subtotal + shippingCost - discountAmount);

  const handleApplyDiscountCode = async () => {
    if (!discountCode.trim()) return;
    setApplyingDiscount(true);
    setDiscountMessage("");
    try {
      const result = await applyDiscountCode(discountCode.trim(), subtotal);
      if (result.valid) {
        setDiscountAmount(result.amount);
        setDiscountMessage(result.message);
      } else {
        setDiscountAmount(0);
        setDiscountMessage(result.message);
      }
    } catch (err) {
      setDiscountAmount(0);
      setDiscountMessage("خطا در بررسی کد تخفیف");
    } finally {
      setApplyingDiscount(false);
    }
  };

  const handleConfirmPayment = async () => {
    setSubmitting(true);
    setSubmitError("");

    try {
      const items = cartItems.map((item) => ({
        id: item.id,
        title: item.title,
        price: item.price,
        oldPrice: item.oldPrice,
        discountPercent: item.discountPercent,
        qty: item.qty,
      }));

      const order = await createOrder({
        branchSlug: "ekbatan", // TODO: بعداً از انتخاب واقعی کاربر بیاد
        deliveryType,
        addressId: deliveryType === "courier" ? Number(addressId) : null,
        note,
        items,
        paymentMethod,
        paymentGateway: paymentMethod === "online" ? selectedGateway : null,
        discountCode: discountAmount > 0 ? discountCode.trim() : null,
      });

      let trackingCode = order.trackingCode;

      if (paymentMethod === "online") {
        // TODO: اینجا محل هدایت واقعی کاربر به درگاه بانک (سامان/ملت/پارسیان) است؛
        // فعلاً به‌صورت مستقیم تایید می‌کنیم (شبیه‌سازی بازگشت موفق از درگاه).
        const paymentResult = await confirmPayment(order.id);
        trackingCode = paymentResult.trackingCode;
      }

      sessionStorage.removeItem("checkout_address_id");
      sessionStorage.removeItem("checkout_delivery_type");
      sessionStorage.removeItem("checkout_note");
      clearCart();
      navigate("/checkout/payment/success", { state: { trackingCode } });
    } catch (err) {
      console.error("خطا در ثبت سفارش:", err);
      setSubmitError(err.message || "ثبت سفارش با خطا مواجه شد");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-container px-4 py-8">
      <div className="mb-8">
        <CheckoutStepper currentStep={3} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="flex flex-col gap-6">
          <div className="rounded-lg2 border border-line p-4">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="flex shrink-0 items-center gap-2 text-base font-bold text-ink">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="text-primary"
                >
                  <path d="M20.59 13.41 13 21l-9-9V4h8z" />
                  <circle cx="7.5" cy="7.5" r="1.5" />
                </svg>
                ثبت کد تخفیف
              </h2>
              <input
                type="text"
                placeholder="کد تخفیف"
                value={discountCode}
                onChange={(e) => setDiscountCode(e.target.value)}
                className="min-w-0 flex-1 rounded-md2 border border-line px-3 py-2 text-sm focus:border-primary focus:outline-none"
              />
              <button
                type="button"
                onClick={handleApplyDiscountCode}
                disabled={!discountCode.trim() || applyingDiscount}
                className="shrink-0 rounded-md2 border border-line px-5 py-2 text-sm font-bold text-ink-muted transition-colors enabled:hover:border-primary enabled:hover:text-primary disabled:opacity-50"
              >
                {applyingDiscount ? "در حال بررسی..." : "ثبت کد"}
              </button>
            </div>
            {discountMessage && (
              <p
                className={`mt-2 text-xs ${discountAmount > 0 ? "text-primary" : "text-red-500"}`}
              >
                {discountMessage}
              </p>
            )}
          </div>

          <div className="rounded-lg2 border border-line p-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex shrink-0 items-center gap-2">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="text-primary"
                >
                  <rect x="2" y="5" width="20" height="14" rx="2" />
                  <line x1="2" y1="10" x2="22" y2="10" />
                </svg>
                <h2 className="text-base font-bold text-ink">روش پرداخت</h2>
              </div>

              <div className="flex flex-wrap items-center gap-6">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("online")}
                  className="flex items-center gap-2 text-right"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    className="shrink-0 text-ink-muted"
                  >
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="M6 15h4" />
                  </svg>
                  <span className="text-sm font-bold text-ink">
                    پرداخت اینترنتی
                  </span>
                  <span
                    className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 ${
                      paymentMethod === "online"
                        ? "border-primary"
                        : "border-line"
                    }`}
                  >
                    {paymentMethod === "online" && (
                      <span className="h-2 w-2 rounded-full bg-primary" />
                    )}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod("cod")}
                  className="flex items-center gap-2 text-right"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    className="shrink-0 text-ink-muted"
                  >
                    <rect x="2" y="6" width="20" height="12" rx="2" />
                    <circle cx="12" cy="12" r="2" />
                  </svg>
                  <span className="text-sm font-bold text-ink">
                    پرداخت در محل
                  </span>
                  <span
                    className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 ${
                      paymentMethod === "cod" ? "border-primary" : "border-line"
                    }`}
                  >
                    {paymentMethod === "cod" && (
                      <span className="h-2 w-2 rounded-full bg-primary" />
                    )}
                  </span>
                </button>
              </div>
            </div>
          </div>

          {paymentMethod === "online" ? (
            <div className="rounded-lg2 border border-line p-4">
              <h2 className="mb-4 flex items-center gap-2 text-base font-bold text-ink">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="text-primary"
                >
                  <rect x="2" y="5" width="20" height="14" rx="2" />
                  <line x1="2" y1="10" x2="22" y2="10" />
                </svg>
                درگاه پرداخت
              </h2>

              <div className="mb-4 flex items-center gap-3">
                {GATEWAYS.map((g) => (
                  <GatewayOption
                    key={g.id}
                    gateway={g}
                    selected={selectedGateway === g.id}
                    onSelect={() => setSelectedGateway(g.id)}
                  />
                ))}
              </div>

              <p className="text-center text-xs leading-6 text-ink-muted">
                پرداخت از طریق کلیه کارت‌های عضو شتاب امکان‌پذیر است.
                <br />
                (لطفا قبل از پرداخت فیلترشکن خود را خاموش کنید.)
              </p>
            </div>
          ) : (
            <div className="rounded-lg2 border border-line p-4">
              <h2 className="mb-3 flex items-center gap-2 text-base font-bold text-ink">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="text-amber-600"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                قابل توجه
              </h2>
              <p className="text-sm leading-7 text-ink-muted">
                هزینه سفارش شما در حین تحویل کالا دریافت خواهد شد. لطفا قبل از
                تحویل کالا کارت بانکی یا پول نقد همراه خود داشته باشید و از
                درخواست برای پرداخت در زمان‌های بعدی یا نسیه خودداری فرمایید. با
                تشکر از همراهی شما.
              </p>
            </div>
          )}
        </div>

        <div className="h-fit rounded-lg2 border border-line p-4">
          <div className="flex flex-col gap-3 text-sm">
            {discountTotal > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-ink-muted">تخفیف محصولات</span>
                <span className="text-red-500">
                  {formatPrice(discountTotal)} تومان
                </span>
              </div>
            )}

            {discountAmount > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-ink-muted">تخفیف کد</span>
                <span className="text-red-500">
                  {formatPrice(discountAmount)} تومان
                </span>
              </div>
            )}

            <div className="flex items-center justify-between">
              <span className="text-ink-muted">هزینه ارسال</span>
              <span className="text-ink">
                {formatPrice(shippingCost)} تومان
              </span>
            </div>

            <div className="border-t border-line pt-3">
              <div className="flex items-center justify-between font-bold text-ink">
                <span>مبلغ قابل پرداخت</span>
                <span>{formatPrice(payable)} تومان</span>
              </div>
            </div>

            {submitError && (
              <p className="text-xs text-red-500">{submitError}</p>
            )}

            <button
              type="button"
              onClick={handleConfirmPayment}
              disabled={submitting}
              className="mt-2 flex items-center justify-center gap-2 rounded-full bg-primary py-2.5 font-bold text-white transition-colors hover:bg-primary-dark disabled:opacity-60"
            >
              {submitting
                ? "در حال ثبت..."
                : paymentMethod === "online"
                  ? "تایید و پرداخت"
                  : "ثبت سفارش"}
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                {paymentMethod === "online" ? (
                  <>
                    <rect x="2" y="5" width="20" height="14" rx="2" />
                    <line x1="2" y1="10" x2="22" y2="10" />
                  </>
                ) : (
                  <polyline points="20 6 9 17 4 12" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentPage;
