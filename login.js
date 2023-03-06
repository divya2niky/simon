function login() {
    const nameE1 = document.querySelector("#name");
    localStorage.setItem("userName", nameE1.value);
    window.location.href = "play.html";
}