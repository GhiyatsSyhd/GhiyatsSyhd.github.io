// get all element in html
const box = document.getElementById("box");

const btnPick = document.getElementById("btn-pick");
const btnSort = document.getElementById("btn-sort");
const btnTeam = document.getElementById("btn-team");
const fieldMaxTeamMember = document.getElementById("max-team-member");

const display = document.getElementById("result");

// variable contain result of pick for download
let downloadResult = [];

// Event Listeners
btnPick.addEventListener("click", pickerListener);
btnSort.addEventListener("click", sortListener);
btnTeam.addEventListener("click", teamListener);

display.addEventListener("click", downloadListener);

/**
 * Function to get input from user and
 * make array of members
 * from split input
 * @returns {Array}
 */
function getInput() {
  const value = box.value;
  if (value == "") {
    Swal.fire("Error", "Nothing can be scrambled, please fill in the items", "error");
    return;
  }
  return value.split("\n");
}
/**
 * Function to reset display result and show result
 * @param {*} result
 */
function showResult(result) {
  display.innerHTML = "";
  display.appendChild(result);
  location.hash = "#result";
  display.scrollIntoView();
}

/**
 * Function to create download button
 * with id
 * @param {String} id
 */
function createButton(name, id) {
  const dwnldBtn = document.createElement("button");
  dwnldBtn.className = "btn btn-light px-3 m-3";
  dwnldBtn.id = id;
  dwnldBtn.innerHTML = name;
  display.appendChild(dwnldBtn);
}

// Listener Function

/**
 * Listener function for picker button
 * It will make random picker from input
 * and show result each 100 milisecond
 * and result will be pick in last random picker
 */
function pickerListener(e) {
  e.preventDefault();

  // get input from user
  const members = getInput();
  if (!members) {
    return;
  }

  // create html result for display and show
  location.hash = "#result";
  display.scrollIntoView();

  // create element for result
  const div = document.createElement("div");
  div.className = "d-flex justify-content-center align-items-center flex-grow-1";
  const span1 = document.createElement("span");
  span1.className = "text-white fs-1 fw-bold text-center m-5";
  display.innerHTML = "";
  div.appendChild(span1);
  display.appendChild(div);

  // asign element result with delay animation
  const acak = setInterval(function () {
    const tesRes = randomPick(members);
    span1.innerHTML = tesRes;
  }, 100);

  // remove delay animation after
  setTimeout(() => {
    clearInterval(acak);
  }, 2000);
}

/**
 * Listener function for random sort button
 * It will make random sort from input
 * and show result
 * Result will be random sort
 * Show as list in html
 * After showing result, it will create download button
 * with id sort-dwnld
 * And change variable downloadResult to result
 */
function sortListener(e) {
  e.preventDefault();

  // get input from user
  const members = getInput();
  if (!members) {
    return;
  }

  // create result
  const result = randomSort(members);

  // create html result for display
  const ol = document.createElement("ol");
  ol.className = "text-white fs-5";
  result.forEach((res) => {
    const li = document.createElement("li");
    li.className = "mb-1";
    li.innerHTML = res;
    ol.appendChild(li);
  });

  // show result
  showResult(ol);
  // change download result
  downloadResult = result;
  // create download button
  createButton("Donwload CSV", "sort-dwnld");
  createButton("Copy Text", "sort-copy");
}

/**
 * Listener function for random team button
 * It will make random team from input
 * and show result
 * Result will be random team
 * Show as list in card in html
 * After showing result, it will create download button
 * with id team-dwnld
 * And change variable downloadResult to result
 */
function teamListener(e) {
  e.preventDefault();

  // get max team member from user
  const maxTeamMember = parseInt(fieldMaxTeamMember.value);
  // check if max team member is valid
  if (!maxTeamMember || maxTeamMember < 1) {
    // using sweet alert to show error
    Swal.fire("Error", "Enter number for maximum items per group", "error");
    return;
  }

  // get input from user
  const members = getInput();
  if (!members) {
    return;
  }

  // create result
  const teams = makeGroup(randomSort(members), maxTeamMember);

  // create html result for display
  const outter = document.createElement("div");
  outter.className = "row";
  teams.forEach((team, i) => {
    const row = document.createElement("div");
    row.className = "col-md-4 p-3";
    const card = document.createElement("div");
    card.className = "card p-2";
    const title = document.createElement("h5");
    title.className = "card-title ms-3 mt-2";
    title.innerHTML = "Group " + (i + 1);
    card.appendChild(title);
    const cardBody = document.createElement("div");
    cardBody.className = "card-body";
    const ol = document.createElement("ol");
    team.forEach((member) => {
      const li = document.createElement("li");
      li.innerHTML = member;
      ol.appendChild(li);
    });
    cardBody.appendChild(ol);
    card.appendChild(cardBody);
    row.appendChild(card);
    outter.appendChild(row);
  });

  // show result
  showResult(outter);
  // change download result
  downloadResult = teams;
  // create download button
  createButton("Download CSV", "team-dwnld");
  createButton("Copy Text", "team-copy");
}

/**
 * Listener function for download button
 * It will create csv file from downloadResult
 * and download it
 *
 * Listener on display cause download button will be created after show result
 */
function downloadListener(e) {
  e.preventDefault();

  if (e.target.id == "sort-dwnld" || e.target.id == "team-dwnld") {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to download this file?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, download it!",
    }).then((result) => {
      if (result.isConfirmed) {
        // check id of button
        if (e.target.id === "sort-dwnld") {
          // create head of csv
          var result = "Urutan,Anggota";
          // by looping downloadResult and add to result it will create body of csv
          downloadResult.forEach((res, i) => {
            result += `\n${i + 1},${res}`;
          });
          // create and download csv file from result
          // with name result.csv
          // this function on another file
          download("result.csv", result);
        }

        // check id of button
        if (e.target.id == "team-dwnld") {
          // create head of csv
          var result = "Team,No Anggota,Anggota";
          // by looping downloadResult and add to result it will create body of csv
          downloadResult.forEach((res, i) => {
            result += `\n${i + 1}`;
            res.forEach((r, j) => {
              result += `\n,${j + 1},${r}`;
            });
          });
          // create and download csv file from result
          // with name result.csv
          // this function on another file
          download("result.csv", result);
        }
      }
    });
  }

  if (e.target.id == "sort-copy" || e.target.id == "team-copy") {
    if (e.target.id === "sort-copy") {
      // create head of csv
      var result = "Random Sort\n";
      // by looping downloadResult and add to result it will create body of csv
      downloadResult.forEach((res, i) => {
        result += `\n${i + 1}. ${res}`;
      });
      copyTextToClipboard(result, (res) => {
        if (res) {
          Swal.fire("Text Has Copied!", "Result text has beed copied", "success");
        }
      });
    }

    // check id of button
    if (e.target.id == "team-copy") {
      // create head of csv
      var result = "Random Team";
      // by looping downloadResult and add to result it will create body of csv
      downloadResult.forEach((res, i) => {
        result += `\n\nGroup ${i + 1}`;
        res.forEach((r, j) => {
          result += `\n${j + 1}. ${r}`;
        });
      });
      copyTextToClipboard(result, (res) => {
        if (res) {
          Swal.fire("Text Has Copied!", "Result text has beed copied", "success");
        }
      });
    }
  }
}
