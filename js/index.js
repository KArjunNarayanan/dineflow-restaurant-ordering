let navMenu = document.getElementById("navMenu");
let menuBtn = document.getElementById("menuBtn");

menuBtn.addEventListener("click", () => {
    navMenu.classList.toggle("hidden");
    navMenu.classList.toggle("flex");
    
});

function updateNavbarCartCount() {
    const badge = document.getElementById("cartCountBadge");
    const countText = document.getElementById("cart-items-count");
    if (!badge || !countText) {
        return;
    }
    const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
    let totalCount = 0;
    cartItems.forEach(() => {
        totalCount ++;
    });
    countText.textContent = String(totalCount);
    if (totalCount > 0) {
        badge.classList.remove("hidden");
    } else {
        badge.classList.add("hidden");
    }
}
updateNavbarCartCount();



