"use strict";
//När DOM är laddat, kör fetchData
document.addEventListener("DOMContentLoaded", () => {
  fetchData();

})

//async function för fetchData
async function fetchData() {

  //Kör get.fetch mot APIn och skriv ut det
  try {
    const getDatabase = await fetch("https://lab2-workexperience.onrender.com/api/workexperience")
    const db = await getDatabase.json()

    let id = db.id
    let companyname = db.companyname
    let jobtitle = db.jobtitle
    let jobLocation = db.jobLocation
    let startdate = db.startdate
    let enddate = db.enddate
    let description = db.description

    //forEach loop för object
    Object.values(db).forEach(entry => {
      let listContainer = document.getElementById("listContainer")
      let listItem = document.createElement("div")
      listItem.setAttribute("class", "listItem")

      let listHeader = document.createElement("h2")
      listHeader.innerHTML = `${entry.companyname} - ${entry.jobtitle}`

      let listjobLocation = document.createElement("h3")
      listjobLocation.innerHTML = `${entry.jobLocation}`

      let startDate = entry.startdate.slice(0, 10)
      let endDate = entry.enddate.slice(0, 10)
      let listDate = document.createElement("h3")
      listDate.innerHTML = `${startDate} -> ${endDate}`

      let listDescription = document.createElement("p")

      listDescription.innerHTML = `${entry.description}`
      listDescription.style.fontStyle = "italic"

      let buttonsDiv = document.createElement("div")
      buttonsDiv.setAttribute("class", "buttonsDiv")

      let updateBtn = document.createElement("button")
      updateBtn.setAttribute("class", "updateBtn")
      updateBtn.value = entry.id
      updateBtn.textContent = `Ändra post`


      let deleteBtn = document.createElement("button")
      deleteBtn.setAttribute("class", "deleteBtn")
      deleteBtn.value = entry.id
      deleteBtn.textContent = `Radera post`

      buttonsDiv.appendChild(updateBtn)
      buttonsDiv.appendChild(deleteBtn)

      listItem.appendChild(listHeader)
      listItem.appendChild(listjobLocation)
      listItem.appendChild(listDate)
      listItem.appendChild(listDescription)
      listItem.appendChild(buttonsDiv)
      listContainer.appendChild(listItem)

      console.log(entry)
      console.log(entry.id)
      updateBtn.addEventListener("click", () => {
        updatePage(entry.id)
      })
      deleteBtn.addEventListener("click", deleteQuery)

      

    })
    console.log(db)

    
  } catch (error) {
    console.error(`Something went wrong: ${error}`)
  }
}

function updatePage(id) {
  window.location=`./edit.html?id=${id}`
}

//Funktion för deleteBtn
async function deleteQuery() {
  let id = document.querySelector(".deleteBtn").value
  console.log(id)
  try {
    const deleteDatabase = await fetch(`https://lab2-workexperience.onrender.com/api/workexperience/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      },
    });

    const data = await deleteDatabase.json();

    console.log(data)
    document.getElementById("listContainer").innerHTML = ""
    fetchData()
  } catch (err) {
    console.error(err)
  }
}