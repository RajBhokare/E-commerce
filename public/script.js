// ============================================
// INDIAKART - COMPLETE FRONTEND JS
// ============================================

document.addEventListener("DOMContentLoaded", () => {

  // ==================== CART ====================
  let cart = JSON.parse(localStorage.getItem("indiakart_cart")) || [];

  function saveCart() {
    localStorage.setItem("indiakart_cart", JSON.stringify(cart));
  }

  function updateCartCount() {
    const badges = document.querySelectorAll(".cart-count");
    const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    badges.forEach(badge => {
      badge.textContent = totalItems;
      if (totalItems > 0) {
        badge.classList.add("show");
      } else {
        badge.classList.remove("show");
      }
    });
    saveCart();
  }

  function showToast(message, icon = "fa-check-circle") {
    let toast = document.getElementById("toast");
    if (!toast) {
      toast = document.createElement("div");
      toast.id = "toast";
      toast.className = "toast";
      document.body.appendChild(toast);
    }
    toast.innerHTML = `<i class="fas ${icon}"></i><span>${message}</span>`;
    toast.classList.add("show");
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => toast.classList.remove("show"), 3200);
  }

  function addToCart(name, price, image) {
    const existing = cart.find(item => item.name === name);
    if (existing) {
      existing.quantity = (existing.quantity || 1) + 1;
      showToast(`${name} qty updated (${existing.quantity})`);
    } else {
      cart.push({ id: Date.now(), name, price: Number(price), image, quantity: 1 });
      showToast(`${name} added to cart!`);
    }
    updateCartCount();
  }

  // Add to Cart buttons
  document.querySelectorAll(".add-to-cart-btn").forEach(btn => {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      addToCart(
        this.dataset.name,
        this.dataset.price,
        this.dataset.image
      );
      // Button animation
      this.style.transform = "scale(0.92)";
      setTimeout(() => this.style.transform = "", 180);
    });
  });

  // ==================== CART PAGE ====================
  const cartItemsEl = document.getElementById("cartItems");
  const emptyCartEl = document.getElementById("emptyCart");
  const cartItemCount = document.getElementById("cartItemCount");

  function renderCart() {
    if (!cartItemsEl) return;

    cartItemsEl.innerHTML = "";

    if (cart.length === 0) {
      if (emptyCartEl) emptyCartEl.style.display = "block";
      cartItemsEl.style.display = "none";
      updateSummary();
      return;
    }

    if (emptyCartEl) emptyCartEl.style.display = "none";
    cartItemsEl.style.display = "block";

    cart.forEach(item => {
      const div = document.createElement("div");
      div.className = "cart-item";
      div.dataset.id = item.id;
      div.innerHTML = `
        <img src="${item.image}" alt="${item.name}" class="cart-item-image" onerror="this.src='https://via.placeholder.com/80'">
        <div class="cart-item-info">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-price">₹${(item.price * (item.quantity || 1)).toLocaleString("en-IN")}</div>
          <div class="cart-item-controls">
            <div class="qty-controls">
              <button class="qty-btn minus-btn" data-id="${item.id}"><i class="fas fa-minus"></i></button>
              <span class="qty-value">${item.quantity || 1}</span>
              <button class="qty-btn plus-btn" data-id="${item.id}"><i class="fas fa-plus"></i></button>
            </div>
            <button class="remove-item-btn" data-id="${item.id}" title="Remove">
              <i class="fas fa-trash-alt"></i>
            </button>
          </div>
        </div>
      `;
      cartItemsEl.appendChild(div);
    });

    // Qty controls
    document.querySelectorAll(".plus-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = Number(btn.dataset.id);
        const item = cart.find(i => i.id === id);
        if (item) { item.quantity = (item.quantity || 1) + 1; updateCartCount(); renderCart(); }
      });
    });

    document.querySelectorAll(".minus-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = Number(btn.dataset.id);
        const idx = cart.findIndex(i => i.id === id);
        if (idx !== -1) {
          if ((cart[idx].quantity || 1) > 1) {
            cart[idx].quantity--;
          } else {
            cart.splice(idx, 1);
          }
          updateCartCount();
          renderCart();
        }
      });
    });

    document.querySelectorAll(".remove-item-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = Number(btn.dataset.id);
        cart = cart.filter(i => i.id !== id);
        updateCartCount();
        renderCart();
        showToast("Item removed from cart", "fa-trash-alt");
      });
    });

    if (cartItemCount) {
      const totalQty = cart.reduce((s, i) => s + (i.quantity || 1), 0);
      cartItemCount.textContent = totalQty;
    }

    updateSummary();
  }

  function updateSummary() {
    const subtotalEl = document.getElementById("subtotal");
    const shippingEl = document.getElementById("shipping");
    const taxEl = document.getElementById("tax");
    const totalEl = document.getElementById("total");

    if (!subtotalEl) return;

    const subtotal = cart.reduce((s, i) => s + i.price * (i.quantity || 1), 0);
    const shipping = subtotal > 499 ? 0 : 49;
    const tax = Math.round(subtotal * 0.18);
    const total = subtotal + shipping + tax;

    subtotalEl.textContent = `₹${subtotal.toLocaleString("en-IN")}`;
    shippingEl.textContent = shipping === 0 ? "Free" : `₹${shipping}`;
    taxEl.textContent = `₹${tax.toLocaleString("en-IN")}`;
    totalEl.textContent = `₹${total.toLocaleString("en-IN")}`;
  }

  // Clear cart
  const clearCartBtn = document.getElementById("clearCartBtn");
  if (clearCartBtn) {
    clearCartBtn.addEventListener("click", () => {
      if (confirm("Clear all items from cart?")) {
        cart = [];
        updateCartCount();
        renderCart();
        showToast("Cart cleared", "fa-trash");
      }
    });
  }

  // Checkout
  const checkoutBtn = document.getElementById("checkoutBtn");
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      if (cart.length === 0) {
        showToast("Your cart is empty!", "fa-exclamation-circle");
        return;
      }
      const modal = document.getElementById("checkoutModal");
      const orderNum = document.getElementById("orderNumber");
      if (orderNum) orderNum.textContent = Math.random().toString(36).substr(2, 8).toUpperCase();
      if (modal) {
        modal.classList.add("active");
        cart = [];
        updateCartCount();
        renderCart();
      }
    });
  }

  // Promo code
  const promoBtn = document.getElementById("promoBtn");
  if (promoBtn) {
    promoBtn.addEventListener("click", () => {
      const code = document.getElementById("promoInput")?.value.trim().toUpperCase();
      if (code === "INDIAKART10") {
        showToast("10% discount applied!", "fa-tag");
      } else if (code === "") {
        showToast("Please enter a promo code", "fa-exclamation-circle");
      } else {
        showToast("Invalid promo code", "fa-times-circle");
      }
    });
  }

  renderCart();

  // ==================== PRODUCT FILTERS ====================
  const searchInput = document.getElementById("searchInput");
  const categoryFilter = document.getElementById("categoryFilter");
  const sortSelect = document.getElementById("sortSelect");
  const noResults = document.getElementById("noResults");

  function filterProducts() {
    const search = searchInput?.value.toLowerCase() || "";
    const category = categoryFilter?.value || "all";
    const sortVal = sortSelect?.value || "default";

    const cards = Array.from(document.querySelectorAll(".product-card"));
    let visible = 0;

    cards.forEach(card => {
      const name = (card.dataset.name || "").toLowerCase();
      const cardCat = (card.dataset.category || "").toLowerCase();
      const matchSearch = name.includes(search);
      const matchCat = category === "all" || cardCat === category;

      if (matchSearch && matchCat) {
        card.style.display = "";
        visible++;
      } else {
        card.style.display = "none";
      }
    });

    if (noResults) noResults.style.display = visible === 0 ? "block" : "none";

    // Sorting
    if (sortVal !== "default") {
      const grid = document.getElementById("productsGrid");
      if (grid) {
        const visibleCards = cards.filter(c => c.style.display !== "none");
        visibleCards.sort((a, b) => {
          if (sortVal === "price-low") return Number(a.dataset.price) - Number(b.dataset.price);
          if (sortVal === "price-high") return Number(b.dataset.price) - Number(a.dataset.price);
          if (sortVal === "name") return a.dataset.name.localeCompare(b.dataset.name);
          return 0;
        });
        visibleCards.forEach(card => grid.appendChild(card));
      }
    }
  }

  if (searchInput) searchInput.addEventListener("input", filterProducts);
  if (categoryFilter) categoryFilter.addEventListener("change", filterProducts);
  if (sortSelect) sortSelect.addEventListener("change", filterProducts);

  // View Toggle
  document.querySelectorAll(".view-btn").forEach(btn => {
    btn.addEventListener("click", function () {
      document.querySelectorAll(".view-btn").forEach(b => b.classList.remove("active"));
      this.classList.add("active");
      const grid = document.getElementById("productsGrid");
      if (grid) {
        if (this.dataset.view === "list") grid.classList.add("list-view");
        else grid.classList.remove("list-view");
      }
    });
  });

  // ==================== HERO SLIDER ====================
  const slides = document.querySelectorAll(".hero-slide");
  const dots = document.querySelectorAll(".hero-dot");
  let currentSlide = 0;
  let slideTimer;

  function goToSlide(n) {
    slides[currentSlide]?.classList.remove("active");
    dots[currentSlide]?.classList.remove("active");
    currentSlide = (n + slides.length) % slides.length;
    slides[currentSlide]?.classList.add("active");
    dots[currentSlide]?.classList.add("active");
  }

  function startSlider() {
    clearInterval(slideTimer);
    slideTimer = setInterval(() => goToSlide(currentSlide + 1), 5000);
  }

  dots.forEach((dot, i) => {
    dot.addEventListener("click", () => { goToSlide(i); startSlider(); });
  });

  if (slides.length > 1) startSlider();

  // ==================== DEALS CAROUSEL ====================
  const track = document.querySelector(".deals-track");
  const prevBtn = document.querySelector(".nav-btn.prev");
  const nextBtn = document.querySelector(".nav-btn.next");
  let dealsPos = 0;
  const cardWidth = 186; // card width + gap

  if (prevBtn && track) {
    prevBtn.addEventListener("click", () => {
      dealsPos = Math.min(dealsPos + cardWidth, 0);
      track.style.transform = `translateX(${dealsPos}px)`;
    });
  }

  if (nextBtn && track) {
    const maxScroll = -(track.scrollWidth - track.parentElement.offsetWidth);
    nextBtn.addEventListener("click", () => {
      dealsPos = Math.max(dealsPos - cardWidth, maxScroll);
      track.style.transform = `translateX(${dealsPos}px)`;
    });
  }

  // ==================== MOBILE MENU ====================
  const toggle = document.getElementById("mobileMenuToggle");
  const navLinks = document.getElementById("navLinks");

  if (toggle && navLinks) {
    toggle.addEventListener("click", () => {
      navLinks.classList.toggle("open");
      const bars = toggle.querySelectorAll("span");
      if (navLinks.classList.contains("open")) {
        bars[0].style.transform = "rotate(45deg) translateY(7px)";
        bars[1].style.opacity = "0";
        bars[2].style.transform = "rotate(-45deg) translateY(-7px)";
      } else {
        bars.forEach(b => { b.style.transform = ""; b.style.opacity = ""; });
      }
    });

    // Close on link click
    navLinks.querySelectorAll("a").forEach(a => {
      a.addEventListener("click", () => {
        navLinks.classList.remove("open");
        toggle.querySelectorAll("span").forEach(b => { b.style.transform = ""; b.style.opacity = ""; });
      });
    });
  }

  // ==================== SCROLL TO TOP ====================
  const scrollBtn = document.getElementById("scrollToTop");

  if (scrollBtn) {
    window.addEventListener("scroll", () => {
      scrollBtn.classList.toggle("visible", window.scrollY > 400);
    });

    scrollBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // ==================== MODALS ====================
  function closeModal(modal) {
    if (modal) modal.classList.remove("active");
  }

  // Checkout modal close
  const modalClose = document.getElementById("modalClose");
  const continueShoppingBtn = document.getElementById("continueShoppingBtn");
  const checkoutModal = document.getElementById("checkoutModal");

  if (modalClose) modalClose.addEventListener("click", () => closeModal(checkoutModal));
  if (continueShoppingBtn) continueShoppingBtn.addEventListener("click", () => {
    closeModal(checkoutModal);
    window.location.href = "/products";
  });

  // Contact modal
  const successModal = document.getElementById("successModal");
  const modalCloseSuccess = document.getElementById("modalCloseSuccess");
  const closeSuccessBtn = document.getElementById("closeSuccessBtn");

  if (modalCloseSuccess) modalCloseSuccess.addEventListener("click", () => closeModal(successModal));
  if (closeSuccessBtn) closeSuccessBtn.addEventListener("click", () => closeModal(successModal));

  // Signup modal
  const signupSuccessModal = document.getElementById("signupSuccessModal");
  const modalCloseSignup = document.getElementById("modalCloseSignup");

  if (modalCloseSignup) modalCloseSignup.addEventListener("click", () => closeModal(signupSuccessModal));

  // Close modal on backdrop click
  document.querySelectorAll(".modal").forEach(modal => {
    modal.addEventListener("click", e => {
      if (e.target === modal) closeModal(modal);
    });
  });

  // ==================== CONTACT FORM ====================
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", e => {
      e.preventDefault();
      const modal = document.getElementById("successModal");
      if (modal) modal.classList.add("active");
      contactForm.reset();
    });
  }

  // ==================== SIGNUP FORM ====================
  const signupForm = document.getElementById("signupForm");

  // Password visibility toggles
  document.querySelectorAll(".password-toggle").forEach(btn => {
    btn.addEventListener("click", function () {
      const input = this.previousElementSibling;
      if (!input) return;
      const isPass = input.type === "password";
      input.type = isPass ? "text" : "password";
      this.querySelector("i").className = `fas ${isPass ? "fa-eye-slash" : "fa-eye"}`;
    });
  });

  // Password strength
  const passwordInput = document.getElementById("password");
  const strengthFill = document.querySelector(".strength-fill");
  const strengthText = document.querySelector(".strength-text");

  if (passwordInput && strengthFill) {
    passwordInput.addEventListener("input", function () {
      const val = this.value;
      let strength = 0;
      if (val.length >= 8) strength++;
      if (/[A-Z]/.test(val)) strength++;
      if (/[0-9]/.test(val)) strength++;
      if (/[^A-Za-z0-9]/.test(val)) strength++;

      const levels = [
        { width: "0%", color: "#e5e7eb", label: "" },
        { width: "25%", color: "#ef4444", label: "Weak" },
        { width: "50%", color: "#f59e0b", label: "Fair" },
        { width: "75%", color: "#3b82f6", label: "Good" },
        { width: "100%", color: "#16a34a", label: "Strong" },
      ];

      strengthFill.style.width = levels[strength].width;
      strengthFill.style.background = levels[strength].color;
      if (strengthText) strengthText.textContent = levels[strength].label;
    });
  }

  if (signupForm) {
    signupForm.addEventListener("submit", e => {
      e.preventDefault();
      let valid = true;

      // Name validation
      const nameVal = document.getElementById("fullName")?.value.trim();
      const nameError = document.getElementById("nameError");
      if (nameError) {
        if (!nameVal || nameVal.length < 2) {
          nameError.textContent = "Please enter your full name";
          valid = false;
        } else {
          nameError.textContent = "";
        }
      }

      // Email validation
      const emailVal = document.getElementById("email")?.value.trim();
      const emailError = document.getElementById("emailError");
      if (emailError) {
        if (!emailVal || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) {
          emailError.textContent = "Please enter a valid email address";
          valid = false;
        } else {
          emailError.textContent = "";
        }
      }

      // Password validation
      const passVal = document.getElementById("password")?.value;
      const passError = document.getElementById("passwordError");
      if (passError) {
        if (!passVal || passVal.length < 8) {
          passError.textContent = "Password must be at least 8 characters";
          valid = false;
        } else {
          passError.textContent = "";
        }
      }

      // Confirm password
      const confirmVal = document.getElementById("confirmPassword")?.value;
      const confirmError = document.getElementById("confirmPasswordError");
      if (confirmError) {
        if (confirmVal !== passVal) {
          confirmError.textContent = "Passwords do not match";
          valid = false;
        } else {
          confirmError.textContent = "";
        }
      }

      if (valid) {
        const modal = document.getElementById("signupSuccessModal");
        if (modal) modal.classList.add("active");
        signupForm.reset();
        if (strengthFill) { strengthFill.style.width = "0%"; }
        if (strengthText) { strengthText.textContent = ""; }
      }
    });
  }

  // ==================== QUICK VIEW ====================
  document.querySelectorAll(".quick-view-btn").forEach(btn => {
    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      const card = this.closest(".product-card");
      const name = card?.dataset.name || "Product";
      showToast(`Quick view: ${name}`, "fa-eye");
    });
  });

  // ==================== RECOMMENDED CARDS ====================
  document.querySelectorAll(".recommended-card .btn-small").forEach(btn => {
    btn.addEventListener("click", function () {
      const card = this.closest(".recommended-card");
      const name = card?.querySelector("h4")?.textContent || "Product";
      const priceText = card?.querySelector(".recommended-price")?.textContent || "₹0";
      const price = priceText.replace(/[₹,]/g, "");
      const img = card?.querySelector("img")?.src || "";
      addToCart(name, price, img);
    });
  });

  // ==================== INIT ====================
  updateCartCount();

  console.log("✅ IndiaKart Loaded Successfully");
});