let form = document.getElementById("deliveryDetailsForm");
let cartListCheckout = document.getElementById("cartListCheckout");
let checkoutItems = document.getElementById("checkoutItems");
let subTotalCheckout = document.getElementById("subTotal");
let receiptSubTotal = document.getElementById("receiptSubTotal");
let priceCheckout = document.querySelectorAll(".priceCheckout");
let orderConfirmationDialog = document.getElementById("orderConfirmationDialog");
let exploreMenuBtn = document.getElementById("exploreMenuBtn");

updateNavbarCartCount();

function getLoggedInUser(){
    return JSON.parse(localStorage.getItem("loggedInUser")) || [];
}
function createElement(tag,className="",text=""){
    const element = document.createElement(tag);
    element.textContent = text;
    element.className = className;
    return element;
}
let totalAmt;
function calculateTotal(){
    const cartItems = getCartItems();
    let totalCount = 0;
    let subTotal = 0;
    cartItems.forEach((item) => {
        subTotal += Number(item.quantity) * Number(item.price);
        totalCount ++;
    });
    totalAmt = subTotal + 40;
    checkoutItems.textContent = totalCount;
    subTotalCheckout.textContent = `₹${subTotal}`;
    receiptSubTotal.textContent = `₹${subTotal}`;
    priceCheckout.forEach((price)=>{
        price.textContent = `₹${totalAmt}`;
    });
}
let itemsInCart = [];
let cartItems = getCartItems();
    cartListCheckout.textContent = "";
    cartItems.forEach((item) => {
        foodItems = {
            foodId: item.id,
            foodName: item.name,
            quantity: item.quantity
        }
        itemsInCart.push(foodItems);
        const outerDiv = createElement("div","flex justify-between items-center gap-3");
        const contentDiv = createElement("div","flex items-center gap-3");
        const quantityText = createElement("span","text-xs size-6 rounded-full bg-gray-100 flex items-center justify-center",item.quantity); 
        const foodName = createElement("p","text-sm",item.name);
        contentDiv.append(quantityText,foodName);
        const totalPrice = createElement("span","text-sm font-medium",`₹${Number(item.price) * Number(item.quantity)}`);
        outerDiv.append(contentDiv,totalPrice);
        cartListCheckout.appendChild(outerDiv);
        calculateTotal();
    });

form.addEventListener("submit",async (e)=>{
    e.preventDefault();

    let name = document.getElementById("name").value.trim();
    let phone = document.getElementById("phone").value.trim();
    let deliveryAddress = document.getElementById("deliveryAddress").value;
    let specialInstructions = document.getElementById("special-instructions").value;

    let nameError = document.getElementById("nameError");
    let phoneError = document.getElementById("phoneError");
    let addressError = document.getElementById("addressError");

    nameError.textContent = "";
    phoneError.textContent = "";
    addressError.textContent = "";

    let namePattern = /^[A-Za-z ]{3,}$/;
    let phonePattern = /^[6-9]\d{9}$/;

    let isValid = true;
    if(name === ""){
        nameError.textContent = "This is required field*";
        isValid = false;
    }else if(!namePattern.test(name)){
        nameError.textContent = "Enter valid name";
        isValid = false;
    }

    if(phone === ""){
        phoneError.textContent = "This is required field*";
        isValid = false;
    }else if(!phonePattern.test(phone)){
        phoneError.textContent = "Please enter a valid 10-digit Indian phone number";
        isValid = false;
    }

    if(deliveryAddress === ""){
        addressError.textContent = "This is required field*";
        isValid = false;
    }

    if(isValid){
        const user = getLoggedInUser();
        const currentDate = new Date();
        const order = {
            userId: user.id,
            name: name,
            deliveryAddress: deliveryAddress,
            phone: phone,
            items: itemsInCart,
            total: totalAmt,
            date: `${currentDate.toDateString()} , ${currentDate.toLocaleTimeString()}`,
            status: "Delivered"
        }
        if (specialInstructions){
            order.specialInstructions = specialInstructions;
        }

        try{
            const response = await fetch("http://localhost:3000/orders",{
                method: "POST",
                headers: {
                    "Content-Type":"application/json"
                },
                body: JSON.stringify(order)
            })
            if(!response.ok){
                throw new Error("Failed to save order!");
            }
        }catch(error){
            console.log(error);
        }

        orderConfirmationDialog.showModal();
        document.body.classList.add("overflow-hidden");
        form.reset();
        exploreMenuBtn.addEventListener("click",()=>{
            window.location.href = "../pages/menu.html";
        });
        cart=[];
        saveCartItems(cart); 

        orderConfirmationDialog.addEventListener("close",()=>{
            document.body.classList.remove("hidden");
            window.location.href = "../index.html";
        });

    }


});