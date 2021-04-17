const docsList = document.querySelector(".guides");
const userLoggedOutLinks = document.querySelectorAll(".logged-out");
const userLoggedInLinks = document.querySelectorAll(".logged-in");
const accountDetails = document.querySelector(".account-details");
const loggedOutCardsContainer = document.querySelector(".logged-out-cards");
const cards = loggedOutCardsContainer.querySelectorAll(".card");

const setupCards = () => {
  cards.forEach(async (card, i) => {
    const title = card.querySelector(".card-title");
    const content = card.querySelector("p");
    const action = card.querySelector(".card-action");

    const cardData = await db
      .collection("cards")
      .doc((i + 1).toString()) // to match docId in firestore
      .get();

    const data = await cardData.data();

    title.innerHTML = data.title ? data.title : "title";
    content.innerHTML = data.content ? data.content : "content";
    action.innerHTML = data.action ? data.action : "action";

    // initially is none
    card.style.display = "block";
  });
};

const setupUI = async (user) => {
  setupCards();
  if (user) {
    const userDatabaseObject = await db.collection("users").doc(user.uid).get();
    loggedOutCardsContainer.style.display = "none";
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
    loggedOutCardsContainer.style.display = "block";

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
        <li class="black-text">
        
          <div class="collapsible-header grey lighten-4">${docs.title}</div>
          <div class="collapsible-body white">
            <span>${docs.content}</span>
            <div class="divider"></div>
            <br/>
            <a href="#" class="edit-doc-btn waves-effect waves-light btn-small modal-trigger" data-target="modal-update">Edit</a>
            <a class="delete-doc-btn waves-effect waves-light btn-small">Delete</a>
          </div>
          
        </li>
        `;
      html += li;
    });
    docsList.innerHTML = html;

    // Deleting docs in firestore
    document.querySelectorAll(".delete-doc-btn").forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        const content = e.path[0].closest("div.collapsible-body").querySelector("span").innerHTML;
        const docToDelete = await db.collection("docs").where("content", "==", content).get();
        docToDelete.forEach((element) => {
          element.ref.delete();
        });
        const docs = await db.collection("docs").get();
        setupDocs(docs.docs);
      });
    });

    // Updating docs in firestore
    document.querySelectorAll(".edit-doc-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        console.log(e.path);
      });
    });
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

  const darkModeSwitch = document.querySelector(".dark-mode-switch input");
  darkModeSwitch.addEventListener("click", () => {
    const body = document.querySelector("body");

    if (darkModeSwitch.checked) {
      body.classList.add("white-text");
      body.classList.remove("lighten-3");
      body.classList.add("darken-2");
      window.localStorage.setItem("dark-mode", "true");
    } else {
      body.classList.remove("white-text");
      body.classList.remove("darken-2");
      body.classList.add("lighten-3");
      window.localStorage.setItem("dark-mode", "false");
    }
  });
});
