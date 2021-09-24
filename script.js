"use strict";

document.addEventListener("DOMContentLoaded", start);

let studentList = [];
let expelledStudents = [];
let hackingSystem = false;

const Student = {
  imageUrl: "",
  firstName: "",
  lastName: "",
  middleName: "",
  // nickName: "",
  house: "",
  bloodstatus: "",
  prefect: false,
  squad: false,
  expel: false,
};

const settings = {
  filter: "all",
  sortBy: "name",
  sortDir: "asc",
};

let popWindow = document.querySelector("#popUp");
let closeWindow = document.querySelector("#close");

let firstName;
let middleName;
let lastName;
// let nickname;
let house;
let imageUrl;
let student;

function registerButtons() {
  document.querySelectorAll("[data-action='filter']").forEach((button) => button.addEventListener("click", selectFilter));

  document.querySelectorAll("[data-action='sort']").forEach((button) => button.addEventListener("click", selectSort));
}

function start() {
  loadJSON();
  registerButtons();
  registerExpelledStudents();
  registerSearchStudent();
}

async function loadJSON() {
  //Fetching json data
  const respons = await fetch("https://petlatkea.dk/2021/hogwarts/students.json");
  const studentJson = await respons.json();

  loadJSONBloodStatus(studentJson);
  console.log("Data loaded");
}

async function loadJSONBloodStatus(studentJson) {
  //Fetching json data
  const respons = await fetch("https://petlatkea.dk/2021/hogwarts/families.json");
  const jsonData = await respons.json();
  prepareObjects(studentJson);
  prepareBloodStatus(jsonData);

  document.querySelector("#hack").addEventListener("click", hackTheSystem);
  console.log("Blood status data loaded");
}

function registerExpelledStudents() {
  document.querySelector("[data-filter='expelled']").addEventListener("click", displayExpelledStudent);
}
function registerSearchStudent() {
  document.querySelector("#search").addEventListener("input", searchStudent);
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
    student.imageUrl = getImageUrl(student.lastName, student.firstName);

    studentList.push(student);
  });

  buildList();
  // displayList(studentList);
}

function prepareBloodStatus(jsonData) {
  console.log("defining bloodstatus");

  let halfBloodArray = jsonData.half;
  let pureBloodArray = jsonData.pure;

  studentList.forEach((student) => {
    if (halfBloodArray.includes(student.lastName)) {
      student.bloodstatus = "Half-Blood";
    } else if (pureBloodArray.includes(student.lastName)) {
      student.bloodstatus = "Pure-Blood";
    } else {
      student.bloodstatus = "Muggleborn";
    }
  });
  buildList();
}

function searchStudent() {
  let search = document.querySelector("#search").value.toLowerCase();
  let searchResult = studentList.filter(filterSearch);

  function filterSearch(student) {
    //Searching firstName and lastLame
    if (student.firstName.toString().toLowerCase().includes(search) || student.lastName.toString().toLowerCase().includes(search)) {
      return true;
    } else {
      return false;
    }
  }

  if (search == " ") {
    displayList(studentList);
  }

  displayList(searchResult);
}

console.log(studentList);

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

  // console.log(fullName)
  if (fullName.length > 2) {
    middleName = fullName[1];
    // console.log(middleName)
  }
  // console.log(middleName)
  // if (middleName.includes("")) {
  // middleName = student.middleName.substring(0, 1).toUpperCase() + student.middleName.substring(1).toLowerCase();
  else {
    middleName = " ";
  }

  return middleName;
}

function getLastName(fullname) {
  lastName = fullname.trim();
  lastName = lastName.substring(lastName.lastIndexOf(" ") + 1);
  return lastName;
}

function getImageUrl(lastname, firstname) {
  // lastname_firstletteroffirstname.png

  if (lastname !== undefined) {
    const smallLastName = lastname.toLowerCase();
    const smallFirstName = firstname.toLowerCase();
    const firstLetterOfFirstName = firstname.slice(0, 1).toLowerCase();
    if (lastname == "Patil") {
      const imageSrc = `${smallLastName}_${smallFirstName}.png`;
      return imageSrc;
    } else if (lastname.includes("-") == true) {
      const partOfLastNameAfterHyphen = lastname.slice(lastname.indexOf("-") + 1);
      const imageSrc = `${partOfLastNameAfterHyphen}_${firstLetterOfFirstName}.png`;
      return imageSrc;
    } else {
      const imageSrc = `${smallLastName}_${firstLetterOfFirstName}.png`;
      return imageSrc;
    }
  }
}

function displayList(studentList) {
  document.querySelector("#list tbody").innerHTML = "";
  studentList.forEach(displayStudent);

  //  console.log("displayList");
}

function selectFilter(event) {
  const filter = event.target.dataset.filter;
  setFilter(filter);
}

function setFilter(filter) {
  settings.filterBy = filter;
  buildList();
}

function filterList(filteredList) {
  // let filteredList = studentList;
  if (settings.filterBy === "gryffindor") {
    // create a filtered list of only Gryffindor
    filteredList = studentList.filter(filterGryffindor);
  } else if (settings.filterBy === "slytherin") {
    // create a filtered list of only Slytherin
    filteredList = studentList.filter(filterSlytherin);
  } else if (settings.filterBy === "hufflepuff") {
    // create a filtered list of only Hufflepuff
    filteredList = studentList.filter(filterHufflepuff);
  } else if (settings.filterBy === "ravenclaw") {
    filteredList = studentList.filter(filterRavenclaw);
  }

  return filteredList;
}

function filterGryffindor(student) {
  return student.house === "Gryffindor";
}

function filterHufflepuff(student) {
  return student.house === "Hufflepuff";
}
function filterRavenclaw(student) {
  return student.house === "Ravenclaw";
}
function filterSlytherin(student) {
  return student.house === "Slytherin";
}

function displayExpelledStudent() {
  console.log("Show expelled students");
  displayList(expelledStudents);
}

function selectSort(event) {
  const sortBy = event.target.dataset.sort;
  const sortDir = event.target.dataset.sortDirection;

  if (sortDir === "asc") {
    event.target.dataset.sortDirection = "desc";
  } else {
    event.target.dataset.sortDirection = "asc";
  }
  // console.log(`user selected ${sortBy}`);

  setSort(sortBy, sortDir);
}

function setSort(sortBy, sortDir) {
  settings.sortBy = sortBy;
  settings.sortDir = sortDir;
  buildList();
}

function sortList(sortedList) {
  let direction = 1;

  if (settings.sortDir === "desc") {
    direction = -1;
  } else {
    direction = 1;
  }

  sortedList = sortedList.sort(sortByProperty);

  function sortByProperty(A, B) {
    if (A[settings.sortBy] < B[settings.sortBy]) {
      return -1 * direction;
    } else {
      return 1 * direction;
    }
  }

  return sortedList;
}

function buildList() {
  const currentList = filterList(studentList);
  const sortedList = sortList(currentList);
  displayList(sortedList);
  // displayExpelledList(expelledStudentList);
}

function displayList(studentList) {
  document.querySelector("#list tbody").innerHTML = "";
  studentList.forEach(displayStudent);
  displayNumbers(studentList);

  console.log("displayList");
}

function displayExpelledList(students) {
  document.querySelector("#list #expelled");

  students.forEach(displayExpelledStudents);
}

function displayStudent(student) {
  const clone = document.querySelector("template#studentList").content.cloneNode(true);

  clone.querySelector("[data-field=image] img").src = `images/${student.imageUrl}`;
  clone.querySelector("[data-field=firstName]").textContent = student.firstName;
  clone.querySelector("[data-field=middleName]").textContent = student.middleName;
  clone.querySelector("[data-field=lastName]").textContent = student.lastName;
  // clone.querySelector("[data-field=nickName]").textContent = student.nickName;
  clone.querySelector("[data-field=house]").textContent = student.house;
  clone.querySelector("[data-field=bloodstatus]").textContent = student.bloodstatus;

  //squad
  if (student.squad === true) {
    clone.querySelector("[data-field=squad]").textContent = "YES";
  } else {
    clone.querySelector("[data-field=squad]").textContent = "NO";
  }

  clone.querySelector("[data-field=squad]").addEventListener("click", clickSquad);
  function clickSquad() {
    if (student.squad === true) {
      student.squad = false;
    } else {
      tryToBeINSquad(student);
    }
    buildList();
  }

  // prefect
  if (student.prefect === true) {
    clone.querySelector("[data-field=prefect]").textContent = "⭐";
  } else {
    clone.querySelector("[data-field=prefect]").textContent = "☆";
  }

  clone.querySelector("[data-field=prefect]").addEventListener("click", clickStar);

  function clickStar() {
    console.log("clicking");
    if (student.prefect === true) {
      student.prefect = false;
    } else {
      tryToMakePrefect(student);
      student.prefect = true;
    }
    buildList();
  }

  // squad
  if (student.squad === true) {
    clone.querySelector("[data-field=squad]").textContent = "YES";
  } else {
    clone.querySelector("[data-field=squad]").textContent = "NO";
  }

  clone.querySelector("[data-field=squad]").addEventListener("click", clickSquad);
  function clickSquad() {
    if (student.squad === true) {
      student.squad = false;
    } else {
      tryToBeINSquad(student);
    }
    buildList();
  }
  // expel
  if (student.expel === true) {
    clone.querySelector("[data-field=expel]").textContent = "EXPELLED";
  } else {
    clone.querySelector("[data-field=expel]").textContent = "ACTIVE";
  }

  clone.querySelector(".student_profile_image").addEventListener("click", () => showDetails(student));

  closeWindow.addEventListener("click", () => (popWindow.style.display = "none"));
  document.querySelector("#list tbody").appendChild(clone);
}

function tryToMakePrefect(selectedStudent) {
  const allPrefects = studentList.filter((student) => student.prefect);
  const prefects = allPrefects.filter((prefect) => prefect.house === selectedStudent.house);

  const other = prefects.filter((prefects) => prefects.house === selectedStudent.house && prefects.gender === selectedStudent.gender).shift();

  // house and gender included
  if (other !== undefined) {
    console.log("there can only be one prefect of each type");
    removeOther(other);
  } else {
    appointPrefect(selectedStudent);
  }

  function removeOther(other) {
    document.querySelector("#removeother").classList.remove("hidden");
    document.querySelector("#removeother .clsbutton").addEventListener("click", closeDialog);
    document.querySelector("#remove_other").addEventListener("click", clickRemoveOther);

    function closeDialog() {
      document.querySelector("#removeother").classList.add("hidden");
      document.querySelector("#removeother .clsbutton").removeEventListener("click", closeDialog);
      document.querySelector("#remove_other").removeEventListener("click", clickRemoveOther);
    }
    function clickRemoveOther() {
      removePrefect(other);
      appointPrefect(selectedStudent);
      buildList();
      closeDialog();
    }
  }

  function removeAandB(prefectA, prefectB) {}

  function removePrefect(studentPrefect) {
    studentPrefect.prefect = false;
  }
  function appointPrefect(student) {
    student.prefect = true;
  }
}

function showDetails(student) {
  popWindow.style.display = "";
  popWindow.classList.remove("hidden");

  popWindow.querySelector(".full_name").textContent = ` ${student.firstName} ${student.middleName} ${student.lastName}`;
  popWindow.querySelector(".student_image").src = `images/${student.imageUrl}`;
  popWindow.querySelector(".house span").textContent = student.house;
  popWindow.querySelector(".blood_type span").textContent = student.bloodstatus;

  if (student.expel === true) {
    popWindow.querySelector("#expelbutton").style.backgroundColor = "black";
    popWindow.querySelector("#expelbutton").style.cursor = "";
  } else {
    popWindow.querySelector("#expelbutton").style.backgroundColor = "transparent";
    popWindow.querySelector("#expelbutton").style.cursor = "pointer";
    // Add Expelled in popup
    document.querySelector("#expelbutton").addEventListener("click", clickExpel);
  }

  if (student.prefect === true) {
    popWindow.querySelector(".prefect span").textContent = `★  is prefect`;
  } else {
    popWindow.querySelector(".prefect span").textContent = `☆  not prefect`;
  }

  function clickExpel() {
    student.expel = true;

    popWindow.querySelector("#expelbutton").style.backgroundColor = "black";
    popWindow.querySelector("#expelbutton").style.cursor = "";
    document.querySelector("#expelbutton").removeEventListener("click", clickExpel);
    expelTheStudent(student);

    buildList();
  }

  if (student.squad === true) {
    popWindow.querySelector(".squad span").textContent = ` Is member`;
  } else {
    popWindow.querySelector(".squad span").textContent = `Not member`;
  }

  document.querySelector(".addsquad").addEventListener("click", clickAddSquad);

  function clickAddSquad() {
    document.querySelector(".addsquad").removeEventListener("click", clickAddSquad);
    if (student.squad === true) {
      student.squad = false;
    } else {
      tryToBeINSquad(student);
    }
    buildList();
  }

  function tryToBeINSquad(selectedStudent) {
    if (selectedStudent.house === "Slytherin") {
      addToSquad(selectedStudent);
    } else if (selectedStudent.bloodstatus === "Pure-Blood") {
      addToSquad(selectedStudent);
    } else {
      selectedStudent.squad = false;
    }
  }

  function addToSquad(selectedStudent) {
    selectedStudent.squad = true;
    document.querySelector(".squad").textContent = `Inquisitorial squad : Is member`;
  }

  if (student.house === "Slytherin") {
    document.querySelector("#studentInfo").style.color = "#B7B3B2";
    document.querySelector("#studentInfo").style.backgroundColor = "#095A2A";
    document.querySelector("#studentInfo").style.border = "7px solid #B7B3B2";
    // document.querySelector("#student_image").style.border = "1.5px solid #d6d5d5 ";
  } else if (student.house === "Hufflepuff") {
    document.querySelector("#studentInfo").style.color = "#7B716F";
    document.querySelector("#studentInfo").style.backgroundColor = "#FFD200";
    document.querySelector("#studentInfo").style.border = "7px solid #7B716F";
  } else if (student.house === "Gryffindor") {
    document.querySelector("#studentInfo").style.color = "#FBBA00";
    document.querySelector("#studentInfo").style.backgroundColor = "#81323B";
    document.querySelector("#studentInfo").style.border = "7px solid #FBBA00";
  } else if (student.house === "Ravenclaw") {
    document.querySelector("#studentInfo").style.color = "#325088";
    document.querySelector("#studentInfo").style.backgroundColor = "#A5D3F2";
    document.querySelector("#studentInfo").style.border = "7px solid #325088";
  }
}

function expelTheStudent(student) {
  console.log("Expel the student");
  studentList.splice(studentList.indexOf(student), 1);
  expelledStudents.push(student);
}

function numberGryffindors(student) {
  if (student.house === "Gryffindor") {
    return true;
  } else {
    return false;
  }
}
function numberHufflepuffs(student) {
  if (student.house === "Hufflepuff") {
    return true;
  } else {
    return false;
  }
}
function numberRavenclaws(student) {
  if (student.house === "Ravenclaw") {
    return true;
  } else {
    return false;
  }
}
function numberSlytherins(student) {
  if (student.house === "Slytherin") {
    return true;
  } else {
    return false;
  }
}
function displayNumbers(studentList) {
  document.querySelector("#totalnumber_students").textContent = `Displayed students : ${studentList.length}`;
  document.querySelector("#g_students").textContent = `Gryffindor: ${studentList.filter(numberGryffindors).length}`;
  document.querySelector("#h_students").textContent = `Hufflepuff: ${studentList.filter(numberHufflepuffs).length}`;
  document.querySelector("#r_students").textContent = `Ravenclaw: ${studentList.filter(numberRavenclaws).length}`;
  document.querySelector("#s_students").textContent = `Slytherin: ${studentList.filter(numberSlytherins).length}`;
  // displayed students

  // // expelled students
  // document.querySelector(
  //   "#expelled_students"
  // ).textContent = `Expelled students : ${expelledStudents.length}`;
}

function hackTheSystem() {
  console.log("system hacked");
  if (hackingSystem === false) {
    //add me to studentlist
    const hacked = Object.create(Student);
    hacked.firstName = "Gosia";
    hacked.lastName = "Warwaszynska";
    hacked.house = "Gryffindor";
    hacked.prefect = true;
    hacked.expelled = false;
    hacked.bloodstatus = "Half-blood";
    hacked.squad = false;
    messUpTheBloodStatus();
    studentList.unshift(hacked);
    console.log(Student);

    hackingSystem = true;

    buildList();
    setTimeout(function () {
      alert("THE SYSTEM HAS BEEN HACKED. BEWARE!");
    }, 100);
  } else {
    alert("THE SYSTEM HAS BEEN HACKED!!!");
  }
}

function messUpTheBloodStatus() {
  studentList.forEach((student) => {
    if (student.bloodstatus === "Muggle-born") {
      student.bloodstatus = "Pure-blood";
    } else if (student.bloodstatus === "Half-blood") {
      student.bloodstatus = "Pure-blood";
    } else {
      let bloodNumber = Math.floor(Math.random() * 3);
      if (bloodNumber === 0) {
        student.bloodstatus = "Muggle-born";
      } else if (bloodNumber === 1) {
        student.bloodstatus = "Half-blood";
      } else {
        student.bloodstatus = "Pure-blood";
      }
    }
  });
}
