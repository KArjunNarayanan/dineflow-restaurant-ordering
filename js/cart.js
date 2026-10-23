let cartContainer = document.getElementById("cart-container");
let checkoutBtn = document.getElementById("checkoutBtn");
let cartCount = document.getElementById("cartCount");
let cartCountBadge = document.getElementById("cartCountBadge");
let cartItemsCount = document.getElementById("cart-items-count");

let orderSummary = document.getElementById("order-summary");
let cartSubtotal = document.getElementById("cart-subtotal");
let totalPriceCart = document.getElementById("cart-total");


function getCartItems(){
    return JSON.parse(localStorage.getItem("cart")) || [];
}
function saveCartItems(cartItems){
    localStorage.setItem("cart", JSON.stringify(cartItems));
}

let cartItems = getCartItems();

function updateCartCount() {
    let totalCount = 0;
    let badgeCount = 0;
    cartItems.forEach((item) => {
        totalCount += Number(item.quantity);
        badgeCount++;
    });
    cartCount.textContent = String(totalCount);
    cartItemsCount.textContent = String(badgeCount);

    if (totalCount > 0) {
        cartCountBadge.classList.remove("hidden");
        cartItemsCount.textContent = String(badgeCount);
    } else {
        cartCountBadge.classList.add("hidden");
    }
}
function updateCartTotals() {
    let subtotal = 0;
    cartItems.forEach(function(item) {
        subtotal += Number(item.price) * Number(item.quantity);
    });
    let deliveryCharge = 40;
    let total = subtotal + deliveryCharge;
    cartSubtotal.textContent = `₹${subtotal}`;
    totalPriceCart.textContent = `₹${total}`;
}
function createCartCard(item){
    const cartCard = document.createElement("div");
    cartCard.className = "flex flex-col md:flex-row md:items-center gap-5 md:gap-4  p-4 border-b border-slate-100 justify-between bg-white";

    const leftDiv =document.createElement("div");
    leftDiv.className = "flex items-center gap-4";

    const imageContainer = document.createElement("div");
    imageContainer.className = "flex shrink-0 rounded-lg size-24   overflow-hidden";

    const image = document.createElement("img");
    image.className = "size-full object-cover";
    image.src = item.image;
    image.alt = item.name;
    imageContainer.appendChild(image);

    const cardDetails = document.createElement("div");
    cardDetails.className = "flex flex-col gap-1";

    const cardTitle = document.createElement("div");
    cardTitle.className = "flex items-center gap-2 flex-wrap";

    const titleName = document.createElement("p");
    titleName.textContent = item.name;
    titleName.className = "font-semibold text-base md:text-lg text-slate-900";

    const titleIcon = document.createElement("span");
    titleIcon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><rect x="2.5" y="2.5" width="19" height="19" fill="#fff" stroke="#168542" stroke-width="1.5"/><circle cx="12" cy="12" r="5" fill="#168542"/></svg>' 
    titleIcon.className = "size-4 flex items-center justify-center";
    cardTitle.append(titleName,titleIcon);

    const rating = document.createElement("p");
    rating.className = "text-sm text-grey-500";
    
    
    const star = document.createElement("span");
    star.textContent = "★ ";
    star.className = "text-amber-500";

    const ratingValue = document.createElement("span");
    ratingValue.textContent = item.rating;
    rating.append(star, ratingValue);

    const price = document.createElement("p");
    price.textContent = `₹${item.price}`;
    price.className = "font-medium text-slate-900";

    
    cardDetails.append(cardTitle,rating,price);
    leftDiv.append(imageContainer,cardDetails);
    
    const rightDiv = document.createElement("div");
    rightDiv.className ="flex items-center justify-between md:justify-end gap-4 md:gap-8";

    const quantityBox = document.createElement("div");
    quantityBox.className ="flex items-center justify-between gap-4 border border-slate-300 rounded-lg px-3 py-2 shadow-sm";

    const minusButton = document.createElement("button");
    minusButton.textContent = "−";
    minusButton.className ="text-gray-500 hover:text-orange-600";
   
    const quantityText = document.createElement("span");
    quantityText.textContent = String(item.quantity);
    quantityText.className ="font-medium text-sm min-w-3 text-center";

    const plusButton = document.createElement("button");
    plusButton.textContent = "+";
    plusButton.className ="text-gray-500 hover:text-orange-600";
    plusButton.addEventListener("click",()=>{
        item.quantity++;
        quantityText.textContent = String(item.quantity);
        saveCartItems(cartItems);
        refreshCart();
    });
    minusButton.addEventListener("click",()=>{
        if(item.quantity > 1){
            item.quantity--;
            quantityText.textContent=String(item.quantity);
            saveCartItems(cartItems);
            refreshCart();
        }else{
            return;
        }
    });

    quantityBox.append(minusButton,quantityText,plusButton);

    const itemTotal = document.createElement("p");
    itemTotal.textContent = `₹${item.price * item.quantity}`;
    itemTotal.className ="font-semibold text-slate-900 min-w-16 text-right";

    const deleteButton = document.createElement("button");
    deleteButton.innerHTML ='<i class="fa-regular fa-trash-can"></i>';
    deleteButton.className ="text-rose-400 hover:text-rose-600 size-8 shrink-0 transition duration-200";
    deleteButton.addEventListener("click",()=>{
        cartItems = cartItems.filter((cartItem)=>{
            return cartItem.id !== item.id;
        });
        saveCartItems(cartItems);
        refreshCart();
    });

    rightDiv.append(quantityBox,itemTotal,deleteButton);
    cartCard.append(leftDiv, rightDiv);
    return cartCard;
}

function refreshCart(){
    cartContainer.textContent="";
    if(cartItems.length === 0){
        let para = document.createElement("p");
        para.textContent = "No items in your cart";
        para.className = "text-gray-500 text-center py-12 text-lg";
        cartContainer.appendChild(para);
        orderSummary.classList.add("hidden");
    }else{
        orderSummary.classList.remove("hidden");
        cartItems.forEach((item)=>{
            cartContainer.appendChild(createCartCard(item));
        });
        updateCartTotals();
    }
    updateCartCount();
}
refreshCart();
checkoutBtn.addEventListener("click",()=>{
    window.location.href = "./checkout.html";
});