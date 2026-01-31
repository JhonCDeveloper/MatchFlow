const local = JSON.parse(localStorage.getItem("user"));

if(!local){
  window.location.href = '../login.html';
}
//Info the user
const nameUser =document.getElementById("nameProfile")
if(nameUser){
nameUser.textContent = local.name
}

//button Home
document.getElementById("btnHome").addEventListener("click", () => {
  document.getElementById("home").scrollIntoView({
    behavior: "smooth"
  });
});
//button offers Work
document.getElementById("btnWork").addEventListener("click", () => {
  document.getElementById("work").scrollIntoView({
    behavior: "smooth"
  });
});
//button Matches
document.getElementById("btnMatches").addEventListener("click", () => {
  document.getElementById("matches").scrollIntoView({
    behavior: "smooth"
  });
});
//button reservations
document.getElementById("btnReservations").addEventListener("click", () => {
  document.getElementById("reservations").scrollIntoView({
    behavior: "smooth"
  });
});


//Eveto de check para que aparezca las ofertas
const checkActive = document.getElementById("check");
const containerOfertas = document.querySelector(".container-ofertas");

checkActive.addEventListener("change", function () {
  if (checkActive.checked) {
    containerOfertas.style.display = "block";
    containerOfertas.innerHTML = `
      <div class="card">
        <div class="card-body d-flex justify-content-between align-items-center">
          <div>
            <h3 class="card-title">Backend Developer</h3>
            <p class="card-text">San Francisco</p>
          </div>
          <div>
            <p style="color: #cbd5e1">TechSoft</p>
            <p>$60.000/admaz</p>
          </div>
          <div>
            <button class="btn btn-bg">See Details</button>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-body d-flex justify-content-between align-items-center">
          <div>
            <h3 class="card-title">Full Stack Developer</h3>
            <p class="card-text">New York</p>
          </div>
          <div>
            <p style="color: #cbd5e1">CodeWorks</p>
            <p>$65.000/admaz</p>
          </div>
          <div>
            <button class="btn btn-bg">See Details</button>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-body d-flex justify-content-between align-items-center">
          <div>
            <h3 class="card-title">DevOps Engineer</h3>
            <p class="card-text">Remoto</p>
          </div>
          <div>
            <p style="color: #cbd5e1">Innovatech</p>
            <p>$105.000/admaz</p>
          </div>
          <div>
            <button class="btn btn-bg">See Details</button>
          </div>
        </div>
      </div>
    `;
  } else {
    containerOfertas.style.display = "none";
    containerOfertas.innerHTML = "";
  }
});




      

