require("@babel/polyfill");
import Search from "./model/Search";
import { elements, renderLoader, clearLoader } from "./view/base";
import * as searchView from "./view/searchView";
import * as likesView from "./view/likesView";
import Recipe from "./model/Recipe";
import {
  renderRecipe,
  clearRecipe,
  highlightSelectedRecipe,
} from "./view/recipeView";
import List from "./model/List";
import * as listView from "./view/listView";
import Like from "./model/Like";
import Likes from "./model/Like";

/**
 * Web app төлөв
 * - Хайлтын query, үр дүн
 * - Тухайн үзүүлж байгаа жор
 * - Лайкласан жорууд
 * - Захиалж байгаа жорын найрлаганууд
 */

const state = {};
// Like цэсийг хаах

/**
 * Хайлтын контроллер = Model ==> Controller <== View
 */
const controlSearch = async () => {
  // 1) Вэбээс хайлтын түлхүүр үгийг гаргаж авна.
  const query = searchView.getInput();

  if (query) {
    // 2) Шинээр хайлтын обьектийг үүсгэж өгнө.
    state.search = new Search(query);

    // 3) Хайлт хийхэд зориулж дэлгэцийг UI бэлтгэнэ.
    searchView.clearSearchQuery();
    searchView.clearSearchResult();
    renderLoader(elements.searchResultDiv);

    // 4) Хайлтыг гүйцэтгэнэ
    await state.search.doSearch();

    // 5) Хайлтын үр дүнг дэлгэцэнд үзүүлнэ.
    clearLoader();
    if (state.search.result === undefined) alert("Хайлтаар илэрцгүй...");
    else searchView.renderRecipes(state.search.result);
  }
};

elements.searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  controlSearch();
});

elements.pageButtons.addEventListener("click", (e) => {
  const btn = e.target.closest(".btn-inline");

  if (btn) {
    const gotoPageNumber = parseInt(btn.dataset.goto, 10);
    searchView.clearSearchResult();
    searchView.renderRecipes(state.search.result, gotoPageNumber);
  }
});

/**
 * Жорын контролллер
 */
const controlRecipe = async () => {
  // 1) URL-аас ID-ийг салгаж
  const id = window.location.hash.replace("#", "");
  if (!state.likes) state.likes = new Like();
  // URL дээр ID байгаа эсэхийг шалгана.
  if (id) {
    // 2) Жорын моделийг үүсгэж өгнө.
    state.recipe = new Recipe(id);

    // 3) UI дэлгэцийг бэлтгэнэ.
    clearRecipe();
    renderLoader(elements.recipeDiv);
    highlightSelectedRecipe(id);

    // 4) Жороо татаж авчирна.
    await state.recipe.getRecipe();

    // 5) Жорыг гүйцэтгэх хугацаа болон орцыг тооцоолно
    clearLoader();
    state.recipe.calcTime();
    state.recipe.calcHuniiToo();

    // 6) Жороо дэлгэцэнд гаргана
    renderRecipe(state.recipe, state.likes.isLiked(id));
  }
};

// window.addEventListener("hashchange", controlRecipe);
// window.addEventListener("load", controlRecipe);
["hashchange", "load"].forEach((event) =>
  window.addEventListener(event, controlRecipe)
);
window.addEventListener("load", (e) => {
  //Шинээр лайк моделийг апп дөнгөж ачаалагдахад үүсгэнэ.
  if (!state.likes) state.likes = new Like();
  // Лайк цэсийг гаргах эсэхийг шийдэх
  likesView.toggleLikeMenu(state.likes.getNumberOfLikes());
  //Лайкууд байвал тэдгээрийг цэсэнд нэмж харуулна.
  state.likes.likes.forEach((like) => likesView.renderLike(like));
});

/**
 * найрлаганы контроллер
 */
const controlList = () => {
  //Найрлаганы модел үүсгэнэ
  state.list = new List();
  listView.clearItems();
  //Уг модел рүү одоо харагдаж байга жорны бүх найрлагыг авч хийнэ
  state.recipe.ingredients.forEach((n) => {
    // Тухайн найрлагыг модел руу хийнэ
    const item = state.list.addItem(n);
    //Тухайн найрлагыг дэлгэцэнд гаргана
    listView.renderItem(item);
  });
};

/**
 * like controller
 */

const controlLike = () => {
  // 1) like -н моделыг үүсгэнэ
  if (!state.likes) state.likes = new Like();

  // 2) Одоо харагдаж байгаа жорын id - г олж авах
  const currentRecipeId = state.recipe.id;
  // 3) Энэ жорыг Лайкласан эсэхийг шалгана
  if (state.likes.isLiked(currentRecipeId)) {
    // 4) Лайкласан бол лайкийг нь болиулна
    state.likes.deleteLike(currentRecipeId);
    //    Лайкын цэснээс устгана
    likesView.deleteLike(currentRecipeId);
    // Лайк товчны лайкласан байдлыг болиулах
    likesView.toggleLikeBtn(false);
  } else {
    // 5) Лайклаагүй бол Лайклана
    const newLike = state.likes.addLike(
      currentRecipeId,
      state.recipe.title,
      state.recipe.publisher,
      state.recipe.image_url
    );
    // Лайк цэсэнд энэ лайкыг оруулах
    likesView.renderLike(newLike);
    // Лайк товчны лайкласан байдлыг лайкласан болгох
    likesView.toggleLikeBtn(true);
  }
  likesView.toggleLikeMenu(state.likes.getNumberOfLikes());
};

elements.recipeDiv.addEventListener("click", (e) => {
  if (e.target.matches(".recipe__btn, .recipe__btn *")) {
    controlList();
  } else if (e.target.matches(".recipe__love, .recipe__love *")) {
    controlLike();
  }
});
elements.shoppingList.addEventListener("click", (e) => {
  // Click хийсэн li элэментийн data-itemid attribute - г шүүж авах
  const id = e.target.closest(".shopping__item").dataset.itemid;
  //олдсон id тай орцийг моделаас устгана
  state.list.deleteItem(id);
  // дэлгэцээс ийм id тэй орцыг олж устгана.
  listView.deleteItem(id);
});
