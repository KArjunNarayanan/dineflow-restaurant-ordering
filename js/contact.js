let form = document.getElementById("contactForm");

emailjs.init({
        publicKey: "DCEsLcfETERelWvM1"
    });

form.addEventListener("submit",(e)=>{
    e.preventDefault();

    let name = document.getElementById("name").value.trim();
    let email = document.getElementById("email").value.trim();
    let message = document.getElementById("message").value.trim();

    let nameError = document.getElementById("nameError");
    let emailError = document.getElementById("emailError");
    let messageError = document.getElementById("messageError");
    let status = document.getElementById("status");


    nameError.textContent = "";
    emailError.textContent = "";
    messageError.textContent = "";
    status.textContent = "";

    let namePattern = /^[A-Za-z ]{3,}$/;
    let emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let messagePattern = /\S/;

    let isValid = true;

    if(name === ""){
        nameError.textContent = "This is a required field*";
        isValid = false;
    }else if(!namePattern.test(name)){
        nameError.textContent = "Enter a valid name!";
        isValid = false;
    }

    if(email === ""){
        emailError.textContent = "This is a required field*";
        isValid = false;
    }else if(!emailPattern.test(email)){
        emailError.textContent = "Enter a valid email!";
        isValid = false;
    }

    if(message === ""){
        messageError.textContent = "This is a required field*";
        isValid = false;
    }else if(!messagePattern.test(message)){
        messageError.textContent = "Enter any message!";
        isValid = false;
    }


    let templateParams = {
        name: name,
        email: email,
        message: message
    }

    if(isValid){
        emailjs.send("service_7prphvp","template_px5lymc",templateParams)
        .then((response)=>{
            status.textContent = "Your message has been sent successfully! We'll get back to you soon.";
            status.classList.add("success");
            setTimeout(()=>{
                status.textContent = " ";
            },4000);
            console.log("success");
            form.reset();
        })
        .catch((error)=>{
            status.textContent = "Failed to send message";
            status.classList.add("error");
        })

    }
 
});