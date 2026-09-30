import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import CheckoutStepper from "../components/CheckoutStepper";
import AddAddressModal from "../components/AddAddressModal";
import { toPersianDigits, formatPrice } from "../utils/format";
import { fetchAddresses, createAddress, deleteAddress } from "../api/addressApi";

const MOCK_SHIPPING_COST = 29000; // TODO: بعداً باید بر اساس آدرس واقعی محاسبه بشه

const PICKUP_BRANCH = {
  name: "شعبه اکباتان",
  address: "اکباتان، خیابان ریاحی، کوچه سیزدهم، ساختمان آیسا، طبقه همکف",
  phone1: "شماره تماس ۱: ۵۴۸۹۱۲۵۴-۰۲۱",
  phone2: "شماره تماس ۲: ۵۴۸۹۱۲۵۵-۰۲۱",
  workingHours: "ساعت کاری: همه‌روزه از ساعت ۱۲ تا ۲۳ بجز روزهای تعطیل",
};

function EmptyAddressIllustration() {
  return (
    <svg width="110" height="110" viewBox="0 0 200 200" fill="none">
      <circle cx="100" cy="100" r="90" fill="#f7f6f3" />
      <g stroke="#c9c6bd" strokeWidth="1.5">
        <path d="M100 30 L100 170 M40 60 L160 140 M40 140 L160 60 M60 40 L140 160 M60 160 L140 40" />
        <circle cx="100" cy="100" r="55" />
        <circle cx="100" cy="100" r="35" />
      </g>
      <circle cx="100" cy="100" r="6" fill="#2f6b3a" />
    </svg>
  );
}

function SummaryItemRow({ item }) {
  const { removeItem, setQty } = useCart();
  return (
    <div className="flex items-center justify-between border-b border-line py-3 last:border-b-0">
      <div className="flex flex-col gap-1">
        <span className="text-sm font-bold text-ink">{item.title}</span>
        <span className="text-xs text-ink-muted">{item.price} تومان</span>
      </div>
      <div className="flex items-center gap-2 rounded-full border border-line px-2 py-1">
        <button
          type="button"
          onClick={() => setQty(item.id, item.qty + 1)}
          aria-label="افزایش تعداد"
          className="text-sm font-bold text-primary"
        >
          +
        </button>
        <span className="min-w-[12px] text-center text-xs">{toPersianDigits(item.qty)}</span>
        <button
          type="button"
          onClick={() => removeItem(item.id)}
          aria-label="حذف از سبد خرید"
          className="text-ink-muted hover:text-red-500"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
          </svg>
        </button>
      </div>
    </div>
  );
}

function AddressCard({ address, onDelete }) {
  return (
    <div className="rounded-md2 border border-line p-3">
      <div className="mb-2 flex items-start justify-between gap-2">
        <p className="text-sm text-ink">{address.fullAddress}</p>
        <div className="flex shrink-0 items-center gap-3 text-ink-muted">
          <button type="button" aria-label="ویرایش آدرس" className="hover:text-primary">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => onDelete(address.id)}
            aria-label="حذف آدرس"
            className="hover:text-red-500"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
            </svg>
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 text-xs text-ink-muted">
        {address.phone && <span dir="ltr">{address.phone}</span>}
        <span>{address.isSelf ? "خودم" : address.recipientName}</span>
        <span className="rounded-sm2 bg-surface-soft px-2 py-0.5 font-bold text-ink">{address.label}</span>
      </div>
    </div>
  );
}

function PickupBranchCard() {
  return (
    <div className="rounded-lg2 border border-line p-4">
      <h2 className="mb-4 flex items-center gap-2 text-base font-bold text-ink">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="text-primary">
          <path d="M21 10c0 6-9 12-9 12s-9-6-9-12a9 9 0 0 1 18 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
        آدرس {PICKUP_BRANCH.name}
      </h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_220px]">
        <div className="flex flex-col gap-2 text-sm text-ink">
          <p>{PICKUP_BRANCH.address}</p>
          <p className="text-ink-muted">{PICKUP_BRANCH.phone1}</p>
          <p className="text-ink-muted">{PICKUP_BRANCH.phone2}</p>
          <p className="text-ink-muted">{PICKUP_BRANCH.workingHours}</p>
          <button
            type="button"
            className="mt-1 w-fit rounded-full border border-line px-4 py-1.5 text-xs font-bold text-ink transition-colors hover:border-primary hover:text-primary"
          >
            مشاهده در نقشه
          </button>
        </div>

        <div className="order-first flex h-40 items-center justify-center rounded-md2 bg-surface-soft text-xs text-ink-muted sm:order-none sm:h-auto">
          نقشه شعبه
        </div>
      </div>
    </div>
  );
}

function CheckoutInfoPage() {
  const { cartItems, totalCount, subtotal, discountTotal } = useCart();
  const navigate = useNavigate();
  const [deliveryMethod, setDeliveryMethod] = useState("courier");
  const [note, setNote] = useState("");
  const [addresses, setAddresses] = useState([]);
  const [addressesLoading, setAddressesLoading] = useState(true);
  const [addAddressOpen, setAddAddressOpen] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState(null);

  useEffect(() => {
    let alive = true;
    fetchAddresses()
      .then((data) => {
        if (!alive) return;
        setAddresses(data);
        if (data.length > 0) setSelectedAddressId(data[0].id);
        setAddressesLoading(false);
      })
      .catch(() => {
        if (alive) setAddressesLoading(false);
      });
    return () => {
      alive = false;
    };
  }, []);

  const isPickup = deliveryMethod === "pickup";
  const shippingCost = isPickup ? 0 : addresses.length > 0 ? MOCK_SHIPPING_COST : 0;
  const payable = subtotal + shippingCost;
  const canSubmit = isPickup || addresses.length > 0;

  const handleSaveAddress = async (address) => {
    try {
      const saved = await createAddress(address);
      setAddresses((prev) => [...prev, saved]);
      setSelectedAddressId(saved.id);
      setAddAddressOpen(false);
    } catch (err) {
      console.error("خطا در ثبت آدرس:", err);
    }
  };

  const handleDeleteAddress = async (id) => {
    try {
      await deleteAddress(id);
      setAddresses((prev) => prev.filter((a) => a.id !== id));
      if (selectedAddressId === id) setSelectedAddressId(null);
    } catch (err) {
      console.error("خطا در حذف آدرس:", err);
    }
  };

  const handleSubmitOrder = () => {
    if (!canSubmit) return;
    // آدرس انتخاب‌شده (یا اولین آدرس) رو برای مرحله‌ی پرداخت نگه می‌داریم
    if (!isPickup && selectedAddressId) {
      sessionStorage.setItem("checkout_address_id", selectedAddressId);
    }
    sessionStorage.setItem("checkout_delivery_type", deliveryMethod);
    sessionStorage.setItem("checkout_note", note);
    navigate("/checkout/payment");
  };

  return (
    <div className="mx-auto max-w-container px-4 py-8">
      <div className="mb-8">
        <CheckoutStepper currentStep={2} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="flex flex-col gap-6">
          <div className="rounded-lg2 border border-line p-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex shrink-0 items-center gap-2">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="text-primary">
                  <rect x="1" y="7" width="15" height="10" rx="1" />
                  <path d="M16 10h3l3 3v4h-6z" />
                  <circle cx="6" cy="19" r="1.8" />
                  <circle cx="17.5" cy="19" r="1.8" />
                </svg>
                <h2 className="text-base font-bold text-ink">روش تحویل سفارش</h2>
              </div>

              <div className="flex flex-wrap items-center gap-6">
                <button
                  type="button"
                  onClick={() => setDeliveryMethod("courier")}
                  className="flex flex-col gap-1 text-right"
                >
                  <div className="flex items-center gap-2">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="shrink-0 text-ink-muted">
                      <rect x="1" y="7" width="15" height="10" rx="1" />
                      <path d="M16 10h3l3 3v4h-6z" />
                      <circle cx="6" cy="19" r="1.8" />
                      <circle cx="17.5" cy="19" r="1.8" />
                    </svg>
                    <span className="text-sm font-bold text-ink">ارسال توسط پیک</span>
                    <span
                      className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 ${
                        deliveryMethod === "courier" ? "border-primary" : "border-line"
                      }`}
                    >
                      {deliveryMethod === "courier" && <span className="h-2 w-2 rounded-full bg-primary" />}
                    </span>
                  </div>
                  {deliveryMethod === "courier" && (
                    <p className="pr-6 text-xs text-ink-muted">توسط پیک رستوران‌ها ارسال می‌شود.</p>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setDeliveryMethod("pickup")}
                  className="flex items-center gap-2 text-right"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="shrink-0 text-ink-muted">
                    <path d="M3 9l9-7 9 7v11a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z" />
                  </svg>
                  <span className="text-sm font-bold text-ink">تحویل حضوری</span>
                  <span
                    className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 ${
                      deliveryMethod === "pickup" ? "border-primary" : "border-line"
                    }`}
                  >
                    {deliveryMethod === "pickup" && <span className="h-2 w-2 rounded-full bg-primary" />}
                  </span>
                </button>
              </div>
            </div>
          </div>

          {isPickup ? (
            <PickupBranchCard />
          ) : (
            <div className="rounded-lg2 border border-line p-4">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-base font-bold text-ink">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="text-primary">
                    <path d="M21 10c0 6-9 12-9 12s-9-6-9-12a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  آدرس‌ها
                </h2>
                <button
                  type="button"
                  onClick={() => setAddAddressOpen(true)}
                  className="flex items-center gap-1 text-sm font-bold text-primary hover:text-primary-dark"
                >
                  افزودن آدرس
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                </button>
              </div>

              {addressesLoading ? (
                <p className="py-8 text-center text-sm text-ink-muted">در حال بارگذاری آدرس‌ها...</p>
              ) : addresses.length === 0 ? (
                <div className="flex flex-col items-center gap-3 py-8 text-center">
                  <EmptyAddressIllustration />
                  <p className="text-sm font-bold text-ink">شما در حال حاضر هیچ آدرسی ثبت نکرده‌اید!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {addresses.map((a) => (
                    <div
                      key={a.id}
                      onClick={() => setSelectedAddressId(a.id)}
                      className={`cursor-pointer rounded-md2 ${
                        selectedAddressId === a.id ? "ring-2 ring-primary" : ""
                      }`}
                    >
                      <AddressCard address={a} onDelete={handleDeleteAddress} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="rounded-lg2 border border-line p-4">
            <textarea
              rows="4"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="توضیحات سفارش (اختیاری)"
              className="w-full resize-none text-sm focus:outline-none"
            />
          </div>
        </div>

        <div className="h-fit rounded-lg2 border border-line p-4">
          <h2 className="mb-2 text-base font-bold text-ink">سبد خرید ({toPersianDigits(totalCount)})</h2>

          <div className="max-h-[220px] overflow-y-auto">
            {cartItems.map((item) => (
              <SummaryItemRow key={item.id} item={item} />
            ))}
          </div>

          <div className="mt-3 flex flex-col gap-3 text-sm">
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
            {!isPickup && addresses.length === 0 && (
              <p className="text-xs leading-6 text-amber-600">
                هزینه ارسال بر اساس آدرس انتخابی شما محاسبه و به این مبلغ اضافه خواهد شد.
              </p>
            )}

            <div className="border-t border-line pt-3">
              <div className="flex items-center justify-between font-bold text-ink">
                <span>مبلغ قابل پرداخت</span>
                <span>{formatPrice(payable)} تومان</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleSubmitOrder}
              disabled={!canSubmit}
              className="mt-2 flex items-center justify-center gap-2 rounded-full bg-primary py-2.5 font-bold text-white transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-40"
            >
              ثبت سفارش
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {addAddressOpen && (
        <AddAddressModal onClose={() => setAddAddressOpen(false)} onSave={handleSaveAddress} />
      )}
    </div>
  );
}

export default CheckoutInfoPage;