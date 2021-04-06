auth.onAuthStateChanged(async (user) => {
  if (user) {
    const docs = await db.collection("docs").get();
    setupDocs(docs.docs);
    setupUI(user);
  } else {
    console.log(user);
    setupDocs([]);
    setupUI();
  }
});

const signupForm = document.querySelector("#signup-form");
signupForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  showProgressBar();
  const email = signupForm["signup-email"].value;
  const password = signupForm["signup-password"].value;

  await auth.createUserWithEmailAndPassword(email, password);
  hideProgressBar();

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
  showProgressBar("login-progress");
  const email = loginForm["login-email"].value;
  const password = loginForm["login-password"].value;

  await auth.signInWithEmailAndPassword(email, password);
  hideProgressBar("login-progress");

  const modal = document.querySelector("#modal-login");
  M.Modal.getInstance(modal).close();
  signupForm.reset();
});

const createForm = document.querySelector("#create-form");
createForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  try {
    showProgressBar("create-docs-progress");
    await db.collection("docs").add({
      title: createForm["title"].value,
      content: createForm["content"].value,
    });
    const docs = await db.collection("docs").get();
    setupDocs(docs.docs);

    const modal = document.querySelector("#modal-create");

    hideProgressBar("create-docs-progress");
    M.Modal.getInstance(modal).close();
    createForm.reset();
  } catch (e) {
    console.log(e);
  } finally {
  }
});
