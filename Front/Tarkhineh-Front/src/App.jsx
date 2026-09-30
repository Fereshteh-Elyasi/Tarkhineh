// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import BranchPage from "./pages/BranchPage";
import MenuPage from "./pages/MenuPage";
import SearchResultsPage from "./pages/SearchResultsPage";
import CartPage from "./pages/CartPage";
import CheckoutInfoPage from "./pages/CheckoutInfoPage";
import PaymentPage from "./pages/PaymentPage";
import PaymentSuccessPage from "./pages/PaymentSuccessPage";
import PaymentFailedPage from "./pages/PaymentFailedPage";
import ProfilePage from "./pages/ProfilePage";
import FranchisePage from "./pages/FranchisePage";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import { WishlistProvider } from "./context/WishlistContext";
import { AddressProvider } from "./context/AddressContext";
import { OrdersProvider } from "./context/OrdersContext";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AddressProvider>
          <OrdersProvider>
            <WishlistProvider>
              <CartProvider>
                <div className="flex min-h-screen flex-col font-vazir text-ink" dir="rtl">
                  <Header />
                  <main className="flex-1">
                    <Routes>
                      <Route path="/" element={<HomePage />} />
                      <Route path="/branch/:slug" element={<BranchPage />} />
                      <Route path="/menu/:tab" element={<MenuPage />} />
                      <Route path="/search" element={<SearchResultsPage />} />
                      <Route path="/cart" element={<CartPage />} />
                      <Route path="/checkout/info" element={<CheckoutInfoPage />} />
                      <Route path="/checkout/payment" element={<PaymentPage />} />
                      <Route path="/checkout/payment/success" element={<PaymentSuccessPage />} />
                      <Route path="/checkout/payment/failed" element={<PaymentFailedPage />} />
                      <Route path="/profile" element={<ProfilePage />} />
                      <Route path="/profile/edit" element={<ProfilePage />} />
                      <Route path="/franchise" element={<FranchisePage />} />
                    </Routes>
                  </main>
                  <Footer />
                </div>
              </CartProvider>
            </WishlistProvider>
          </OrdersProvider>
        </AddressProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;