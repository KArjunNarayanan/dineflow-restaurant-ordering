let navMenu = document.getElementById("navMenu");
let menuBtn = document.getElementById("menuBtn");
let bookBtn = document.getElementById("bookBtn");
let shoppingCart = document.getElementById("shopping-cart");
const badge = document.getElementById("cartCountBadge");
const GuestIcon = document.getElementById("GuestIcon");
const profileUser = document.querySelector(".profile-user");
const userInitials = document.getElementById("userInitials");
const userInitialsProfile = document.getElementById("userInitialsProfile");

const user = getLoggedInUser();

if (user) {
    let initials = user.name.trim().split(" ").map((word) => (word[0])).slice(0,2).join("").toUpperCase();
    userInitials.textContent = initials;
    if(userInitialsProfile !== null){
        userInitialsProfile.textContent = initials;
    }
    profileUser.classList.remove("hidden");
    GuestIcon.classList.add("hidden");
}else {
    profileUser.classList.add("hidden");
    GuestIcon.classList.remove("hidden");
}

function checkUserLogin() {
    const loggedInUser = getLoggedInUser();
    if (!loggedInUser) {
        const isInsidePagesFolder = window.location.pathname.includes("/pages/");
        window.location.href = isInsidePagesFolder ? "./auth.html" : "./pages/auth.html";
        return false;
    }
    return true;
}

shoppingCart.addEventListener("click",()=>{
    if(!checkUserLogin()){
        return;
    }
    const isInsidePagesFolder = window.location.pathname.includes("/pages/");
    window.location.href = isInsidePagesFolder ? "./cart.html" : "./pages/cart.html";
});

if(bookBtn){
    bookBtn.addEventListener("click",()=>{
        window.location.href = "./pages/about.html";
    });
}

menuBtn.addEventListener("click", () => {
    navMenu.classList.toggle("hidden");
    navMenu.classList.toggle("flex"); 
});

function updateNavbarCartCount() {
    const countText = document.getElementById("cart-items-count");
    if (!badge || !countText) {
        return;
    }
    const cartItems = getCartItems();
    let totalCount = 0;
    cartItems.forEach(() => {
        totalCount ++;
    });
    countText.textContent = totalCount;
    if (totalCount > 0) {
        badge.classList.remove("hidden");
    } else {
        badge.classList.add("hidden");
    }
}
updateNavbarCartCount();




