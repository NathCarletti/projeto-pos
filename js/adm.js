var database = firebase.database()

//ADD PRODUCT
function btnConfirm() {

  var amnt = document.getElementById('amnt').value
  var desc = document.getElementById('desc').value
  var image = document.getElementById('img').value
  var prodName = document.getElementById('name').value
  var prc = document.getElementById('prc').value

  //userName.focus();

  writeProductData(amnt, desc, image, prodName, prc);
}

//WRITE on Firebase
function writeProductData(amnt, desc, image, prodName, prc) {

  database.ref('products/').once('value').then(function (snapshot) {

    var newId = snapshot.numChildren()

    database.ref('/products/' + Number(newId)).set({
        
        amount: Number(amnt),
        description: desc,
        imageURL: image,
        name: prodName,
        price: formatNumber(prc)

      }).then(function () {
        
        alert("\"" + prodName + "\"" + " cadastrado com sucesso!!")

      })
  })
}

//LIST product
var products = new Array();
function listaP() {
  var i = 0
  while (products.length) {
    products.pop()
  }

  clearList()

  database.ref('products/').once('value').then(function (snapshot) {
    for (var i in snapshot.val()) {
      //for( i=0;i<snapshot.val().length;i++){
      while (products.length) {
        products.pop()
      }
      console.log(snapshot.val())
      console.log(products)
      console.log(i)
      products.push(snapshot.val()[i].amount)
      products.push(snapshot.val()[i].description)
      products.push(snapshot.val()[i].name)
      products.push(snapshot.val()[i].price)

      listProductData(products)
      while (products.length) {
        products.pop()
        console.log(products)
      }
    }
  })
}
//CREATE list
function listProductData(products) {
  var ul = document.getElementById('lista')
  var newLi = document.createElement('li')
  var liContent = document.createTextNode(products)

  newLi.appendChild(liContent)
  ul.appendChild(newLi)
}
//CLEAR list before generate another
function clearList() {
  var ul = document.getElementById('lista')
  var list = document.getElementsByTagName('li')
  for (var i = 0; i < ul.children.length; i++) {
    ul.removeChild(ul.children[i])
  }
}

//DELETE object from Firebase
function btnDel() {
  var name = document.getElementById('pName').value
  console.log(name)
  database.ref('products/').orderByChild('name').equalTo(name).on('child_added', (snapshot) => {
    snapshot.ref.remove()
  })
}

// EDIT
function searchProduct() {

  var name = document.getElementById('editName').value

  database.ref('products/').orderByChild('name').equalTo(name).once('value', function (snapshot) {

    var product
    for(var i in snapshot.val()) {
      product = snapshot.val()[i]
      document.getElementById('nameE').value = product.name
      document.getElementById('descE').value = product.description
      document.getElementById('prcE').value = product.price
      document.getElementById('amntE').value = product.amount
    }
  }).then(function() {

    // Open modal
    $(document).ready(function() {
      $('#myModal1').modal(
      {
        url: 'adm.html'
      }
    );});
  })
}

function btnEd() {
  var amnt = document.getElementById('amntE').value
  var desc = document.getElementById('descE').value
  var image = document.getElementById('imgE').value
  var prodName = document.getElementById('nameE').value
  var prc = document.getElementById('prcE').value
  var nameP = document.getElementById('editName').value

  database.ref('products/').once('value').then(function (snapshot) {
      var product
      var id
      for (var i in snapshot.val()) {
        if(snapshot.val()[i].name===nameP){
          console.log(i)
          product=snapshot.val()[i]
          console.log(product)
          id=i
        }else{console.log('nao existe')}}
        database.ref('products/'+id).orderByChild('name').equalTo(nameP).once('value', function (snapshot) {
        snapshot.ref.update({
        amount: amnt,
        description: desc,
        name: prodName,
        price: prc
        })
      })
  })
}

function formatNumber(money) {
  return Number(money.replace("R$ ", "").replace(",", "."));
}