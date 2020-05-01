import { elements } from "./base";
const renderRecipe = (recipe) => {
  //   console.log(recipe);
  const markup = `
<li>
    <a class="results__link " href="#${recipe.recipe_id}">
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
  elements.pageButtons.innerHTML = " ";
};
export const getInput = () => elements.searchInput.value;
export const renderRecipes = (recipes, currentPage = 1, resPerPage = 10) => {
  // хайлтын үр дүнг хуудаслаж үзүүлэх
  // page = 2 байвал start нь 10, end = 20 болж байна
  const start = (currentPage - 1) * resPerPage;
  const end = currentPage * resPerPage;

  recipes.slice(start, end).forEach(renderRecipe);
  // Хуудаслалтуудыг гаргаж ирэх
  const totalPages = Math.ceil(recipes.length / resPerPage);
  renderButtons(currentPage, totalPages);
};
//type ===> 'prev', 'next'
//Arrow functiong duudahin tuld dooros ni l duudah yostoi
const createButton = (
  page,
  type,
  dir
) => `<button class="btn-inline results__btn--${type}" data-goto=${page}>
<svg class="search__icon">
    <use href="img/icons.svg#icon-triangle-${dir}"></use>
</svg>
<span>Хуудас ${page}</span>
</button>`;
const renderButtons = (currentPage, totalPages) => {
  let buttonHtml;

  if (currentPage === 1 && totalPages > 1) {
    //1-р хуудсан дээр дээр байна 2-р хуудас гэдэг товч гаргана
    buttonHtml = createButton(2, "next", "right");
  } else if (currentPage < totalPages) {
    buttonHtml = createButton(currentPage - 1, "prev", "left");
    buttonHtml += createButton(currentPage + 1, "next", "right");
    // өмнөх болон дараачийн хуудасруу шилжих товчуудыг үзүүл
  } else if (currentPage === totalPages) {
    // хамгийн сүүлийн хуудас дээр байна. Өмнөхрүү шилжүүлэх товчийг үзүүлнэ.
    buttonHtml = createButton(currentPage - 1, "prev", "left");
  }

  elements.pageButtons.insertAdjacentHTML("afterbegin", buttonHtml);
};
