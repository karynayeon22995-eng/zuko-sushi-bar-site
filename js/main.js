/* ============================================================
   Zuko Sushi Bar — main.js
   ============================================================ */

/* >>> CẤU HÌNH ĐẶT HÀNG ONLINE <<<
   Dán link trang đặt hàng (MealKeyway / MenuSifu / Square...) vào đây.
   - Có link (https://...): mọi nút "Order" sẽ mở trang đó ở tab mới + bắn event tracking.
   - Để trống (""): các nút giữ hành vi cuộn nội bộ như thiết kế gốc.
   Nhớ cập nhật cả "potentialAction" trong JSON-LD ở index.html. */
const ORDER_URL = "";

document.addEventListener("DOMContentLoaded", function () {
  // --- Mobile nav toggle ---
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    // đóng menu sau khi chọn 1 mục
    nav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // --- Order CTAs: link-out khi đã cấu hình ORDER_URL ---
  var isExternal = /^https?:\/\//i.test(ORDER_URL);
  document.querySelectorAll("[data-order]").forEach(function (el) {
    if (isExternal) {
      el.setAttribute("href", ORDER_URL);
      el.setAttribute("target", "_blank");
      el.setAttribute("rel", "noopener");
    }
    el.addEventListener("click", function () {
      // Đo chuyển đổi — an toàn nếu chưa gắn GA4 / Meta Pixel
      if (window.gtag) gtag("event", "order_click", { location: el.dataset.order });
      if (window.fbq) fbq("track", "InitiateCheckout");
    });
  });
});
