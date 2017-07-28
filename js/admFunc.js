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
  database.ref('/products/' + Number(id)).set({
    amount: Number(amnt),
    description: desc,
    imageURL: image,
    name: prodName,
    price: formatNumber(prc)
  });

console.log('oi')
}

//LIST product
var products = new Array();
function listaP(){
  while(products.length){
              products.pop()
              //console.log(products)
            }
    database.ref('products/').once('value').then(function(snapshot) {
      for(var i in snapshot.val()){
        while(products.length){
              products.pop()
             // console.log(products)
            }
          console.log(i)
            products.push(snapshot.val()[i].amount)
            products.push(snapshot.val()[i].description)
            products.push(snapshot.val()[i].name)
            products.push(snapshot.val()[i].price)

            listProductData(products)
            while(products.length){
              products.pop()
              //console.log(products)
            }
      }
    })
}

function listProductData(products){
  var productToDel = new Array();
		var ul = document.getElementById('lista');
		var newLi = document.createElement('li');
		//newLi.id='';
		newLi.onclick = function(){
		//ul.removeChild(newLi);
		var list = document.getElementById('lista');
		  list.removeChild(this); //cara que foi clicado
      database.ref('products/').once('value').then(function(snapshot) {
        var max = ul.children.length;
        for(var i in snapshot.val()){
          for(var t=0;t<max;t++){
            var listItem = ul.children[t];
            //console.log(listItem)
            //console.log(ul.children[t])
			    if(listItem === snapshot.val()[i]){
            console.log('oi')
          }else{//remove(snapshot.val()[i])
            console.log(listItem)
            console.log(snapshot.val()[i])
        }
      }
    }
  })
    }
		var liContent = document.createTextNode(products);
    productToDel = products

		newLi.appendChild(liContent);
		ul.appendChild(newLi);
}

function btnDel(){
  var name = document.getElementById('pName').value
  console.log(name)
    database.ref('products/').orderByChild('name').equalTo(name).on('child_added', (snapshot) => {
     snapshot.ref.remove()
  })
}

  //var ref = firebase.database().ref('products/');
  //ref.orderByChild('name').equalTo(name).once("value", function(snapshot){
    // var updates = {};
      //snapshot.forEach(function(child){
        //  updates[child.name] = null;
     //});
     //ref.update(updates);
//});

function formatNumber(money) {
    return Number(money.replace("R$ ", "").replace(",", "."));
}