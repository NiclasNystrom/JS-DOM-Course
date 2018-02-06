
const _table = new PriceTable();
initEvents();


function initEvents() {

	// Add Button to calculate the final sum.
	addLoadEvent(function() {

		_table.addColumn("Summa");
		_table.addRow("sumrow");

		var btn = document.createElement('input');
			btn.setAttribute('value', 'Beräkna pris');
			btn.setAttribute('class', 'btn-primary');
			btn.setAttribute('type', 'button');
			btn.setAttribute('onclick', '_table.eval()');

		// Insert button after table.
		_table.table.parentNode.insertBefore(btn, _table.table.nextSibling);
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


function PriceTable() {
	
	this.table = document.getElementById('pricetable');
	
	this.eval = function () {
	  
	  	// Evaluate...
	  	// 	1. Final sum for each individual row.
	  	//	2. Final amount of items (one row may contain > 1 items.)
	  	// Exclue: First row (headings) and last row (final sums).
	  	var nSum = 0, nAmount = 0;
		for (var i = 1; i < this.table.rows.length-1; i++){
			var row = this.table.rows[i];
			var price 	= parseInt(row.cells[3].firstChild.nodeValue);
			var amount 	= parseInt(row.cells[4].firstChild.value);
			var sum 	= amount * price;	
			row.cells[5].firstChild.nodeValue = sum;
			
			nSum += sum;
			nAmount += amount;
		}

		// Set values in final row (rowsum) to values below...
		this.table.rows[this.table.rows.length-1].cells[4].firstChild.nodeValue = nAmount;
		this.table.rows[this.table.rows.length-1].cells[5].firstChild.nodeValue = nSum;
	}


	this.addRow = function (id) {

		var nCols  = this.table.rows[0].cells.length;
		var newRow = this.table.insertRow(-1);
			newRow.setAttribute('id', id);

		// Add columns.
		for (var i = 0; i < nCols; i++ ){
			newRow.insertCell(i);
		}

		newRow.cells[4].appendChild(document.createTextNode(''));
		newRow.cells[5].appendChild(document.createTextNode(''));
	}
  
	this.addColumn = function (name) {
		for (var i = 0; i < this.table.rows.length; i++) {
			if (i == 0) {
				var newCol = document.createElement('th');
					newCol.appendChild(document.createTextNode(name));
				this.table.tHead.children[0].appendChild(newCol);
			} else {
				var newCol = this.table.rows[i].insertCell(-1);
					newCol.appendChild(document.createTextNode(''));
			}
		}
	}
}




