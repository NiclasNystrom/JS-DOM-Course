


const fr = new FoodRetriever();
initEvents();


function initEvents() {
	// Button event.
	addLoadEvent(function(){  
		var searchBtn = document.getElementById('sok-button');
  			searchBtn.setAttribute('onclick', 'fr.get()');
  	});
}
// Standard solution to multiple onload-events.
function addLoadEvent(newOnLoadFunction){
  
	var prevOnLoad = window.onload;
	if(typeof window.onload != 'function'){
		window.onload = newOnLoadFunction;
		return;
	}

	window.onload = function() {
		prevOnLoad();
		newOnLoadFunction();
	}
}

function FoodRetriever() {
	
	this.url = "https://webservice.informatik.umu.se/webservice_livsmedel/getlivsmedel.php";
	this.dataType = "jsonp";
	this.table = new FoodTable();


	this.get = function() {
		var searchWord = document.getElementById('livsmedelsSokOrd').value;
		$.ajax(
		{
		  url: this.url,
		  dataType: this.dataType,
		  data: {
		  	limit: 100,
			namn: searchWord
		  },
		  success: this.onSuccess
		});
	}

	this.onSuccess = function(response) {
	    
	    // Remark: Calling this.table... yields undefined behaviour.

	    // Clear table from past entries.
	    fr.table.clearTable();

	    // Fill table with entries matching the searchword.
	    fr.table.fillTable(response);
	}

}


function FoodTable() {
	
	this.table 		= document.getElementById('tabell');
	this.headings 	= this.table.tHead.children[0];


	this.hide = function() {
		$("#tabell").hide();
	}
	this.show = function() {
		$("#tabell").show();
	}
	this.clearTable = function() {
		while(this.table.rows.length > 1) {
		    this.table.deleteRow(1);
		}		
	}

	this.fillTable = function (data) {
		
		var tableBody = this.table.getElementsByTagName('tbody')[0];
		if (data.livsmedel.length > 0) {
			for(var i = 0; i < data.livsmedel.length; i ++){
				this.insertNutrients(tableBody.insertRow(i), data.livsmedel[i]);
			}
			this.show();
		} else {
			this.hide();
		}
	}

	this.insertNutrients = function(row, food) {
		row.insertCell(0).innerHTML = food.namn;
		row.insertCell(1).innerHTML = food.energi;
		row.insertCell(2).innerHTML = food.kolhydrater;
		row.insertCell(3).innerHTML = food.protein;
		row.insertCell(4).innerHTML = food.fett;
	}
}






