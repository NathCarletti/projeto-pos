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
  clearList()
  while (products.length) {
    products.pop()
  }

  database.ref('products/').once('value').then(function (snapshot) {
    for (var i in snapshot.val()) {
      while (products.length) {
        products.pop()
      }
      products.push(snapshot.val()[i].amount)
      products.push(snapshot.val()[i].description)
      products.push(snapshot.val()[i].name)
      products.push(snapshot.val()[i].price)

      listProductData(products)
      while (products.length) {
        products.pop()
      }
    }
  })
}
//CREATE list
function listProductData(products) {
  var ul = document.getElementById('lista')
  /*var newLi = document.createElement('li')
  var liContent = document.createTextNode(products)

  newLi.appendChild(liContent)
  ul.appendChild(newLi)*/
  var l = "";
  var li = '<ul tag>';
    li += '<li class="text-center">' + products + '</li>';
    li += '</ul>';
    l += li;
    ul.innerHTML += l;
}
//CLEAR list before generate another
function clearList() {
 var ul = document.getElementById('lista')
  var list = document.getElementsByTagName('li')
  for (var i = 1; i < ul.children.length; i++) {
    ul.removeChild(ul.children[i])
    console.log(i)
  }
}

var allItems;
var editSelectedId;

//DELETE object from Firebase
function btnDel() {

  if(editSelectedId != null) {
    var res = confirm("Tem certeza que deseja remover este produto?")
    if(res == true) {
      database.ref('products/' + editSelectedId).remove()

      $('#del').modal('toggle');
    }

  } else {
    alert("Selecione um produto para remover")
  }
}

// EDIT
function searchProduct() {

  if (editSelectedId != null) {
  
    var product
    database.ref('products/' + editSelectedId)
    .once('value', function (snapshot) {

        product = snapshot.val()

        document.getElementById('nameE').value = product.name
        document.getElementById('descE').value = product.description
        document.getElementById('prcE').value = product.price
        document.getElementById('amntE').value = product.amount
        
    }).then(function() {

      if(product != null) {
        // Open modal
        $(document).ready(function() {
          $('#myModal1').modal(
          {
            url: 'adm.html'
          }
        )})

        $('#edit').modal('toggle');

      } else {
        alert("Produto não encontrado.")
      }
    })
  } else {
    alert('Selecione um produto para editar!')
  }
}

function getProducts(modalType) {

  editSelectedId = null

  var listEdit = document.getElementById('listEdit')
  var listDelete = document.getElementById('listDelete')

  listEdit.innerHTML = "";
  listDelete.innerHTML = "";

  var listItems
  if(modalType == 0) {
    listItems = listEdit
  } else if(modalType == 1) {
    listItems = listDelete
  }

  database.ref('products/').once('value').then(function (snapshot) {

    allItems = snapshot.val()
    for(var i in allItems) {
      var listItem = '<button id="itemId' + i + '" class="list-group-item" onclick="itemSelected(' + i + ')" >' + allItems[i].name + '</button>'

      listItems.innerHTML += listItem;
    }
  })
}

function itemSelected(selectedId) {

  console.log(selectedId)

  editSelectedId = selectedId

  // Unselect other items
  for(var i in allItems) {
    var item = document.getElementById('itemId' + i)
    console.log(item)
    item.classList.remove('active')
  }

  // Select item
  var selectedItem = document.getElementById('itemId' + selectedId);
  selectedItem.classList.add('active')

}

function btnEd() {
  var amnt = document.getElementById('amntE').value
  var desc = document.getElementById('descE').value
  var image = document.getElementById('imgE').value
  var prodName = document.getElementById('nameE').value
  var prc = document.getElementById('prcE').value
  
  database.ref('products/' + editSelectedId).update({
    amount: formatNumber(amnt),
    description: desc,
    name: prodName,
    price: formatNumber(prc)
  })
}

function formatNumber(money) {
  return Number(money.replace("R$ ", "").replace(",", "."));
}