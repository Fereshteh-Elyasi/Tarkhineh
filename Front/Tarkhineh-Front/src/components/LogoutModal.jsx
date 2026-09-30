// src/components/LogoutModal.jsx
import { useEffect } from "react";

function LogoutModal({ onClose, onConfirm }) {
  // غیرفعال کردن اسکرول بدنه
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ====== آیکون خروج ====== */}
        <div className="mb-4 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#dc2626"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </div>
        </div>

        {/* ====== عنوان ====== */}
        <h2 className="mb-2 text-center text-xl font-bold text-gray-900">
          خروج
        </h2>

        {/* ====== متن ====== */}
        <p className="mb-6 text-center text-sm text-gray-500">
          آیا مایل به خروج از حساب کاربری خود هستید؟
        </p>

        {/* ====== دکمه‌ها ====== */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-lg border bg-primary border-gray-200 py-2.5 text-sm font-medium text-white transition-colors"
          >
            بازگشت
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 rounded-lg border bg-[#dc143c] py-2.5 text-sm text-white font-medium transition-colors"
          >
            خروج
          </button>
        </div>
      </div>
    </div>
  );
}

export default LogoutModal;