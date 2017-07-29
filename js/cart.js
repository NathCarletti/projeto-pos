// DEFINING FIREBASE DATABASE VARIABLE 
var database = firebase.database()

// GETTING USER LOGGED ID
var userId = 10 // TODO get real ID

// GETTING HTML ELEMENTS
const submit = document.getElementById("btnSubmit")
const table = document.getElementById("products")
const loader = document.getElementById("loader")
const modal = document.getElementById('myModal');
const modalText = document.getElementById('modalText');
const modalBtnYes = document.getElementById('modalBtnYes');
const modalBtnNo = document.getElementById('modalBtnNo');
const cartTotalPrice = document.getElementById('cartTotalPrice');

// THINGS TO DO AS SOON AS THE PAGE LOADS
updateCartItemsCountInNavigationBar()
populateTable(getAllUserCartItems())

// localStorage.removeItem("cart");

function updateCartItemsCountInNavigationBar() {
    var itemsCount = getCartItemsCount();

    var badgeCart = document.getElementById('badgeCart')
    badgeCart.innerHTML = itemsCount
}

function getCartItemsCount() {

    var currentCartItems = getAllUserCartItems()
    var currentCartItemsCount = 0

    if(currentCartItems != null) {
        currentCartItemsCount = currentCartItems.length
    }

    return currentCartItemsCount
}

function getAllUserCartItems() {

    var currentCartItems = localStorage.cart

    if(currentCartItems) {

        var allItems = new Array()
        allItems = JSON.parse(localStorage.cart)

        return allItems
    }
}

var userCartProducts = new Array();
function populateTable(cartProducts) {

    if(cartProducts != null) {

        console.log("Getting products...")

        // var userCartProducts = new Array();

        for(var key in cartProducts) {

            var product = cartProducts[key]

            getProductInfo(product.id, product.amount, function(productInfo) {

                userCartProducts.push(productInfo)

                var id = productInfo.id
                var name = productInfo.name
                var price = productInfo.price
                var imageUrl = productInfo.imageUrl
                var description = productInfo.description
                var totalAmount = productInfo.totalAmount
                var userAmount = productInfo.userAmount

                addRow(id, imageUrl, name, price, totalAmount, userAmount)
            });
        }
    } else {
        console.log("Your cart is empty")

        var t = "";

        var tr = '<tr tag>';
        tr += '<td colspan="5" class="text-center" ><span>Seu carrinho está vazio.<span></td>';
        tr += '</tr>';
        t += tr;
            
        table.innerHTML += t;
    }
    
    if(loader.parentNode != null) {
        loader.parentNode.removeChild(loader);
    }
}

function getProductInfo(productId, productAmount, callback) {

    var cartProductInfo = new Object();

    database.ref('/products/' + productId).once('value').then(function(snapshot) {
            var product = snapshot.val()

            if(product != null) {

                cartProductInfo["id"] = productId
                cartProductInfo["name"] = product.name
                cartProductInfo["price"] = product.price
                cartProductInfo["imageUrl"] = product.imageUrl
                cartProductInfo["description"] = product.description
                cartProductInfo["totalAmount"] = product.amount
                cartProductInfo["userAmount"] = productAmount

                callback(cartProductInfo)
            }
        });
}

submit.addEventListener('click', function(event) {
    console.log("Submit action")
})

function addRow(id, image, name, price, totalAmount, userAmount) {

    console.log("ID do produto: " + id)
    //console.log("Total em estoque: " + totalAmount)
    //console.log("Total no carrinho do usuário: " + userAmount)

    let imgTag = '<img class="product-img" src="images/' + image +'" alt="...">'
    let amountInput = '<input type="number" value="' + userAmount + '" min="1" max="' + totalAmount + '" onclick="inputChanged('+ id +', this)" />'
    let totalPrice = price * userAmount
    let delBtn = '<button type="button" class="btn btn-xs btn-danger" onclick="deleteItem('+ id +', this)" href="#myModal" >Remover</button>'

    var t = "";

    var tr = '<tr tag>';
    tr += '<td class="text-center">' + imgTag + '</td>';
    tr += '<td class="text-center">' + name + '</td>';
    tr += '<td class="text-center">' + formatMoney(price) + '</td>';
    tr += '<td class="text-center">' + amountInput + '</td>';
    tr += '<td class="text-center">' + formatMoney(totalPrice) + '</td>';
    tr += '<td class="text-center">' + delBtn + '</td>';
    tr += '</tr>';
    t += tr;
        
    table.innerHTML += t;
}

function removeRow(row) {
    table.deleteRow(row);
}

function deleteItem(id, element) {

    let row = element.parentNode.parentNode.rowIndex - 1
    
    var clickedItem = getTableClickedItem(element)
    console.log("Delete product: " + clickedItem.name)

    modalText.textContent="Remover \"" + clickedItem.name + "\" do carrinho?";
    modal.style.display = "block";
    
    modalBtnYes.onclick = function() {
        console.log("Remover item " + clickedItem.name + " row: " + row)
        
        removeRow(row)
        modal.style.display = "none";

        var allItems = getAllUserCartItems()
        var index = allItems.findIndex(item => item.id === id)

        allItems.splice(index)

        if(allItems.length <= 0) {
            localStorage.removeItem("cart");
        } else {
            updateLocalStorage(allItems)
        }

        populateTable(getAllUserCartItems())
    }
}

function updateLocalStorage(allItems) {

    var jsonString = JSON.stringify(allItems);

    localStorage.cart = jsonString

    updateCartItemsCountInNavigationBar()
}

function inputChanged(id, element) {

    let row = element.parentNode.parentNode.rowIndex - 1

    var clickedItem = getTableClickedItem(element)

    var newValue = element.value

    console.log("Changed amount of product " + clickedItem.name + " to amount " + newValue)

    var newTotal = formatMoney(newValue * clickedItem.price)

    table.rows[row].cells[4].innerHTML = newTotal

    cartTotalPrice.innerHTML = "Total: " + formatMoney(getCartTotalPrice())

    var allItems = getAllUserCartItems()
    var itemIndex = allItems.findIndex(item => item.id === id)

    allItems[itemIndex].amount = newValue

    updateLocalStorage(allItems)
}

function getCartTotalPrice() {

    var total = 0.0

    var totalRows = table.rows.length
    
    for(var i=0; i<totalRows; i++) {
        var totalRow = table.rows[i].cells[4].innerHTML
        total += formatNumber(totalRow)
    }

    return total
}

function formatMoney(num) {
    return "R$ " + num.toFixed(2).toString().replace(".", ",");
}

function formatNumber(money) {
    return Number(money.replace("R$ ", "").replace(",", "."));
}

function getTableClickedItem(element) {
    let row = element.parentNode.parentNode.rowIndex - 1
    let column = element.parentNode.cellIndex

    var itemName = table.rows[row].cells[1].innerHTML
    var clickedItem = userCartProducts.find(i => i.name === itemName);

    return clickedItem;
}


//function firebaseDeleteProduct(id) {

//    database.ref('/cart/')
//            .orderByChild('userId')
//            .startAt(userId).endAt(userId)
//            .once('value').then(function(snapshot) {

//            var products = snapshot.val()[0].products
//            var key = snapshot.key

//            console.log("key: "+ key) // .items.splice(1, 1);
            
            /*products.child*/
//            var newProducts = new Array();
//            for(var i in products) {
//                if(products[i].id != id) {
//                    newProducts.push(products[i].id)

//                    console.log("Adicionando: " + products[i].id)

//                } else {
//                    console.log("Removendo: " + products[i].id)
//                }
//            }


//            var userCart = {
//                products: newProducts,
//                userId: userId
//            };

//            console.log(userCart.products)

            // Write the new post's data simultaneously in the posts list and the user's post list.
//            var updates = {};
//            updates['/cart/' + 0] = userCart;
            //updates['/user-posts/' + uid + '/' + newPostKey] = postData;

            //firebase.database().ref().update(updates);

            

            //if( snapshot.val() === null ) {
                /* does not exist */
            //} else {
            //    snapshot.ref().update({"postID": postID});
            //}
//    });
//}



// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    modal.style.display = "none";
}

modalBtnNo.onclick = function() {
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}