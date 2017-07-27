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
		var max = ul.children.length;
		var newLi = document.createElement('li');
		//newLi.id='';
		newLi.onclick = function(){
		//ul.removeChild(newLi);
		var list = document.getElementById('lista');
		list.removeChild(this); //cara que foi clicado
    console.log(this)
      database.ref('products/').once('value').then(function(snapshot) {
        for(var t=0;t<max;t++){
			var listItem = ul.children[i];
			
			if(listItem.innerHTML == name.value){
				alert('Já existe esse nome na lista!');
				name.focus();
				
				return;
			}
        for(var i in snapshot.val()){
          console.log(i)
            productToDel.push(snapshot.val()[i].description)
            productToDel.push(snapshot.val()[i].name)
        }
        }
		  });
    }

		var liContent = document.createTextNode(products);
    productToDel = products

		newLi.appendChild(liContent);
		ul.appendChild(newLi);
};