"use strict";

document.addEventListener("DOMContentLoaded", () => {

    document.getElementById("submitBtn").addEventListener("click", sendQuery)
})

//Funktion för POST vid knapptryck
async function sendQuery(event) {
    //Jag vill inte att sidan laddar om.
    event.preventDefault()

    //Tom error array för felmeddelanden.
    const errors = [];

    //Skapande av variabler för HTML DOM
    let companyname = document.getElementById("companyname").value
    let jobtitle = document.getElementById("jobtitle").value
    let location = document.getElementById("location").value
    let startdate = document.getElementById("startdate").value
    let enddate = document.getElementById("enddate").value
    let description = document.getElementById("description").value

    //Skapar objekt för att skicka till APIn
    let work = {
        companyname: companyname,
        jobtitle: jobtitle,
        location: location,
        startdate: startdate,
        enddate: enddate,
        description: description
    }
    //Dubbelkollar i fall det som skrivits redan finns i databasen
    let result = await fetch("https://lab2-workexperience.onrender.com/api/workexperience/", {
        headers: {
            "Content-Type": "application/json"
        }

    })
    let dbResult = await result.json()
    //validerare för entries. En anställd kan ha samma roll på samma företag, men inte flera gånger under samma tidsperiod.
    Object.values(dbResult).forEach(entry => {
        if (companyname === entry.companyname && 
            jobtitle === entry.jobtitle &&
            startdate >= entry.startdate &&
            enddate <= entry.enddate
            ) {
            errors.push(`Angiven befattning finns redan registrerad på arbetsplats - kontrollera även start- och slutdatum`)

            if(companyname === entry.companyname) {
                document.getElementById("companyname").value = ""
            }

            if(jobtitle === entry.jobtitle) {
                document.getElementById("jobtitle").value = ""
            }

            return;
        }
        console.log(errors)

    })
    //Om errors har fler än ett entry, fyll errorlistan.
    if (errors.length > 0) {
        let errorList = document.getElementById("errorList")
        errors.forEach(error => {
            let errorLine = document.createElement("li")
            errorLine.innerHTML = error

            errorList.appendChild(errorLine)
        })

    }

    //I fall inga fel finns, skicka till POST
    if (errors.length === 0) {

        let response = await fetch("https://lab2-workexperience.onrender.com/api/workexperience/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(work)
        });
        let data = await response.json();
        console.log(data);

        document.getElementById("form").reset()
    }

}