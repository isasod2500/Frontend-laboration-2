"use strict";

document.addEventListener("DOMContentLoaded", () => {
  fetchData();
})

async function fetchData() {

  try {
    const getDatabase = await fetch("https://lab2-workexperience.onrender.com/api/workexperience")
    const db = await getDatabase.json()
    console.log(db)
    let id = db.id
    let companyname = db.companyname
    let jobtitle = db.jobtitle
    let location = db.location
    let startdate = db.startdate
    let enddate = db.enddate
    let description = db.description


    Object.values(db).forEach(entry => {
      let listContainer = document.getElementById("listContainer")
      let listItem = document.createElement("div")
      listItem.setAttribute("class", "listItem")

      let listHeader = document.createElement("h2")
      listHeader.innerHTML = `${entry.companyname} - ${entry.jobtitle}`

      let listLocation = document.createElement("h3")
      listLocation.innerHTML = `${entry.location}`

      let startDate = entry.startdate.slice(0, 10)
      let endDate = entry.enddate.slice(0, 10)
      let listDate = document.createElement("h3")
      listDate.innerHTML = `${startDate} -> ${endDate}`

      let listDescription = document.createElement("p")
      
      listDescription.innerHTML = `${entry.description}`
      listDescription.style.fontStyle = "italic"

      listItem.appendChild(listHeader)
      listItem.appendChild(listLocation)
      listItem.appendChild(listDate)
      listItem.appendChild(listDescription)
      listContainer.appendChild(listItem)


      console.log(entry.id)
    })

  } catch (error) {
    console.error(`Something went wrong: ${error}`)
  }
}