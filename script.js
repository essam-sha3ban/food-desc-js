let mealsCon = document.getElementById("meals");
let favoriteContainerM = document.getElementById("fav-meals");
let searchTerm = document.getElementById("search-term");
let searchIcon = document.getElementById("search");
let closePopupPtn = document.getElementById("close-popup");
let mealPopup = document.getElementById("meal-popup");
let mealInfoEl = document.getElementById("meal-info");
getRandomMeal();
fetchFavMeals();

function getRandomMeal() {
  fetch("https://www.themealdb.com/api/json/v1/1/random.php")
    .then((res) => res.json())
    .then((data) => {
      let resData = data.meals[0];
      // console.log(resData)
      addMeal(resData, true);
    });
}

async function getMealById(id) {
  let resp = await fetch(
    "https://www.themealdb.com/api/json/v1/1/lookup.php?i=" + id
  );
  let respData = await resp.json();

  let meal = respData.meals[0];
  console.log(meal);
  return meal;
}

async function getMealBySearch(term) {
  let resp = await fetch(
    "https://www.themealdb.com/api/json/v1/1/search.php?s=" + term
  );

  let resData = await resp.json();
  let meals = resData.meals;
  return meals;
}

function addMeal(mealData, random = false) {
  let meal = document.createElement("div");
  meal.classList.add("meal");
  meal.innerHTML = `<div class="meal">
                
  <div class="meal-header">
     ${random ? `<span class="random">Random Recipe </span>` : ""}
  <img src="${mealData.strMealThumb}" class="show-info" alt="${mealData.strMeal}">

  </div>
  <div class="meal-body">
      <h4>${mealData.strMeal}</h4>
      <button class="fav-btn ">
      <i class="fa-solid fa-heart"></i>
      </button>
  </div>
  </div>`;
  
  let btnFav = meal.querySelector(".meal-body .fav-btn");
  btnFav.addEventListener("click", () => {
    if (btnFav.classList.contains("active")) {
      removeMealFromLocalS(mealData.idMeal);
      btnFav.classList.remove("active");
    } else {
      addMealToLocalS(mealData.idMeal);
      btnFav.classList.add("active");
    }
    
    fetchFavMeals();
  });
  mealsCon.appendChild(meal);

  meal.querySelector(".show-info").addEventListener("click",()=>{
    showMealInfo(mealData)
  })
}

function addMealToLocalS(mealId) {
  let mealIds = getMealFromLocalS();
  localStorage.setItem("mealIds", JSON.stringify([...mealIds, mealId]));
}

function removeMealFromLocalS(mealId) {
  let mealIds = getMealFromLocalS();
  localStorage.setItem(
    "mealIds",
    JSON.stringify(mealIds.filter((id) => id !== mealId))
  );
}

function getMealFromLocalS() {
  let mealIds = JSON.parse(localStorage.getItem("mealIds"));
  return mealIds === null ? [] : mealIds;
}

async function fetchFavMeals() {
  // clean the container
  favoriteContainerM.innerHTML = "";

  let mealIds = getMealFromLocalS();
  for (let i = 0; i < mealIds.length; i++) {
    let mealId = mealIds[i];
    let meal = await getMealById(mealId);
    addMealFav(meal);
  }
}

function addMealFav(mealData) {
  let favMeal = document.createElement("li");
  favMeal.classList.add("swiper-slide")

  favMeal.innerHTML = `
      <img
          src="${mealData.strMealThumb}"
          alt="${mealData.strMeal}"
          class="info"
          /><span>${mealData.strMeal}</span> 
          <button class="cancel"> <i class=" fas fa-window-close"></i> </button>   
      `;
      favMeal.querySelector(".info").addEventListener("click",()=>{
      showMealInfo(mealData)
      })

  favoriteContainerM.appendChild(favMeal);
  let btnCancel = favMeal.querySelector(".cancel");
  btnCancel.addEventListener("click", () => {
    removeMealFromLocalS(mealData.idMeal);
    fetchFavMeals();
  });
 
 
  
}

searchIcon.addEventListener("click", async () => {
  mealsCon.innerHTML = "";
  let search = searchTerm.value;
  let meals = await getMealBySearch(search);
  if (meals) {
    meals.forEach((meal) => {
      addMeal(meal);
    });
  }
});

function showMealInfo(mealData) {

  mealInfoEl.innerHTML="";
  let mealEl = document.createElement("div");
  const ingredients = [];
    
  // get ingredients and measures
  for (let i = 1; i <= 20; i++) {
      if (mealData["strIngredient" + i]) {
          ingredients.push(`${mealData["strIngredient" + i]} - ${mealData["strMeasure" + i]}`);
      } else {
          break;
      }
  }
  mealEl.innerHTML = `
    <h1>${mealData.strMeal}</h1>
    <img src="${mealData.strMealThumb}"alt="${mealData.strMeal}"/>
    <p>${mealData.strInstructions}</p>
    <h3>Ingredients:</h3>
    <ul>
      ${ingredients.map((ing) => `<li>${ing}</li>`).join("")}
        </ul>
      `;
  mealInfoEl.appendChild(mealEl)
  mealPopup.classList.remove("close");
}

closePopupPtn.addEventListener("click", () => {
  mealPopup.classList.add("close");
});
//localStorage.clear()



var swiper = new Swiper(".mySwiper", {
  slidesPerView: 4,
  spaceBetween: 0,
  freeMode: true,
pagination: {
  el: ".swiper-pagination",
  clickable: true,
},

});
