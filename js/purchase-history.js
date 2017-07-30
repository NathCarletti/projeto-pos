var database = firebase.database()

const modalLogin = document.getElementById('modalLogin');
var userEmailL = document.getElementById('emailL')
var userPassL = document.getElementById('pwdL')
const loader = document.getElementById("loader")
const table = document.getElementById("purchase-history")

function btnLogin() {
    var userEmailValue = userEmailL.value
    var userPassValue = userPassL.value

    loginUserData(userEmailValue, userPassValue)
}

function loginUserData(userEmailValue, userPassValue) {
    userPassL.parentNode.classList.remove("has-error")
    userEmailL.parentNode.classList.remove("has-error")

    database.ref('users/')

        .orderByChild('email')
        .startAt(userEmailValue).endAt(userEmailValue)
        .once('value').then(function (snapshot) {

            if (snapshot.val() != null) {
                // Email exists on database.

                // Check password
                var storedPass = snapshot.val()[0].pass

                if (storedPass == userPassValue) {
                    console.log("Login")

                    // Closing modal
                    modalLogin.style.display = 'none';

                    var doc = content.document;
                    var body = doc.body;
                    var div = doc.getElementsByClassName("modal-backdrop");

                    // Removing dimmer
                    body.className = '';
                    body.removeChild(div[0]);

                    var userId = snapshot.val()[0].id
                    setUserIdLogged(userId)
                    updateNavBarMenu()

                    alert("Olá " + snapshot.val()[0].name + "!")

                } else {
                    console.log("Wrong password")
                    userPassL.parentNode.classList.add("has-error")
                }

            } else {
                console.log("This email is not registered yet.")
                userEmailL.parentNode.classList.add("has-error")
            }
        });
}

var menuDefault = document.getElementById('menuDefault')
var menuUserLoggedIn = document.getElementById('menuUserLoggedIn')

updateNavBarMenu()
function updateNavBarMenu() {

    // Handling user login
    if (loggedUserId = getUserIdLogged()) {
        console.log("The user with ID " + loggedUserId + "is logged")

        menuDefault.style.visibility = 'visible';
        menuUserLoggedIn.style.visibility = 'hidden';

    } else {
        console.log("There is no user logged")

        menuDefault.style.visibility = 'hidden';
        menuUserLoggedIn.style.visibility = 'visible';
    }
}

function getUserIdLogged() {
    return sessionStorage.loggedUserId
}

function setUserIdLogged(userId) {
    sessionStorage.loggedUserId = userId
}

function logout() {
    sessionStorage.removeItem("loggedUserId")
    updateNavBarMenu()

    console.log("You have successfully logout!")
}

// Getting items
getPurchaseItems(getUserIdLogged())
function getPurchaseItems(userId) {

    console.log(userId)

    if(userId != null) {

        userId = Number(userId)

        database.ref('purchase/')
                .orderByChild('userId')
                .startAt(userId).endAt(userId)
                .once('value').then(function (snapshot) {

                    purchaseItems = snapshot.val()
                    if (purchaseItems!= null) {

                        var j = 0
                        for(var i in purchaseItems) { // Para cada pedido

                            var purchaseItem = purchaseItems[i] // items de um pedido

                            getPurchaseItemsInfo(purchaseItem, function(item) {
                                j++
                                
                                addRow(item.date, item.items, item.status, item.totalPrice)
                                
                                if(j >= purchaseItems.length) {
                                    if(loader.parentNode != null) {
                                        loader.parentNode.removeChild(loader);
                                    }
                                }

                            })
                        }

                    } else {
                        console.log("There is no purchase items for this user.")

                        var t = "";

                        var tr = '<tr tag>';
                        tr += '<td colspan="4" class="text-center" ><span>Você ainda não realizou nenhum pedido.<span></td>';
                        tr += '</tr>';
                        t += tr;
                            
                        table.innerHTML += t;

                        if(loader.parentNode != null) {
                            loader.parentNode.removeChild(loader);
                        }
                    }
                })
    } else {
        alert("Logue ou cadastre-se para visualizar seus pedidos!")

        var t = "";

        var tr = '<tr tag>';
        tr += '<td colspan="4" class="text-center" ><span>Você ainda não realizou nenhum pedido.<span></td>';
        tr += '</tr>';
        t += tr;
            
        table.innerHTML += t;

        if(loader.parentNode != null) {
            loader.parentNode.removeChild(loader);
        }
    }
}

function getPurchaseItemsInfo(purchaseItem, callback) {

    var itemObj = new Object()
    var items = new Array()

    itemObj["date"] = purchaseItem.date
    itemObj["status"] = purchaseItem.status
    itemObj["totalPrice"] = purchaseItem.totalPrice

    var itemsInfo = purchaseItem.items

    for(var j in itemsInfo) {

        getProductInfo(itemsInfo[j].id, itemsInfo[j].amount, function(productInfo) {
            items.push(productInfo)

            if(items.length >= itemsInfo.length) {

                itemObj["items"] = items
                callback(itemObj)
            }
        });
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

//Adding items on HTML
function addRow(date, items, status, totalPrice) {
    
    var itemsList = "<ul>"
    for(var i in items) {
        itemsList += "<li>" + items[i].name + "</li>"
    }
    itemsList += "</ul>"

    var t = "";

    var tr = '<tr>';
    tr += '<td class="text-center">' + date + '</td>';
    tr += '<td class="text-center">' + itemsList + '</td>';
    tr += '<td class="text-center">' + status + '</td>';
    tr += '<td class="text-center">' + formatMoney(totalPrice) + '</td>';
    tr += '</tr>';
    t += tr;
        
    table.innerHTML += t;
}

// Auxiliar functions
function formatMoney(num) {
    return "R$ " + num.toFixed(2).toString().replace(".", ",");
}