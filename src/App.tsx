import './App.css';
import HomePage from './pages/HomePage.tsx';
import LoginPage from './pages/LoginPage.tsx';
import CreateNewUserPage from './pages/CreateNewUserPage.tsx';
import ForgetPasswordPage from './pages/ForgetPasswordPage.tsx';
import EmailSentPage from './pages/EmailSentPage.tsx';
import MyAccountPage from './pages/MyAccountPage.tsx';
import ProductsPage from './pages/ProductsPage.tsx';
import ProductListingPage from './pages/ProductListingPage.tsx';
import ProductDetailsPage from './pages/ProductDetailsPage.tsx';
import CartPage from './pages/CartPage.tsx';
import WishListPage from './pages/WishListPage.tsx';
import NavigationBar from "./components/NavigationBar.tsx";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './components/AuthContext';
import { Provider } from 'react-redux';
import { store } from './store/store';

function App() {

  return (
    <BrowserRouter>
    <AuthProvider>
    <Provider store={store}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/products/:id" element={<ProductsPage />} />
        <Route path="/products/listings/:platform" element={<ProductListingPage />} />
        <Route path="/games/:slug" element={<ProductDetailsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/createaccount" element={<CreateNewUserPage />} />
        <Route path="/resetpassword" element={<ForgetPasswordPage />} />
        <Route path="/emailsent" element={<EmailSentPage />} />
        <Route path="/myaccount" element={<MyAccountPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/wishlist" element={<WishListPage />} />
      </Routes>
    </Provider>
    <NavigationBar/>
    </AuthProvider>
    </BrowserRouter>
  )
}

export default App
