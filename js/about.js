let form = document.getElementById("bookTableForm");
let dateInput = document.getElementById("dateInput");
let timeSelect = document.getElementById("timeSelect");
let noGuestInput = document.getElementById("noGuestInput");
let seatPrefer = document.getElementById("seatPrefer");
let specialRequest = document.getElementById("special-request");
let result = document.getElementById("result");

let requiredFields = [dateInput,timeSelect];

function validateFields(field){
    if(field.value === ""){
        field.classList.remove("border-[var(--text-grey)]","border");
        field.classList.add("border-2","border-red-600")
        return false;
    }else {
        field.classList.add("border-[var(--text-grey)]","border");
        field.classList.remove("border-2","border-red-600");
        return true;
    }
}

requiredFields.forEach((field)=>{
    field.addEventListener("change",()=>{
        validateFields(field);
    })
});

form.addEventListener("submit",async (e)=>{
    e.preventDefault();

    let isValid = true;

    requiredFields.forEach((field)=>{
        if(!validateFields(field)){
            isValid = false;
        }
    });

    if(!isValid){
        return;
    }

    let availableTables = ["Table #01","Table #02","Table #03","Table #04","Table #05","Table #06","Table #07","Table #08","Table #09","Table #10","Table #11","Table #12","Table #13","Table #14","Table #15"]

    let randomIndex = Math.floor(Math.random() * availableTables.length);
    let allocatedTable = availableTables[randomIndex];
    const bookingData = {
        date: dateInput.value,
        time: timeSelect.value,
        guests: noGuestInput.value,
        seating: seatPrefer.value,
        table: allocatedTable,
        specialRequest: specialRequest.value.trim(),
        status: "Confirmed",
        createdAt: new Date().toISOString()
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