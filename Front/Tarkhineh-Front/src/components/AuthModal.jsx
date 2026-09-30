// src/components/AuthModal.jsx
import { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import logo from "../assets/Images/Logo.png";
import { toEnglishDigits, toPersianDigits, formatPhoneGroups, formatTimer } from "../utils/format";
import { apiFetch } from "../api/client";

const RESEND_SECONDS = 119;

function AuthModal({ onClose, onSuccess }) {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState("phone");
  const [phoneDigits, setPhoneDigits] = useState("");
  const [otpValues, setOtpValues] = useState(["", "", "", "", ""]);
  const [otpError, setOtpError] = useState(false);
  const [resendSeconds, setResendSeconds] = useState(RESEND_SECONDS);
  const [isLoading, setIsLoading] = useState(false);

  const otpInputRefs = useRef([]);
  const phoneInputRef = useRef(null);

  const isValidPhone = phoneDigits.length === 11 && phoneDigits.startsWith("0");
  const isOtpComplete = otpValues.every((d) => d !== "");

  useEffect(() => {
    if (step !== "otp" || resendSeconds <= 0) return;
    const timerId = setTimeout(() => setResendSeconds((s) => s - 1), 1000);
    return () => clearTimeout(timerId);
  }, [step, resendSeconds]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const handlePhoneInputChange = (e) => {
    const digitsOnly = toEnglishDigits(e.target.value).replace(/\D/g, "").slice(0, 11);
    setPhoneDigits(digitsOnly);
  };

const handleContinueClick = async () => {
  if (!isValidPhone) return;
  try {
    await apiFetch("/auth/send-otp", {
      method: "POST",
      body: { phone: phoneDigits },
    });
    setOtpValues(["", "", "", "", ""]);
    setOtpError(false);
    setResendSeconds(RESEND_SECONDS);
    setStep("otp");
  } catch (error) {
    console.error("❌ خطا در ارسال کد:", error);
    // اینجا می‌تونید یه پیام خطا به کاربر نشون بدید، مثلاً با یه state جدید
  }
};

  const handleBackToPhone = () => {
    setStep("phone");
    setOtpError(false);
  };

  const handleOtpChange = (index, rawValue) => {
    const digit = toEnglishDigits(rawValue).replace(/\D/g, "").slice(-1);
    setOtpValues((prev) => {
      const next = [...prev];
      next[index] = digit;
      return next;
    });
    if (otpError) setOtpError(false);
    if (digit && index < otpValues.length - 1) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otpValues[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  // ====== اصلاح: بعد از ورود به صفحه قبلی برمی‌گرده ======
const handleSubmitOtp = async () => {
  if (!isOtpComplete) return;

  setIsLoading(true);
  console.log("🔑 تأیید کد:", otpValues.join(""));

  try {
    const result = await apiFetch("/auth/verify-otp", {
      method: "POST",
      body: { phone: phoneDigits, code: otpValues.join("") },
    });

    setOtpError(false);
    console.log("✅ ورود موفق! اطلاعات کاربر:", result.user);

    // 1. ذخیره در Context (کاربر + توکن)
    login(result.user, result.token);

    // 2. بستن مودال
    onClose();

    // 3. اگر onSuccess وجود داشت (برای موارد خاص) صدا بزن
    if (onSuccess) {
      onSuccess();
    }
  } catch (error) {
    console.error("❌ خطا در تأیید کد:", error);
    setOtpError(true);
  } finally {
    setIsLoading(false);
  }
};

const handleResendCode = async () => {
  if (resendSeconds > 0) return;
  try {
    await apiFetch("/auth/send-otp", {
      method: "POST",
      body: { phone: phoneDigits },
    });
    setOtpValues(["", "", "", "", ""]);
    setOtpError(false);
    setResendSeconds(RESEND_SECONDS);
  } catch (error) {
    console.error("❌ خطا در ارسال مجدد کد:", error);
  }
};

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-lg bg-surface p-6 shadow-lg animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* هدر مودال */}
        <div className="mb-4 flex items-center justify-between">
          <button onClick={onClose} className="text-2xl text-ink-muted hover:text-ink">
            ✕
          </button>
          {step === "otp" && (
            <button onClick={handleBackToPhone} className="text-ink-muted hover:text-ink">
              ← بازگشت
            </button>
          )}
          <img src={logo} alt="ترخینه" className="h-8" />
        </div>

        {/* مرحله اول: دریافت شماره */}
        {step === "phone" && (
          <div className="flex flex-col gap-4 text-center">
            <h2 className="text-lg font-bold text-ink">ورود / ثبت نام</h2>
            <p className="text-sm text-ink-muted">
              با وارد کردن شماره موبایل کد تاییدی برای شما ارسال خواهد شد.
            </p>

            <label className="flex flex-col gap-1 text-right">
              <span className="text-xs text-ink-muted">شماره همراه</span>
              <input
                ref={phoneInputRef}
                type="text"
                inputMode="numeric"
                dir="ltr"
                className="w-full rounded-md border border-line px-3 py-2 text-center text-lg focus:border-primary focus:outline-none"
                value={formatPhoneGroups(phoneDigits)}
                onChange={handlePhoneInputChange}
                onKeyDown={(e) => e.key === "Enter" && handleContinueClick()}
                autoFocus
                placeholder="۰۹۱۲۳۴۵۶۷۸۹"
              />
            </label>

            <button
              type="button"
              disabled={!isValidPhone}
              onClick={handleContinueClick}
              className="w-full rounded-full bg-primary py-2.5 font-bold text-white transition-colors hover:bg-primary-dark disabled:opacity-40"
            >
              ادامه
            </button>

            <p className="text-xs text-ink-muted">
              ورود و عضویت در ترخینه به منزله قبول{" "}
              <a href="#" className="text-primary hover:underline">
                قوانین و مقررات
              </a>{" "}
              است.
            </p>
          </div>
        )}

        {/* مرحله دوم: تأیید کد */}
        {step === "otp" && (
          <div className="flex flex-col gap-4 text-center">
            <h2 className="text-lg font-bold text-ink">کد تایید</h2>
            <p className="text-sm text-ink-muted">
              کد تایید پنج‌رقمی به شماره{" "}
              <span dir="ltr" className="inline-block font-bold">
                {toPersianDigits(formatPhoneGroups(phoneDigits))}
              </span>{" "}
              ارسال شد.
            </p>

            <div dir="ltr" className="flex justify-center gap-2">
              {otpValues.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => (otpInputRefs.current[i] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  className={`h-12 w-10 rounded-md border text-center text-lg font-bold transition-colors focus:outline-none ${
                    otpError
                      ? "border-red-400 bg-red-50"
                      : "border-line focus:border-primary"
                  }`}
                  value={digit}
                  onChange={(e) => handleOtpChange(i, e.target.value)}
                  onKeyDown={(e) => {
                    handleOtpKeyDown(i, e);
                    if (e.key === "Enter") handleSubmitOtp();
                  }}
                  autoFocus={i === 0}
                />
              ))}
            </div>

            <div className="flex items-center justify-between text-xs">
              <button onClick={handleBackToPhone} className="text-primary hover:underline">
                ویرایش شماره
              </button>
              {resendSeconds > 0 ? (
                <span className="flex items-center gap-1 text-ink-muted">
                  دریافت مجدد کد
                  <span className="font-bold text-primary">
                    {toPersianDigits(formatTimer(resendSeconds))}
                  </span>
                </span>
              ) : (
                <button onClick={handleResendCode} className="text-primary hover:underline">
                  دریافت مجدد کد
                </button>
              )}
            </div>

            {otpError && (
              <div className="rounded-md bg-red-50 py-2 text-sm text-red-500">
                ❌ کد تایید نامعتبر است. لطفاً دوباره تلاش کنید.
              </div>
            )}

            <button
              type="button"
              disabled={!isOtpComplete || isLoading}
              onClick={handleSubmitOtp}
              className="w-full rounded-full bg-primary py-2.5 font-bold text-white transition-colors hover:bg-primary-dark disabled:opacity-40"
            >
              {isLoading ? "در حال تأیید..." : "ثبت کد"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default AuthModal;