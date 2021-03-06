const { CartItem } = require("../models")
const cartDataLayer = require("../dal/cart")

class CartServices {
    constructor(user_id) {
        this.user_id = user_id
    }

    async getAll() {
        const allItems = await cartDataLayer.getAllItems(this.user_id)
        return allItems
    }

    async addToCart(posterId) {
        // Check if item is already in cart
        const cartItem = await cartDataLayer.getCartItemByUserAndPoster(this.user_id, posterId)
        // If false, create and save to the cart
        if (!cartItem) {
            let newCartItem = new CartItem();
            newCartItem.set("poster_id", posterId)
            newCartItem.set("user_id", this.user_id)
            newCartItem.set("quantity", 1)
            await newCartItem.save()
            return newCartItem

        } else {
            // If true, take item and increase qty by 1
            cartItem.set("quantity", cartItem.get("quantity") + 1)
            await cartItem.save()
            return cartItem
        }
    }

    async updateQuantity(posterId, newQuantity) {
        return await cartDataLayer.updateQuantity(this.user_id, posterId, newQuantity)
    }

    async removeItem(posterId) {
        return await cartDataLayer.removeItem(this.user_id, posterId)
    }
}

module.exports = CartServices