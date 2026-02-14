// ============================================
// INDIAKART - E-COMMERCE SERVER
// Professional Express.js Application
// ============================================

const express = require("express");
const path = require("path");

// Initialize Express Application
const app = express();

// ============================================
// CONFIGURATION
// ============================================

const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// View Engine Configuration
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// ============================================
// MIDDLEWARE
// ============================================

// Serve static files (CSS, JS, images)
app.use(express.static(path.join(__dirname, "public")));

// Parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware (development only)
if (NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
  });
}

// Security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

// ============================================
// DATA MODELS
// ============================================

// Expanded Product Database
const products = [
  // Electronics
  {
    id: 1,
    name: "iPhone 15 Pro Max",
    price: 159900,
    image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500",
    category: "electronics",
    description: "Latest flagship with titanium design and A17 Pro chip",
    rating: 4.8,
    stock: 25
  },
  {
    id: 2,
    name: "MacBook Air M3",
    price: 134900,
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500",
    category: "electronics",
    description: "Powerful, portable laptop with M3 chip",
    rating: 4.9,
    stock: 15
  },
  {
    id: 3,
    name: "iPad Pro 12.9-inch",
    price: 109900,
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500",
    category: "electronics",
    description: "Professional tablet with M2 chip and stunning display",
    rating: 4.7,
    stock: 20
  },
  {
    id: 4,
    name: "Samsung Galaxy S24 Ultra",
    price: 129999,
    image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500",
    category: "electronics",
    description: "Flagship Android with S Pen and AI features",
    rating: 4.6,
    stock: 30
  },
  {
    id: 5,
    name: "Sony WH-1000XM5",
    price: 29990,
    image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=500",
    category: "electronics",
    description: "Industry-leading noise cancellation headphones",
    rating: 4.8,
    stock: 40
  },
  {
    id: 6,
    name: "Dell XPS 15",
    price: 169999,
    image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500",
    category: "electronics",
    description: "Premium Windows laptop for creators",
    rating: 4.7,
    stock: 12
  },

  // Fashion
  {
    id: 7,
    name: "Nike Air Max 270",
    price: 12995,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500",
    category: "fashion",
    description: "Iconic sneakers with Max Air cushioning",
    rating: 4.5,
    stock: 50
  },
  {
    id: 8,
    name: "Levi's 501 Original Jeans",
    price: 3999,
    image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=500",
    category: "fashion",
    description: "Classic straight fit denim jeans",
    rating: 4.6,
    stock: 60
  },
  {
    id: 9,
    name: "Ray-Ban Aviator Sunglasses",
    price: 8990,
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500",
    category: "fashion",
    description: "Timeless style with UV protection",
    rating: 4.8,
    stock: 35
  },
  {
    id: 10,
    name: "Adidas Ultraboost 22",
    price: 16999,
    image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=500",
    category: "fashion",
    description: "Premium running shoes with Boost cushioning",
    rating: 4.7,
    stock: 45
  },

  // Home & Living
  {
    id: 11,
    name: "Smart LED TV 55-inch",
    price: 45999,
    image: "https://images.unsplash.com/photo-1593784991095-a205069470b6?w=500",
    category: "home",
    description: "4K Ultra HD Smart TV with HDR",
    rating: 4.5,
    stock: 18
  },
  {
    id: 12,
    name: "Coffee Maker Pro",
    price: 8999,
    image: "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=500",
    category: "home",
    description: "Programmable coffee maker with thermal carafe",
    rating: 4.4,
    stock: 25
  },
  {
    id: 13,
    name: "Robot Vacuum Cleaner",
    price: 24999,
    image: "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=500",
    category: "home",
    description: "Smart vacuum with mapping and app control",
    rating: 4.6,
    stock: 15
  },
  {
    id: 14,
    name: "Air Purifier",
    price: 15999,
    image: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=500",
    category: "home",
    description: "HEPA filter air purifier for large rooms",
    rating: 4.7,
    stock: 22
  },

  // Sports & Fitness
  {
    id: 15,
    name: "Yoga Mat Premium",
    price: 2499,
    image: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500",
    category: "sports",
    description: "Non-slip exercise mat with carrying strap",
    rating: 4.5,
    stock: 70
  },
  {
    id: 16,
    name: "Fitness Tracker Band",
    price: 4999,
    image: "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=500",
    category: "sports",
    description: "Track steps, heart rate, and sleep",
    rating: 4.3,
    stock: 55
  },
  {
    id: 17,
    name: "Adjustable Dumbbells Set",
    price: 12999,
    image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=500",
    category: "sports",
    description: "Space-saving adjustable weights 5-25kg",
    rating: 4.6,
    stock: 20
  },
  {
    id: 18,
    name: "Resistance Bands Set",
    price: 1499,
    image: "https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=500",
    category: "sports",
    description: "5 resistance levels for full-body workout",
    rating: 4.4,
    stock: 80
  },

  // Accessories
  {
    id: 19,
    name: "Apple Watch Series 9",
    price: 44900,
    image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500",
    category: "accessories",
    description: "Advanced smartwatch with health tracking",
    rating: 4.9,
    stock: 30
  },
  {
    id: 20,
    name: "Leather Wallet",
    price: 1999,
    image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=500",
    category: "accessories",
    description: "Genuine leather bifold wallet with RFID",
    rating: 4.5,
    stock: 100
  },
  {
    id: 21,
    name: "Wireless Earbuds Pro",
    price: 9999,
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500",
    category: "accessories",
    description: "True wireless with active noise cancellation",
    rating: 4.6,
    stock: 45
  },
  {
    id: 22,
    name: "Power Bank 20000mAh",
    price: 2499,
    image: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=500",
    category: "accessories",
    description: "Fast charging portable battery pack",
    rating: 4.4,
    stock: 65
  },
  {
    id: 23,
    name: "Laptop Backpack",
    price: 3499,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500",
    category: "accessories",
    description: "Water-resistant backpack with USB charging port",
    rating: 4.5,
    stock: 50
  },
  {
    id: 24,
    name: "Phone Case Premium",
    price: 1299,
    image: "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=500",
    category: "accessories",
    description: "Military-grade drop protection case",
    rating: 4.3,
    stock: 120
  }
];

// Category data for filtering
const categories = [
  { id: "all", name: "All Products", icon: "fa-th" },
  { id: "electronics", name: "Electronics", icon: "fa-laptop" },
  { id: "fashion", name: "Fashion", icon: "fa-tshirt" },
  { id: "home", name: "Home & Living", icon: "fa-home" },
  { id: "sports", name: "Sports & Fitness", icon: "fa-dumbbell" },
  { id: "accessories", name: "Accessories", icon: "fa-bag-shopping" }
];

// ============================================
// HELPER FUNCTIONS
// ============================================

// Get products by category
function getProductsByCategory(category) {
  if (category === 'all' || !category) {
    return products;
  }
  return products.filter(product => product.category === category);
}

// Get product by ID
function getProductById(id) {
  return products.find(product => product.id === parseInt(id));
}

// Get featured products (highest rated)
function getFeaturedProducts(limit = 4) {
  return products
    .sort((a, b) => b.rating - a.rating)
    .slice(0, limit);
}

// Calculate cart statistics
function calculateCartStats(cartItems) {
  const subtotal = cartItems.reduce((sum, item) => {
    const product = getProductById(item.id);
    return sum + (product ? product.price * item.quantity : 0);
  }, 0);
  
  const tax = subtotal * 0.18; // 18% GST
  const shipping = subtotal > 999 ? 0 : 50;
  const total = subtotal + tax + shipping;
  
  return { subtotal, tax, shipping, total };
}

// ============================================
// ROUTES
// ============================================

// Home Page
app.get("/", (req, res) => {
  try {
    const featuredProducts = getFeaturedProducts(4);
    res.render("index", {
      title: "IndiaKart - Premium E-Commerce",
      featuredProducts
    });
  } catch (error) {
    console.error("Error rendering home page:", error);
    res.status(500).render("error", { 
      error: "Unable to load home page",
      message: error.message 
    });
  }
});

// Products Page
app.get("/products", (req, res) => {
  try {
    const { category, sort, search } = req.query;
    let filteredProducts = getProductsByCategory(category);
    
    // Search filter
    if (search) {
      filteredProducts = filteredProducts.filter(product =>
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.description.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    // Sorting
    if (sort === 'price-low') {
      filteredProducts.sort((a, b) => a.price - b.price);
    } else if (sort === 'price-high') {
      filteredProducts.sort((a, b) => b.price - a.price);
    } else if (sort === 'name') {
      filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sort === 'rating') {
      filteredProducts.sort((a, b) => b.rating - a.rating);
    }
    
    res.render("products", {
      title: "Products - IndiaKart",
      products: filteredProducts,
      categories,
      currentCategory: category || 'all',
      currentSort: sort || 'default',
      searchQuery: search || ''
    });
  } catch (error) {
    console.error("Error rendering products page:", error);
    res.status(500).render("error", { 
      error: "Unable to load products",
      message: error.message 
    });
  }
});

// Product Detail Page (Optional - for future enhancement)
app.get("/product/:id", (req, res) => {
  try {
    const product = getProductById(req.params.id);
    
    if (!product) {
      return res.status(404).render("error", {
        error: "Product not found",
        message: "The product you're looking for doesn't exist"
      });
    }
    
    // Get related products from same category
    const relatedProducts = products
      .filter(p => p.category === product.category && p.id !== product.id)
      .slice(0, 4);
    
    res.render("product-detail", {
      title: `${product.name} - IndiaKart`,
      product,
      relatedProducts
    });
  } catch (error) {
    console.error("Error rendering product detail:", error);
    res.status(500).render("error", { 
      error: "Unable to load product details",
      message: error.message 
    });
  }
});

// Cart Page
app.get("/cart", (req, res) => {
  try {
    res.render("cart", {
      title: "Shopping Cart - IndiaKart"
    });
  } catch (error) {
    console.error("Error rendering cart page:", error);
    res.status(500).render("error", { 
      error: "Unable to load cart",
      message: error.message 
    });
  }
});

// About Page
app.get("/about", (req, res) => {
  try {
    res.render("about", {
      title: "About Us - IndiaKart"
    });
  } catch (error) {
    console.error("Error rendering about page:", error);
    res.status(500).render("error", { 
      error: "Unable to load about page",
      message: error.message 
    });
  }
});

// Contact Page
app.get("/contact", (req, res) => {
  try {
    res.render("contact", {
      title: "Contact Us - IndiaKart"
    });
  } catch (error) {
    console.error("Error rendering contact page:", error);
    res.status(500).render("error", { 
      error: "Unable to load contact page",
      message: error.message 
    });
  }
});

// Signup Page
app.get("/signup", (req, res) => {
  try {
    res.render("signup", {
      title: "Sign Up - IndiaKart"
    });
  } catch (error) {
    console.error("Error rendering signup page:", error);
    res.status(500).render("error", { 
      error: "Unable to load signup page",
      message: error.message 
    });
  }
});

// Login Page (Optional - for future enhancement)
app.get("/login", (req, res) => {
  try {
    res.render("login", {
      title: "Login - IndiaKart"
    });
  } catch (error) {
    console.error("Error rendering login page:", error);
    res.status(500).render("error", { 
      error: "Unable to load login page",
      message: error.message 
    });
  }
});

// ============================================
// API ROUTES (for AJAX requests)
// ============================================

// Get all products (JSON)
app.get("/api/products", (req, res) => {
  try {
    res.json({
      success: true,
      count: products.length,
      products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get single product (JSON)
app.get("/api/products/:id", (req, res) => {
  try {
    const product = getProductById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        error: "Product not found"
      });
    }
    
    res.json({
      success: true,
      product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Contact form submission
app.post("/api/contact", (req, res) => {
  try {
    const { firstName, lastName, email, phone, subject, message } = req.body;
    
    // Validation
    if (!firstName || !lastName || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        error: "All required fields must be filled"
      });
    }
    
    // In a real application, you would:
    // 1. Validate email format
    // 2. Save to database
    // 3. Send email notification
    // 4. Send confirmation email to user
    
    console.log("Contact form submission:", {
      firstName,
      lastName,
      email,
      phone,
      subject,
      message,
      timestamp: new Date().toISOString()
    });
    
    res.json({
      success: true,
      message: "Your message has been received. We'll get back to you soon!"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Newsletter subscription
app.post("/api/newsletter", (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email || !email.includes('@')) {
      return res.status(400).json({
        success: false,
        error: "Valid email is required"
      });
    }
    
    // In a real application, save to database
    console.log("Newsletter subscription:", email);
    
    res.json({
      success: true,
      message: "Successfully subscribed to newsletter!"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ============================================
// ERROR HANDLING
// ============================================

// 404 Handler - Must be after all other routes
app.use((req, res) => {
  res.status(404).render("error", {
    title: "404 - Page Not Found",
    error: "Page Not Found",
    message: `The page "${req.url}" you're looking for doesn't exist.`
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  
  res.status(err.status || 500).render("error", {
    title: "Error - IndiaKart",
    error: NODE_ENV === 'development' ? err.message : "Something went wrong",
    message: NODE_ENV === 'development' ? err.stack : "Please try again later"
  });
});

// ============================================
// SERVER INITIALIZATION
// ============================================

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

// Start Server
const server = app.listen(PORT, () => {
  console.log("\n" + "=".repeat(50));
  console.log("🛍️  IndiaKart E-Commerce Platform");
  console.log("=".repeat(50));
  console.log(`🚀 Server running on: http://localhost:${PORT}`);
  console.log(`📦 Environment: ${NODE_ENV}`);
  console.log(`📊 Total Products: ${products.length}`);
  console.log(`📁 Categories: ${categories.length}`);
  console.log("=".repeat(50) + "\n");
  
  if (NODE_ENV === 'development') {
    console.log("📍 Available Routes:");
    console.log("   GET  /                - Homepage");
    console.log("   GET  /products        - Products listing");
    console.log("   GET  /product/:id     - Product details");
    console.log("   GET  /cart            - Shopping cart");
    console.log("   GET  /about           - About page");
    console.log("   GET  /contact         - Contact page");
    console.log("   GET  /signup          - Signup page");
    console.log("   GET  /api/products    - Products API");
    console.log("   POST /api/contact     - Contact form API");
    console.log("   POST /api/newsletter  - Newsletter API");
    console.log("\n" + "=".repeat(50) + "\n");
  }
});

// Export for testing
module.exports = app;