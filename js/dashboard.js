
const ordersContainer = document.getElementById("order-container");
const orderCount = document.querySelectorAll(".orderCount");
const logoutBtn = document.getElementById("logoutBtn");
const userLogo = document.getElementById("userLogo");
const userNameMessage = document.getElementById("userNameMessage");
const userEmail = document.getElementById("userEmail");
const userGreeting = document.getElementById("userGreeting");

updateNavbarCartCount();
logoutBtn.addEventListener("click",()=>{
    localStorage.removeItem("loggedInUser");
    window.location.href = "../pages/auth.html";
});
async function fetchingOrderDetails(){
    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    userNameMessage.textContent = user.name;
    userEmail.textContent = user.email;
    userGreeting.textContent = `Welcome, ${user.name} ☺️`;
    try{
        const response = await fetch("http://localhost:3000/orders")
        if(!response.ok){
            throw new Error("Fetching order details failed!");
        }
        const orders = await response.json();
        const userOrders = orders.filter((order) => {
            return String(order.userId) === String(user.id);
        });
        orderCount.forEach((orderNo)=>{
            orderNo.textContent = userOrders.length;
        });
        ordersContainer.textContent="";
        if(userOrders.length === 0){
            const para1 = document.createElement("p");
            para1.textContent = "No record found!";
            para1.classList = "text-[var(--primary-color)] font-semibold";
            ordersContainer.appendChild(para1);
        }
        userOrders.forEach((order)=>{
            ordersContainer.appendChild(createOrderDelivered(order));
        });
    }catch(error){
        console.error("Error fetching orders:", error);
        ordersContainer.textContent ="Unable to load orders. Please try again.";
        ordersContainer.classList = "text-red-600 font-semibold";
    }
}
fetchingOrderDetails();

function createOrderDelivered(order){   
    const orderDiv = document.createElement("div");
    orderDiv.className = "py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all duration-300";

    const leftDiv = document.createElement("div");
    leftDiv.className = "flex items-start gap-4";

    const iconDiv = document.createElement("div");
    iconDiv.className ="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center";
    iconDiv.innerHTML = `
        <svg class="w-6 h-6" fill="none" stroke="currentColor"
            viewBox="0 0 24 24">
            <path
                d="M5 12l4 4L19 6"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2.5">
            </path>
        </svg>`;

    const detailsDiv = document.createElement("div");

    const titleDiv = document.createElement("div");
    titleDiv.className = "flex items-center gap-2";

    const title = document.createElement("h4");
    title.className = "text-base font-bold text-gray-900";
    title.textContent = `Order #${order.id}`;

    const status = document.createElement("span");
    status.className ="px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-600 border border-emerald-200";
    status.textContent = order.status;

    titleDiv.append(title,status);

    const items = document.createElement("p");
    items.className ="text-sm text-gray-600 mt-1 font-medium flex flex-wrap sm:max-w-sm md:max-w-xl";
    order.items.forEach((item)=>{
        const fudItems = document.createElement("span");
        fudItems.textContent = ` ${item.quantity}× ${item.foodName} ● `;
        items.appendChild(fudItems);
    });
    
    const date = document.createElement("time");
    date.className ="text-xs text-gray-400 mt-0.5";
    date.textContent = order.date;

    detailsDiv.append(titleDiv, items, date);
    leftDiv.append(iconDiv, detailsDiv);

    const rightDiv = document.createElement("div");
    rightDiv.className ="flex sm:flex-col items-center sm:items-end justify-between gap-3";

    const price = document.createElement("span");
    price.className ="text-base font-bold text-gray-900";
    price.textContent = `₹${order.total}`;

    const buttonDiv = document.createElement("div");
    buttonDiv.className = "flex items-center gap-2";

    const cancelButton = document.createElement("button");
    cancelButton.type = "button";
    cancelButton.className ="px-3 py-1.5 whitespace-nowrap rounded-lg border border-red-200 text-xs font-semibold text-red-600 hover:bg-red-50 flex items-center gap-1.5 transition";
    cancelButton.textContent = "Delete Order";
    cancelButton.addEventListener("click",async ()=>{
        const confirmDeleteOrder = confirm("Are you sure want to delete this order?");
        if(!confirmDeleteOrder) return;
        try{
            const response = await fetch(`http://localhost:3000/orders/${order.id}`,{
                method: "DELETE"
            })
            if(!response.ok){
                throw new Error("Deleting failed!");
            }
            alert("Order Deleted Successfully");
            await fetchingOrderDetails();
        }catch(error){
            console.log(error);
        }
    });

    buttonDiv.appendChild(cancelButton);
    rightDiv.append(price, buttonDiv);

    orderDiv.append(leftDiv, rightDiv);
    
    return orderDiv;
}


const bookingsContainer = document.getElementById("bookings-container");
const bookingCount = document.querySelectorAll(".bookingCount");
function createBooking(booking){
    const bookingDiv = document.createElement("div");
    bookingDiv.className ="py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all duration-300";

    const leftDiv = document.createElement("div");
    leftDiv.className = "flex items-start gap-4";

    const iconDiv = document.createElement("div");
    iconDiv.className ="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center";
    iconDiv.innerHTML = `
        <svg class="w-6 h-6" fill="none" stroke="currentColor"
            viewBox="0 0 24 24">
            <path
                d="M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2">
            </path>
        </svg>`;

    const detailsDiv = document.createElement("div");

    const titleDiv = document.createElement("div");
    titleDiv.className = "flex flex-wrap items-center gap-2";


    const title = document.createElement("h4");
    title.className = "text-base font-bold text-gray-900";
    title.textContent = `Table Booking #${booking.id}`;

    const status = document.createElement("span");
    status.className ="px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-600 border border-emerald-200";
    status.textContent = booking.status;

    titleDiv.append(title,status);

    const info = document.createElement("p");
    info.className = "text-sm text-gray-600 mt-1 font-medium";

    const guestNumber = document.createElement("span");
    guestNumber.textContent = booking.guests;
    
    const guestSeating = document.createElement("span");
    guestSeating.textContent = booking.seating;

    const guestTable = document.createElement("span");
    guestTable.textContent = booking.table;

    const dotSpan1 = document.createElement("span");
    dotSpan1.textContent = "•";
    dotSpan1.className = "mx-2";
    const dotSpan2 = document.createElement("span");
    dotSpan2.textContent = "•";
    dotSpan2.className = "mx-2";

    info.append(guestNumber,dotSpan1,guestSeating,dotSpan2,guestTable);

    const specialReq = document.createElement("p");
    specialReq.textContent = `"${booking.specialRequest}"`;
    specialReq.className = "text-xs text-orange-600 mt-1 font-medium";
    
    const date = document.createElement("time");
    date.className ="block text-xs text-gray-400 mt-1";
    date.textContent = `${booking.date} • ${booking.time} `;

    detailsDiv.append(titleDiv, info);

    if(booking.specialRequest && booking.specialRequest.trim() !== ""){
        detailsDiv.appendChild(specialReq);
    }
    detailsDiv.appendChild(date);
    leftDiv.append(iconDiv,detailsDiv);

    const rightDiv = document.createElement("div");
    rightDiv.className ="flex items-center justify-end";


    const cancelButton = document.createElement("button");
    cancelButton.type = "button";
    cancelButton.className ="px-4 py-2 rounded-lg border border-red-200 text-sm font-semibold text-red-600 hover:bg-red-50 flex items-center gap-2 cursor-pointer transition-all";
    cancelButton.textContent = "Cancel Booking";

    cancelButton.addEventListener("click",async ()=>{
        const confirmDelete = confirm("Are you sure you want to cancel this booking?");
        if(!confirmDelete){return}
        try{
            const response = await fetch(`http://localhost:3000/bookings/${booking.id}`,{
                method: "DELETE"
            })
            if (!response.ok) {
                throw new Error("Failed to fetch bookings");
            }
            alert("Booking cancelled successfully!");
            await fetchBookings();

        }catch(error){
            console.error("Error deleting booking:", error);
            alert("Unable to cancel booking. Please try again.");
        }
    });
    
    rightDiv.append(cancelButton);
    bookingDiv.append(leftDiv, rightDiv);
    
    return bookingDiv;
}

async function fetchBookings(){
    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    try{
        const response = await fetch("http://localhost:3000/bookings")
        if (!response.ok) {
            throw new Error("Failed to fetch bookings");
        }
        const bookings = await response.json();
        const userBookings = bookings.filter((booking) => {
            return String(booking.userId) === String(user.id);
        });
        bookingCount.forEach((count) => {
            count.textContent = userBookings.length;
        });
        bookingsContainer.textContent = "";
        if(userBookings.length === 0){
            const para = document.createElement("p");
            para.textContent = "No record found!";
            para.classList = "text-[var(--primary-color)] font-semibold";
            bookingsContainer.appendChild(para);
        }
        userBookings.forEach((booking)=>{
            bookingsContainer.appendChild(createBooking(booking));
        });

    }catch(error) {
        console.error("Error fetching bookings:", error);
        bookingsContainer.textContent ="Unable to load bookings. Please try again.";
        bookingsContainer.classList = "text-red-600 font-semibold";
    }
}
fetchBookings();

let dashboardTab = document.getElementById("dashboard-tab");
let orderTab = document.getElementById("order-tab");
let bookingTab = document.getElementById("booking-tab");
let favoriteTab = document.getElementById("favorite-tab");


let dashboardShow = document.getElementById("dashboard-show");
let orderList = document.getElementById("order-list");
let tableBookingList = document.getElementById("table-booking-list");
let favoriteList = document.getElementById("favorite-list");

let tabs = [dashboardTab,orderTab,bookingTab,favoriteTab];

function activeTab(active){
    tabs.forEach((tab)=>{
        tab.classList.remove("bg-[var(--primary-color)]","text-white");
        tab.classList.add("text-gray-500");
        active.classList.remove("text-gray-500");
        active.classList.remove("hover:bg-orange-100","hover:text-[var(--primary-color)]");
        active.classList.add("bg-[var(--primary-color)]","text-white");
    });
}

function dashboardClick(){
    activeTab(dashboardTab);
    dashboardShow.classList.remove("hidden");
    orderList.classList.add("hidden");
    tableBookingList.classList.add("hidden");
    favoriteList.classList.add("hidden");
}

function myOrderClick(){
    activeTab(orderTab);
    orderList.classList.remove("hidden");
    dashboardShow.classList.add("hidden");
    tableBookingList.classList.add("hidden");
    favoriteList.classList.add("hidden");
}

function tableBookingClick(){
    activeTab(bookingTab);
    tableBookingList.classList.remove("hidden");
    dashboardShow.classList.add("hidden");
    orderList.classList.add("hidden");
    favoriteList.classList.add("hidden");
}

function favoriteClick() {
    activeTab(favoriteTab);
    favoriteList.classList.remove("hidden");
    dashboardShow.classList.add("hidden");
    orderList.classList.add("hidden");
    tableBookingList.classList.add("hidden");
}


const favoriteContainer = document.getElementById("favorite-container");
const favoriteCount = document.querySelectorAll(".favCount");
favoriteContainer.textContent = "";
function createFavorites(favorites){
    favorites.forEach((item)=>{
        const outerDiv = document.createElement("div");
        outerDiv.className = "p-2 hover:shadow-md flex gap-2 bg-[#fafafa] transition duration-150";

        const leftDiv = document.createElement("div");
        leftDiv.className = "rounded-md h-25 w-25 overflow-hidden flex flex-shrink-0"
        const image = document.createElement("img");
        image.className = "w-full h-full object-cover"
        image.src = item.image;
        image.alt = item.name;

        leftDiv.appendChild(image);

        const rightDiv = document.createElement("div");
        rightDiv.className = "flex flex-col gap-4"

        const cardContent = document.createElement("div");

        const rowDiv = document.createElement("div");
        rowDiv.classList = "flex justify-between items-center";

        const cardName = document.createElement("h3");
        cardName.className = "font-bold"
        cardName.textContent = item.name;

        const heartContainer = document.createElement("button");
        heartContainer.classList = "p-1 rounded-xl hover:bg-red-100 flex justify-center items-center transition duration-150";
        const heartIcon = document.createElement("span");
        heartIcon.className = "fa-solid fa-heart text-red-500 text-sm cursor-pointer";

        heartIcon.addEventListener("click",()=>{
            favorites = getFavoritesItems();
            favorites = favorites.filter((food) => food.id !== item.id);
            saveFavoritesItems(favorites);
            displayFavorites();
        });
        heartContainer.appendChild(heartIcon);

        rowDiv.append(cardName,heartContainer);
        
        const cardDescription = document.createElement("p");
        cardDescription.className = "text-[var(--text-color)] text-xs line-clamp-1 sm:line-clamp-2 md:line-clamp-none";
        cardDescription.textContent = item.description;

        cardContent.append(rowDiv,cardDescription);

        const cardBottom = document.createElement("div");
        cardBottom.className = "flex justify-between items-center";

        const price = document.createElement("span");
        price.textContent = `₹${item.price}`;
        price.className = "font-bold";
        const addButton = document.createElement("button");
        addButton.textContent = "Add";
        addButton.className = "px-3 py-1 text-xs bg-[var(--primary-color)] text-white font-semibold rounded-md hover:opacity-90 cursor-pointer";
        addButton.addEventListener("click",()=>{
            let cartItems = getCartItems();
            let exists = cartItems.some((cartItem)=>{
                return cartItem.id === item.id;
            });
            if(exists){
                alert("Already in your cart");
                return;
            }else{
                cartItems.push({
                    id: item.id,
                    image: item.image,
                    name: item.name,
                    price: item.price,
                    quantity: 1,
                    rating: item.rating,
                    type: item.dietaryTags[0]
                });
                saveCartItems(cartItems);
                alert("Added to cart");
                updateNavbarCartCount();
            }
        });

        cardBottom.append(price,addButton);
        rightDiv.append(cardContent,cardBottom);

        outerDiv.append(leftDiv,rightDiv);
        favoriteContainer.appendChild(outerDiv);
    });
}

function displayFavorites(){
    let favorites = getFavoritesItems();
    let currentFavoriteCount = favorites.length;
    favoriteCount.forEach((fav)=>{
        fav.textContent = currentFavoriteCount;
    })
    favoriteContainer.textContent = ""
    if(favorites.length === 0){
        favoriteContainer.textContent = "No favorites added yet";
        favoriteContainer.classList = "text-[var(--primary-color)] font-semibold";
        return;
    }
    createFavorites(favorites); 
}
displayFavorites();
