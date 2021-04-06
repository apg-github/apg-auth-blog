const docsList = document.querySelector(".guides");
const userLoggedOutLinks = document.querySelectorAll(".logged-out");
const userLoggedInLinks = document.querySelectorAll(".logged-in");

const setupUI = (user) => {
  if (user) {
    userLoggedOutLinks.forEach((link) => {
      link.style.display = "none";
    });
    userLoggedInLinks.forEach((link) => {
      link.style.display = "block";
    });
  } else {
    userLoggedOutLinks.forEach((link) => {
      link.style.display = "block";
    });
    userLoggedInLinks.forEach((link) => {
      link.style.display = "none";
    });
  }
};

const setupDocs = (data) => {
  if (data.length) {
    let html = "";

    data.forEach((element) => {
      const docs = element.data(); // retrieve data from db snapshots
      const li = `
        <li>
          <div class="collapsible-header grey lighten-4">${docs.title}</div>
          <div class="collapsible-body white"><span>${docs.content}</span></div>
        </li>
        `;
      html += li;
    });
    docsList.innerHTML = html;
  } else {
    docsList.innerHTML = `<h4 class="center-align">Login to see stored docs</h4>`;
  }
};

document.addEventListener("DOMContentLoaded", () => {
  const modals = document.querySelectorAll(".modal");
  M.Modal.init(modals);

  const items = document.querySelectorAll(".collapsible");
  M.Collapsible.init(items);
});
