let cartContainer = document.getElementById("cart-container");

let cartItems = [
        {
            id: 1,
            name: "Margherita Pizza",
            image: "../assets/images/Pizzas.jpg",
            rating: 5.0,
            price: 299,
            quantity: 1,
            type: "veg"
        },
        {
            id: 2,
            name: "Classic Burger",
            image: "../assets/images/Burgers.jpg",
            rating: 5.0,
            price: 249,
            quantity: 1,
            type: "non-veg"
        }
    ]

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
    ratingValue.textContent = item.rating.toFixed(1);
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

    const quantity = document.createElement("span");
    quantity.textContent = item.quantity;
    quantity.className ="font-medium text-sm min-w-3 text-center";

    const plusButton = document.createElement("button");
    plusButton.textContent = "+";
    plusButton.className ="text-gray-500 hover:text-orange-600";

    quantityBox.append(minusButton,quantity,plusButton);

    const itemTotal = document.createElement("p");
    itemTotal.textContent = `₹${item.price * item.quantity}`;
    itemTotal.className ="font-semibold text-slate-900 min-w-16 text-right";

    const deleteButton = document.createElement("button");
    deleteButton.innerHTML ='<i class="fa-regular fa-trash-can"></i>';
    deleteButton.className ="text-rose-400 hover:text-rose-600 size-8 shrink-0 transition duration-200";

    rightDiv.append(quantityBox,itemTotal,deleteButton);
    cartCard.append(leftDiv, rightDiv);
    return cartCard;
}
cartItems.forEach((item)=>{
    cartContainer.appendChild(createCartCard(item));
});