import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

// Providers
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import B2BRegistration from './pages/B2BRegistration';
import OemHub from './pages/OemHub';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Contact from './pages/Contact';
import WeyWipesPage from './pages/WeyWipesPage';
import PrivacyPolicy from './pages/PrivacyPolicy';
import About from './pages/About';
import Careers from './pages/Careers';

function AppContent() {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const isWeyWipes = location.pathname === '/weywipes';
  const isAdminPage = location.pathname.toLowerCase().replace(/\/$/, '') === '/admin';

  // 1. Initialize Lenis smooth scroll globally
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // standard expo easing
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false, // keep touch device default scroll feel for responsiveness
      touchMultiplier: 2,
      infinite: false,
    });

    // Keep requestAnimationFrame running to tick Lenis scroll updates
    let rafId;
    function raf(time) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    // Save lenis instance to window for global access
    window.lenis = lenis;

    return () => {
      lenis.destroy();
      cancelAnimationFrame(rafId);
      window.lenis = null;
    };
  }, []);

  // 2. Reset scroll position to top on route change
  useEffect(() => {
    if (window.lenis) {
      window.lenis.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }
  }, [location.pathname]);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      backgroundColor: 'var(--bg-base)'
    }}>
      {!isWeyWipes && !isAdminPage && <Navbar />}
      
      <main style={{ 
        flex: '1 0 auto',
        paddingTop: (isHomePage || 
                     location.pathname.toLowerCase().replace(/\/$/, '') === '/contact' || 
                     isWeyWipes || 
                     location.pathname.toLowerCase().replace(/\/$/, '') === '/oem' || 
                     location.pathname.toLowerCase().replace(/\/$/, '') === '/about' ||
                     location.pathname.toLowerCase().replace(/\/$/, '') === '/careers' ||
                     isAdminPage) ? '0px' : '100px' // Dynamic top padding to offset the fixed navbar on subpages
      }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/register-b2b" element={<B2BRegistration />} />
          <Route path="/oem" element={<OemHub />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/weywipes" element={<WeyWipesPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/about" element={<About />} />
          <Route path="/careers" element={<Careers />} />
        </Routes>
      </main>

      {!isWeyWipes && !isAdminPage && <Footer />}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <AppContent />
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
