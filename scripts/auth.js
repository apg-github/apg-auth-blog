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
  try {
    showProgressBar("signup-progress");
    const email = signupForm["signup-email"].value;
    const password = signupForm["signup-password"].value;

    await auth.createUserWithEmailAndPassword(email, password);

    const modal = document.querySelector("#modal-signup");
    M.Modal.getInstance(modal).close();
  } catch (e) {
    console.log(e);
  } finally {
    hideProgressBar("signup-progress");
    signupForm.reset();
  }
});

const logout = document.querySelector("#logout");
logout.addEventListener("click", async (e) => {
  e.preventDefault();
  await auth.signOut();
});

const loginForm = document.querySelector("#login-form");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  try {
    showProgressBar("login-progress");
    const email = loginForm["login-email"].value;
    const password = loginForm["login-password"].value;

    await auth.signInWithEmailAndPassword(email, password);

    const modal = document.querySelector("#modal-login");
    M.Modal.getInstance(modal).close();
  } catch (e) {
    console.log(e);
  } finally {
    hideProgressBar("login-progress");
    loginForm.reset();
  }
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

    M.Modal.getInstance(modal).close();
  } catch (e) {
    console.log(e);
  } finally {
    hideProgressBar("create-docs-progress");
    createForm.reset();
  }
});
