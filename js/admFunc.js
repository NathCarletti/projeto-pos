var database = firebase.database()
//ADD PRODUCT
function btnConfirm(){
    var id= document.getElementById('id').value
    var amnt=document.getElementById('amnt').value
    var desc = document.getElementById('desc').value
    var image = document.getElementById('img').value
    var prodName= document.getElementById('name').value
    var prc = document.getElementById('prc').value
    
    writeProductData(id, amnt, desc, image, prodName, prc);
      /*
		userName.value='';
		userAdd.value='';
		userCard.value='';
		userTel.value='';
		userEmail.value='';
		userName.focus();*/
}

function writeProductData(id, amnt, desc, image, prodName, prc) {
  database.ref('/products/' + id).set({
    amount: amnt,
    description: desc,
    imageURL: image,
    name: prodName,
    price: prc
  });

console.log('oi')
}

//LIST product
var products = new Array();
listProductData()
function listProductData(){
    database.ref('products/').once('value').then(function(snapshot) {
            products.push(snapshot.val()[0])
            products.push(snapshot.val()[1])
            products.push(snapshot.val()[2])
            console.log(products)
            function addProductHTML(products)
    })
    
}

function addProductHTML(products) {

    var html = "";

    var html = '<div class="col-xs-2">';
    html += '<div class="thumbnail">';
    html += '<img src="images/' + products.imageUrl + '" alt="..." style="width:100%" class="product-img">';
    html += '<div class="caption">';
    html += '<p>' + products.name + '</p>';
    html += '<p>' + formatMoney(products.prc) + '</p>';
    html += '<button type="submit" class="btn btn-xs btn-success" onclick="addToCart(' + products.id + ')" >Adicionar ao carrinho</button>';
    html += '</div>';
    html += '</div>';
    html += '</div>';
    //t += html;
        
    productsDiv.innerHTML += html;
}
