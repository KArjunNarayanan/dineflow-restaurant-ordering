let loginBtn = document.getElementById('loginBtn');
let signupBtn = document.getElementById('signupBtn');
let signupToggle = document.getElementById('signupToggle');
let loginToggle = document.getElementById('loginToggle');

function loginClick(){
    signupBtn.classList.add("toggle-btn");
    loginBtn.classList.remove("toggle-btn");
    signupToggle.classList.add("hidden");
    loginToggle.classList.remove("hidden");
}
function signupClick(){
    loginBtn.classList.add("toggle-btn");
    signupBtn.classList.remove("toggle-btn");
    loginToggle.classList.add("hidden");
    signupToggle.classList.remove("hidden");
}

signupBtn.classList.add("toggle-btn");
signupToggle.classList.add("hidden");
loginBtn.addEventListener("click",()=>{
    loginClick();
});
signupBtn.addEventListener("click",()=>{
    signupClick();
});