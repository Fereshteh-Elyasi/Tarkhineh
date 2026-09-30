// src/components/Header.jsx
import { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate, useLocation, matchPath } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import logo from "../assets/Images/Logo.png";
import AuthModal from "./AuthModal";
import SearchModal from "./SearchModal";
import BranchModal from "./BranchModal";
import { branches } from "../data/branches";
import { toPersianDigits } from "../utils/format";

const menuDropdownItems = [
  { label: "غذای اصلی", tab: "main" },
  { label: "پیش غذا", tab: "appetizer" },
  { label: "دسر", tab: "dessert" },
  { label: "نوشیدنی", tab: "drink" },
];

const profileMenuItems = [
  { label: "پروفایل", icon: "user", action: "profile" },
  { label: "پیگیری سفارش", icon: "order", action: "orders" },
  { label: "علاقه‌مندی‌ها", icon: "heart", action: "wishlist" },
  { label: "آدرس‌های من", icon: "pin", action: "addresses" },
  { label: "خروج از حساب", icon: "logout", action: "logout" },
];

const profileIcons = {
  user: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  order: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 4h6a2 2 0 0 1 2 2v14l-5-3-5 3V6a2 2 0 0 1 2-2z" />
    </svg>
  ),
  heart: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z" />
    </svg>
  ),
  pin: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 10c0 6-9 12-9 12s-9-6-9-12a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  ),
  logout: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  ),
};

const navClass = ({ isActive }) =>
  `text-sm font-medium transition-colors ${isActive ? "text-primary font-bold" : "text-ink hover:text-primary"}`;

function Header() {
  const { isAuthenticated, logout, user } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [branchModalOpen, setBranchModalOpen] = useState(false);

  const menuDropdownRef = useRef(null);
  const branchDropdownRef = useRef(null);
  const profileDropdownRef = useRef(null);

  const branchRouteMatch = matchPath("/branch/:slug", location.pathname);
  const currentBranch = branchRouteMatch
    ? branches.find((b) => b.slug === branchRouteMatch.params.slug)
    : null;

  useEffect(() => {
    if (!activeDropdown) return;
    const refsByType = { menu: menuDropdownRef, branch: branchDropdownRef, profile: profileDropdownRef };
    const handleClickOutside = (e) => {
      const currentRef = refsByType[activeDropdown];
      if (currentRef?.current && !currentRef.current.contains(e.target)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [activeDropdown]);

  const toggleDropdown = (type) => setActiveDropdown((cur) => (cur === type ? null : type));

  const handleMenuItemClick = (tab) => {
    setActiveDropdown(null);
    setMenuOpen(false);
    navigate(`/menu/${tab}`);
  };

  const handleBranchClick = () => {
    setActiveDropdown(null);
    setMenuOpen(false);
    setBranchModalOpen(true);
  };

  const handleProfileClick = () => {
    setActiveDropdown(null);
    if (isAuthenticated) {
      navigate("/profile");
    } else {
      setAuthModalOpen(true);
    }
  };

  const handleProfileItemClick = (item) => {
    setActiveDropdown(null);
    if (item.action === "profile") {
      handleProfileClick();
    } else if (item.action === "logout") {
      logout();
      navigate("/");
    } else if (item.action === "orders") {
      navigate("/profile", { state: { tab: "orders" } });
    } else if (item.action === "wishlist") {
      navigate("/profile", { state: { tab: "wishlist" } });
    } else if (item.action === "addresses") {
      navigate("/profile", { state: { tab: "addresses" } });
    }
  };

  const handleAuthSuccess = () => {
    console.log("✅ ورود موفق، کاربر در همان صفحه می‌ماند");
  };

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-line bg-white shadow-sm">
        <div className="container mx-auto flex items-center justify-between gap-6 px-4 py-3 md:px-8 lg:px-12">
          {/* لوگو */}
          <NavLink to="/" className="shrink-0">
            <img src={logo} alt="ترخینه" className="h-9 w-auto md:h-10" />
          </NavLink>

          {/* منوی اصلی - چیدمان از چپ به راست (برعکس عکس) */}
          <nav
            className={`${
              menuOpen ? "flex" : "hidden"
            } absolute inset-x-0 top-full flex-col gap-1 border-b border-line bg-white p-4 shadow-lg md:static md:flex md:flex-row md:items-center md:gap-4 md:border-none md:p-0 md:shadow-none lg:gap-6`}
          >
            <NavLink to="/" end className={navClass}>
              صفحه اصلی
            </NavLink>

            {/* دراپ‌داون شعبه */}
            <div className="relative" ref={branchDropdownRef}>
              <button
                type="button"
                onClick={() => toggleDropdown("branch")}
                className={`flex items-center gap-1 text-sm font-medium ${
                  currentBranch ? "font-bold text-primary" : "text-ink hover:text-primary"
                }`}
              >
                {currentBranch ? currentBranch.name : "شعبه"}
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
              {activeDropdown === "branch" && (
                <div className="absolute top-full right-0 z-10 mt-2 min-w-[160px] rounded-md border border-line bg-surface py-1 shadow-md">
                  {branches.map((b) => (
                    <button
                      key={b.slug}
                      type="button"
                      onClick={handleBranchClick}
                      className="block w-full border-b border-line px-4 py-3 text-right text-sm text-ink last:border-b-0 hover:bg-surface-soft"
                    >
                      {b.name.replace(/^شعبه\s*/, "")}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* دراپ‌داون منو */}
            <div className="relative" ref={menuDropdownRef}>
              <button
                type="button"
                onClick={() => toggleDropdown("menu")}
                className="flex items-center gap-1 text-sm font-medium text-ink hover:text-primary"
              >
                منو
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
              {activeDropdown === "menu" && (
                <div className="absolute top-full right-0 z-10 mt-2 min-w-[160px] rounded-md border border-line bg-surface py-1 shadow-md">
                  {menuDropdownItems.map((item) => (
                    <button
                      key={item.tab}
                      type="button"
                      onClick={() => handleMenuItemClick(item.tab)}
                      className="block w-full border-b border-line px-4 py-3 text-right text-sm text-ink last:border-b-0 hover:bg-surface-soft"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <NavLink to="/franchise" className="text-sm font-medium text-ink hover:text-primary">
              اعطای نمایندگی
            </NavLink>
            <NavLink to="/about" className="text-sm font-medium text-ink hover:text-primary">
              درباره ما
            </NavLink>
            <NavLink to="/contact" className="text-sm font-medium text-ink hover:text-primary">
              تماس با ما
            </NavLink>
          </nav>

          {/* دکمه‌های سمت راست */}
          <div className="flex items-center gap-1.5 md:gap-2">
            <button
              aria-label="جستجو"
              onClick={() => setSearchModalOpen(true)}
              className="flex h-8 w-8 items-center justify-center rounded-md bg-primary-light text-primary transition-colors hover:bg-primary hover:text-white md:h-9 md:w-9"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="md:h-5 md:w-5">
                <circle cx="11" cy="11" r="7" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>

            <NavLink
              to="/cart"
              aria-label="سبد خرید"
              className="relative flex h-8 w-8 items-center justify-center rounded-md bg-primary-light text-primary transition-colors hover:bg-primary hover:text-white md:h-9 md:w-9"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="md:h-5 md:w-5">
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              {totalItems > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-white">
                  {toPersianDigits(totalItems)}
                </span>
              )}
            </NavLink>

            <div className="relative" ref={profileDropdownRef}>
              <button
                aria-label="حساب کاربری"
                onClick={() => toggleDropdown("profile")}
                className="flex h-8 w-8 items-center justify-center rounded-md bg-primary-light text-primary transition-colors hover:bg-primary hover:text-white md:h-9 md:w-9"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="md:h-5 md:w-5">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="md:h-3 md:w-3">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
              {activeDropdown === "profile" && (
                <div className="absolute top-full left-0 z-10 mt-2 min-w-[180px] rounded-md border border-line bg-surface py-2 shadow-md">
                  {profileMenuItems.map((item) => (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => handleProfileItemClick(item)}
                      className="flex w-full items-center justify-between gap-2 px-4 py-2 text-sm text-ink transition-colors hover:bg-surface-soft"
                    >
                      <span>{item.label}</span>
                      {profileIcons[item.icon]}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              aria-label="منو"
              onClick={() => setMenuOpen((v) => !v)}
              className="flex h-8 w-8 items-center justify-center rounded-full text-ink hover:bg-surface-soft md:hidden"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {authModalOpen && (
        <AuthModal
          onClose={() => {
            setAuthModalOpen(false);
          }}
          onSuccess={handleAuthSuccess}
        />
      )}
      {searchModalOpen && <SearchModal onClose={() => setSearchModalOpen(false)} />}
      {branchModalOpen && <BranchModal onClose={() => setBranchModalOpen(false)} />}
    </>
  );
}

export default Header;