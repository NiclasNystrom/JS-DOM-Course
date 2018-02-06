/*
* Fetches recipies ('POST':s) from 'primarycontent' and store them.
* Create menu by...
*	For each recipe...
*		Create list item...
*			Set title as first node in <h4>-tag
*			Link list item with corresponding recipe_id.
*			Add onclick-event listener...
*				Extract id (<href>) from clicked list item and...
*					Make is visibile
*					Hide all other items.
* Add menu to the pages contentarea.
*/

$(document).ready(generateMenu);

recipies=[];

function generateMenu() {
	retrieveRecipies();
	createMenu();
	showRecipe2(getCurrentUrlRecipeIndex(), true);
}


/*
 * Checks if url contains a recipe index and if so start the the index at recipe with index index.
 * E.g. When clicking on a anchorlink IN the inspector you will be redirected to a new page with the url ending similar to:
 * "index.html#recipe_n" where n is an index. If the url contains such an index then show that recipe instead of the first recipe.
 * When opening the page as normal the url won't contain an index and then the page will show the first recipe as per definiation in the assignment spec. 
 */
function getCurrentUrlRecipeIndex() {
	recipeIndexToShow = 0;
	var query_string = window.location.href;
	tokens=query_string.split("#recipe_");
	if (tokens.length > 1) {
		recipeIndexToShow=tokens[1];
	}
	return recipeIndexToShow;	
}

/*
* retrieveRecipies retrieves all recipies (id=post) in the container
* 'primarycontent' and saves each recipie in a 'Recipe'-object. Each object
* is given an id in sequential order (recipe_0, recipe_1, ..., recipe_n).
*/
function retrieveRecipies() {
	var content = document.getElementById('primarycontent');
  	var extractedRecipies = content.getElementsByClassName('post');
  	for(var i = 0; i < extractedRecipies.length; i++) {
  		recipies.push(new Recipe(i, extractedRecipies[i]));
  	}
}

/*
* hideRecipies hides all recipies in the array of recipies. 
*/
function hideRecipies(){
	for(var i = 0; i < recipies.length; i++){
		recipies[i].hide();
	}
}


/*
* showRecipe makes the recipie corresponding with index visible.
*/
function showRecipe(index){
	if (recipies.length > 0) {
		if (index >= 0 && index < recipies.length) {
			recipies[index].show();
			return;
		}
	}
}

/*
* showRecipe2 makes the recipie corresponding with index visible and
* prompts the feature to hide all other recipies.
*/
function showRecipe2(index, hideOthers){
	if (hideOthers) {
		hideRecipies();
	}
	showRecipe(index);
}

/*
* createMenu creates a MenuBuilder and inserts all retrieved recipies into it.
*/
function createMenu() {
	var mb = new MenuBuilder();
	for(var i = 0; i < recipies.length; i++){
		mb.addItem(recipies[i]);
	}
	mb.build();
}


/*
* MenuBuilder create and prepares a menu containing recipies. 
*/
function MenuBuilder() {
	this.recipe;
	this.currentItem;
	this.link_;
	this.menu = document.createElement('ul');

	/*
	* Each recipe is inserted into the menubuilder here. First the recipe 
	* is converted into a list item and then linked accordingly to it's
	* correspnding id (recipe_x). Lastly the item are appended to the menu.
	*/
	this.addItem = function(newItem){
		this.recipe = newItem;
		this.createItem();
		this.attachLink();
	    this.menu.appendChild(this.currentItem);		
	}

	/*
	* When all items are in the menubuilder the build function loads it into
	* the website.
	*/
	this.build = function(){
		var rc = document.getElementById('receptmeny');
		var ca = rc.getElementsByClassName('contentarea')[0];
    		ca.appendChild(this.menu);
	}

	/*
	* Creates a new list item.
	*/
	this.createItem = function() {
		this.currentItem = document.createElement('li');
	}

	/*
	* Create a link in the menu to a given recipe (accordingly to recipe id)
	* and appends the link to the relevant list item.
	*/
	this.attachLink = function () {
		var recipe_id = 'recipe_'+this.recipe.id;
		this.recipe.content.setAttribute('id', recipe_id)
		this.link_ = document.createElement('a');
		this.link_.href = '#'+recipe_id;
		this.link_.textContent = this.getTitle();
		this.addOnClickListener();
		this.currentItem.appendChild(this.link_);
	}


	/*
	* Extracts the title from the <h4>-tag within a recipe body. The title
	* is presumed to be the first node in the result.
	*/
	this.getTitle = function() {
		return this.recipe.content.getElementsByTagName("h4")[0].innerHTML;
	}


	/*
	* Extract the id to the clicked recipe and make it visible (and hide all other recipies).
	* The id is extracted by extracting the string from the tag href in the clicked
	* object and split it by the delimiter _. The id/index is the last token (e.g. #recipe_1) 
	*/
	this.addOnClickListener = function() {
		this.link_.addEventListener("click", function(event){
			var tokens = event.target.getAttribute('href').split('_');
			showRecipe2(tokens[1], true);
			event.preventDefault();
		});
	}
}


/*
* Object storing recipies and methods specific to a certain recipe.
*/
function Recipe(id, content){
	this.id = id;
	this.content = content;

	this.show = function(){
		this.content.style.display = 'block';
	}
	this.hide = function(){
		this.content.style.display = 'none';
	}
}