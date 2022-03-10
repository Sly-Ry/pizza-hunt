// 'db' variable that will store the connected database object when the connection is complete. 
let db;

// 'request' variable will act as an event listener for the database. That event listener is created when we open the connection to the database using the indexedDB.open() method.
// The .open() method we use here takes the following two parameters:

// 1. The name of the IndexedDB database you'd like to create (if it doesn't exist) or connect to (if it does exist). We'll use the name pizza_hunt.

// 2. The version of the database. By default, we start it at 1. This parameter is used to determine whether the database's structure has changed between connections. Think of it as if you were changing the columns of a SQL database.
const request = indexedDB.open('pizza_hunt', 1);

// this event will emit if the database version changes (nonexistant to version 1, v1 to v2, etc.)
request.onupgradeneeded = function(event) {
    // when db is successfully created with its object store (from onupgradedneeded event above) or simply established a connection, save reference to db in global variable
    const db = event.target.result;
    // create an object store (table) called `new_pizza`, set it to have an auto incrementing primary key of sorts 
    db.createObjectStore('new_pizza', { autoIncrement: true });
};

//  we set up 'onsuccess' so that when we finalize the connection to the database, we can store the resulting database object to the global variable db we created earlier. 
request.onsuccess = function(event) {
    // when db is successfully created with its object store (from onupgradedneeded event above) or simply established a connection, save reference to db in global variable
    db = event.target.result;
  
    // check if app is online, if yes run uploadPizza() function to send all local db data to api
    if (navigator.onLine) {
        // With this uncommented, we'll check to see if we're online every time this app opens and upload any remnant pizza data, just in case we left the app with items still in the local IndexedDB database
        uploadPizza();
    }
};

// We also added the 'onerror' event handler to inform us if anything ever goes wrong with the database interaction.
request.onerror = function(event) {
    // log error here
    console.log(event.target.errorCode);
};

// this function will be executed if we attempt to submit a new pizza and there's no internet connection
function saveRecord(record) {
    // open a new transaction with the database with read and write permissions 
    // transaction - a temporary connection to the database.
    const transaction = db.transaction(['new_pizza'], 'readwrite');

    // access the object store for `new_pizza`
    const pizzaObjectStore = transaction.objectStore('new_pizza');

    // add record to your store with add method
    pizzaObjectStore.add(record);
};

// With this uploadPizza() function, we open a new transaction to the database to read the data.
function uploadPizza() {
    // open a transaction on your db
    const transaction = db.transaction(['new_pizza'], 'readwrite');

    // access the object store
    const pizzaObjectStore = transaction.objectStore('new_pizza');

    // get all records from store and set to a variable
    // you may think that the getAll variable will automatically receive the data from the new_pizza object store, but unfortunately it does not
    const getAll = pizzaObjectStore.getAll();

    getAll.onsuccess = function() {
        // if there was data in indexedDb's store, let's send it to the api server.
        if(getAll.result.length > 0) {
            fetch('/api/pizzas', {
                method: 'POST',
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                }
            })
            .then(response => response.json())
            .then(serverResponse => {
                if (serverResponse.message) {
                    throw new Error(serverResponse);
                }
                // open one more transaction
                const transaction = db.transaction(['new_pizza'], 'readwrite');

                // access the new_pizza object store
                const pizzaObjectStore = transaction.objectStore('new_pizza');

                // clear all objects in store
                pizzaObjectStore.clear();

                alert('All saved pizzas has been submitted!');
            })
            .catch(err => {
                console.log(err);
            });
        };
    };
};

// Here, we instruct the app to listen for the browser regaining internet connection using the online event. If the browser comes back online, we execute the 'uploadPizza' function automatically.
window.addEventListener('online', uploadPizza);

// IndexedDB can feel a little clumsy at times. If the database isn't doing what you intend it to do, simply delete the database using the DevTools application tab and refresh the page so that it re-creates itself. It's a lot easier than messing with the versioning features.