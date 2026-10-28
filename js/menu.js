const menuContainer = document.getElementById("menu-container");
const menuSearchInput = document.getElementById("menuSearchInput");
const dietaryFilters = document.querySelectorAll(".dietary-filter");
const priceFilters = document.querySelectorAll(".price-filter");
const profileUserBtn = document.querySelector(".profile-user");
const bothDietary = document.getElementById("bothDietary");
const priceSort = document.getElementById("priceSort");

let allFoods = [];
let allReviews = [];
async function loadMenu() {
    updateNavbarCartCount();
    try {
        const [menuResponse, reviewsResponse] = await Promise.all([fetch("http://localhost:3000/menu"),fetch("http://localhost:3000/reviews")]);
        if (!menuResponse.ok || !reviewsResponse.ok) {
            throw new Error("Failed to fetch menu / reviews data");
        }
        allFoods = await menuResponse.json();
        allReviews = await reviewsResponse.json();
        displayMenu(allFoods);
    } catch (error) {
        console.error("Error loading menu:", error);
    }
}

function displayMenu(foods) {
    menuContainer.innerHTML = "";
    if (foods.length === 0) {
        const para = document.createElement("p");
        para.className = "text-gray-500 col-span-full text-center py-10";
        para.textContent = "No dishes found in this category."
        menuContainer.appendChild(para);
        return;
    }
    foods.forEach((food) => {
        updateMenuContainer(food);
    });
}

let selectedCategory = "All";

function applyFilters() {
    const searchText = menuSearchInput.value.trim().toLowerCase();
    let filteredFoods = allFoods;

    if (selectedCategory !== "All") {
        filteredFoods = filteredFoods.filter((food) => {
            return food.category === selectedCategory;
        });
    }

    if (searchText !== "") {
        filteredFoods = filteredFoods.filter((food) => {
            return (
                food.name.toLowerCase().includes(searchText) ||
                food.description.toLowerCase().includes(searchText)
            );
        });
    }

    const selectedDietary = [...dietaryFilters].filter((checkbox) => checkbox.checked).map((checkbox) => checkbox.value);
    if (!selectedDietary.includes("Both") && selectedDietary.length > 0) {
        filteredFoods = filteredFoods.filter((food) => {
            return selectedDietary.some((type) =>
                food.dietaryTags.includes(type)
            );
    
        });
    }

    const selectedPrices = [...priceFilters].filter((checkbox) => checkbox.checked).map((checkbox) => checkbox.value);
    if (selectedPrices.length > 0) {
        filteredFoods = filteredFoods.filter((food) => {
            return selectedPrices.some((range) => {
                if (range === "under200") {
                    return food.price < 200;
                }
                if (range === "200to350") {
                    return food.price >= 200 && food.price <= 350;
                }
                if (range === "over350") {
                    return food.price > 350;
                }
                return false;
            });
        });
    }

     switch (priceSort.value) {
        case "priceLowHigh":
            filteredFoods.sort((a, b) => a.price - b.price);
            break;

        case "priceHighLow":
            filteredFoods.sort((a, b) => b.price - a.price);
            break;

        case "ratingHighLow":
            filteredFoods.sort((a, b) => b.rating - a.rating);
            break;
    }
    displayMenu(filteredFoods);
}

dietaryFilters.forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
        if(checkbox === bothDietary && bothDietary.checked){
            dietaryFilters.forEach((filter)=>{
                if(filter !== bothDietary){
                    filter.checked = false;
                }
            });
        }else if(checkbox !== bothDietary && checkbox.checked){
            bothDietary.checked = false;
        }
        applyFilters();
    });
});


priceFilters.forEach((checkbox) => {
    checkbox.addEventListener("change", applyFilters);
});

priceSort.addEventListener("change", applyFilters);

const categoryButtons = document.querySelectorAll(".category-btn");
function activeTab(active) {
    categoryButtons.forEach((btn) => {
        btn.classList.remove("bg-[var(--primary-color)]","text-white");
        btn.classList.add("text-gray-600","bg-gray-200");
    });
    active.classList.remove("text-gray-600","bg-gray-200");
    active.classList.add("bg-[var(--primary-color)]","text-white");
}
categoryButtons.forEach((button) => {
    button.addEventListener("click", () => {
        selectedCategory = button.dataset.category;
        activeTab(button);
        applyFilters();
        if (selectedCategory === "All") {
            displayMenu(allFoods);
        } else {
            const filteredFoods = allFoods.filter((food) => {
                return food.category === selectedCategory;
            });
            displayMenu(filteredFoods);
        }
    });
});

menuSearchInput.addEventListener("input",()=>{
    applyFilters();
});

function updateMenuContainer(food){
    const card = document.createElement("div");
    card.classList.add("card-menu");

    card.addEventListener("click",()=>{
        let selectedFoodId = localStorage.setItem("selectedFoodId",food.id);
        window.location.href = "./food-details.html";
    });

    const imageContainer = document.createElement("div");
    imageContainer.classList.add("card-image");

    const image = document.createElement("img");
    image.src = food.image;
    image.alt = food.name;

    imageContainer.appendChild(image);

    const favoriteButton = document.createElement("button");
    favoriteButton.classList.add("favorite-btn");
    favoriteButton.textContent = "♡";
    imageContainer.appendChild(favoriteButton);

    let favorites = getFavoritesItems();

    let alreadyAdded = false;
    for(let item of favorites){
        if(item.id === food.id){
            alreadyAdded = true;
            break;
        }
    }
    if(alreadyAdded){
        favoriteButton.textContent = "♥";
        favoriteButton.classList.toggle("favorite-btn-clicked");
    }else{
        favoriteButton.textContent = "♡";
    }

    profileUserBtn.addEventListener("click",()=>{
        
    });
    favoriteButton.addEventListener("click",(e)=>{
        e.stopPropagation();
        if(!checkUserLogin()){
            return;
        }
        favoriteButton.classList.toggle("favorite-btn-clicked");
        favorites = getFavoritesItems();

        alreadyAdded = false;
        for(let item of favorites){
            if(item.id === food.id){
                alreadyAdded = true;
                break;
            }
        }

        if(alreadyAdded){
            favorites = favorites.filter((item)=>item.id !== food.id);
            favoriteButton.textContent = "♡";
        }else{
            favorites.push(food);
            favoriteButton.textContent = "♥";
        }
        saveFavoritesItems(favorites);
    });

    const cardContent = document.createElement("div");
    cardContent.classList.add("menu-card-content");

    const foodName = document.createElement("h3");
    foodName.textContent = food.name;

    const ratingRow = document.createElement("div");
    ratingRow.classList.add("menu-rating-row");

    const category = document.createElement("span");
    if(food.dietaryTags[0].toLowerCase() === "non-veg") {
        category.classList.add("non-veg");
    }else{
        category.classList.add("veg");
    }
    category.textContent = food.dietaryTags[0];
    
    const foodRating = getFoodRating(food.id,allReviews);
    if(foodRating.reviewCount > 0) {
        const rating = document.createElement("span");
        rating.classList.add("menu-rating");
        rating.textContent = "★";
        const ratingNumber = document.createElement("span");
        ratingNumber.textContent = foodRating.rating.toFixed(1);
        rating.appendChild(ratingNumber);
        const reviews = document.createElement("span");
        reviews.classList.add("reviews");
        reviews.textContent = `(${foodRating.reviewCount})`;
        
        ratingRow.append(category,rating,reviews);
    }else{
        ratingRow.append(category);    
    }
    
    
    const description = document.createElement("p");
    description.classList.add("menu-description");
    description.textContent = food.description;

    const cardBottom = document.createElement("div");
    cardBottom.classList.add("card-bottom");

    const price = document.createElement("span");
    price.classList.add("price");
    price.textContent = `₹${food.price}`;

    const cartButton = document.createElement("button");
    cartButton.classList.add("add-cart");
    cartButton.textContent = "Add to Cart";
    cartButton.addEventListener("click",(e)=>{
        e.stopPropagation();   
        if(!checkUserLogin()){
            return;
        } 
        let cartItems = getCartItems();
        let alreadyAdded = cartItems.find((item)=>{
            return item.id === food.id
        });
        if(alreadyAdded){
            alert("Already in your cart");
            return;
        }
        cartItems.push({
            id: food.id,
            name: food.name,
            image: food.image,
            rating: food.rating,
            price: food.price,
            quantity: 1,
            type: food.dietaryTags[0].toLowerCase()
        });
        saveCartItems(cartItems);
        alert("Item added to cart!");
        updateNavbarCartCount();
    });
    cardBottom.appendChild(price);
    cardBottom.appendChild(cartButton);

    cardContent.appendChild(foodName);
    cardContent.appendChild(ratingRow);
    cardContent.appendChild(description);
    cardContent.appendChild(cardBottom);
    card.appendChild(imageContainer);
    card.appendChild(cardContent);
    menuContainer.appendChild(card);
}
loadMenu();
