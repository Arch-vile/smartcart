import {
  createOrderClient
} from "adapters/ordersHttpClient";
import {createSuggestionService} from "core/ports/in/suggestionService";
import {Suggestion} from "core/domain/models";

// Called from the bookmarklet bookmark, the entry point
export function runBookmarklet() {
    console.log('starting bookmarklet')
  let dao = createOrderClient();
  const suggestionService = createSuggestionService(dao);
  const suggestions = suggestionService.suggestions();
  suggestions.then(proposals => {
    // Start the UI update loop
    setInterval(() => {
      updateUI(proposals);
    }, 500);
  });
}

function updateUI(itemsForNextOrder: Suggestion[]) {

  // Remove the previously created html
  const previousHtml = document.getElementById("smartCart");
  if (previousHtml) {
    previousHtml.remove();
  }

  const currentShoppingItems = Array.from(document.querySelectorAll(
      ".shopping-list-item .product-result-name-content .product-name SPAN"))
  .map(it => it.innerHTML);

  const itemsToPropose = itemsForNextOrder.filter(
      it => currentShoppingItems.indexOf(it.item.name) === -1);

  const newProposalsHtml = proposalsHTML(proposalItemsHtml(itemsToPropose));
  shoppingListDepartmentsContainer().prepend(htmlToElement(newProposalsHtml));

  //
  // Private functions
  //
  function htmlToElement(html: string): ChildNode  {
    let template = document.createElement('template');
    html = html.trim(); // Never return a text node of whitespace as the result
    template.innerHTML = html;
    return template.content.firstChild!;
  }

  function shoppingListDepartmentsContainer() {
    return document.querySelector(
        '#shopping-basket-element > section > div > div.shopping-list-shopping-content > ul')!;
  }

  function proposalItemsHtml(suggestions: Suggestion[]): string {
    return suggestions.map(suggestion => `<li>${suggestion.item.name}</li>`).join('');
  }

  function proposalsHTML(itemsHtml: string) {
    return `
<li id="smartCart" class="shopping-list-department">
  <h3 class="department-heading">
    <span>Muista myös nämä</span>
  </h3>
  <ul class="shopping-list-items department-item-listing">
    <li><ul style="padding-left: 1em; list-style-type:circle; list-style-position: inside;">${itemsHtml}</ul></li>
  </ul>
</li>
`;
  }

}

