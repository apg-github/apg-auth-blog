auth.onAuthStateChanged(async (user) => {
  if (user) {
    const docs = await db.collection("docs").get();
    setupDocs(docs.docs);
    setupUI(user);
  } else {
    setupDocs([]);
    setupUI();
  }
});

const signupForm = document.querySelector("#signup-form");
signupForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = signupForm["signup-email"].value;
  const password = signupForm["signup-password"].value;

  await auth.createUserWithEmailAndPassword(email, password);

  const modal = document.querySelector("#modal-signup");
  M.Modal.getInstance(modal).close();
  signupForm.reset();
});

const logout = document.querySelector("#logout");
logout.addEventListener("click", async (e) => {
  e.preventDefault();
  await auth.signOut();
});

const loginForm = document.querySelector("#login-form");
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = loginForm["login-email"].value;
  const password = loginForm["login-password"].value;

  await auth.signInWithEmailAndPassword(email, password);

  const modal = document.querySelector("#modal-login");
  M.Modal.getInstance(modal).close();
  signupForm.reset();
});

const createForm = document.querySelector("#create-form");
createForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  try {
    await db.collection("docs").add({
      title: createForm["title"].value,
      content: createForm["content"].value,
    });

    const modal = document.querySelector("#modal-create");
    M.Modal.getInstance(modal).close();
    signupForm.reset();
  } catch (e) {
    console.log(e);
  }
});
