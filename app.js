const ingredientsButton = document.getElementById("by-ingredients-button");
const categoryButton = document.getElementById("by-category-button");
const areaButton = document.getElementById("by-area-button");
const searchBtn = document.getElementById("search-btn");
const searchBox = document.querySelector(".meal-search-box");
const mealResult = document.querySelector(".meal-result");
const mealList = document.getElementById("meal");
const mealDetailsContent = document.querySelector(".meal-details-content");
const recipeCloseBtn = document.getElementById("recipe-close-btn");
const searchInput = document.getElementById("search-input");

//------------  Event listeners  --------

let searchTarget;
// To show the search box of the ingredient search
ingredientsButton.addEventListener("click", () => {
  searchTarget = "ingredients";
  showSearchBox(searchTarget);
});

// To show category search box
categoryButton.addEventListener("click", () => {
  searchTarget = "category";
  showSearchBox(searchTarget);
});

// To show Area search box
areaButton.addEventListener("click", () => {
  searchTarget = "area";
  showSearchBox(searchTarget);
});

// show the meals list once search bottom clicked
searchBtn.addEventListener("click", () => {
  let searchInputValue = searchInput.value.trim();

  // To check if the input are empty
  if (!searchInputValue) {
    return;
  }

  // use the correct Fetch URL based on the clicked button
  let fetchUrl;
  if (searchTarget === "ingredients") {
    fetchUrl = `https://www.themealdb.com/api/json/v1/1/filter.php?i=${searchInputValue}`;
  } else if (searchTarget === "category") {
    fetchUrl = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${searchInputValue}`;
  } else {
    fetchUrl = `https://www.themealdb.com/api/json/v1/1/filter.php?a=${searchInputValue}`;
  }
  getMealList(fetchUrl);
});

// show the meals Details
mealList.addEventListener("click", getMealRecipes);

// close the meal Details once close button clicked
recipeCloseBtn.addEventListener("click", () => {
  mealDetailsContent.parentElement.classList.remove("showRecipe");
});

//------------ End of Event listeners  --------

// get meal list that match with the ingredient , Category or Area entered
function getMealList(url) {
  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw Error(response.statusText);
      }
      return response.json();
    })
    .then((data) => {
      let html = "";
      if (data.meals) {
        data.meals.forEach((meal) => {
          html += `<div class="meal-item" data-id ="${meal.idMeal}">
                      <div class="meal-img">
                         <img src="${meal.strMealThumb}" alt="food" />
                      </div>

                      <div class="meal-name">
                         <h3>${meal.strMeal}</h3>
                         <a href="#" class="recipe-btn">Get Recipe</a>
                      </div>
                  </div>`;
        });
        mealList.classList.remove("notFound");
      } else {
        html = "Sorry We did not find any meal! <br> Please try again";
        mealList.classList.add("notFound");
      }
      mealList.innerHTML = html;
    })
    .catch((error) => {
      mealList.innerHTML = `OPPs.. Fetch Failed .. `;
      console.error(error);
      mealList.classList.add("notFound");
    });
}

// Get Recipe Details of the Meal

function getMealRecipes(e) {
  e.preventDefault();
  if (e.target.classList.contains("recipe-btn")) {
    let mealItem = e.target.parentElement.parentElement;
    fetch(
      `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealItem.dataset.id}`
    )
      .then((response) => {
        if (!response.ok) {
          throw Error(response.statusText);
        }
        return response.json();
      })
      .then((data) => {
        mealRecipeDetails(data.meals);
      })
      .catch((error) => {
        mealList.innerHTML = `OPPs.. Fetch Failed .. `;
        console.error(error);
        mealList.classList.add("notFound");
      });
  }
}

// get the recipe Details

function mealRecipeDetails(meal) {
  meal = meal[0];

  let html = `
            <h2 class="recipe-title">${meal.strMeal}</h2>
            <p class="recipe-category">${meal.strCategory}</p>

            <div class="recipe-instruct">
                <h3>Instructions:</h3>
                <p>
                ${meal.strInstructions}
                </p>
                
            </div>

              <div class="recipe-meal-img">
                   <img src="${meal.strMealThumb}" alt="" />
              </div>

              <div class="recipe-link">
                <a href="${meal.strYoutube}" target="_blank">Watch Video</a>
              </div>`;

  mealDetailsContent.innerHTML = html;
  mealDetailsContent.parentElement.classList.add("showRecipe");
}

// To show the correct search box based on the button clicked

function showSearchBox(Target) {
  searchInput.value = "";
  searchBox.classList.add("showElement");
  mealResult.classList.add("showRecipe");

  if (Target === "ingredients") {
    searchInput.placeholder = "Enter an ingredient, Ex : Egg , Rice, Cheese";
  } else if (Target === "category") {
    searchInput.placeholder =
      " Enter a Category , Ex : beef , Breakfast, Chicken";
  } else {
    searchInput.placeholder =
      " Enter an Area , Ex : Malaysian , American, Dutch";
  }
}
