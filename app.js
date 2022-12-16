// Storage Controller 
const StorageCtrl = (function() {
    // Public Methods
    return {
        storeItem: function(item) {
            let items;
            // Check any item in ls
            if(localStorage.getItem('items') === null) {
                items = [];
                // Push new item
                items.push(item);
                // Set ls
                localStorage.setItem('items', JSON.stringify(items));
            } else {
                // Get what is already in ls
                items = JSON.parse(localStorage.getItem('items'));

                // Push new item
                items.push(item)

                // Reset ls
                localStorage.setItem('items', JSON.stringify(items));
            }
        },
        getItemsFromStorage: function() {
            let items;
            if(localStorage.getItem('items') === null) {
                items = [];
            } else {
                items = JSON.parse(localStorage.getItem('items'))
            }
            return items;
        },
        updateItemStorage: function(updatedItem) {
            let items = JSON.parse(localStorage.getItem('items'));

            items.forEach(function(item, index) {
                if(updatedItem.id === item.id) {
                    items.splice(index, 1, updatedItem);
                }
            });
            localStorage.setItem('items', JSON.stringify(items));
        },
        deleteItemFromStorage: function(id) {
            let items = JSON.parse(localStorage.getItem('items'));

            items.forEach(function(item, index) {
                if(id === item.id) {
                    items.splice(index, 1);
                }
            });
            localStorage.setItem('items', JSON.stringify(items));
        },
        clearItemsFromStorage: function() {
            localStorage.removeItem('items');
        }
     }
})();

// Item Controller
const itemCtrl = (function() {
    // Item Constructor
    const Item = function(id, name, calories) {
        this.id = id;
        this.name = name;
        this.calories = calories;
    }

    // Data Structure / State
    const data = {
        // items: [
        //     // { id: 0, name: "Steak Dinner", calories: 1200 },
        //     // { id: 1, name: "Cookie", calories: 400 },
        //     // { id: 2, name: "Eggs", calories: 300 }
        // ],
        items: StorageCtrl.getItemsFromStorage(),
        currentItem: null,
        totalCalories: 0
    }

    // Public Methods
    return {
        getItems: function() {
            return data.items;
        },
        addItem: function(name, calories) {
            let ID;
            // create ID
            if(data.items.length > 0) {
                ID = data.items[data.items.length - 1].id + 1;
            } else {
                ID = 0;
            }

            // calories to Number
            calories = parseInt(calories)

            // Create new item
            newItem = new Item(ID, name, calories);

            // Add to items array
            data.items.push(newItem)

            return newItem;
        },
        getItemById: function(id) {
            let found = null;
            // Loop through items
            data.items.forEach(function(item) {
                if(item.id === id) {
                    found = item;
                }
            });
            return found;
        },
        updateItem: function(name, calories) {
            // Calories to Number
            calories = parseInt(calories)

            let found = null;

            // Loop through items
            data.items.forEach(function(item) {
                if(item.id === data.currentItem.id) {
                    item.name = name;
                    item.calories = calories;
                    found = item
                }
            })
            return found;
        },
        deleteItem: function(id) {
            // Get ids
            const ids = data.items.map(function(item) {
                return item.id;
            });

            // Get index
            const index = ids.indexOf(id);

            // Remove item
            data.items.splice(index, 1);
        },
        clearItems: function() {
            data.items = [];
        },
        setCurrentItem: function(item) {
            data.currentItem = item;
        },
        getCurrentItem: function() {
            return data.currentItem;
        },
        getTotalCalories: function() {
            let total = 0;

            // Loop through items and add cals
            data.items.forEach(function(item) {
                total += item.calories;
            })

            // set total cal in data structure
            data.totalCalories = total;

            // Return the total
            return data.totalCalories;
        },
        logData: function() {
            return data;
        }
    }
})();


// UI Controller
const UICtrl = (function() {
    const UISelector = {
        itemList: '#item-list',
        listItems: '#item-list li',
        addBtn: '.add-btn',
        updateBtn: '.update-btn',
        deleteBtn: '.delete-btn',
        backBtn: '.back-btn',
        clearBtn: '.clear-btn',
        itemNameInput:'#item-name',
        itemCaloriesInput:'#item-calories',
        totalCalories: '.total-calories',
    }
    // Public methods
    return {
        populateItemList: function(items) {
            let html = '';

            items.forEach(function(item) {
                html += `<li class="collection-item" id="item-${item.id}">
                <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
                <a href="#" class="secondary-content">
                  <i class="edit-item fa fa-pencil"></i>
                </a>
              </li>`;
            })

            // Insert List items
            document.querySelector(UISelector.itemList).innerHTML = html;
        },

        getItemInput: function() {
            return {
                name:document.querySelector(UISelector.itemNameInput).value,
                calories:document.querySelector(UISelector.itemCaloriesInput).value
            }
        },
        addListItem: function(item) {
            // Show the list
            document.querySelector(UISelector.itemList).style.display = 'block';
            // Create li element
            const li = document.createElement('li');
            // Add class
            li.className = 'collection-item';
            // Add ID
            li.id = `item-${item.id}`
            // Add style
            li.innerHTML = `<strong>${item.name}: </strong> <em>${item.calories} Calories</em>
            <a href="#" class="secondary-content">
              <i class="edit-item fa fa-pencil"></i>
            </a>`
            // Insert Item
            document.querySelector(UISelector.itemList).insertAdjacentElement('beforeend', li)
        },
        updateListItem: function(item) {
            let listItems = document.querySelectorAll(UISelector.listItems);

            // Turn Node list into array
            listItems = Array.from(listItems);

            listItems.forEach(function(listItem) {
                const itemID = listItem.getAttribute('id');

                if(itemID === `item-${item.id}`) {
                    document.querySelector(`#${itemID}`).innerHTML = `<strong>${item.name}: </strong> <em>${item.calories} Calories</em>
                    <a href="#" class="secondary-content">
                      <i class="edit-item fa fa-pencil"></i>
                    </a>`
                }
            });

        },
        deleteListItem: function(id) {
            const itemID = `#item-${id}`;
            const item = document.querySelector(itemID)
            item.remove()
        },
        clearFields: function() {
            document.querySelector(UISelector.itemNameInput).value = '';
            document.querySelector(UISelector.itemCaloriesInput).value = '';
        },
        addItemToForm: function() {
            document.querySelector(UISelector.itemNameInput).value = itemCtrl.getCurrentItem().name;
            document.querySelector(UISelector.itemCaloriesInput).value = itemCtrl.getCurrentItem().calories;
            UICtrl.showEditState()
        },
        removeItems: function() {
            let listItems = document.querySelectorAll(UISelector.listItems);

            // Turn Node List into Array
            listItems = Array.from(listItems);

            listItems.forEach(function(listItem) {
                listItem.remove()
            })
        },
        hideList: function() {
            document.querySelector(UISelector.itemList).style.display = 'none';
        },
        showTotalCalories: function(totalCalories) {
            document.querySelector(UISelector.totalCalories).textContent = totalCalories;
        },
        clearEditState: function() {
            UICtrl.clearFields();
            document.querySelector(UISelector.updateBtn).style.display = 'none';
            document.querySelector(UISelector.deleteBtn).style.display = 'none';
            document.querySelector(UISelector.backBtn).style.display = 'none';
            document.querySelector(UISelector.addBtn).style.display = 'inline';
        },
        showEditState: function() {
            document.querySelector(UISelector.updateBtn).style.display = 'inline';
            document.querySelector(UISelector.deleteBtn).style.display = 'inline';
            document.querySelector(UISelector.backBtn).style.display = 'inline';
            document.querySelector(UISelector.addBtn).style.display = 'none';
        },
        getSelectors: function() {
            return UISelector;
        }
    }    
})();


//  App Controller
const appCtrl = (function(itemCtrl, StorageCtrl, UICtrl) {
    // Load event listeners
    const loadEventListeners = function() {
        // Get UI selectors
        const UISelector = UICtrl.getSelectors();

        // Add item event
        document.querySelector(UISelector.addBtn).addEventListener('click', itemAddSubmit)

        // Disable submit on enter key
        document,addEventListener('keypress', function(e) {
            if(e.keyCode === 13) {
                e.preventDefault();
                return false;
            }
        });

        // Edit icon click event
        document.querySelector(UISelector.itemList).addEventListener('click', itemEditClick)

        // Update button event
        document.querySelector(UISelector.updateBtn).addEventListener('click', itemUpdateClick)

        // Delete button event
        document.querySelector(UISelector.deleteBtn).addEventListener('click', itemDeleteClick)
        
        // Back button event
        document.querySelector(UISelector.backBtn).addEventListener('click', UICtrl.clearEditState)

        // Clear button event
        document.querySelector(UISelector.clearBtn).addEventListener('click', clearItemsClick)
    };

    // Add item Submit
    const itemAddSubmit = function(e) {
        // Get form Input from UI Controller
        const input = UICtrl.getItemInput()

        // Check for name and calories input
        if(input.name !== '' && input.calories !== '') {
            // Add item
            const newItem = itemCtrl.addItem(input.name, input.calories)

            // Add Item to the UI List
            UICtrl.addListItem(newItem)

            // Get total calories
            const totalCalories = itemCtrl.getTotalCalories()
            // Add totalCalories to UI
            UICtrl.showTotalCalories(totalCalories)

            // Store in localStorage
            StorageCtrl.storeItem(newItem)

            // Clear fields
            UICtrl.clearFields();
        }

        e.preventDefault();
    }

    // Item edit click
    const itemEditClick = function(e) {
        if(e.target.classList.contains('edit-item')) {
            // Get list item id (item-0, item-1, ...)
            const listId = e.target.parentNode.parentNode.id;

            // Break into array
            const listIdArr = listId.split('-');
            
            // Get the actual id
            const id = parseInt(listIdArr[1])

            // Get item
            const itemToEdit = itemCtrl.getItemById(id)

            // Set current Item
            itemCtrl.setCurrentItem(itemToEdit)

            // Add item to form
            UICtrl.addItemToForm()
        }

        e.preventDefault();
    }

    // Update item click
    const itemUpdateClick = function(e) {
        // Get item Input
        const input = UICtrl.getItemInput()
    
        // Update item
        const updatedItem = itemCtrl.updateItem(input.name, input.calories)

        // Update UI
        UICtrl.updateListItem(updatedItem);

        // Get total calories
        const totalCalories = itemCtrl.getTotalCalories()
        // Add totalCalories to UI
        UICtrl.showTotalCalories(totalCalories)

        // Update local storage
        StorageCtrl.updateItemStorage(updatedItem)

        UICtrl.clearEditState()

        e.preventDefault()
    }

    // Delete item
    const itemDeleteClick = function(e) {
        // Get current item
        const currentItem = itemCtrl.getCurrentItem()

        // Delete item
        itemCtrl.deleteItem(currentItem.id)

        // Delete from UI
        UICtrl.deleteListItem(currentItem.id)

        // Get total calories
        const totalCalories = itemCtrl.getTotalCalories()
        // Add totalCalories to UI
        UICtrl.showTotalCalories(totalCalories)

        // Delete from local storage
        StorageCtrl.deleteItemFromStorage(currentItem.id);
        
        UICtrl.clearEditState()

        // UICtrl.hideList()

        e.preventDefault();
    }

    // Clear items event
    const clearItemsClick = function(e) {
        // Clear items from data structure
        itemCtrl.clearItems();

        // Get total calories
        const totalCalories = itemCtrl.getTotalCalories()
        // Add totalCalories to UI
        UICtrl.showTotalCalories(totalCalories)

        // Remove items from UI
        UICtrl.removeItems();
        
        // Clear from local storage
        StorageCtrl.clearItemsFromStorage()

        UICtrl.hideList()
    
        e.preventDefault();
    }

    // Public methods
    return {
        init: function() {
            // Set Initial state
            UICtrl.clearEditState();
            
            // Fetch items from data structure
            const items = itemCtrl.getItems();

            if(items.length === 0) {
                UICtrl.hideList()
            } else {
                // Populate list with items
                UICtrl.populateItemList(items);
            }

            // Get total calories
            const totalCalories = itemCtrl.getTotalCalories()
            // Add totalCalories to UI
            UICtrl.showTotalCalories(totalCalories)

            // Load event listeners
            loadEventListeners();
        }
    }
})(itemCtrl, StorageCtrl, UICtrl);

// Initialize App
appCtrl.init();
