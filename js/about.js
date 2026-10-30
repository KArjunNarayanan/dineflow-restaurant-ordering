let form = document.getElementById("bookTableForm");
let dateInput = document.getElementById("dateInput");
let timeSelect = document.getElementById("timeSelect");
let noGuestInput = document.getElementById("noGuestInput");
let seatPrefer = document.getElementById("seatPrefer");
let specialRequestInput = document.getElementById("special-request");
let dateError = document.getElementById("dateError");
let timeError = document.getElementById("timeError");
let guestsError = document.getElementById("guestsError");
let seatingError = document.getElementById("seatingError");

const today = new Date();
const localDate = today.getFullYear()+"-"+String(today.getMonth() + 1).padStart(2,"0")+"-"+String(today.getDate()).padStart(2,"0");
dateInput.min = localDate;

updateNavbarCartCount();

form.addEventListener("submit",async (e)=>{
    e.preventDefault();
    if(!checkUserLogin()){
        return;
    }

    const date = dateInput.value;
    const time = timeSelect.value;
    const guests = noGuestInput.value;
    const seating = seatPrefer.value;
    const specialRequest = specialRequestInput.value.trim();

    dateError.textContent = "";
    timeError.textContent = "";
    guestsError.textContent = "";
    seatingError.textContent = "";

    let isValid = true;

    if(date === ""){
        dateError.textContent = "This is a required field*";
        isValid = false;
    }
    if(time === ""){
        timeError.textContent = "This is a required field*";
        isValid = false;
    }
    if(guests === ""){
        guestsError.textContent = "This is a required field*";
        isValid = false;
    }
    if(seating === ""){
        seatingError.textContent = "This is a required field*";
        isValid = false;
    }

    if(!isValid){
        return;
    }

    let availableTables = ["Table #01","Table #02","Table #03","Table #04","Table #05","Table #06","Table #07","Table #08","Table #09","Table #10","Table #11","Table #12","Table #13","Table #14","Table #15"]

    let randomIndex = Math.floor(Math.random() * availableTables.length);
    let allocatedTable = availableTables[randomIndex];
    const user = getLoggedInUser();
    const bookingData = {
        userId: user.id,
        date: date,
        time: time,
        guests: guests,
        seating: seating,
        table: allocatedTable,
        specialRequest: specialRequest,
        status: "Confirmed",
        createdAt: new Date().toString()
    };

    try{
        let response = await fetch("http://localhost:3000/bookings",{
            method: "POST",
            headers: {
                "Content-Type":"application/json"
            },
            body: JSON.stringify(bookingData)
        })
        if(!response.ok){
            throw new Error("Failed to book the table");
        }
        alert("Saved Booking")
        form.reset();
    }catch(error) {
        console.log("Booking error: ",error);
        alert("Unable to book the table. Please try again!");
    }
});