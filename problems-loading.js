document.addEventListener("DOMContentLoaded", async function () {
  const tbody = document.getElementById("problems-table");
  try {
    const response = await fetch("./questions.json");
    const data = await response.json();
    questions = data.questions;
    tbody.innerHTML = questions
      .map(
        (question) => `
            <tr>
              <td>${question.title}</td>
              <td>${question.date}</td>
              <td>${question.level}</td>
              <td>${question.tags.map((tag) => `<div class="table-tag">${tag}</div>`).join("")}</td>
              <td><a href="${question.url}">${question.source}</a></td>
            </tr>
          `,
      )
      .join("");
  } catch (error) {
    console.error("Error loading JSON data:", error);
  }
});

// Function to convert table data to CSV
function downloadCSV() {
  const table = document.getElementById("problems-table");
  let csvContent = "data:text/csv;charset=utf-8,";

  // Add CSV headers
  csvContent += "Title,Date,Level,Tags, Source,Link\n";

  // Iterate over table rows
  table.querySelectorAll("tr").forEach((row) => {
    let rowData = [];
    row.querySelectorAll("td").forEach((cell, index) => {
      let text = cell.innerText.trim();
      if (index === 3) {
        // Tags column
        const tags = Array.from(cell.querySelectorAll(".table-tag"))
          .map((tag) => tag.innerText.trim())
          .join("; "); // Join multiple tags with a semicolon
        text = `"${tags.replace(/"/g, '""')}"`; // Escape quotes
      }

      if (index === 4) {
        // Extract Source (anchor text) & Link (href)
        const anchor = cell.querySelector("a");
        const sourceText = anchor ? anchor.innerText.trim() : "";
        const sourceLink = anchor ? anchor.href : "";
        rowData.push(`"${sourceText}"`); // Source column
        rowData.push(`"${sourceLink}"`); // Link column
        return; // Skip pushing 'text' since we handle both source and link separately
      }
      rowData.push(`"${text.replace(/"/g, '""')}"`); // Escape quotes
    });
    csvContent += rowData.join(",") + "\n";
  });

  // Create a temporary download link
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "problems.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Attach event listener to the download button
document.getElementById("download-btn").addEventListener("click", downloadCSV);

let inorderSorting = true;

document
  .getElementById("sortingLevel")
  .addEventListener("click", async function () {
    inorderSorting = !inorderSorting; // Toggle state

    const ascIcon = document.getElementById("asc-icon");
    const descIcon = document.getElementById("desc-icon");
    const tbody = document.getElementById("problems-table");
    try {
      const response = await fetch("./questions.json");
      const data = await response.json();

      const levelOrder = { easy: 1, medium: 2, hard: 3 };

      // Sort in ascending or descending order based on `inorderSorting`
      const sortedQuestions = data.questions.sort((a, b) => {
        return inorderSorting
          ? levelOrder[a.level.toLowerCase()] -
              levelOrder[b.level.toLowerCase()]
          : levelOrder[b.level.toLowerCase()] -
              levelOrder[a.level.toLowerCase()];
      });

      tbody.innerHTML = sortedQuestions
        .map(
          (question) => `
            <tr>
              <td>${question.title}</td>
              <td>${question.date}</td>
              <td>${question.level}</td>
              <td>${question.tags.map((tag) => `<div class="table-tag">${tag}</div>`).join("")}</td>
              <td><a href="${question.url}">${question.source}</a></td>
            </tr>
          `,
        )
        .join("");
      // Toggle SVG visibility
      ascIcon.style.display = inorderSorting ? "inline" : "none";
      descIcon.style.display = inorderSorting ? "none" : "inline";
    } catch (error) {
      console.error("Error loading JSON data:", error);
    }
  });

document
  .getElementById("sorting-by-date")
  .addEventListener("click", async function () {
    inorderSorting = !inorderSorting; // Toggle state

    const ascIcon = document.getElementById("asc-icon-for-date");
    const descIcon = document.getElementById("desc-icon-for-date");
    const tbody = document.getElementById("problems-table");
    try {
      const response = await fetch("./questions.json");
      const data = await response.json();

      const sortedQuestions = data.questions.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);

        return inorderSorting
          ? dateA - dateB // Ascending order
          : dateB - dateA; // Descending order
      });

      tbody.innerHTML = sortedQuestions
        .map(
          (question) => `
            <tr>
              <td>${question.title}</td>
              <td>${question.date}</td>
              <td>${question.level}</td>
              <td>${question.tags.map((tag) => `<div class="table-tag">${tag}</div>`).join("")}</td>
              <td><a href="${question.url}">${question.source}</a></td>
            </tr>
          `,
        )
        .join("");
      // Toggle SVG visibility
      ascIcon.style.display = inorderSorting ? "inline" : "none";
      descIcon.style.display = inorderSorting ? "none" : "inline";
    } catch (error) {
      console.error("Error loading JSON data:", error);
    }
  });
