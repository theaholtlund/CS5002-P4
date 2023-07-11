// Module code: CS5002
// Module: Programming Principles and Practice
// Analysing Data For Top 500 Songs of All Time

// Use fetch() method to access data from the JSON file
// The promises created from the then() method will be completed when a response is available
fetch("songs.json")
  .then((response) => response.json())
  .then((data) => {
    console.log("Data:", data);
    const earliestYear = findEarliestYear(data); // Should be 1948.
    console.log("Earliest song year available:", earliestYear);
    const latestYear = findLatestYear(data); // Should be 2009.
    console.log("Latest song year available:", latestYear);

    constructYearOptions(earliestYear, latestYear, "selectYearStart");
    constructYearOptions(earliestYear, latestYear, "selectYearEnd");
  })
  // Catch() method added to promise object to instruct the program what to do if an error occurs
  // In this instance, the error is logged to the console
  .catch((error) => console.log(error));

// Function to populate the drop-down menu for start year
function findEarliestYear(data) {
  const earliestSong = data.songs.sort((a, b) => {
    return parseInt(a.year) - parseInt(b.year);
  })[0];
  return earliestSong.year;
}

// Same procedure to find the end year
// Change the order in which the values are returned, so that latest song is in index position 0
function findLatestYear(data) {
  const latestSong = data.songs.sort((a, b) => {
    return parseInt(b.year) - parseInt(a.year);
  })[0];
  return latestSong.year;
}

// Populate the drop-down menus with the year options
// Only include years available in the original JSON "songs" array of objects
// This function is called in the fetch() method at the top of the file, where the id parameters are defined
function constructYearOptions(earliestYear, latestYear, id) {
  for (let i = earliestYear; i <= latestYear; i++) {
    const select = document.getElementById(id);

    const option = document.createElement("option");
    option.value = i;
    option.innerHTML = i;

    select.appendChild(option);
  }
}

// Function to populate the HTML table
function createTableRow(song) {
  const tr = document.createElement("tr");
  tr.innerHTML =
    "<td>" +
    song.rank +
    "</td>" +
    "<td>" +
    song.title +
    "</td>" +
    "<td>" +
    song.artist +
    "</td>" +
    "<td>" +
    song.album +
    "</td>" +
    "<td>" +
    song.year +
    "</td>";
  songTable.appendChild(tr);
}

// Function to clear the table after a search has been completed
// Removing all child nodes except from the first two, so that users can search again
function removeAllTableRows(songTable) {
  // Used to check how many childNodes should be removed
  console.log(songTable.childNodes);
  while (songTable.childNodes.length > 2) {
    songTable.removeChild(songTable.lastChild);
  }
}

// Function to remove existing rows and add new ones
// This function will later be included in the function to populate the HTML table
function updateTableHtml(data) {
  const songTable = document.getElementById("songTable");

  // Remove all existing <tr> elements
  removeAllTableRows(songTable);

  // Add all new <tr> elements
  data.forEach(createTableRow);
}

// Function that will populate the songsTable in the HTML file
function updateTable(songs) {
  fetch("songs.json")
    .then((response) => response.json())
    .then((data) => {
      const selectYearStart = document.getElementById("selectYearStart");
      const selectYearEnd = document.getElementById("selectYearEnd");
      const selectArtist = document.getElementById("selectArtist");
      const selectTitle = document.getElementById("selectTitle");

      const startYear = selectYearStart.value;
      console.log("Start year searched for:", startYear);
      const endYear = selectYearEnd.value;
      console.log("End year searched for:", endYear);
      const artistName = selectArtist.value;
      console.log("Artist name searched for:", artistName);
      const songTitle = selectTitle.value;
      console.log("Song title searched for:", songTitle);

      // Add security checks for the validity of input data
      // This function will display an error message if the start year is greater than the end year
      function verifyYears(startYear, endYear) {
        if (startYear > endYear) {
          alert(
            "Start year cannot be greater than end year. Please select a different value."
          );
          console.log(
            "Start year cannot be greater than end year. Please select a different value."
          );
        } else {
          console.log("Valid year range:", startYear, "-", endYear);
        }
      }

      // Create a new array that only include the songs matching the user input
      const yearArray = data.songs.filter(
        (song) => song.year >= startYear && song.year <= endYear
      );

      // Continue filtering on relevant artist names
      const artistsArray = yearArray.filter((song) =>
        song.artist.toLowerCase().includes(artistName.toLowerCase())
      );

      // Continue filtering on relevant song titles
      const titleArray = artistsArray.filter((song) =>
        song.title.toLowerCase().includes(songTitle.toLowerCase())
      );

      // Update the table based on the final array that was filtered
      verifyYears(startYear, endYear);
      updateTableHtml(titleArray);
    });
}

// Function to show all songs
function showAllSongs(songs) {
  fetch("songs.json")
    .then((response) => response.json())
    .then((data) => {
      console.log("Data:", data);
      const songTable = document.getElementById("songTable");

      // Remove all existing <tr> elements.
      removeAllTableRows(songTable);

      // Add all new <tr> elements.
      // Here, we need to add ".songs", since the previously defined what properties to access.
      data.songs.forEach(createTableRow);
    });
}
