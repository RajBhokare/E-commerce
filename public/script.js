// ============================================
// INDIAKART - Enhanced JavaScript
// ============================================

document.addEventListener("DOMContentLoaded", () => {
  
  // ============================================
  // CART MANAGEMENT
  // ============================================
  
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  
  // Update cart count in navbar
  function updateCartCount() {
    const cartBadge = document.getElementById("cartBadge");
    const cartCount = document.querySelector(".cart-count");
    
    if (cartBadge) {
      cartBadge.textContent = cart.length;
      cartBadge.style.display = cart.length > 0 ? "flex" : "none";
    }
    
    if (cartCount) {
      cartCount.textContent = cart.length;
    }
    
    localStorage.setItem("cart", JSON.stringify(cart));
  }
  
  // Add to cart functionality
  function addToCart(name, price, image) {
    const item = {
      id: Date.now(),
      name: name,
      price: parseFloat(price),
      image: image,
      quantity: 1
    };
    
    cart.push(item);
    updateCartCount();
    showToast("Product added to cart!");
    return item;
  }
  
  // Remove from cart
  function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateCartCount();
    renderCart();
    showToast("Product removed from cart");
  }
  
  // Update quantity
  function updateQuantity(id, change) {
    const item = cart.find(item => item.id === id);
    if (item) {
      item.quantity = Math.max(1, item.quantity + change);
      updateCartCount();
      renderCart();
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }
  
  // Clear cart
  function clearCart() {
    if (confirm("Are you sure you want to clear your cart?")) {
      cart = [];
      updateCartCount();
      renderCart();
      showToast("Cart cleared");
    }
  }
  
  // Calculate totals
  function calculateTotals() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.18;
    const shipping = subtotal > 999 ? 0 : 50;
    const total = subtotal + tax + shipping;
    
    return { subtotal, tax, shipping, total };
  }
  
  // Render cart items
  function renderCart() {
    const cartItemsContainer = document.getElementById("cartItems");
    const emptyCart = document.getElementById("emptyCart");
    const cartItemCount = document.getElementById("cartItemCount");
    
    if (!cartItemsContainer) return;
    
    if (cart.length === 0) {
      cartItemsContainer.style.display = "none";
      emptyCart.style.display = "flex";
      if (cartItemCount) cartItemCount.textContent = "0";
      updateCartSummary();
      return;
    }
    
    cartItemsContainer.style.display = "block";
    emptyCart.style.display = "none";
    if (cartItemCount) cartItemCount.textContent = cart.length;
    
    cartItemsContainer.innerHTML = cart.map(item => `
      <div class="cart-item" data-id="${item.id}">
        <div class="cart-item-image">
          <img src="${item.image}" alt="${item.name}">
        </div>
        <div class="cart-item-details">
          <h3 class="cart-item-name">${item.name}</h3>
          <p class="cart-item-price">₹${item.price.toLocaleString()}</p>
        </div>
        <div class="cart-item-quantity">
          <button class="quantity-btn minus" data-id="${item.id}">
            <i class="fas fa-minus"></i>
          </button>
          <span class="quantity-value">${item.quantity}</span>
          <button class="quantity-btn plus" data-id="${item.id}">
            <i class="fas fa-plus"></i>
          </button>
        </div>
        <div class="cart-item-total">
          <p class="item-total-price">₹${(item.price * item.quantity).toLocaleString()}</p>
        </div>
        <button class="cart-item-remove" data-id="${item.id}">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    `).join("");
    
    // Attach event listeners
    document.querySelectorAll(".quantity-btn.plus").forEach(btn => {
      btn.addEventListener("click", () => updateQuantity(parseInt(btn.dataset.id), 1));
    });
    
    document.querySelectorAll(".quantity-btn.minus").forEach(btn => {
      btn.addEventListener("click", () => updateQuantity(parseInt(btn.dataset.id), -1));
    });
    
    document.querySelectorAll(".cart-item-remove").forEach(btn => {
      btn.addEventListener("click", () => removeFromCart(parseInt(btn.dataset.id)));
    });
    
    updateCartSummary();
  }
  
  // Update cart summary
  function updateCartSummary() {
    const { subtotal, tax, shipping, total } = calculateTotals();
    
    const subtotalEl = document.getElementById("subtotal");
    const taxEl = document.getElementById("tax");
    const shippingEl = document.getElementById("shipping");
    const totalEl = document.getElementById("total");
    
    if (subtotalEl) subtotalEl.textContent = `₹${subtotal.toLocaleString()}`;
    if (taxEl) taxEl.textContent = `₹${tax.toLocaleString()}`;
    if (shippingEl) shippingEl.textContent = shipping === 0 ? "Free" : `₹${shipping}`;
    if (totalEl) totalEl.textContent = `₹${total.toLocaleString()}`;
  }
  
  // Toast notification
  function showToast(message) {
    const toast = document.getElementById("toast");
    if (!toast) return;
    
    toast.querySelector("span").textContent = message;
    toast.classList.add("show");
    
    setTimeout(() => {
      toast.classList.remove("show");
    }, 3000);
  }
  
  // Initialize cart
  updateCartCount();
  renderCart();
  
  // ============================================
  // PRODUCT PAGE FUNCTIONALITY
  // ============================================
  
  // Add to cart buttons
  document.querySelectorAll(".add-to-cart-btn").forEach(btn => {
    btn.addEventListener("click", function() {
      const name = this.dataset.name;
      const price = this.dataset.price;
      const image = this.dataset.image;
      
      addToCart(name, price, image);
      
      // Button feedback
      const originalContent = this.innerHTML;
      this.innerHTML = '<i class="fas fa-check"></i><span>Added!</span>';
      this.classList.add("added");
      
      setTimeout(() => {
        this.innerHTML = originalContent;
        this.classList.remove("added");
      }, 2000);
    });
  });
  
  // Product search and filter
  const searchInput = document.getElementById("searchInput");
  const categoryFilter = document.getElementById("categoryFilter");
  const sortSelect = document.getElementById("sortSelect");
  const productsGrid = document.getElementById("productsGrid");
  const noResults = document.getElementById("noResults");
  
  function filterAndSortProducts() {
    if (!productsGrid) return;
    
    const searchTerm = searchInput ? searchInput.value.toLowerCase() : "";
    const category = categoryFilter ? categoryFilter.value : "all";
    const sortBy = sortSelect ? sortSelect.value : "default";
    
    const products = Array.from(productsGrid.querySelectorAll(".product-card"));
    let visibleCount = 0;
    
    // Filter products
    products.forEach(product => {
      const name = product.dataset.name || "";
      const matchesSearch = name.includes(searchTerm);
      const matchesCategory = category === "all" || product.dataset.category === category;
      
      if (matchesSearch && matchesCategory) {
        product.style.display = "block";
        visibleCount++;
      } else {
        product.style.display = "none";
      }
    });
    
    // Sort products
    if (sortBy !== "default") {
      const visibleProducts = products.filter(p => p.style.display !== "none");
      
      visibleProducts.sort((a, b) => {
        if (sortBy === "price-low") {
          return parseFloat(a.dataset.price) - parseFloat(b.dataset.price);
        } else if (sortBy === "price-high") {
          return parseFloat(b.dataset.price) - parseFloat(a.dataset.price);
        } else if (sortBy === "name") {
          return a.dataset.name.localeCompare(b.dataset.name);
        }
        return 0;
      });
      
      visibleProducts.forEach(product => productsGrid.appendChild(product));
    }
    
    // Show/hide no results message
    if (noResults) {
      noResults.style.display = visibleCount === 0 ? "flex" : "none";
    }
  }
  
  if (searchInput) {
    searchInput.addEventListener("input", filterAndSortProducts);
  }
  
  if (categoryFilter) {
    categoryFilter.addEventListener("change", filterAndSortProducts);
  }
  
  if (sortSelect) {
    sortSelect.addEventListener("change", filterAndSortProducts);
  }
  
  // View toggle (grid/list)
  const viewBtns = document.querySelectorAll(".view-btn");
  viewBtns.forEach(btn => {
    btn.addEventListener("click", function() {
      viewBtns.forEach(b => b.classList.remove("active"));
      this.classList.add("active");
      
      const view = this.dataset.view;
      if (productsGrid) {
        productsGrid.className = view === "list" ? "products-list" : "products-grid";
      }
    });
  });
  
  // ============================================
  // CART PAGE FUNCTIONALITY
  // ============================================
  
  const clearCartBtn = document.getElementById("clearCartBtn");
  if (clearCartBtn) {
    clearCartBtn.addEventListener("click", clearCart);
  }
  
  // Checkout functionality
  const checkoutBtn = document.getElementById("checkoutBtn");
  const checkoutModal = document.getElementById("checkoutModal");
  const modalClose = document.getElementById("modalClose");
  const continueShoppingBtn = document.getElementById("continueShoppingBtn");
  
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      if (cart.length === 0) {
        showToast("Your cart is empty!");
        return;
      }
      
      const orderNumber = Math.floor(Math.random() * 1000000);
      document.getElementById("orderNumber").textContent = orderNumber;
      
      checkoutModal.classList.add("show");
      
      // Clear cart after checkout
      setTimeout(() => {
        cart = [];
        updateCartCount();
        renderCart();
        localStorage.setItem("cart", JSON.stringify(cart));
      }, 1000);
    });
  }
  
  if (modalClose) {
    modalClose.addEventListener("click", () => {
      checkoutModal.classList.remove("show");
    });
  }
  
  if (continueShoppingBtn) {
    continueShoppingBtn.addEventListener("click", () => {
      window.location.href = "/products";
    });
  }
  
  // Promo code
  const promoBtn = document.getElementById("promoBtn");
  const promoInput = document.getElementById("promoInput");
  
  if (promoBtn) {
    promoBtn.addEventListener("click", () => {
      const code = promoInput.value.trim().toUpperCase();
      
      if (code === "SAVE10") {
        showToast("Promo code applied! 10% discount");
      } else if (code === "") {
        showToast("Please enter a promo code");
      } else {
        showToast("Invalid promo code");
      }
    });
  }
  
  // ============================================
  // MOBILE MENU
  // ============================================
  
  const mobileMenuToggle = document.getElementById("mobileMenuToggle");
  const navLinks = document.getElementById("navLinks");
  const mobileMenuOverlay = document.getElementById("mobileMenuOverlay");
  
  function toggleMobileMenu() {
    mobileMenuToggle.classList.toggle("active");
    navLinks.classList.toggle("active");
    mobileMenuOverlay.classList.toggle("active");
    document.body.style.overflow = navLinks.classList.contains("active") ? "hidden" : "";
  }
  
  if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener("click", toggleMobileMenu);
  }
  
  if (mobileMenuOverlay) {
    mobileMenuOverlay.addEventListener("click", toggleMobileMenu);
  }
  
  // Close mobile menu when clicking a link
  document.querySelectorAll(".nav-link").forEach(link => {
    link.addEventListener("click", () => {
      if (navLinks.classList.contains("active")) {
        toggleMobileMenu();
      }
    });
  });
  
  // ============================================
  // SCROLL TO TOP
  // ============================================
  
  const scrollToTopBtn = document.getElementById("scrollToTop");
  
  window.addEventListener("scroll", () => {
    if (scrollToTopBtn) {
      if (window.scrollY > 300) {
        scrollToTopBtn.classList.add("show");
      } else {
        scrollToTopBtn.classList.remove("show");
      }
    }
  });
  
  if (scrollToTopBtn) {
    scrollToTopBtn.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    });
  }
  
  // ============================================
  // CONTACT FORM
  // ============================================
  
  const contactForm = document.getElementById("contactForm");
  const successModal = document.getElementById("successModal");
  const modalCloseSuccess = document.getElementById("modalCloseSuccess");
  const closeSuccessBtn = document.getElementById("closeSuccessBtn");
  
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      
      // Show success modal
      successModal.classList.add("show");
      
      // Reset form
      contactForm.reset();
    });
  }
  
  if (modalCloseSuccess) {
    modalCloseSuccess.addEventListener("click", () => {
      successModal.classList.remove("show");
    });
  }
  
  if (closeSuccessBtn) {
    closeSuccessBtn.addEventListener("click", () => {
      successModal.classList.remove("show");
    });
  }
  
  // ============================================
  // SIGNUP FORM
  // ============================================
  
  const signupForm = document.getElementById("signupForm");
  const passwordInput = document.getElementById("password");
  const confirmPasswordInput = document.getElementById("confirmPassword");
  const togglePassword = document.getElementById("togglePassword");
  const toggleConfirmPassword = document.getElementById("toggleConfirmPassword");
  const signupSuccessModal = document.getElementById("signupSuccessModal");
  const modalCloseSignup = document.getElementById("modalCloseSignup");
  
  // Password strength checker
  function checkPasswordStrength(password) {
    let strength = 0;
    
    if (password.length >= 8) strength++;
    if (password.match(/[a-z]/)) strength++;
    if (password.match(/[A-Z]/)) strength++;
    if (password.match(/[0-9]/)) strength++;
    if (password.match(/[^a-zA-Z0-9]/)) strength++;
    
    return strength;
  }
  
  if (passwordInput) {
    passwordInput.addEventListener("input", () => {
      const strength = checkPasswordStrength(passwordInput.value);
      const strengthBar = document.querySelector(".strength-fill");
      const strengthText = document.querySelector(".strength-text");
      
      if (strengthBar && strengthText) {
        const percentage = (strength / 5) * 100;
        strengthBar.style.width = `${percentage}%`;
        
        if (strength <= 2) {
          strengthBar.style.background = "#ef4444";
          strengthText.textContent = "Weak";
          strengthText.style.color = "#ef4444";
        } else if (strength <= 3) {
          strengthBar.style.background = "#f59e0b";
          strengthText.textContent = "Fair";
          strengthText.style.color = "#f59e0b";
        } else if (strength <= 4) {
          strengthBar.style.background = "#10b981";
          strengthText.textContent = "Good";
          strengthText.style.color = "#10b981";
        } else {
          strengthBar.style.background = "#059669";
          strengthText.textContent = "Strong";
          strengthText.style.color = "#059669";
        }
      }
    });
  }
  
  // Toggle password visibility
  if (togglePassword) {
    togglePassword.addEventListener("click", () => {
      const type = passwordInput.type === "password" ? "text" : "password";
      passwordInput.type = type;
      togglePassword.querySelector("i").classList.toggle("fa-eye");
      togglePassword.querySelector("i").classList.toggle("fa-eye-slash");
    });
  }
  
  if (toggleConfirmPassword) {
    toggleConfirmPassword.addEventListener("click", () => {
      const type = confirmPasswordInput.type === "password" ? "text" : "password";
      confirmPasswordInput.type = type;
      toggleConfirmPassword.querySelector("i").classList.toggle("fa-eye");
      toggleConfirmPassword.querySelector("i").classList.toggle("fa-eye-slash");
    });
  }
  
  // Signup form validation
  if (signupForm) {
    signupForm.addEventListener("submit", (e) => {
      e.preventDefault();
      
      let isValid = true;
      
      // Validate password match
      if (passwordInput.value !== confirmPasswordInput.value) {
        document.getElementById("confirmPasswordError").textContent = "Passwords do not match";
        isValid = false;
      } else {
        document.getElementById("confirmPasswordError").textContent = "";
      }
      
      // Validate password strength
      if (checkPasswordStrength(passwordInput.value) < 3) {
        document.getElementById("passwordError").textContent = "Password is too weak";
        isValid = false;
      } else {
        document.getElementById("passwordError").textContent = "";
      }
      
      if (isValid) {
        signupSuccessModal.classList.add("show");
        signupForm.reset();
      }
    });
  }
  
  if (modalCloseSignup) {
    modalCloseSignup.addEventListener("click", () => {
      signupSuccessModal.classList.remove("show");
    });
  }
  
  // ============================================
  // STATS COUNTER ANIMATION
  // ============================================
  
  const statNumbers = document.querySelectorAll(".stat-number");
  
  function animateCounter(element) {
    const target = parseInt(element.dataset.target);
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;
    
    const updateCounter = () => {
      current += increment;
      if (current < target) {
        element.textContent = Math.floor(current).toLocaleString();
        requestAnimationFrame(updateCounter);
      } else {
        element.textContent = target.toLocaleString() + (element.textContent.includes("%") ? "%" : "+");
      }
    };
    
    updateCounter();
  }
  
  // Intersection Observer for stats
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        statsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  
  statNumbers.forEach(stat => {
    statsObserver.observe(stat);
  });
  
  // ============================================
  // SMOOTH SCROLL FOR ANCHOR LINKS
  // ============================================
  
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }
    });
  });
  
  // ============================================
  // NAVBAR SCROLL EFFECT
  // ============================================
  
  const navbar = document.querySelector(".navbar");
  let lastScroll = 0;
  
  window.addEventListener("scroll", () => {
    const currentScroll = window.scrollY;
    
    if (navbar) {
      if (currentScroll > 100) {
        navbar.classList.add("scrolled");
      } else {
        navbar.classList.remove("scrolled");
      }
    }
    
    lastScroll = currentScroll;
  });
  
  // ============================================
  // LAZY LOADING IMAGES
  // ============================================
  
  const images = document.querySelectorAll("img[data-src]");
  
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.removeAttribute("data-src");
        imageObserver.unobserve(img);
      }
    });
  });
  
  images.forEach(img => {
    imageObserver.observe(img);
  });
  
  // ============================================
  // NEWSLETTER FORM
  // ============================================
  
  const newsletterForm = document.querySelector(".newsletter-form");
  const newsletterBtn = document.querySelector(".newsletter-btn");
  const newsletterInput = document.querySelector(".newsletter-input");
  
  if (newsletterBtn) {
    newsletterBtn.addEventListener("click", (e) => {
      e.preventDefault();
      
      if (newsletterInput && newsletterInput.value.trim() !== "") {
        showToast("Thank you for subscribing!");
        newsletterInput.value = "";
      } else {
        showToast("Please enter a valid email");
      }
    });
  }
  
  // ============================================
  // ADD ANIMATIONS ON SCROLL
  // ============================================
  
  const animateOnScroll = () => {
    const elements = document.querySelectorAll(".feature-card, .category-card, .testimonial-card, .value-card");
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
        }
      });
    }, { threshold: 0.1 });
    
    elements.forEach(el => {
      el.style.opacity = "0";
      el.style.transform = "translateY(30px)";
      el.style.transition = "all 0.6s ease";
      observer.observe(el);
    });
  };
  
  animateOnScroll();
  
  console.log("🎉 IndiaKart initialized successfully!");
});