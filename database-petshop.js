const lowdb = require('lowdb')
const db = lowdb('database.json')

db
    .defaults({
        users: [],
        products: [],
        productSections: [],
        cart: []
    })
    .write()

// Add a product to a cart of a specific user
function addCartProduct(userId, productId) {
    db
        .get('cart')
        .push({
            userId: userId,
            productsId: [productId]
        })
        .write()
}

// Returns an array with all the products ids of an user's cart
function getCartProductsByUser(userId) {
    return db
        .get('cart')
        .find({ userId: userId })
        .get('productsId')
        .value()
}

/*function getCartProducts() {
    return db
        .get('cart')
        .value()
}*/

// Deletes a product from the cart of a specific user
function deleteCartProduct(userId, productId) {
    const n = db
        .get('cart')
        .remove({
            userId: userId,
            productId: productId
        })
        .write()
}

// TESTES
// addCartProduct(1, 16)
// console.log(getCartProductsByUser(1))
// console.log(getCartProducts())
// deleteCartProduct(1)

//expose methods
module.exports = {
    addCartProduct,
    getCartProductsByUser,
    deleteCartProduct
}