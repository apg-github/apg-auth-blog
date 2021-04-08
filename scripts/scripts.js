const progressBar = document.querySelector(".progress");

const showProgressBar = (elementId) => {
  document.querySelector("#" + elementId).classList.remove("hide");
};

const hideProgressBar = (elementId) => {
  document.querySelector("#" + elementId).classList.add("hide");
};
