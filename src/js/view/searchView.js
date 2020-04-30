import { elements } from "./base";
// image_url: "http://forkify-api.herokuapp.com/images/BBQChickenPizza3e2b.jpg"
// publisher: "My Baking Addiction"
// publisher_url: "http://www.mybakingaddiction.com"
// recipe_id: "a723e8"
// social_rank: 99.9999968917598
// source_url: "http://www.mybakingaddiction.com/barbecue-chicken-pizza-recipe/"
// title: "Barbecue Chicken Pizza"
//private function
const renderRecipe = (recipe) => {
  //   console.log(recipe);
  const markup = `
<li>
    <a class="results__link " href="${recipe.recipe_id}">
        <figure class="results__fig">
            <img src="${recipe.image_url}" alt="Test">
        </figure>
        <div class="results__data">
            <h4 class="results__name">${recipe.title}</h4>
            <p class="results__author">${recipe.publisher}</p>
        </div>
    </a>
</li>`;
  //ul рүүгээ нэмнэ.
  elements.searchResultList.insertAdjacentHTML("beforeend", markup);
};
export const clearSearchQuery = () => {
  elements.searchInput.value = "";
};
export const clearSearchResult = () => {
  elements.searchResultList.innerHTML = " ";
};
export const getInput = () => elements.searchInput.value;
export const renderRecipes = (recipes) => {
  recipes.forEach(renderRecipe);
};
