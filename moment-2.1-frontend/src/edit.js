"use strict";

window.addEventListener("load", async () => {
    let sendUpdate = document.getElementById("sendUpdate")
    sendUpdate.addEventListener("click", updateQuery)

    let params = new URLSearchParams(document.location.search)
    let id = params.get("id");

    try {
        const getDatabase = await fetch(`https://lab2-workexperience.onrender.com/api/workexperience/${id}`)
        const db = await getDatabase.json()

        let companyname = db.companyname
        let jobtitle = db.jobtitle
        let jobLocation = db.jobLocation
        let startdate = db.startdate
        let enddate = db.enddate
        let description = db.description

        console.log(db)

        document.getElementById("companyname").value = companyname
        document.getElementById("jobtitle").value = jobtitle
        document.getElementById("jobLocation").value = jobLocation
        document.getElementById("startdate").value = startdate.slice(0, 10)
        document.getElementById("enddate").value = enddate.slice(0, 10)
        document.getElementById("description").value = description

    } catch (err) {
        console.log(err)
    }

});

async function updateQuery() {
    //Jag vill inte att sidan laddar om.
    event.preventDefault()

    let params = new URLSearchParams(document.location.search)
    let id = params.get("id");

    let errors = [];

    let companyname = document.getElementById("companyname").value
    let jobtitle = document.getElementById("jobtitle").value
    let jobLocation = document.getElementById("jobLocation").value
    let startdate = document.getElementById("startdate").value
    let enddate = document.getElementById("enddate").value
    let description = document.getElementById("description").value
    //Skapar objekt för att skicka till APIn
    let work = {
        companyname: companyname,
        jobtitle: jobtitle,
        jobLocation: jobLocation,
        startdate: startdate,
        enddate: enddate,
        description: description
    }
    console.log(work)
    //Dubbelkollar i fall det som skrivits redan finns i databasen
    let result = await fetch(`https://lab2-workexperience.onrender.com/api/workexperience/`, {
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

            if (companyname === entry.companyname) {
                document.getElementById("companyname").value = ""
            }

            if (jobtitle === entry.jobtitle) {
                document.getElementById("jobtitle").value = ""
            }

            return;
        }

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

    //I fall inga fel finns, skicka till PUT
    if (errors.length === 0) {

        let response = await fetch(`https://lab2-workexperience.onrender.com/api/workexperience/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(work)
        });
        let data = await response.json();
        console.log(data);

        //Ladda index vid lyckad input
        window.location = `./index.html`
    }

}

