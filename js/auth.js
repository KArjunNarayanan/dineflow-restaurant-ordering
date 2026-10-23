let loginBtn = document.getElementById('loginBtn');
let signupBtn = document.getElementById('signupBtn');
let signupToggle = document.getElementById('signupToggle');
let loginToggle = document.getElementById('loginToggle');

let loginForm = document.getElementById("loginForm");
let signupForm = document.getElementById("signupForm");

let signupName = document.getElementById("signupName");
let signupEmail = document.getElementById("signupEmail");
let signupPassword = document.getElementById("signupPassword");
let confirmPassword = document.getElementById("confirmPassword");

let namePattern = /^[A-Za-z ]{3,}$/;
let emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
let passwordPattern = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/;

loginForm.addEventListener("submit",async (e)=>{
    e.preventDefault();

    let email = document.getElementById("loginEmail").value.trim();
    let password = document.getElementById("loginPassword").value;

    let loginEmailError = document.getElementById("loginEmailError");
    let loginPasswordError = document.getElementById("loginPasswordError");
    let loginMessage = document.getElementById("loginMessage");

    loginEmailError.textContent = "";
    loginPasswordError.textContent = "";
    loginMessage.textContent = "";
    loginMessage.classList.remove("error", "success");

    let isValid = true;

    if(email === ""){
        loginEmailError.textContent = "This is a required field*";
        isValid = false;
    }else if(!emailPattern.test(email)){
        loginEmailError.textContent = "Enter a valid email!";
        isValid = false;
    }

    if(password === ""){
        loginPasswordError.textContent = "This is a required field*";
        isValid = false;
    }

    if(!isValid) return;

    try{
        let response = await fetch("http://localhost:3000/users")
        if(!response.ok){
            throw new Error("Fetching user details failed!");
        }
        let users = await response.json();
        let user = users.find((user) => user.email === email);
        if (!user) {
            loginMessage.textContent = "Email does not exist!";
            loginMessage.classList.add("error","text-center","pt-2");
            loginForm.reset();
            setTimeout(()=>{
                loginMessage.textContent = "";
                signupClick();
            },2500);

            return;
        }
        if (user.password !== password) {
            loginPasswordError.textContent = "Incorrect password!";
            loginMessage.classList.add("error","text-center","pt-2");
            loginForm.reset();
            return;
        }
        localStorage.setItem("loggedInUser", JSON.stringify(user));
        window.location.href = "../index.html";
        loginForm.reset();
    }catch(err) {
        console.error(err);
        loginMessage.textContent ="Unable to connect to the server. Please try again.";
        loginMessage.classList.add("error");
    }
}); 

signupForm.addEventListener("submit",async (e)=>{
    e.preventDefault();

    let name = signupName.value.trim();
    let email = signupEmail.value.trim().toLowerCase();
    let password = signupPassword.value;
    let confirmPass = confirmPassword.value;

    let isValid = true;

    let signupNameError = document.getElementById("signupNameError");
    let signupEmailError = document.getElementById("signupEmailError");
    let signupPasswordError = document.getElementById("signupPasswordError");
    let confirmPasswordError = document.getElementById("confirmPasswordError");
    let signupMessage = document.getElementById("signupMessage");

    signupNameError.textContent = "";
    signupEmailError.textContent = "";
    signupPasswordError.textContent = "";
    confirmPasswordError.textContent = "";
    signupMessage.textContent = "";

    if (name === "") {
        signupNameError.textContent = "This is a required field*";
        isValid = false;
    } else if (!namePattern.test(name)) {
        signupNameError.textContent = "Enter at least 3 letters";
        isValid = false;
    }

    if (email === "") {
        signupEmailError.textContent = "This is a required field*";
        isValid = false;
    } else if (!emailPattern.test(email)) {
        signupEmailError.textContent = "Enter a valid email";
        isValid = false;
    }

    if (password === "") {
        signupPasswordError.textContent = "This is a required field*";
        isValid = false;
    } else if (!passwordPattern.test(password)) {
        signupPasswordError.textContent ="Password should contain min 8 digits,uppercase,special characters";
        isValid = false;
    }

    if (confirmPass === "") {
        confirmPasswordError.textContent ="This is a required field*";
        isValid = false;
    }else if (password !== confirmPass) {
        confirmPasswordError.textContent ="Passwords do not match";
        isValid = false;
    }

    if(!isValid) return;

    try{
        let response = await fetch("http://localhost:3000/users")
        if(!response.ok){
            throw new Error("Could not checking existing user!");
        }
        let users = await response.json();
        let emailExists;
        if(users.length > 0){
            emailExists = users.some((user) => user.email === email);
        }
        if(emailExists){
            signupEmailError.textContent ="This email is already registered";
            return;
        }

        let newUser = {
            name: name,
            email: email,
            password: password
        }

        let registerResponse = await fetch("http://localhost:3000/users",{
            method: "POST",
            headers: {
                "Content-Type":"application/json"
            },
            body: JSON.stringify(newUser)
        })
        if(!registerResponse.ok){
            throw new Error("Registration Failed!");
        }
        signupMessage.textContent ="Registration successful! Please log in.";
        signupMessage.classList.add("success","text-center","pt-3");
        setTimeout(()=>{
            signupMessage.textContent = "";
        },2500);
        signupForm.reset();
        setTimeout(()=>{
            loginClick();
        },3000);
    }catch (error) {
        console.error(error);
        signupMessage.textContent ="Something went wrong. Please try again.";
        signupMessage.classList.add("error");
    }
});

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