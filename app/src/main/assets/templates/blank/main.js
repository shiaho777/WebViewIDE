const button = document.querySelector("#tap");
let count = 0;
button.addEventListener("click", () => {
  count += 1;
  button.textContent = "点过 " + count + " 次";
});
