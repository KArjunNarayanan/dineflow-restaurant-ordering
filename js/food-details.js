let foodDetailsContainer = document.getElementById("food-details-container");
let loading = document.getElementById("loading");


let selectedFood;
let quantity = 1;
let isFavourite = false;

let foodId = localStorage.getItem("selectedFoodId");

function createElement(tag,className="",text=""){
    let element = document.createElement(tag);
    element.textContent = text;
    element.className = className;
    return element;
}

async function loadFoodDetails() {
    try{
        let response = await fetch("http://localhost:3000/menu")
        if(!response.ok){
            throw new Error("Unable to load food details");
        }
        let foods = await response.json();

        selectedFood = foods.find((food)=>{
            return String(food.id) === String(foodId);
        })

        if(!selectedFood){
            foodDetailsContainer.appendChild(createElement("p","text-red-600 text-center py-10","Food item not found!"));
            loading.classList.add("hidden");
            return;
        }
        displayFoodDetails();
    }catch(error){
        console.log(error);
        foodDetailsContainer.appendChild(createElement("p","text-red-600 text-center py-10","Unable to load food details!. Please try again."));
        loading.classList.add("hidden");
    }
}


function displayFoodDetails(){
    foodDetailsContainer.textContent = "";

    const mainCard = createElement("div","max-w-7xl mx-auto bg-white rounded-2xl px-4 sm:px-6 lg:px-8 py-8 md:py-10 grid grid-cols-1 md:grid-cols-2 gap-8");
    const image = createElement("img","w-full h-72 md:h-96 object-cover rounded-xl");
    image.src = selectedFood.image;
    image.alt = selectedFood.name;
    mainCard.appendChild(image);

    const details = createElement("div", "flex flex-col");

    const headerSection = createElement("div","border-b border-gray-100 pb-5");
    const name = createElement("h1","text-2xl sm:text-3xl font-bold text-gray-900",selectedFood.name);
    headerSection.appendChild(name);
    const badges = createElement("div", "flex flex-wrap items-center gap-3 mt-3");
    const foodType = createElement("span","inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold");
     if(selectedFood.dietaryTags[0].toLowerCase() === "non-veg") {
        foodType.classList.add("non-veg");
        const foodDot = createElement("span","size-1 rounded-full bg-orange-600");
        foodType.appendChild(foodDot);
    }else{
        foodType.classList.add("veg");
        const foodDot = createElement("span","size-1 rounded-full bg-emerald-600")
        foodType.appendChild(foodDot);
    }
    

    foodType.appendChild(createElement("span","",selectedFood.dietaryTags[0]))
    const rating = createElement("span","inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200",
        "★ " + selectedFood.rating);

    badges.append(foodType,rating);
    headerSection.appendChild(badges);

    const priceSection = createElement("div","mt-4 flex flex-wrap items-baseline gap-2");
    const price = createElement("span","text-3xl font-bold text-gray-900","₹" + selectedFood.price);
    const taxInfo = createElement("span","text-sm text-gray-400 font-medium","Inclusive of all taxes");

    priceSection.append(price,taxInfo);
    headerSection.appendChild(priceSection);
    details.appendChild(headerSection);

    const descriptionSection = createElement("div","py-2 border-b border-gray-100");
    const description = createElement("p","text-sm text-gray-600 leading-relaxed",selectedFood.description);

    descriptionSection.appendChild(description);
    details.appendChild(descriptionSection);

    const ingredientsSection = createElement("div","border-b border-gray-100 py-3");
    const ingredientsTitle = createElement("h2","text-xs font-bold text-gray-900 uppercase tracking-wide mb-2","Ingredients");
    const ingredientsText = createElement("p","text-sm text-gray-600 leading-relaxed",Array.isArray(selectedFood.ingredients) ? selectedFood.ingredients.join(", "): selectedFood.ingredients);
    ingredientsSection.append(ingredientsTitle, ingredientsText);
    details.appendChild(ingredientsSection);
    
    const dietarySection = createElement("div","border-b border-gray-100 py-3");
    const dietaryTitle = createElement("h2","text-xs font-bold text-gray-900 uppercase tracking-wide mb-2","Dietary Information");
    const tagContainer = createElement("div","flex flex-wrap gap-2 pt-2");
    selectedFood.dietaryTags.forEach((tag)=>{
        let tagElement = createElement("span","bg-gray-100 text-gray-700 text-xs font-medium px-3 py-1 rounded-full border border-gray-200",tag);
        tagContainer.appendChild(tagElement);
    });
    dietarySection.append(dietaryTitle,tagContainer);
    details.appendChild(dietarySection);
    
    
    const quantitySection = createElement("div","flex flex-wrap items-center gap-3 pt-5");
    const quantityLabel = createElement("span","font-bold text-xs text-gray-700 uppercase tracking-wide","Quantity");
    const quantityBox = createElement("div","flex items-center border border-gray-200 rounded-xl bg-white overflow-hidden shadow-sm");
    const decreaseBtn = createElement("button","px-4 py-2 text-gray-500 hover:bg-gray-100  hover:text-gray-900 font-semibold","−");
    const quantityText = createElement("span","px-5 py-2 text-sm font-semibold text-gray-900",String(quantity));
    const increaseBtn = createElement("button","px-4 py-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors font-semibold","+");

    decreaseBtn.addEventListener('click', ()=>{
        if(quantity > 1){
            quantity--;
            quantityText.textContent = String(quantity);
        }
    });
    increaseBtn.addEventListener('click', ()=>{
        quantity++;
        quantityText.textContent = String(quantity);
    });

    quantityBox.append(decreaseBtn, quantityText, increaseBtn);
    quantitySection.append(quantityLabel,quantityBox);
    details.appendChild(quantitySection);

    const actions = createElement("div","flex flex-col gap-3 pt-5");
    const favouriteBtn = createElement("button","w-full flex items-center justify-center gap-2 py-3 px-4 border border-orange-500 rounded-xl text-orange-600 hover:bg-orange-50 transition duration-150 text-sm font-semibold");
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    isFavourite = favorites.some((item)=>{
        return String(item.id) === String(selectedFood.id);
    });
    favouriteBtn.textContent = isFavourite ? "♥ Favourited": "♡ Favourites"; 
    favouriteBtn.classList.toggle("bg-orange-50", isFavourite);
    favouriteBtn.addEventListener("click", ()=> {
        let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
        let exists = favorites.some((item)=>{
            return String(item.id) === String(selectedFood.id);
        });
        if(exists){
            favorites = favorites.filter((item)=>{
                return String(item.id) !== String(selectedFood.id);
            });
            isFavourite = false;
        }else{
            favorites.push(selectedFood);
            isFavourite = true;
        }
        localStorage.setItem("favorites", JSON.stringify(favorites));
        favouriteBtn.textContent = isFavourite ? "♥ Favourited": "♡ Favourites";
        favouriteBtn.classList.toggle("bg-orange-50", isFavourite);
    });

    const addToCartBtn = createElement("button","w-full flex items-center justify-center py-3 px-4 bg-[var(--primary-color)] rounded-xl text-white font-semibold text-sm","Add to Cart");
    addToCartBtn.addEventListener("click",()=>{
        addToCart();
        updateNavbarCartCount();
    });
    actions.append(favouriteBtn, addToCartBtn);
    details.appendChild(actions);
    mainCard.appendChild(details);
    foodDetailsContainer.appendChild(mainCard);
    
}

function addToCart(){
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingItem = cart.find(function(item) {
        return String(item.id) === String(selectedFood.id);
    });
    if (existingItem) {
        alert("Already Added!");
        return;
    } else {
        cart.push({
            id: selectedFood.id,
            name: selectedFood.name,
            image: selectedFood.image,
            rating: selectedFood.rating,
            price: selectedFood.price,
            quantity: quantity,
            type: selectedFood.dietaryTags[0].toLowerCase()
        });
    }
    localStorage.setItem("cart",JSON.stringify(cart));
    alert("Food added to cart");
}

loadFoodDetails();

