// DEFINING FIREBASE DATABASE VARIABLE 
var database = firebase.database()

// GETTING HTML ELEMENTS
const submit = document.getElementById("btnSubmit")
const table = document.getElementById("products")
const loader = document.getElementById("loader")
const modal = document.getElementById('modalDelete');
const modalText = document.getElementById('modalText');
const modalBtnYes = document.getElementById('modalBtnYes');
const modalBtnNo = document.getElementById('modalBtnNo');
const cartTotalPrice = document.getElementById('cartTotalPrice');

populateTable(getAllUserCartItems())

var userCartProducts = new Array();
function populateTable(cartProducts) {

    if(cartProducts != null) {

        console.log("Getting products...")

        for(var key in cartProducts) {

            var product = cartProducts[key]

            getProductInfo(product.id, product.amount, function(productInfo) {

                userCartProducts.push(productInfo)

                var id = productInfo.id
                var name = productInfo.name
                var price = productInfo.price
                var imageURL = productInfo.imageURL
                var description = productInfo.description
                var totalAmount = productInfo.totalAmount
                var userAmount = productInfo.userAmount

                addRow(id, imageURL, name, price, totalAmount, userAmount)

                // Atualizar total do carrinho
                updateCartTotalValue()

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
                cartProductInfo["imageURL"] = product.imageURL
                cartProductInfo["description"] = product.description
                cartProductInfo["totalAmount"] = product.amount
                cartProductInfo["userAmount"] = productAmount

                callback(cartProductInfo)
            }
        });
}

submit.addEventListener('click', function(event) {
    console.log("Submit action")

    if(getUserIdLogged()) {
        if(getAllUserCartItems() != null) {
            var result = confirm("Finalizar pedido de compra?")

            // Add all cart items to purschase
            addPurchase(function() {
                // Clear cart items
                clearCartItems()

                if (result == true) {
                    console.log("You pressed OK!")

                    window.location = "purchase-history.html";

                } else {
                    console.log("You pressed Cancel!")
                }
            })

        } else {
            alert("Seu carrinho está vazio!")
        }
    } else {
        alert("Logue ou cadastre-se para finalizar o seu pedido!")
    }
})

function addPurchase(callback) {

    // Handling arrays in Firebase database is ****

    firebase.database().ref('purchase/').once('value').then(function(snapshot) {
        var newId = snapshot.val().length

        firebase.database().ref('purchase/' + newId).set({
            date: getDate(),
            items: getAllUserCartItems(),
            status : "Aguardando confirmação de pagamento.",
            totalPrice : getCartTotalPrice(),
            userId : Number(getUserIdLogged())
        });

    }).then(function() {
        callback()
    }).catch(function(error) {
        alert("Data could not be saved." + error);
    })
}

// HTML elements
function addRow(id, image, name, price, totalAmount, userAmount) {

    console.log("ID do produto: " + id)

    let imgTag = '<img class="product-img" src="images/' + image +'" alt="...">'
    let amountInput = '<input type="number" value="' + userAmount + '" min="1" max="' + totalAmount + '" onclick="inputChanged('+ id +', this)" />'
    let totalPrice = price * userAmount
    let delBtn = '<button type="button" class="btn btn-xs btn-danger" onclick="deleteItem('+ id +', this)" href="#modalDelete" >Remover</button>'

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

    modalText.textContent="Remover \"" + clickedItem.name + "\" do carrinho?";
    modal.style.display = "block";
    
    modalBtnYes.onclick = function() {
        console.log("Remover item " + clickedItem.name + " row: " + row)
        
        removeRow(row)

        modal.style.display = "none";

        var allItems = getAllUserCartItems()
        console.log("all items on cart: " + allItems)
        var index = allItems.findIndex(item => item.id === id)
        console.log("index to remove: " + index)

        allItems.splice(index, 1)

        console.log("all items after remove: " + allItems)

        if(allItems.length <= 0) {
            localStorage.removeItem("cart");

            console.log("Your cart is empty")

        } else {
            updateLocalStorage(allItems)
        }
        
        updateCartTotalValue()
    }
}

function inputChanged(id, element) {

    let row = element.parentNode.parentNode.rowIndex - 1

    var clickedItem = getTableClickedItem(element)

    var newValue = element.value

    console.log("Changed amount of product " + clickedItem.name + " to amount " + newValue)

    var newTotal = formatMoney(newValue * clickedItem.price)

    table.rows[row].cells[4].innerHTML = newTotal

    updateCartTotalValue()

    var allItems = getAllUserCartItems()
    var itemIndex = allItems.findIndex(item => item.id === id)

    allItems[itemIndex].amount = Number(newValue)

    updateLocalStorage(allItems)
}

function updateCartTotalValue() {
    cartTotalPrice.innerHTML = "Total: " + formatMoney(getCartTotalPrice())
}

function getCartTotalPrice() {

    var total = 0.0

    var totalRows = table.rows.length

    console.log("total rows: " + totalRows)
    
    if(totalRows > 0) {
        for(var i=0; i<totalRows; i++) {
            var totalRow = table.rows[i].cells[4].innerHTML
            total += formatNumber(totalRow)
        }
    } else {
        var t = "";

        var tr = '<tr tag>';
        tr += '<td colspan="5" class="text-center" ><span>Seu carrinho está vazio.<span></td>';
        tr += '</tr>';
        t += tr;
            
        table.innerHTML += t;
    }

    return total
}

function getTableClickedItem(element) {
    let row = element.parentNode.parentNode.rowIndex - 1
    let column = element.parentNode.cellIndex

    var itemName = table.rows[row].cells[1].innerHTML
    var clickedItem = userCartProducts.find(i => i.name === itemName);

    return clickedItem;
}






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






// Handling user registration
function btnSub() {

    const userPass = document.getElementById('pwd1')
    const userPassConfirm = document.getElementById('pwd2')
    const userName = document.getElementById('name')
    const userAdd = document.getElementById('add')
    const userCard = document.getElementById('card')
    const userTel = document.getElementById('tel')
    const userEmail = document.getElementById('email')

    userPass.parentNode.classList.remove("has-error")
    userPassConfirm.parentNode.classList.remove("has-error")
    userName.parentNode.classList.remove("has-error")
    userAdd.parentNode.classList.remove("has-error")
    userCard.parentNode.classList.remove("has-error")
    userTel.parentNode.classList.remove("has-error")
    userEmail.parentNode.classList.remove("has-error")

    if (validateRegisterFields(userName.value, userAdd.value, userCard.value, userTel.value, userEmail.value, userPass.value, userPassConfirm.value)) {
        writeUserData(userName.value, userAdd.value, userCard.value, userTel.value, userEmail.value, userPass.value)
    }
}

function validateRegisterFields(userNameValue, userAddValue, userCardValue, userTelValue, userEmailValue, userPassValue, userPassConfirmValue) {

    // Validating empty fields
    var thereIsEmptyField = false
    if (userNameValue.trim() === '') {
        thereIsEmptyField = true
        userName.parentNode.classList.add("has-error")
    }

    if (userAddValue.trim() === '') {
        thereIsEmptyField = true
        userAdd.parentNode.classList.add("has-error")
    }

    if (userCardValue.trim() === '') {
        thereIsEmptyField = true
        userCard.parentNode.classList.add("has-error")
    }

    if (userTelValue.trim() === '') {
        thereIsEmptyField = true
        userTel.parentNode.classList.add("has-error")
    }

    if (userEmailValue.trim() === '') {
        thereIsEmptyField = true
        userEmail.parentNode.classList.add("has-error")
    }

    if (userPassValue.trim() === '') {
        thereIsEmptyField = true
        userPass.parentNode.classList.add("has-error")
    }

    if (userPassConfirmValue.trim() === '') {
        thereIsEmptyField = true
        userPassConfirm.parentNode.classList.add("has-error")
    }

    if (thereIsEmptyField) {
        alert("Há campos vazios que precisam ser preenchidos!")
        return false
    } else {

        if (!isNaN(parseFloat(userNameValue))) {

            userName.parentNode.classList.add("has-error")
            alert('Nome digitado é inválido!')

            return false

        } else if (!isNaN(parseFloat(userEmailValue))) {

            userEmail.parentNode.classList.add("has-error")
            alert('E-mail digitado é inválido')

            return false

        } else if (userPassValue != userPassConfirmValue) {

            userPass.parentNode.classList.add("has-error")
            userPassConfirm.parentNode.classList.add("has-error")
            alert("Senhas não conferem!")

            return false
        }
    }

    return true
}

function writeUserData(userName, userAdd, userCard, userTel, userEmail, userPass) {

    var newId = 0
    firebase.database().ref('users/').once('value').then(function (snapshot) {
        newId = snapshot.val().length

        database.ref('users/' + newId).set({
            username: userName,
            address: userAdd,
            card: userCard,
            phone: userTel,
            email: userEmail,
            pass: userPass
        })
    }).then(function () {

        console.log("Cadastro realizado com sucesso!")

        // Closing modal
        const modalRegister = document.getElementById('modalRegister');
        modalRegister.style.display = 'none';

        var doc = content.document;
        var body = doc.body;
        var div = doc.getElementsByClassName("modal-backdrop");

        // Removing dimmer
        body.className = '';
        body.removeChild(div[0]);

        // Logging
        setUserIdLogged(newId)

        // Update dropdown
        updateNavBarMenu()

        // Feedback to user
        alert("Olá " + userName + "!")

    }).catch(function (error) {
        alert("Data could not be saved.\n" + error);
    })
}

// Handling user login
var userEmailL = document.getElementById('emailL')
var userPassL = document.getElementById('pwdL')

function btnLogin() {
    var userEmailValue = userEmailL.value
    var userPassValue = userPassL.value

    loginUserData(userEmailValue, userPassValue)
}

function loginUserData(userEmailValue, userPassValue) {

    let modalLogin = document.getElementById('modalLogin');

    console.log("Logging with \"" + userEmailValue + "\"")

    userPassL.parentNode.classList.remove("has-error")
    userEmailL.parentNode.classList.remove("has-error")

    database.ref('users/')

        .orderByChild('email')
        .startAt(userEmailValue).endAt(userEmailValue)
        .once('value').then(function (snapshot) {

            if (snapshot.val() != null) {
                // Email exists on database.

                // Check password
                var user
                var userId
                for(var i in snapshot.val()) {
                    user = snapshot.val()[i]
                    userId = i
                }
                var storedPass = user.pass

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

                    setUserIdLogged(userId)
                    updateNavBarMenu()

                    alert("Olá " + user.username + "!")

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

// Handling user edit
function loadEdUser() {
    var name = document.getElementById('nameEdit')
    var add = document.getElementById('addEdit')
    var card = document.getElementById('cardEdit')
    var phone = document.getElementById('telEdit')
    var email = document.getElementById('emailEdit')

    var userId = getUserIdLogged()

    database.ref('users/' + userId)
        .once('value', function (snapshot) {

            var user = snapshot.val()
            
            name.value = user.username
            add.value = user.address
            card.value = user.card
            phone.value = user.phone
            email.value = user.email
        })
}

function btnEdUser() {
    var name = document.getElementById('nameEdit')
    var add = document.getElementById('addEdit')
    var card = document.getElementById('cardEdit')
    var phone = document.getElementById('telEdit')
    var email = document.getElementById('emailEdit')
    var pwdCurrent = document.getElementById('pwd1Edit')
    var pwdNew = document.getElementById('pwd2Edit')
    var pwdConfirmNew = document.getElementById('pwd3Edit')

    name.parentNode.classList.remove("has-error")
    add.parentNode.classList.remove("has-error")
    card.parentNode.classList.remove("has-error")
    phone.parentNode.classList.remove("has-error")
    email.parentNode.classList.remove("has-error")
    pwdCurrent.parentNode.classList.remove("has-error")
    pwdNew.parentNode.classList.remove("has-error")
    pwdConfirmNew.parentNode.classList.remove("has-error")

    var userId = getUserIdLogged()

    database.ref('users/' + userId)
        .once('value', function (snapshot) {

            var user = snapshot.val()

            var pass

            if(pwdNew.value != '') {
                pass = pwdNew
            } else {
                pass = pwdCurrent
            }

            if(validateEditFields(user.pass)) {
                snapshot.ref.update({
                    userame: name.value,
                    address: add.value,
                    card: card.value,
                    phone: phone.value,
                    email: email.value,
                    pass: pass
                })
            }
        })
        
}

function validateEditFields(storedUserPwd) {

    console.log(storedUserPwd)

    var userName = document.getElementById('nameEdit')
    var userAdd = document.getElementById('addEdit')
    var userCard = document.getElementById('cardEdit')
    var userPhone = document.getElementById('telEdit')
    var userEmail = document.getElementById('emailEdit')
    var userPwdCurrent = document.getElementById('pwd1Edit')
    var userPwdNew = document.getElementById('pwd2Edit')
    var userPwdNewConfirm = document.getElementById('pwd3Edit')

    var userNameValue = userName.value
    var userAddValue = userAdd.value
    var userCardValue = userCard.value
    var userPhoneValue = userPhone.value
    var userEmailValue = userEmail.value
    var userPwdCurrentValue = userPwdCurrent.value
    var userPwdNewValue = userPwdNew.value
    var userPwdNewConfirmValue = userPwdNewConfirm.value

    // Validating empty fields
    var thereIsEmptyField = false
    if (userNameValue.trim() === '') {
        thereIsEmptyField = true
        userName.parentNode.classList.add("has-error")
    }

    if (userAddValue.trim() === '') {
        thereIsEmptyField = true
        userAdd.parentNode.classList.add("has-error")
    }

    if (userCardValue.trim() === '') {
        thereIsEmptyField = true
        userCard.parentNode.classList.add("has-error")
    }

    if (userPhoneValue.trim() === '') {
        thereIsEmptyField = true
        userPhone.parentNode.classList.add("has-error")
    }

    if (userEmailValue.trim() === '') {
        thereIsEmptyField = true
        userEmail.parentNode.classList.add("has-error")
    }

    if (userPwdCurrentValue.trim() === '') {
        thereIsEmptyField = true
        userPwdCurrent.parentNode.classList.add("has-error")
    }

    if (thereIsEmptyField) {
        alert("Há campos vazios que precisam ser preenchidos!")
        return false
    } else {

        if (!isNaN(parseFloat(userNameValue))) {

            userName.parentNode.classList.add("has-error")
            alert('Nome digitado é inválido!')

            return false

        } else if (!isNaN(parseFloat(userEmailValue))) {

            userEmail.parentNode.classList.add("has-error")
            alert('E-mail digitado é inválido')

            return false

        } else if (userPwdCurrentValue != storedUserPwd) {

            userPwdCurrent.parentNode.classList.add("has-error")
            alert("Senha atual inválida")

            return false
        } else if ((userPwdNewValue != '' || userPwdNewConfirm != '')
                && (userPwdNewValue != userPwdNewConfirmValue)) {

            userPwdNew.parentNode.classList.add("has-error")
            userPwdNewConfirm.parentNode.classList.add("has-error")
            alert("Senhas não conferem!")

            return false
        }
    }

    return true
}

// Handling cart in local storage
updateCartItemsCountInNavigationBar()

function updateCartItemsCountInNavigationBar() {
    let itemsCount = getCartItemsCount();

    let badgeCart = document.getElementById('badgeCart')
    badgeCart.innerHTML = itemsCount
}

function updateLocalStorage(allItems) {
    console.log("Updating local storage")

    var jsonString = JSON.stringify(allItems);

    localStorage.cart = jsonString

    updateCartItemsCountInNavigationBar()
}

function getCartItemsCount() {

    var currentCartItems = localStorage.cart
    var currentCartItemsCount = 0

    if (currentCartItems) {

        var allItems = new Array()
        allItems = JSON.parse(localStorage.cart)

        currentCartItemsCount = allItems.length
    }

    return currentCartItemsCount
}

function getAllUserCartItems(callback) {

    var currentCartItems = localStorage.cart

    if(currentCartItems) {

        var allItems = new Array()
        allItems = JSON.parse(localStorage.cart)

        return allItems
    }
}

function clearCartItems() {
    localStorage.removeItem("cart");
}

// Updating dropdown nav bar menu
updateNavBarMenu()

function updateNavBarMenu() {

    let menuDefault = document.getElementById('menuDefault')
    let menuUserLoggedIn = document.getElementById('menuUserLoggedIn')

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

// Handling user login
function getUserIdLogged() {

    let userID = sessionStorage.loggedUserId

    if(userID) {
        return userID
    } else {
        return null
    }
}

function setUserIdLogged(userId) {
    if(userId != null) {
        sessionStorage.loggedUserId = userId
    }
}

function logout() {
    sessionStorage.removeItem("loggedUserId")
    updateNavBarMenu()

    console.log("You have successfully logout!")
}

// Checking if browser can use local storage

if (typeof (Storage) !== "undefined") {
    console.log("Local Storage can be used")
} else {
    console.log("Local Storage cannot be used.")
}

// Utils
function formatMoney(num) {
    return "R$ " + num.toFixed(2).toString().replace(".", ",");
}

function formatNumber(money) {
    return Number(money.replace("R$ ", "").replace(",", "."));
}

function getDate() {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; //January is 0!
    var yyyy = today.getFullYear();

    if(dd<10) {
        dd = '0'+dd
    } 

    if(mm<10) {
        mm = '0'+mm
    } 

    return (dd + '/' + mm + '/' + yyyy)
}