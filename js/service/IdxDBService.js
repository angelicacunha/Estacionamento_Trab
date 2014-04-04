estacionamentoApp.service('IdxDbService', [function () {	
	var db = {};
	var carros = [];

	this.init = function() {
		this.db = this.initDB();


		console.log('iniciado o IndexedDB');
	};

	this.initDB = function() {		
		//No support? Go in the corner and pout.
		if(!"indexedDB" in window) return;

		var openRequest = indexedDB.open("aluguel_db",1);

		openRequest.onupgradeneeded = function(e) {
			var thisDB = e.target.result;

			if(!thisDB.objectStoreNames.contains("aluguel")) {
				var aluguel = thisDB.createObjectStore("aluguel", {autoIncrement:true, keyPath:"key"});
				aluguel.createIndex("placa", "placa", {unique:false});
			}
		}

		openRequest.onsuccess = function(e) {
			db = e.target.result;
			console.log("Banco de dados Aberto");
			
	

			console.log("Realizando consulta");
			db.transaction(["aluguel"], "readonly").objectStore("aluguel").openCursor().onsuccess = function(e) {
				var cursor = e.target.result;
				if(cursor) {	
					var aluguel = {};
					aluguel.key = cursor.key;			
					for(var field in cursor.value) {
						if(field=='placa'){
							aluguel.placa = cursor.value[field];
						} else if (field=='marca'){
							aluguel.marca = cursor.value[field];
						} else if (field=='modelo'){
							aluguel.modelo = cursor.value[field];
						} else if (field=='horaentrada'){
							aluguel.horaentrada = cursor.value[field];
						}
					}
					console.log("aluguel encontrado: " + aluguel.key + " " + aluguel.marca + " " + aluguel.modelo + " " + aluguel.horaentrada);
					carros.push(aluguel);
					cursor.continue();
				}
			}	

		}	

		openRequest.onerror = function(e) {
			//Do something for the error
		}

		return db;
	};

	this.create = function(aluguel) {
		console.log("About to add a aluguel");

		//Get a transaction
		//default for OS list is all, default for marca is read
		var transaction = db.transaction(["aluguel"],"readwrite");
		//Ask for the objectStore
		var store = transaction.objectStore("aluguel");

		//Define a aluguel
		var aluguel = {
			placa:aluguel.placa,
			marca:aluguel.marca,
			modelo:aluguel.modelo,
			horaentrada:aluguel.horaentrada
		}

		//Perform the add
		var request = store.add(aluguel);

		request.onerror = function(e) {
			console.log("Error",e.target.error.name);
			//some marca of error handler
		}

		request.onsuccess = function(e) {
			console.log("aluguel added!");
			//Get the ID from the result request
			aluguel.key = request.result;
		}

		return aluguel;
	};

	this.list = function(filters) {
		if(filters) {
			db.transaction(["aluguel"], "readonly").objectStore("aluguel").openCursor().onsuccess = function(e) {
				var cursor = e.target.result;
				if(cursor) {	
					var aluguel = {};
					aluguel.key = cursor.key;			
					for(var field in cursor.value) {
						if(field=='placa'){
							aluguel.placa = cursor.value[field];
						} else if (field=='marca'){
							aluguel.marca = cursor.value[field];
						} else if (field=='modelo'){
							aluguel.modelo = cursor.value[field];
						} else if (field=='horaentrada'){
							aluguel.horaentrada = cursor.value[field];
						}
					}
					carros.push(aluguel);
					cursor.continue();
				}
				return carros;
			}
		} else {

		}		
	};

	this.getById = function(key) {
		var aluguel = {};
		var transaction = db.transaction(["aluguel"],"readonly");
		var store = transaction.objectStore("aluguel");

		var request = store.get(Number(key));

		request.onsuccess = function(e) {

			var result = e.target.result;
			if(result) {
				for(var field in result) {
					if(field=='placa'){
						aluguel.placa = result[field];
					} else if (field=='marca'){
						aluguel.marca = result[field];
					} else if (field=='modelo'){
						aluguel.modelo = result[field];
					} else if (field=='horaentrada'){
						aluguel.horaentrada = result[field];
					} else if (field=='key'){
						aluguel.key = result[field];
					}
				}
			} else {
			}	
		}	
	return aluguel;		
	};

	this.getByDesc = function(placa) {
		if(placa === "" ) return;

		var aluguel = {};
		var transaction = db.transaction(["aluguel"],"readonly");
		var store = transaction.objectStore("aluguel");
		var index = store.index("placa");

		var request = index.get(placa);

		request.onsuccess = function(e) {

			var result = e.target.result;
			if(result) {
				for(var field in result) {
					if(field=='placa'){
						aluguel.placa = result[field];
					} else if (field=='marca'){
						aluguel.marca = result[field];
					} else if (field=='modelo'){
						aluguel.modelo = result[field];
					} else if (field=='horaentrada'){
						aluguel.horaentrada = result[field];
					} else if (field=='key'){
						aluguel.key = result[field];
					}
				}
			} else {
			}	
		}	
	return aluguel;		
	};

	this.getcarros = function() {
		console.log(carros);
		return carros;		
	};

	this.update = function(aluguel) {
		console.log("About to update a aluguel");

		//Get a transaction
		//default for OS list is all, default for marca is read
		var transaction = db.transaction(["aluguel"],"readwrite");
		//Ask for the objectStore
		var store = transaction.objectStore("aluguel");

		//Get the aluguel by placaription, must be by ID, not placaription!!!
		var key = aluguel.key;
		console.log(key);
		store.get(Number(key)).onsuccess = function(e) {
			var aluguelToUpdate = e.target.result;
			//Perform the update
			aluguelToUpdate.placa = aluguel.placa;
			aluguelToUpdate.marca = aluguel.marca;
			aluguelToUpdate.modelo = aluguel.modelo;
			aluguelToUpdate.horaentrada = aluguel.horaentrada;
			var request = store.put(aluguelToUpdate);

			request.onerror = function(e) {
				console.log("Error",e.target.error.name);
				//some marca of error handler
			}
			request.onsuccess = function(e) {
				console.log("aluguel updated!");
			}

		}


	};

	this.deletealuguel = function(key) {
		if(key === "" || isNaN(key)) return;

		var transaction = db.transaction(["aluguel"], "readwrite");
		var store = transaction.objectStore("aluguel");

		var request = store.delete(Number(key));

		request.onsuccess = function(e) {
		  console.log("Deleted key: ", key);
		};

		request.onerror = function(e) {
		  console.log("Error Deleting key: ", key);
		};
	};
}]);