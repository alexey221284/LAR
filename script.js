let addNewTask = document.getElementById("addNewTask");
addNewTask.addEventListener("click", (event) => addRow());

const NEW_TASK_NAME = "новая задача ";
let mainTable = document.getElementById("main_table");


function createPopup(id, content, taskDate) {
	let wrapper = document.getElementById('wrapper');

	let popup = document.createElement("div");
	popup.id = "popup";
	wrapper.append(popup);
	let buttonClose = document.createElement('span');
	buttonClose.id = "buttonClose";
	buttonClose.innerText = "X";
	popup.append(buttonClose);
	let nameEdit = document.createElement('input');
	nameEdit.type = "text";
	nameEdit.id = "nameEdit";
	nameEdit.value = content;
	popup.append(nameEdit);
	let dateEdit = document.createElement('input');
	dateEdit.type = "date";
	dateEdit.id = "dateEdit";
	dateEdit.value = taskDate;
	popup.append(dateEdit);
	let buttonSave = document.createElement('button');
	buttonSave.id = "buttonSave";
	buttonSave.innerText = "Сохранить";
	popup.append(buttonSave);
	//close
	buttonClose.addEventListener("click", event => closePopup(popup));
	//update
	buttonSave.addEventListener("click", event => updateItemInStorage(id, nameEdit.value, dateEdit.value, popup));
	popup.style.visibility = 'visible';
	return popup;
}

function renderTable() {

	clearAndRecreateHeader(mainTable);

	// create rows

	let rows = JSON.parse(localStorage.getItem("rows"));
	console.log('***' + JSON.parse(localStorage.getItem("rows")));
	for (let k = 0; k < rows.length; k++) {

		/* create row */
		let currId = k;

		let tr = document.createElement("tr");
		tr.className = "tr" + rows[k].id;
		mainTable.append(tr);
		for (let i = 1; i < 5; i++) {
			let td = document.createElement("td");
			td.id = tr.className + "td" + i;
			tr.append(td);
		}

		/* create buttons */
		let td = document.createElement("td");
		let buttonEdit = document.createElement("button");
		buttonEdit.id = tr.className + "buttonEdit";
		buttonEdit.innerText = "[Редактировать]";
		td.append(buttonEdit);
		let buttonDelete = document.createElement("button");
		buttonDelete.id = tr.className + "buttonDelete";
		buttonDelete.innerText = "[Удалить]";
		td.append(buttonDelete);
		tr.append(td);

		console.log('***** ' + localStorage.getItem("rows"));

		document.getElementById("tr" + rows[k].id + "td1").innerText = JSON.parse(localStorage.getItem("rows"))[k].id;
		let taskContent = JSON.parse(localStorage.getItem("rows"))[k].name;
		document.getElementById("tr" + rows[k].id + "td2").innerText = taskContent;
		let taskDate = JSON.parse(localStorage.getItem("rows"))[k].date;
		document.getElementById("tr" + rows[k].id + "td3").innerText = taskDate;
		document.getElementById("tr" + rows[k].id + "td4").innerHTML = JSON.parse(localStorage.getItem("rows"))[k].status;


		//add listener for editing
		let editButtonId = "tr" + rows[k].id + "buttonEdit";
		document.getElementById(editButtonId).addEventListener("click", (event) => editTaskPopup(rows[k].id, taskContent, taskDate));

		//added listener for deletion
		document.getElementById("tr" + rows[k].id + "buttonDelete").addEventListener("click", (event) => deleteRowById(rows[k].id));

		//update status
		//document.getElementById("tr" + rows[k].id + "buttonDelete").addEventListener("click", (event) => deleteRowById(rows[k].id));

	}
}

function clearAndRecreateHeader(table) {
	table.innerHTML = '<tr><th>Id</th><th>Наименование</th><th>Дата</th><th>Статус</th><th>Действия</th></tr>';
}

renderTable();

function getLastId() {
	let rows = JSON.parse(localStorage.getItem("rows"));
	if (rows.length < 1) {
		return 0;
	}
	return rows[rows.length - 1].id;
}

function addItemToStorage(row) {
	let rows = JSON.parse(localStorage.getItem("rows"));
	rows.push(row);
	localStorage.setItem("rows", JSON.stringify(rows));
	renderTable();
	return rows;
}


function updateItemInStorage(id, content, taskDate, popup) {
	let rows = JSON.parse(localStorage.getItem("rows"));
	for (let i = 0; i < rows.length; i++) {
		if(rows[i].id == id){
			console.log('id:' + id + ' content: ' + content + ' taskDate:' + taskDate);
			rows[i].name = content;
			rows[i].date = taskDate;
			break;
		}
	}
	localStorage.setItem("rows", JSON.stringify(rows));
	popup.style.visibility = 'hidden';
	renderTable();
}

function addRow() {
	let rowId = getLastId() + 1;
	let newRow = {
		id: rowId,
		name: NEW_TASK_NAME,
		date: new Date().toISOString().slice(0, 10),
		status: '<input type="checkbox" class="checkBox">',
	};
	addItemToStorage(newRow);

	console.log(localStorage.getItem("rows"));
	console.log("длина массива = " + rowId);
	return rowId;
}

function deleteRowById(rowId) {
	let rows = JSON.parse(localStorage.getItem("rows"));
	for (let i = 0; i < rows.length; i++) {
		if (rows[i].id == rowId) {
			rows.splice(i, 1);
			break;
		}
	}
	localStorage.setItem("rows", JSON.stringify(rows));
	renderTable();
}

function editTaskPopup(id, content, date) {
	createPopup(id, content, date)

	//alert("Редактируем поле с айди " + rowId)
}

function closePopup(popup) {
	popup.style.visibility = 'hidden';
}

