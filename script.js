"use strict";

document.addEventListener("DOMContentLoaded", start);

const studentList = [];
const Student = {
    firstName: "",
    lastName: "",
    middleName: "",
    // nickName: "",
    // image: "",
    house: "",

}
let popWindow = document.querySelector("#popUp");
let closeWindow = document.querySelector("#close");


let firstName;
let middleName;
let lastName;
// let nickname;
let house;
// let image;


function registerButtons() {
    document.querySelectorAll("[data-action='filter']")
    .forEach(button => button.addEventListener("click", selectFilter));

}

function start() {
    loadJSON();
    registerButtons();
}
function loadJSON() {
    fetch("https://petlatkea.dk/2021/hogwarts/students.json")
    .then((response) => response.json())
    .then((jsonData) => {
        prepareObjects(jsonData)
    });
    // console.log("JSON data loaded");
}

function prepareObjects(jsonData) {
    jsonData.forEach((elm) => {

              const student = Object.create(Student);
              student.firstName = getFirstName(elm.fullname);
              student.firstName = student.firstName.substring(0, 1).toUpperCase() + student.firstName.substring(1).toLowerCase();
              student.middleName = getMiddleName(elm.fullname);
            //   student.middleName = middleName

            //   student.nickname = getNickName(elm.fullname);
              student.lastName = getLastName(elm.fullname);
              student.lastName = student.lastName.substring(0, 1).toUpperCase() + student.lastName.substring(1).toLowerCase();
              student.house = elm.house;
              student.house = student.house.trim();
              student.house = student.house.substring(0, 1).toUpperCase() + student.house.substring(1).toLowerCase();
              studentList.push(student);
            });
    

            displayList(studentList);
}


// console.log(studentList);


function getFirstName(fullName) {
firstName = fullName.trim();
if (fullName.includes(" ")) {
    firstName = firstName.substring(0, firstName.indexOf(" "));
} else {
        firstName = fullName;
    }
return firstName;
   
  }


  function getMiddleName(fullName) {
    fullName = fullName.trim();
    fullName = fullName.split(" ");
    
    console.log(fullName)
    if (fullName.length > 2) {
        middleName = fullName[1];
        console.log(middleName)

    }
        // console.log(middleName)
        // if (middleName.includes("")) {
        // middleName = student.middleName.substring(0, 1).toUpperCase() + student.middleName.substring(1).toLowerCase();
         else {
        middleName = undefined;
        }
    
    return middleName;

  }




  function getLastName(fullname) {
      lastName = fullname.trim();
      lastName = lastName.substring(lastName.lastIndexOf(" ") + 1);
      return lastName;
 
  }

function displayList() {
    document.querySelector("#list tbody").innerHTML = "";
    studentList.forEach(displayStudent);
    //  console.log("displayList");


}

function displayStudent(student) {
    const clone = document.querySelector("template#studentList").content.cloneNode(true);

    clone.querySelector("[data-field=firstName]").textContent = student.firstName;
    clone.querySelector("[data-field=middleName]").textContent = student.middleName;
    clone.querySelector("[data-field=lastName]").textContent = student.lastName;
    // clone.querySelector("[data-field=nickName]").textContent = student.nickName;
    clone.querySelector("[data-field=house]").textContent = student.house;

    document.querySelector("#list").appendChild( clone );

    // console.log("displayStudent");
}


function selectFilter(event) {
    const filter = event.target.dataset.filter;
    filterList(filter);
    }
  

function filterList(filterBy) {
let filteredList = studentList;
if (filterBy === "gryffindor") {
    // create a filterede list of only Gryffindor
    filteredList = studentList.filter(filterGryffindor);
  } else if (filterBy === "slytherin") {
    // create a filterede list of only Slytherin
    filteredList = studentList.filter(filterSlytherin);
  } else if (filterBy === "hufflepuff") {
    // create a filtered list of only Hyfflepuff
    filteredList = studentList.filter(filterHufflepuff);
  } else if (filterBy === "ravenclaw") {
    filteredList = studentList.filter(filterRavenclaw);}
//   } else if (settings.filterBy === "resposibilities") {
//     filteredList = studentList.filter(filterResponsibilities);
//   }
displayList(filteredList) 
 }

function filterGryffindor(student) {
    return student.house === "Gryffindor";
}

  function filterHufflepuff(student) {
    return student.house === "Hufflepuff";

      
} function filterRavenclaw(student) {
    return student.house === "Ravenclaw";

      
    
} function filterSlytherin(student) {
    return student.house === "Slytherin";

      
}
function displayList(studentList) {
    document.querySelector("#list tbody").innerHTML = "";
  studentList.forEach(displayStudent);
     console.log("displayList");


}

function displayStudent(student) {
    const clone = document.querySelector("template#studentList").content.cloneNode(true);

    clone.querySelector("[data-field=firstName]").textContent = student.firstName;
    clone.querySelector("[data-field=middleName]").textContent = student.middleName;
    clone.querySelector("[data-field=lastName]").textContent = student.lastName;
    // clone.querySelector("[data-field=nickName]").textContent = student.nickName;
    clone.querySelector("[data-field=house]").textContent = student.house;
    clone
    .querySelector(".popUp")
    .addEventListener("click", () => showDetails(student));  

    document.querySelector("#list tbody").appendChild(clone);
    closeWindow.addEventListener("click", () => (popWindow.style.display = "none"));


}
    


function showDetails(student) {
   

    popWindow.style.display = "";
    popWindow.classList.remove("hidden");
    popWindow.querySelector(
      ".full_name"
    ).textContent = ` ${student.firstName} ${student.middleName} ${student.lastName}`;
}


