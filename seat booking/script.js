// Function to populate dropdown for autocomplete
function setupDropdown(inputId, options) {
    const input = document.getElementById(inputId);
    const dropdown = document.createElement("div");
    dropdown.className = "dropdown-menu";
    input.parentElement.appendChild(dropdown);
  
    input.addEventListener("input", function () {
      const value = this.value.toLowerCase();
      dropdown.innerHTML = "";
      if (value.length < 2) {
        dropdown.style.display = "none";
        return;
      }
  
      // Filter options based on input value
      const filteredOptions = options.filter(option =>
        option.toLowerCase().includes(value)
      );
  
      filteredOptions.forEach(option => {
        const item = document.createElement("div");
        item.textContent = option;
        item.className = "dropdown-item";
        item.onclick = () => {
          input.value = option;
          dropdown.style.display = "none";
        };
        dropdown.appendChild(item);
      });
  
      dropdown.style.display = filteredOptions.length ? "block" : "none";
    });
  
    // Hide dropdown when clicking outside
    document.addEventListener("click", function (event) {
      if (!dropdown.contains(event.target) && event.target.id !== inputId) {
        dropdown.style.display = "none";
      }
    });
  }
  
  // Setup autocomplete for 'from' and 'destination' inputs
  setupDropdown("from", fromOptions);
  setupDropdown("destination", destinationOptions);
  
  // Function to filter results based on the search inputs
  function filterResults() {
    console.log("Filtering results...");
    document.querySelector(".spinner-border").style.display = "block";
  
    const fromInput = document.getElementById("from").value.toLowerCase();
    const destinationInput = document.getElementById("destination").value.toLowerCase();
    const endDateInput = document.getElementById("endDate").value;
  
    const formattedEndDate = endDateInput
      ? new Date(endDateInput).toLocaleDateString("en-GB").replace(/\//g, "-")
      : "";
  
    const rows = Array.from(document.querySelectorAll("#resultsBody tr"));
    let filteredRows = rows.filter((row) => {
      const fromCell = row.cells[0].textContent.toLowerCase();
      const destinationCell = row.cells[1].textContent.toLowerCase();
      const dateCell = row.cells[2].textContent;
  
      const matchesFrom = fromInput === "" || fromCell.includes(fromInput);
      const matchesDestination =
        destinationInput === "" || destinationCell.includes(destinationInput);
      const matchesDate =
        formattedEndDate === "" || dateCell === formattedEndDate;
  
      return matchesFrom && matchesDestination && matchesDate;
    });
  
    const tableBody = document.getElementById("resultsBody");
    tableBody.innerHTML = "";
    filteredRows.forEach((row) => tableBody.appendChild(row));
  
    document.querySelector(".spinner-border").style.display = "none";
  }
  
  // Function to clear the search form
  function clearForm() {
    document.getElementById("searchForm").reset();
    filterResults();
  }
  
  // Function to sort the table by the clicked column
  function sortTable(columnIndex) {
    console.log("Sorting table...");
    const table = document.querySelector("#resultsBody");
    const rows = Array.from(table.querySelectorAll("tr"));
    const isAscending = table.getAttribute("data-sort-order") === "asc";
  
    const sortedRows = rows.sort((rowA, rowB) => {
      const cellA = rowA.children[columnIndex].textContent.toLowerCase();
      const cellB = rowB.children[columnIndex].textContent.toLowerCase();
  
      if (columnIndex === 2) {
        // Date column
        const dateA = new Date(cellA.split("-").reverse().join("-"));
        const dateB = new Date(cellB.split("-").reverse().join("-"));
        return isAscending ? dateA - dateB : dateB - dateA;
      } else {
        return isAscending
          ? cellA.localeCompare(cellB)
          : cellB.localeCompare(cellA);
      }
    });
  
    sortedRows.forEach((row) => table.appendChild(row));
    table.setAttribute("data-sort-order", isAscending ? "desc" : "asc");
  }
  
  // Function to update pagination
  function updatePagination() {
    console.log("Updating pagination...");
    const rows = document.querySelectorAll("#resultsBody tr");
    const totalRows = rows.length;
    const totalPages = Math.ceil(totalRows / resultsPerPage);
  
    rows.forEach((row, index) => {
      row.classList.add("hidden");
      if (
        index >= (currentPage - 1) * resultsPerPage &&
        index < currentPage * resultsPerPage
      ) {
        row.classList.remove("hidden");
      }
    });
  
    document.querySelector(".pagination").innerHTML = `
      <li class="page-item ${currentPage === 1 ? "disabled" : ""}">
        <a class="page-link" href="#" onclick="changePage(${currentPage - 1})">Previous</a>
      </li>
      ${Array.from({ length: totalPages }, (_, i) => `
        <li class="page-item ${currentPage === i + 1 ? "active" : ""}">
          <a class="page-link" href="#" onclick="changePage(${i + 1})">${i + 1}</a>
        </li>
      `).join("")}
      <li class="page-item ${currentPage === totalPages ? "disabled" : ""}">
        <a class="page-link" href="#" onclick="changePage(${currentPage + 1})">Next</a>
      </li>
    `;
  }
  
  function changePage(page) {
    console.log("Changing page to:", page);
    const totalPages = Math.ceil(
      document.querySelectorAll("#resultsBody tr:not(.hidden)").length /
        resultsPerPage
    );
  
    if (page >= 1 && page <= totalPages) {
      currentPage = page;
      updatePagination();
    }
  }
  
  // Initialize autocomplete
  setupDropdown("from", fromOptions);
  setupDropdown("destination", destinationOptions);
  