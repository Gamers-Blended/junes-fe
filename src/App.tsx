import "./App.css";
import HomePage from "./pages/HomePage.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import CreateNewUserPage from "./pages/CreateNewUserPage.tsx";
import ForgetPasswordPage from "./pages/ForgetPasswordPage.tsx";
import EmailSentPage from "./pages/EmailSentPage.tsx";
import MyAccountPage from "./pages/MyAccountPage.tsx";
import ChangeCredentialsPage from "./pages/ChangeCredentialsPage.tsx";
import SavedInfoPage from "./pages/SavedInfoPage.tsx";
import ModifyAddressPage from "./pages/ModifyAddressPage.tsx";
import ProductsPage from "./pages/ProductsPage.tsx";
import ProductListingPage from "./pages/ProductListingPage.tsx";
import ProductDetailsPage from "./pages/ProductDetailsPage.tsx";
import OrderDetailsPage from "./pages/OrderDetailsPage.tsx";
import InvoicePage from "./pages/InvoicePage.tsx";
import CartPage from "./pages/CartPage.tsx";
import WishListPage from "./pages/WishListPage.tsx";
import CheckoutPage from "./pages/CheckoutPage.tsx";
import NavigationBar from "./components/NavigationBar.tsx";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./components/AuthContext";
import { Provider } from "react-redux";
import { store } from "./store/store";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppLayout />
      </AuthProvider>
    </BrowserRouter>
  );
}

function AppLayout() {
  const location = useLocation();
  const hideNavBar = location.pathname.startsWith("/invoice/");

  return (
    <>
      <Provider store={store}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products/:id" element={<ProductsPage />} />
          <Route
            path="/products/listings/:platform"
            element={<ProductListingPage />}
          />
          <Route path="/order/:orderId" element={<OrderDetailsPage />} />
          <Route path="/invoice/:orderId" element={<InvoicePage />} />
          <Route path="/games/:slug" element={<ProductDetailsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/createaccount" element={<CreateNewUserPage />} />
          <Route path="/resetpassword" element={<ForgetPasswordPage />} />
          <Route path="/emailsent" element={<EmailSentPage />} />
          <Route path="/myaccount" element={<MyAccountPage />} />
          <Route
            path="/changecredentials"
            element={<ChangeCredentialsPage />}
          />
          <Route path="/savedinfo" element={<SavedInfoPage />} />
          <Route path="/modifyaddress" element={<ModifyAddressPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/wishlist" element={<WishListPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
        </Routes>
      </Provider>

      {!hideNavBar && <NavigationBar />}
    </>
  );
}

export default App;
