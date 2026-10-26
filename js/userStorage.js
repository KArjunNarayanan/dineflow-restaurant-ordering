

function getLoggedInUser() {
    return JSON.parse(localStorage.getItem("loggedInUser"))
}

function getUserCartKey(){
    const user = getLoggedInUser();
    if(!user){
        return null;
    }
    return `cart_${user.id}`;
}
function getCartItems(){
    const key = getUserCartKey();
    return JSON.parse(localStorage.getItem(key)) || [];
}
function saveCartItems(cartItems){
    const key = getUserCartKey();
    if(!key){
        return;
    }
    localStorage.setItem(key,JSON.stringify(cartItems));
}


function getUserFavoritesKey(){
    const user = getLoggedInUser();
    if(!user){
        return null;
    }
    return `favorites_${user.id}`;
}
function getFavoritesItems(){
    const key = getUserFavoritesKey();
    return JSON.parse(localStorage.getItem(key)) || [];
}
function saveFavoritesItems(favorites){
    const key = getUserFavoritesKey();
    if(!key){
        return;
    }
    localStorage.setItem(key,JSON.stringify(favorites));
}



