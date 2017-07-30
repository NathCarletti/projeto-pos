var database = firebase.database()

function btnSub() {
    var pass1 = document.getElementById('pwd1').value
    var pass2 = document.getElementById('pwd2').value
    var userName = document.getElementById('name').value
    var userAdd = document.getElementById('add').value
    var userCard = document.getElementById('card').value
    var userTel = document.getElementById('tel').value
    var userEmail = document.getElementById('email').value

    /* if(userName.trim()==='') alert ('Digite o nome!!');
     else if(!isNaN(parseFloat(userName))) alert('Digite nome valido');
     else if(userAdd.trim()==='') alert('Digite o endereço!!');
     else if(userCard.trim()==='') alert('Digite o número cartão!!');
     else if(userTel.trim()==='') alert('Digite o telefone!!');
     else if(userEmail.trim()==='') alert('Digite o E-mail!!');
     else if(!isNaN(parseFloat(userEmail))) alert('Digite e-mail valido');
     else if(isNaN(parseFloat(userTel))) alert('Digite numero valido');
     else {
          if(pass1==pass2){
             pass1 = pass1
             }else{
             alert("error")
         }
        /*var usuario=[
            userName,
            userAdd,
            userCard,
            userEmail
        ]*/
    writeUserData(12, userName, userAdd, userCard, userTel, userEmail);
    /*
      userName.value='';
      userAdd.value='';
      userCard.value='';
      userTel.value='';
      userEmail.value='';
      userName.focus();*/
}

var userEmailL = document.getElementById('emailL')
var userPassL = document.getElementById('pwdL')

function btnLogin() {
    var userEmailValue = userEmailL.value
    var userPassValue = userPassL.value

    loginUserData(userEmailValue, userPassValue)
}

function writeUserData(userId, userName, userAdd, userCard, userTel, userEmail) {
    database.ref('users/' + userId).set({
        username: userName,
        address: userAdd,
        card: userCard,
        phone: userTel,
        email: userEmail
    });
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