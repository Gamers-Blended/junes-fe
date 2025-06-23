import './App.css';
import HomePage from './pages/HomePage.tsx';
import LoginPage from './pages/LoginPage.tsx';
import MyAccountPage from './pages/MyAccountPage.tsx';
import ProductsPage from './pages/ProductsPage.tsx';
import CartPage from './pages/CartPage.tsx';
import WishListPage from './pages/WishListPage.tsx';
import NavigationBar from "./components/NavigationBar.tsx";
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
