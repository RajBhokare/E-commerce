// ============================================
// INDIAKART - EXPRESS SERVER
// ============================================

const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

// ================= VIEW ENGINE =================
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// ================= MIDDLEWARE =================
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ================= SAMPLE DATA =================
const products = [
  {
    id: 1,
    name: "iPhone 15 Pro Max",
    price: 159900,
    image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500&h=400&fit=crop",
    category: "electronics",
    rating: 4.8
  },
  {
    id: 2,
    name: "Nike Air Max 270",
    price: 12995,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=400&fit=crop",
    category: "fashion",
    rating: 4.5
  },
  {
    id: 3,
    name: "Smart LED TV 55-inch",
    price: 45999,
    image: "https://images.unsplash.com/photo-1593784991095-a205069470b6?w=500&h=400&fit=crop",
    category: "home",
    rating: 4.6
  },
  {
    id: 4,
    name: "Yoga Mat Premium",
    price: 2499,
    image: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500&h=400&fit=crop",
    category: "sports",
    rating: 4.4
  },
  {
    id: 5,
    name: "Sony WH-1000XM5",
    price: 29990,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=400&fit=crop",
    category: "electronics",
    rating: 4.9
  },
  {
    id: 6,
    name: "Levi's Slim Fit Jeans",
    price: 3499,
    image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=500&h=400&fit=crop",
    category: "fashion",
    rating: 4.3
  },
  {
    id: 7,
    name: "Adidas Ultraboost 22",
    price: 15999,
    image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=500&h=400&fit=crop",
    category: "sports",
    rating: 4.7
  },
  {
    id: 8,
    name: "Samsung Galaxy Tab S9",
    price: 74999,
    image: "https://images.unsplash.com/photo-1589739900266-43b2843f4c12?w=500&h=400&fit=crop",
    category: "electronics",
    rating: 4.6
  },
  {
    id: 9,
    name: "Instant Pot Duo 7-in-1",
    price: 8999,
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500&h=400&fit=crop",
    category: "home",
    rating: 4.5
  },
  {
    id: 10,
    name: "boAt Rockerz 450 Pro",
    price: 1799,
    image: "https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?w=500&h=400&fit=crop",
    category: "electronics",
    rating: 4.2
  },
];

// ================= ROUTES =================

// Home
app.get("/", (req, res) => {
  res.render("index", {
    title: "IndiaKart - Premium Shopping",
    currentPage: "home",
    featuredProducts: products.slice(0, 4)
  });
});

// Products
app.get("/products", (req, res) => {
  const { category } = req.query;
  let filteredProducts = products;
  if (category && category !== "all") {
    filteredProducts = products.filter(p => p.category === category);
  }
  res.render("products", {
    title: "Products - IndiaKart",
    currentPage: "products",
    products: filteredProducts
  });
});

// Cart
app.get("/cart", (req, res) => {
  res.render("cart", {
    title: "Cart - IndiaKart",
    currentPage: "cart"
  });
});

// About
app.get("/about", (req, res) => {
  res.render("about", {
    title: "About - IndiaKart",
    currentPage: "about"
  });
});

// Contact
app.get("/contact", (req, res) => {
  res.render("contact", {
    title: "Contact - IndiaKart",
    currentPage: "contact"
  });
});

// Signup
app.get("/signup", (req, res) => {
  res.render("signup", {
    title: "Sign Up - IndiaKart",
    currentPage: "signup"
  });
});

// ================= 404 =================
app.use((req, res) => {
  res.status(404).render("error", {
    title: "404 - Not Found",
    error: "Page Not Found",
    message: "The page you are looking for does not exist."
  });
});

// ================= START SERVER =================
app.listen(PORT, () => {
  console.log(`🚀 IndiaKart running at http://localhost:${PORT}`);
});