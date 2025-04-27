import './App.css';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/products/:id" element={<ProductsPage />} />
      </Routes>
      </Router>
  )
}

export default App
