var database = firebase.database()

const userPass = document.getElementById('pwd1')
const userPassConfirm = document.getElementById('pwd2')
const userName = document.getElementById('name')
const userAdd = document.getElementById('add')
const userCard = document.getElementById('card')
const userTel = document.getElementById('tel')
const userEmail = document.getElementById('email')

function btnSub() {
    var userPassValue = document.getElementById('pwd1').value
    var userPassConfirmValue = document.getElementById('pwd2').value
    var userNameValue = document.getElementById('name').value
    var userAddValue = document.getElementById('add').value
    var userCardValue = document.getElementById('card').value
    var userTelValue = document.getElementById('tel').value
    var userEmailValue = document.getElementById('email').value

    userPass.parentNode.classList.remove("has-error")
    userPassConfirm.parentNode.classList.remove("has-error")
    userName.parentNode.classList.remove("has-error")
    userAdd.parentNode.classList.remove("has-error")
    userCard.parentNode.classList.remove("has-error")
    userTel.parentNode.classList.remove("has-error")
    userEmail.parentNode.classList.remove("has-error")

    if(validateFields(userNameValue, userAddValue, userCardValue, userTelValue, userEmailValue, userPassValue, userPassConfirmValue)) {
        writeUserData(userNameValue, userAddValue, userCardValue, userTelValue, userEmailValue, userPassValue)
    }
}

function validateFields(userNameValue, userAddValue, userCardValue, userTelValue, userEmailValue, userPassValue, userPassConfirmValue) {
    
    // Validating empty fields
    var thereIsEmptyField = false
    if(userNameValue.trim() === '') {
        thereIsEmptyField = true
        userName.parentNode.classList.add("has-error")
    }

    if(userAddValue.trim() === '') {
        thereIsEmptyField = true
        userAdd.parentNode.classList.add("has-error")
    }

    if(userCardValue.trim() === '') {
        thereIsEmptyField = true
        userCard.parentNode.classList.add("has-error")
    }

    if(userTelValue.trim() === '') {
        thereIsEmptyField = true
        userTel.parentNode.classList.add("has-error")
    }

    if(userEmailValue.trim() === '') {
        thereIsEmptyField = true
        userEmail.parentNode.classList.add("has-error")
    }

    if(userPassValue.trim() === '') {
        thereIsEmptyField = true
        userPass.parentNode.classList.add("has-error")
    }

    if(userPassConfirmValue.trim() === '') {
        thereIsEmptyField = true
        userPassConfirm.parentNode.classList.add("has-error")
    }

    if(thereIsEmptyField) {
        alert("Há campos vazios que precisam ser preenchidos!")
        return false
    } else {

        if(!isNaN(parseFloat(userNameValue))) {

            userName.parentNode.classList.add("has-error")
            alert('Nome digitado é inválido!')

            return false

        } else if(!isNaN(parseFloat(userEmailValue))) {

            userEmail.parentNode.classList.add("has-error")
            alert('E-mail digitado é inválido')

            return false

        } else if(userPassValue != userPassConfirmValue) {

            userPass.parentNode.classList.add("has-error")
            userPassConfirm.parentNode.classList.add("has-error")
            alert("Senhas não conferem!")

            return false
        }
    }

    return true
}

var userEmailL = document.getElementById('emailL')
var userPassL = document.getElementById('pwdL')

function btnLogin() {
    var userEmailValue = userEmailL.value
    var userPassValue = userPassL.value

    loginUserData(userEmailValue, userPassValue)
}

function writeUserData(userName, userAdd, userCard, userTel, userEmail, userPass) {

    var newId = 0
    firebase.database().ref('users/').once('value').then(function(snapshot) {
        newId = snapshot.val().length

        database.ref('users/' + newId).set({
            username: userName,
            address: userAdd,
            card: userCard,
            phone: userTel,
            email: userEmail,
            pass: userPass
        })
    }).then(function() {
        
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

    }).catch(function(error) {
        alert("Data could not be saved.\n" + error);
    })
}

function btnEdUser(){
      var name= document.getElementById('nameE').value
      var add=document.getElementById('addE').value
      var card = document.getElementById('cardE').value
      var phone = document.getElementById('telE').value
      var email= document.getElementById('emailE').value
      var pwd = document.getElementById('pwdE').value
      var emailToEd = document.getElementById('editEmail').value

    console.log(emailToEd)
    database.ref('users/'+ userId).orderByChild('name').equalTo(emailToEd).once('value', function (snapshot){
      snapshot.ref.update({
        userName: name,
        address: add,
        card: card,
        phone: phone,
        email: email,
        password: pwd
      })
  })
}

const modalLogin = document.getElementById('modalLogin');
function loginUserData(userEmailValue, userPassValue) {

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

const productsDiv = document.getElementById("products")
const loader = document.getElementById("loader")

function getAllUserCartItems(callback) {

    console.log("Getting products...")

    var allProducts = new Array()

    database.ref('/products/')
        .once('value').then(function (snapshot) {

            var firebaseProducts = snapshot.val()

            for (var i in firebaseProducts) {

                var product = new Object()
                product["id"] = i
                product["name"] = firebaseProducts[i].name
                product["price"] = firebaseProducts[i].price
                product["imageUrl"] = firebaseProducts[i].imageUrl

                allProducts.push(product)
            }

            callback(allProducts)
        });
}

getAllUserCartItems(function (allProducts) {

    for (var i in allProducts) {
        console.log(allProducts[i])
        addProductHTML(allProducts[i])
    }

    console.log('Removing loader')
    loader.parentNode.removeChild(loader);
})


function addProductHTML(product) {

    var html = "";

    var html = '<div class="col-xs-2">';
    html += '<div class="thumbnail">';
    html += '<img src="images/' + product.imageUrl + '" alt="..." style="width:100%" class="product-img">';
    html += '<div class="caption">';
    html += '<p>' + product.name + '</p>';
    html += '<p>' + formatMoney(product.price) + '</p>';
    html += '<button type="submit" class="btn btn-xs btn-success" onclick="addToCart(' + product.id + ')" >Adicionar ao carrinho</button>';
    html += '</div>';
    html += '</div>';
    html += '</div>';
    //t += html;

    productsDiv.innerHTML += html;
}

function formatMoney(num) {
    return "R$ " + num.toFixed(2).toString().replace(".", ",");
}

if (typeof (Storage) !== "undefined") {
    // Code for localStorage/sessionStorage.
    console.log("Local Storage can be used")
} else {
    // Sorry! No Web Storage support..
    console.log("Local Storage cannot be used")
}

function sampleUsingLocalStorage() {
    // Store
    localStorage.setItem("lastname", "Smith");
    // Retrieve
    console.log(localStorage.getItem("lastname"))
    // Remove
    localStorage.removeItem("lastname");
}

/*function sampleUsingSessionStorage() {
    if (sessionStorage.myName) {
        sessionStorage.myName = Number(sessionStorage.myName) + 1;
    } else {
        sessionStorage.myName = 1;
    }
    console.log("You have clicked the button " + sessionStorage.myName + " time(s) in this session.")
}
sampleUsingSessionStorage()*/

// localStorage.removeItem("cart");
updateCartItemsCountInNavigationBar()

function addToCart(productId) {

    var currentCartItems = localStorage.cart
    var allItems = new Array();

    if (currentCartItems) {
        // Check if the item is already added
        allItems = JSON.parse(currentCartItems);

        var itemAlreadyAdded = allItems.find(e => e.id == productId) != null
        if (!itemAlreadyAdded) {
            addItemLocalStorage(allItems, productId)
        } else {
            console.log("This item has already been added.")
        }

    } else {
        // Store first item on cart
        addItemLocalStorage(allItems, productId)
    }

    console.log("Cart: " + localStorage.cart)

    // to remove
    // localStorage.removeItem("cart");
}

function addItemLocalStorage(allItems, itemIdToAdd) {

    var obj = new Object();
    obj.id = itemIdToAdd;
    obj.amount = 1;

    allItems.push(obj)

    var jsonString = JSON.stringify(allItems);

    localStorage.cart = jsonString

    updateCartItemsCountInNavigationBar()
}

function updateCartItemsCountInNavigationBar() {
    var itemsCount = getCartItemsCount();

    var badgeCart = document.getElementById('badgeCart')
    badgeCart.innerHTML = itemsCount

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

var menuDefault = document.getElementById('menuDefault')
var menuUserLoggedIn = document.getElementById('menuUserLoggedIn')

updateNavBarMenu()

function updateNavBarMenu() {

    // Handling user login
    if (loggedUserId = getUserIdLogged()) {
        console.log("The user with ID " + loggedUserId + "is logged")
        // menuUserLoggedIn.parentNode.removeChild(menuUserLoggedIn);
        //menuDefault.style.visibility = 'hidden';
        //menuUserLoggedIn.style.visibility = 'visible';

        menuDefault.style.visibility = 'visible';
        menuUserLoggedIn.style.visibility = 'hidden';

    } else {
        console.log("There is no user logged")
        // menuDefault.parentNode.removeChild(menuDefault);
        //menuDefault.style.visibility = 'visible';
        //menuUserLoggedIn.style.visibility = 'hidden';

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