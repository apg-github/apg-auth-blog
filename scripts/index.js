const docsList = document.querySelector(".guides");
const userLoggedOutLinks = document.querySelectorAll(".logged-out");
const userLoggedInLinks = document.querySelectorAll(".logged-in");
const accountDetails = document.querySelector(".account-details");

const setupUI = async (user) => {
  if (user) {
    const userDatabaseObject = await db.collection("users").doc(user.uid).get();

    accountDetails.innerHTML = `
    <div>
      <h5>Logged in as ${user.email}</h5>
      <h6>Email verified: ${user.emailVerified}</h6>
      <p>
      User bio: ${userDatabaseObject.data().bio}
      </br>
      Last login: ${user.metadata.creationTime}
      </br>
      Account created: ${user.metadata.lastSignInTime}
      </p>
    </div>`;

    userLoggedOutLinks.forEach((link) => {
      link.style.display = "none";
    });
    userLoggedInLinks.forEach((link) => {
      link.style.display = "block";
    });
  } else {
    accountDetails.innerHTML = "";

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
  const modalOptions = {
    inDuration: 400, // Transition in duration
    outDuration: 400, // Transition out duration
    onOpenStart: (e) => {
      e.querySelector(".modal-error").innerHTML = "";
    },
  };
  M.Modal.init(modals, modalOptions);

  const items = document.querySelectorAll(".collapsible");
  M.Collapsible.init(items);
});
