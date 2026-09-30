// نوار ۳ مرحله‌ای بالای صفحات پرداخت: سبد خرید → تکمیل اطلاعات → پرداخت
// currentStep: 1 | 2 | 3
// قانون رنگ: مرحله‌ای که رسیده‌ایم بهش (فعلی یا قبلی) = سبز + متن مشکی پررنگ
//            مرحله‌ای که هنوز نرسیدیم = طوسی + متن طوسی
const steps = [
  {
    id: 1,
    label: "سبد خرید",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="9" cy="21" r="1" />
        <circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
      </svg>
    ),
  },
  {
    id: 2,
    label: "تکمیل اطلاعات",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M9 11l3 3L22 4" />
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
      </svg>
    ),
  },
  {
    id: 3,
    label: "پرداخت",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="5" width="20" height="14" rx="2" />
        <line x1="2" y1="10" x2="22" y2="10" />
      </svg>
    ),
  },
];

function CheckoutStepper({ currentStep }) {
  return (
    <div className="flex w-full items-center">
      {steps.map((step, i) => {
        const reached = step.id <= currentStep;
        return (
          <div key={step.id} className={`flex items-center ${i < steps.length - 1 ? "flex-1" : ""}`}>
            <div className="flex shrink-0 items-center gap-2">
              <span className={`text-sm ${reached ? "font-bold text-ink" : "text-ink-muted"}`}>{step.label}</span>
              <span
                className={`flex h-7 w-7 items-center justify-center rounded-md2 border-2 ${
                  reached ? "border-primary text-primary" : "border-line text-ink-muted"
                }`}
              >
                {step.icon}
              </span>
            </div>
            {i < steps.length - 1 && (
              <span
                className={`mx-3 h-0 flex-1 border-t-2 border-dashed ${
                  step.id < currentStep ? "border-primary" : "border-line"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default CheckoutStepper;
