const submit = document.getElementById("btnSubmit")
const table = document.getElementById("products")

var cartProducts = JSON.parse('[{ "id": 1, "name": "Racao", "description": "Racao premium 15Kg",'
                    + '"image": "racao1.jpg", "sectionId": 1, "price": 105.00, "amount": 2 }]')

for(var i=0; i<cartProducts.length; i++) {
    addRow(cartProducts[i].id, cartProducts[i].image, cartProducts[i].name, cartProducts[i].price, cartProducts[i].amount)
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

function addRow(id, image, name, price, amount) {

    let imgTag = '<img class="product-img" src="images/' + image +'" alt="...">'
    let amountInput = '<input type="number" value="1" min="1" max="' + amount + '" />'
    let totalPrice = price
    let delBtn = '<button type="button" class="btn btn-xs btn-danger" onclick="getId(this)">Remover</button>'

    var t = "";

    var tr = '<tr tag>';
    tr += '<td class="text-center">' + imgTag + '</td>';
    tr += '<td class="text-center">' + name + '</td>';
    tr += '<td class="text-center">' + price + '</td>';
    tr += '<td class="text-center">' + amountInput + '</td>';
    tr += '<td class="text-center">' + totalPrice + '</td>';
    tr += '<td class="text-center">' + delBtn + '</td>';
    tr += '</tr>';
    t += tr;
        
    document.getElementById("products").innerHTML += t;
}

function getId(element) {
    let row = element.parentNode.parentNode.rowIndex - 1
    let column = element.parentNode.cellIndex

    // Get product
    if(element.tagName.toLowerCase() == "button"){
        // remove button clicked

        let userId = 1;
        let productId = cartProducts[row].id
        deleteCartProduct(userId, productId)

    } else if(element.tagName.toLowerCase() == "input") {
        // amount changed

    }

}