import './App.css';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import MyAccountPage from './pages/MyAccountPage';
import ProductsPage from './pages/ProductsPage';
import CartPage from './pages/CartPage';
import WishListPage from './pages/WishListPage';
import NavigationBar from "./components/NavigationBar";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './components/AuthContext';

function App() {

  return (
    <BrowserRouter>
    <AuthProvider>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/products/:id" element={<ProductsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/myaccount" element={<MyAccountPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/wishlist" element={<WishListPage />} />
      </Routes>
      <NavigationBar/>
      </AuthProvider>
      </BrowserRouter>
  )
}

export default App
