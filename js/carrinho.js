var database = firebase.database()

var userId = 10 // TODO get real ID
//var userId = firebase.auth().currentUser.uid;

const submit = document.getElementById("btnSubmit")
const table = document.getElementById("products")
const loader = document.getElementById("loader")

function getAllUserCartItems() {

    database.ref('/cart/')
        .orderByChild('userId')
        .startAt(userId).endAt(userId)
        .once('value').then(function(snapshot) {

        var allUserCartProducts = snapshot.val()[0].products

        getProducts(allUserCartProducts)
    });
}

getAllUserCartItems()
var userCartProducts = new Array();
function getProducts(cartProducts) {

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

            //console.log("----------------------------------------")
            //console.log("id: " + id)
            //console.log("name: " + name)
            //console.log("price: " + price)
            //console.log("imageUrl: " + imageUrl)
            //console.log("description: " + description)
            //console.log("totalAmount: " + totalAmount)
            //console.log("userAmount: " + userAmount)

            addRow(id, imageUrl, name, price, totalAmount, userAmount)
        });
    }

    loader.parentNode.removeChild(loader);
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

/*remove.addEventListener('click', function(event) {
    console.log("Remove action")

    var rowLength = table.rows.length;
    console.log("quantidade de itens: " + (rowLength-1))

    console.log("Id do selecionado: " + table.innerHTML)
})*/

submit.addEventListener('click', function(event) {
    console.log("Submit action")
})

function addRow(id, image, name, price, totalAmount, userAmount) {

    console.log("ID do produto: " + id)
    //console.log("Total em estoque: " + totalAmount)
    //console.log("Total no carrinho do usuário: " + userAmount)

    let imgTag = '<img class="product-img" src="images/' + image +'" alt="...">'
    let amountInput = '<input type="number" value="' + userAmount + '" min="1" max="' + totalAmount + '" onkeyup="showMe(this)" />'
    let totalPrice = price * userAmount
    let delBtn = '<button type="button" class="btn btn-xs btn-danger" onclick="getId(this)">Remover</button>'

    var t = "";

    var tr = '<tr tag>';
    tr += '<td class="text-center">' + imgTag + '</td>';
    tr += '<td class="text-center">' + name + '</td>';
    tr += '<td class="text-center">' + "R$ " + price + '</td>';
    tr += '<td class="text-center">' + amountInput + '</td>';
    tr += '<td class="text-center">' + "R$ " + totalPrice + '</td>';
    tr += '<td class="text-center">' + delBtn + '</td>';
    tr += '</tr>';
    t += tr;
        
    document.getElementById("products").innerHTML += t;
}

function getId(element) {
    let row = element.parentNode.parentNode.rowIndex - 1
    let column = element.parentNode.cellIndex

    console.log("getId clicked")

    var itemName = table.rows[row].cells[1].innerHTML
    var clickedProduct = userCartProducts.find(i => i.name === itemName);

    // Get product
    if(element.tagName.toLowerCase() == "button"){
        // remove button clicked

        //let productId = cartProducts[row].id
        // deleteCartProduct(userId, productId)

        console.log("Delete product of row: " + row)

    } else if(element.tagName.toLowerCase() == "input") {
        // amount changed

        console.log(table.rows[row].cells[3].innerHTML)

        console.log("User changed amount item")

    }

}

function showMe(e) {
// i am spammy!
  alert(e.value);

  console.log("input clicked")
}