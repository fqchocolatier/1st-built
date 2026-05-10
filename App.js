import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, X, Plus, Minus, User, ChevronLeft, Menu } from 'lucide-react';
import { getAllProducts, getProductsByCategory, getProductById } from './data/products';

// Components
import AnnouncementBar from './components/AnnouncementBar';
import Header from './components/Header';
import NavigationBar from './components/NavigationBar';
import HomePage from './pages/HomePage';
import CollectionPage from './pages/CollectionPage';
import ProductDetailPage from './pages/ProductDetailPage';
import AboutUsPage from './pages/AboutUsPage';
import OurCraftPage from './pages/OurCraftPage';
import Toast from './components/Toast';

function App() {
  const [currentView, setCurrentView] = useState('home');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('fqc-cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('fqc-cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product, quantity = 1, selectedVariant = null) => {
    const existingItem = cart.find(item => 
      item.id === product.id && item.variant === selectedVariant
    );

    if (existingItem) {
      setCart(cart.map(item =>
        item.id === product.id && item.variant === selectedVariant
          ? { ...item, quantity: item.quantity + quantity }
          : item
      ));
    } else {
      setCart([...cart, { 
        ...product, 
        quantity, 
        variant: selectedVariant 
      }]);
    }

    showToast(`${product.name} added to cart`);
    setIsCartOpen(true);
  };

  const removeFromCart = (productId, variant = null) => {
    setCart(cart.filter(item => 
      !(item.id === productId && item.variant === variant)
    ));
  };

  const updateQuantity = (productId, quantity, variant = null) => {
    if (quantity <= 0) {
      removeFromCart(productId, variant);
    } else {
      setCart(cart.map(item =>
        item.id === productId && item.variant === variant
          ? { ...item, quantity }
          : item
      ));
    }
  };

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 2800);
  };

  const navigateToHome = () => {
    setCurrentView('home');
    setSelectedCategory(null);
    setSelectedProduct(null);
    window.scrollTo(0, 0);
  };

  const navigateToCategory = (categoryId) => {
    setCurrentView('collection');
    setSelectedCategory(categoryId);
    setSelectedProduct(null);
    setIsMobileMenuOpen(false);
    window.scrollTo(0, 0);
  };

  const navigateToProduct = (productId) => {
    const product = getProductById(productId);
    if (product) {
      setSelectedProduct(product);
      setCurrentView('product');
      window.scrollTo(0, 0);
    }
  };

  const navigateToAbout = () => {
    setCurrentView('about');
    setSelectedCategory(null);
    setSelectedProduct(null);
    window.scrollTo(0, 0);
  };

  const navigateToCraft = () => {
    setCurrentView('craft');
    setSelectedCategory(null);
    setSelectedProduct(null);
    window.scrollTo(0, 0);
  };

  const goBack = () => {
    if (currentView === 'product' && selectedCategory) {
      setCurrentView('collection');
      setSelectedProduct(null);
    } else {
      navigateToHome();
    }
    window.scrollTo(0, 0);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => {
      const price = item.variant ? 
        parseFloat(item.variant.split(' — $')[1]) : 
        item.price;
      return total + (price * item.quantity);
    }, 0);
  };

  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <div className="min-h-screen bg-brand-ivory">
      <AnnouncementBar />
      
      <Header
        cartCount={getCartCount()}
        onCartClick={() => setIsCartOpen(true)}
        onLogoClick={navigateToHome}
        onAboutClick={navigateToAbout}
        onCraftClick={navigateToCraft}
        onMobileMenuClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      />

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-brand-sand"
          >
            <div className="px-4 py-3 space-y-2">
              <button
                onClick={navigateToAbout}
                className="block w-full text-left px-3 py-2 text-sm text-brand-brown hover:bg-brand-cream rounded"
              >
                About Us
              </button>
              <button
                onClick={navigateToCraft}
                className="block w-full text-left px-3 py-2 text-sm text-brand-brown hover:bg-brand-cream rounded"
              >
                Our Craft
              </button>
              <div className="border-t border-brand-sand pt-2">
                {['bonbons', 'king-cake', 'marshmallows', 'chocolate-barks', 'fruit-sculptures', 'nuts-creole-corn', 'pralines', 'chocolate-bars', 'bark-sticks', 'truffles', 'gift-boxes'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => navigateToCategory(cat)}
                    className="block w-full text-left px-3 py-2 text-xs uppercase tracking-wider text-brand-brown hover:bg-brand-cream rounded"
                  >
                    {cat === 'gift-boxes' ? '✦ Gift Boxes' : cat.replace('-', ' ')}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation Bar - Only show on home */}
      {currentView === 'home' && !isMobileMenuOpen && (
        <NavigationBar onCategoryClick={navigateToCategory} />
      )}

      {/* Main Content */}
      <main className="min-h-screen">
        <AnimatePresence mode="wait">
          {currentView === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <HomePage
                onCategoryClick={navigateToCategory}
                onProductClick={navigateToProduct}
                products={getAllProducts()}
              />
            </motion.div>
          )}

          {currentView === 'collection' && selectedCategory && (
            <motion.div
              key="collection"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <CollectionPage
                category={selectedCategory}
                products={getProductsByCategory(selectedCategory)}
                onProductClick={navigateToProduct}
                onBackClick={goBack}
              />
            </motion.div>
          )}

          {currentView === 'product' && selectedProduct && (
            <motion.div
              key="product"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <ProductDetailPage
                product={selectedProduct}
                onAddToCart={addToCart}
                onBackClick={goBack}
              />
            </motion.div>
          )}

          {currentView === 'about' && (
            <motion.div
              key="about"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <AboutUsPage />
            </motion.div>
          )}

          {currentView === 'craft' && (
            <motion.div
              key="craft"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <OurCraftPage />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Cart Drawer */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
              onClick={() => setIsCartOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-full md:w-[420px] bg-white shadow-xl z-50 overflow-y-auto"
            >
              <div className="sticky top-0 bg-white border-b border-brand-sand p-4 flex items-center justify-between">
                <h2 className="text-lg font-playfair font-bold text-brand-brown">Shopping Cart</h2>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="p-2 hover:bg-brand-cream rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-brand-brown" />
                </button>
              </div>

              {cart.length === 0 ? (
                <div className="p-8 text-center">
                  <div className="w-16 h-16 bg-brand-cream rounded-full mx-auto mb-4 flex items-center justify-center">
                    <ShoppingCart className="w-8 h-8 text-brand-muted" />
                  </div>
                  <h3 className="text-lg font-playfair text-brand-brown mb-2">Your cart is empty</h3>
                  <p className="text-brand-muted mb-6">Add some delicious chocolates to get started!</p>
                  <button
                    onClick={() => {
                      setIsCartOpen(false);
                      navigateToHome();
                    }}
                    className="btn-primary"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <>
                  <div className="p-4 space-y-4">
                    {cart.map((item, index) => (
                      <div key={`${item.id}-${item.variant}-${index}`} className="flex gap-4 p-3 bg-brand-cream rounded-lg">
                        <div className={`w-16 h-16 ${item.gradient} rounded-lg flex-shrink-0`}></div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-brand-brown truncate">{item.name}</h4>
                          <p className="text-sm text-brand-muted truncate">{item.subtitle}</p>
                          <p className="text-sm font-medium text-brand-gold">
                            ${item.variant ? 
                              parseFloat(item.variant.split(' — $')[1]).toFixed(2) : 
                              item.price.toFixed(2)}
                          </p>
                        </div>
                        <div className="flex flex-col items-end justify-between">
                          <button
                            onClick={() => removeFromCart(item.id, item.variant)}
                            className="p-1 hover:bg-brand-sand rounded transition-colors"
                          >
                            <X className="w-4 h-4 text-brand-muted" />
                          </button>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1, item.variant)}
                              className="w-6 h-6 bg-white border border-brand-sand rounded flex items-center justify-center hover:bg-brand-cream transition-colors"
                            >
                              <Minus className="w-3 h-3 text-brand-brown" />
                            </button>
                            <span className="w-8 text-center text-sm font-medium text-brand-brown">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1, item.variant)}
                              className="w-6 h-6 bg-white border border-brand-sand rounded flex items-center justify-center hover:bg-brand-cream transition-colors"
                            >
                              <Plus className="w-3 h-3 text-brand-brown" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="sticky bottom-0 bg-white border-t border-brand-sand p-4 space-y-3">
                    <div className="flex justify-between text-sm text-brand-muted">
                      <span>Free shipping $75+ · Gift wrapping included · Ships 24hrs</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-playfair font-bold text-brand-brown">Subtotal</span>
                      <span className="text-lg font-playfair font-bold text-brand-brown">
                        ${getCartTotal().toFixed(2)}
                      </span>
                    </div>
                    <button
                      onClick={() => showToast('Proceeding to checkout...')}
                      className="w-full btn-primary"
                    >
                      Proceed to Checkout
                    </button>
                    <button
                      onClick={() => setIsCartOpen(false)}
                      className="w-full border border-brand-brown text-brand-brown px-6 py-3 font-medium transition-all duration-300 hover:bg-brand-brown hover:text-white"
                    >
                      Continue Shopping
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-brand-brown text-white px-6 py-3 rounded-lg shadow-lg z-50 border-l-4 border-brand-gold"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
