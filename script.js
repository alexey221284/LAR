let addNewTask = document.getElementById("addNewTask");
addNewTask.addEventListener("click", (event) => addRow());
const NEW_TASK_NAME = "новая задача ";
let mainTable = document.getElementById("main_table");
let mainCheckBox = document.getElementById('mainCheckbox');

mainCheckBox.addEventListener('change', function () {
	renderTable(this.checked);
});

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
}

function renderTable(hideCompleted) {

	clearAndRecreateHeader(mainTable);

	// create rows

	let rows = JSON.parse(localStorage.getItem("rows"));
	for (let k = 0; k < rows.length; k++) {
		if (hideCompleted && rows[k].status) {
			continue;
		}
		/* create row */

		let tr = document.createElement("tr");
		tr.id = "tr" + rows[k].id;
		tr.setAttribute("trId", "tr" + rows[k].id);
		mainTable.append(tr);
		for (let i = 1; i < 5; i++) {
			let td = document.createElement("td");
			td.id = tr.id + "td" + i;
			tr.append(td);
		}

		/* create buttons */
		let td = document.createElement("td");
		let buttonEdit = document.createElement("button");
		buttonEdit.id = tr.id + "buttonEdit";
		buttonEdit.innerText = "[Редактировать]";
		td.append(buttonEdit);
		let buttonDelete = document.createElement("button");
		buttonDelete.id = tr.id + "buttonDelete";
		buttonDelete.innerText = "[Удалить]";
		td.append(buttonDelete);
		tr.append(td);

		document.getElementById("tr" + rows[k].id + "td1").innerText = JSON.parse(localStorage.getItem("rows"))[k].id;
		let taskContent = JSON.parse(localStorage.getItem("rows"))[k].name;
		document.getElementById("tr" + rows[k].id + "td2").innerText = taskContent;
		let taskDate = JSON.parse(localStorage.getItem("rows"))[k].date;
		document.getElementById("tr" + rows[k].id + "td3").innerText = taskDate;
		document.getElementById("tr" + rows[k].id + "td4").innerHTML = generateStatusHtml(rows[k]);


		//add listener for editing
		let editButtonId = "tr" + rows[k].id + "buttonEdit";
		document.getElementById(editButtonId).addEventListener("click", (event) => editTaskPopup(rows[k].id, taskContent, taskDate));

		//added listener for deletion
		document.getElementById("tr" + rows[k].id + "buttonDelete").addEventListener("click", (event) => deleteRowById(rows[k].id));

		//update status
		document.getElementById('checkbox' + rows[k].id).addEventListener('change', function () {
			// taskCompleted(k, this.checked);
			taskCompleted(rows[k].id, this.checked);
		});
	}
}

function generateStatusHtml(row) {
	let result;
	if (row.status) {
		result = '<input type="checkbox" id="checkbox' + row.id + '" checked>';
	} else {
		result = '<input type="checkbox" id="checkbox' + row.id + '">';
	}
	return result;
}

function clearAndRecreateHeader(table) {
	table.innerHTML = '<tr><th>Id</th><th>Наименование</th><th>Дата</th><th>Статус</th><th>Действия</th></tr>';
}

renderTable(mainCheckBox.checked);

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
	renderTable(mainCheckBox.checked);
	return rows;
}

function updateItemInStorage(id, content, taskDate, popup) {
	let rows = JSON.parse(localStorage.getItem("rows"));
	for (let i = 0; i < rows.length; i++) {
		if (rows[i].id == id) {
			rows[i].name = content;
			rows[i].date = taskDate;
			break;
		}
	}
	localStorage.setItem("rows", JSON.stringify(rows));
	popup.style.visibility = 'hidden';
	renderTable(mainCheckBox.checked);
}

function addRow() {
	let rowId = getLastId() + 1;
	let newRow = {
		id: rowId,
		name: NEW_TASK_NAME,
		date: new Date().toISOString().slice(0, 10),
		status: false,
		//	'<input type="checkbox" class="checkBox" id="checkbox' + rowId + '">'
	};
	addItemToStorage(newRow);
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
	renderTable(mainCheckBox.checked);
}

function editTaskPopup(id, content, date) {
	createPopup(id, content, date)
}

function closePopup(popup) {
	popup.style.visibility = 'hidden';
}

function taskCompleted(id, isChecked) {
	let rows = JSON.parse(localStorage.getItem("rows"));
	for (let i = 0; i < rows.length; i++) {
		if (rows[i].id == id) {
			if (isChecked) {
				rows[i].status = true;
			} else {
				rows[i].status = false;
			}
		}
	}
	localStorage.setItem("rows", JSON.stringify(rows));
	renderTable(mainCheckBox.checked);
}