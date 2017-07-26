var database = firebase.database()

var userId = 10 // TODO get real ID

const productsDiv = document.getElementById("products")
const loader = document.getElementById("loader")

function getAllUserCartItems(callback) {

    console.log("Getting products...")

    
    var allProducts = new Array()

    database.ref('/products/')
        .once('value').then(function(snapshot) {

        var firebaseProducts = snapshot.val()
        
        for(var i in firebaseProducts) {
            
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

getAllUserCartItems(function(allProducts) {

    for(var i in allProducts) {
        console.log(allProducts[i])
        addProductHTML(allProducts[i])
    }

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

function addToCart(productId) {
    
    

    /*var clickedItem = getTableClickedItem(element)
    console.log("Delete product: " + clickedItem.name)

    modalText.textContent="Remover \"" + clickedItem.name + "\" do carrinho?";
    modal.style.display = "block";
    
    modalBtnYes.onclick = function() {
        console.log("Remover item " + clickedItem.name + " row: " + row)
        // removeRow(row)
        modal.style.display = "none";

        firebaseDeleteProduct(clickedItem.id)
    }*/
}