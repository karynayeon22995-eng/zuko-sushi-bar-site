/* Zuko Sushi Bar — online-order demo cart (runs on menu.html only) */
(function () {
  "use strict";
  var bar = document.getElementById("cartBar");
  if (!bar) return; // not the menu page

  var KEY = "zuko_cart";
  var barText = document.getElementById("cartBarText");
  var drawer = document.getElementById("cartDrawer");
  var backdrop = document.getElementById("cartBackdrop");
  var itemsEl = document.getElementById("cartItems");
  var subtotalEl = document.getElementById("cartSubtotal");
  var checkoutBtn = document.getElementById("cartCheckout");
  var clearBtn = document.getElementById("cartClear");
  var closeBtn = document.getElementById("cartClose");
  var footEl = drawer.querySelector(".cart-drawer__foot");
  var cart = load();

  function load() { try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) { return []; } }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(cart)); } catch (e) {} }
  function money(n) { return "$" + (Number.isInteger(n) ? n : n.toFixed(2)); }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#x27;" }[c]; }); }
  function find(name) { for (var i = 0; i < cart.length; i++) if (cart[i].name === name) return cart[i]; return null; }
  function totals() { var c = 0, s = 0; cart.forEach(function (i) { c += i.qty; s += i.qty * i.price; }); return { count: c, sum: s }; }

  function add(name, price) { var it = find(name); if (it) it.qty++; else cart.push({ name: name, price: price, qty: 1 }); save(); render(); }
  function changeQty(name, d) {
    var it = find(name); if (!it) return;
    it.qty += d;
    if (it.qty <= 0) cart = cart.filter(function (i) { return i.name !== name; });
    save(); render();
  }

  function render() {
    var t = totals();
    if (t.count > 0) { bar.classList.add("is-visible"); barText.textContent = "View Cart · " + t.count + " item" + (t.count > 1 ? "s" : "") + " · " + money(t.sum); }
    else { bar.classList.remove("is-visible"); }

    if (cart.length) {
      itemsEl.innerHTML = cart.map(function (i) {
        return '<div class="cart-item"><div class="cart-item__info">' +
          '<span class="cart-item__name">' + esc(i.name) + '</span>' +
          '<span class="cart-item__price">' + money(i.price) + ' each</span></div>' +
          '<div class="cart-item__qty">' +
          '<button type="button" class="qty-btn" data-dec="' + esc(i.name) + '" aria-label="Decrease">&minus;</button>' +
          '<span class="cart-item__n">' + i.qty + '</span>' +
          '<button type="button" class="qty-btn" data-inc="' + esc(i.name) + '" aria-label="Increase">+</button>' +
          '</div></div>';
      }).join("");
    } else {
      itemsEl.innerHTML = '<p class="cart-empty">Your cart is empty.<br>Tap + on a dish to add it.</p>';
    }
    subtotalEl.textContent = money(t.sum);
    checkoutBtn.disabled = cart.length === 0;
  }

  function openDrawer() { footEl.style.display = ""; render(); drawer.classList.add("is-open"); backdrop.classList.add("is-open"); document.body.classList.add("cart-open"); }
  function closeDrawer() { drawer.classList.remove("is-open"); backdrop.classList.remove("is-open"); document.body.classList.remove("cart-open"); }

  document.querySelectorAll(".add-btn").forEach(function (b) {
    b.addEventListener("click", function () {
      add(b.dataset.name, parseFloat(b.dataset.price));
      b.classList.add("added"); setTimeout(function () { b.classList.remove("added"); }, 450);
      if (window.gtag) gtag("event", "add_to_cart", { item_name: b.dataset.name });
    });
  });

  bar.addEventListener("click", openDrawer);
  backdrop.addEventListener("click", closeDrawer);
  closeBtn.addEventListener("click", closeDrawer);
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeDrawer(); });
  clearBtn.addEventListener("click", function () { cart = []; save(); render(); });
  itemsEl.addEventListener("click", function (e) {
    var dec = e.target.closest("[data-dec]"), inc = e.target.closest("[data-inc]");
    if (dec) changeQty(dec.getAttribute("data-dec"), -1);
    if (inc) changeQty(inc.getAttribute("data-inc"), 1);
  });

  checkoutBtn.addEventListener("click", function () {
    var t = totals(); if (t.count === 0) return;
    if (window.gtag) gtag("event", "begin_checkout", { value: t.sum });
    itemsEl.innerHTML = '<div class="cart-confirm"><div class="cart-confirm__check">✓</div>' +
      '<h3>Order received!</h3><p>' + t.count + ' item' + (t.count > 1 ? 's' : '') + ' · ' + money(t.sum) + '</p>' +
      '<p class="cart-confirm__note">This is a demo. Live online ordering will connect to our ordering platform for real pickup &amp; payment.</p></div>';
    footEl.style.display = "none";
    cart = []; save();
    setTimeout(function () { bar.classList.remove("is-visible"); }, 50);
  });

  render();
})();
