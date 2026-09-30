import footerBg from "../assets/Images/footer.jpg";

const branchLinks = ["شعبه اکباتان", "شعبه چالوس", "شعبه اقدسیه", "شعبه ونک"];
const quickLinks = ["پرسش‌های متداول", "قوانین ترخینه", "مدیر مربوطه"];

function Footer() {
  return (
    <footer
      id="contact"
      className="relative bg-cover bg-center text-white"
      style={{ backgroundImage: `url(${footerBg})` }}
    >
      <div className="absolute inset-0 bg-black/70" />

      <div className="relative mx-auto grid max-w-container gap-8 px-4 py-8 md:grid-cols-3">
        <div className="flex flex-col gap-2">
          <h4 className="text-base font-bold">پیام به ترخینه</h4>
          <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-2">
            <textarea
              placeholder="پیام شما"
              rows="3"
              maxLength={300}
              className="rounded-md2 bg-white/10 px-3 py-2 text-sm placeholder:text-white/60 focus:outline-none"
            />
            <input
              type="text"
              placeholder="نام و نام خانوادگی"
              className="rounded-md2 bg-white/10 px-3 py-2 text-sm placeholder:text-white/60 focus:outline-none"
            />
            <input
              type="text"
              placeholder="شماره تماس"
              className="rounded-md2 bg-white/10 px-3 py-2 text-sm placeholder:text-white/60 focus:outline-none"
            />
            <input
              type="email"
              placeholder="آدرس ایمیل (اختیاری)"
              className="rounded-md2 bg-white/10 px-3 py-2 text-sm placeholder:text-white/60 focus:outline-none"
            />
            <p className="text-xs text-white/60">۰/۳۰۰</p>
            <button
              type="submit"
              className="w-fit rounded-full bg-primary px-8 py-2 text-sm font-bold text-white transition-colors hover:bg-primary-dark"
            >
              ارسال پیام
            </button>
          </form>
        </div>

        <div>
          <h4 className="mb-2 text-base font-bold">شعبه‌های ترخینه</h4>
          <ul className="flex flex-col gap-1.5 text-sm text-white/80">
            {branchLinks.map((b) => (
              <li key={b}>
                <a href="#branches" className="hover:text-white">
                  {b}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-2 text-base font-bold">دسترسی آسان</h4>
          <ul className="mb-3 flex flex-col gap-1.5 text-sm text-white/80">
            {quickLinks.map((l) => (
              <li key={l}>
                <a href="#" className="hover:text-white">
                  {l}
                </a>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-3">
            <a href="#" aria-label="تلگرام" className="text-white/80 hover:text-white">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 2L11 13" />
                <path d="M22 2l-7 20-4-9-9-4 20-7z" />
              </svg>
            </a>
            <a href="#" aria-label="اینستاگرام" className="text-white/80 hover:text-white">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
              </svg>
            </a>
            <a href="#" aria-label="توییتر" className="text-white/80 hover:text-white">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53A4.48 4.48 0 0 0 22.4.36a9 9 0 0 1-2.84 1.1A4.48 4.48 0 0 0 16.11 0c-2.5 0-4.52 2.02-4.52 4.5 0 .35.04.69.11 1.02C7.69 5.3 4.07 3.2 1.64.5a4.48 4.48 0 0 0-.61 2.27c0 1.56.8 2.95 2 3.77A4.48 4.48 0 0 1 .96 6v.06c0 2.18 1.55 4 3.6 4.42a4.5 4.5 0 0 1-2.04.08c.57 1.78 2.23 3.08 4.2 3.12A9.05 9.05 0 0 1 0 19.54a12.8 12.8 0 0 0 6.92 2.03c8.3 0 12.84-6.88 12.84-12.84 0-.2 0-.39-.02-.58A9.22 9.22 0 0 0 23 3z" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      <div className="relative border-t border-white/10 py-3 text-center text-xs text-white/70">
        <p>© تمامی حقوق این وب‌سایت متعلق به ترخینه می‌باشد.</p>
      </div>
    </footer>
  );
}

export default Footer;
