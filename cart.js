// Shopping Cart Module
class CartItem {
    constructor(product, quantity = 1) {
        this.product = product;
        this.quantity = quantity;
    }

    // Get total price for this item
    getTotalPrice() {
        return (this.product.price * this.quantity).toFixed(2);
    }

    // Update quantity
    updateQuantity(quantity) {
        if (quantity > 0) {
            this.quantity = quantity;
            return true;
        }
        console.error("Quantity must be greater than 0");
        return false;
    }
}

// Shopping Cart Management
class ShoppingCart {
    constructor() {
        this.items = [];
        this.taxRate = 0.20; // 20% tax
        this.shippingCost = 3.00;
    }

    // Add item to cart
    addItem(product, quantity = 1) {
        const existingItem = this.items.find(item => item.product.id === product.id);
        
        if (existingItem) {
            existingItem.updateQuantity(existingItem.quantity + quantity);
        } else {
            this.items.push(new CartItem(product, quantity));
        }
        return true;
    }

    // Remove item from cart
    removeItem(productId) {
        const index = this.items.findIndex(item => item.product.id === productId);
        if (index > -1) {
            this.items.splice(index, 1);
            return true;
        }
        return false;
    }

    // Update item quantity
    updateItemQuantity(productId, quantity) {
        const item = this.items.find(item => item.product.id === productId);
        if (item) {
            return item.updateQuantity(quantity);
        }
        return false;
    }

    // Get all items in cart
    getItems() {
        return this.items;
    }

    // Get cart item count
    getItemCount() {
        return this.items.reduce((total, item) => total + item.quantity, 0);
    }

    // Get subtotal (before tax and shipping)
    getSubtotal() {
        return this.items.reduce((total, item) => {
            return total + parseFloat(item.getTotalPrice());
        }, 0).toFixed(2);
    }

    // Get tax amount
    getTaxAmount() {
        return (parseFloat(this.getSubtotal()) * this.taxRate).toFixed(2);
    }

    // Get total (including tax and shipping)
    getTotal() {
        const subtotal = parseFloat(this.getSubtotal());
        const tax = parseFloat(this.getTaxAmount());
        const total = subtotal + tax + this.shippingCost;
        return total.toFixed(2);
    }

    // Get cart summary
    getSummary() {
        return {
            itemCount: this.getItemCount(),
            subtotal: this.getSubtotal(),
            shipCost: this.shippingCost.toFixed(2),
            tax: this.getTaxAmount(),
            total: this.getTotal(),
            items: this.items
        };
    }

    // Clear cart
    clearCart() {
        this.items = [];
        return true;
    }

    // Check if cart is empty
    isEmpty() {
        return this.items.length === 0;
    }

    // Apply coupon code (discount)
    applyCoupon(couponCode, discountPercent) {
        if (couponCode && discountPercent > 0 && discountPercent < 100) {
            const subtotal = parseFloat(this.getSubtotal());
            const discount = subtotal * (discountPercent / 100);
            return discount.toFixed(2);
        }
        return null;
    }

    // Get cart total with discount
    getTotalWithDiscount(discountPercent) {
        const subtotal = parseFloat(this.getSubtotal());
        const discountAmount = subtotal * (discountPercent / 100);
        const discountedSubtotal = subtotal - discountAmount;
        const tax = discountedSubtotal * this.taxRate;
        const total = discountedSubtotal + tax + this.shippingCost;
        return {
            originalSubtotal: this.getSubtotal(),
            discount: discountAmount.toFixed(2),
            discountedSubtotal: discountedSubtotal.toFixed(2),
            tax: tax.toFixed(2),
            shipping: this.shippingCost.toFixed(2),
            total: total.toFixed(2)
        };
    }

    // Save cart to localStorage
    saveCart() {
        const cartData = {
            items: this.items.map(item => ({
                productId: item.product.id,
                productName: item.product.name,
                price: item.product.price,
                quantity: item.quantity
            }))
        };
        localStorage.setItem('tescoCart', JSON.stringify(cartData));
        return true;
    }

    // Load cart from localStorage
    loadCart() {
        const savedCart = localStorage.getItem('tescoCart');
        if (savedCart) {
            const cartData = JSON.parse(savedCart);
            return cartData;
        }
        return null;
    }
}

// Initialize shopping cart
const cart = new ShoppingCart();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        CartItem,
        ShoppingCart,
        cart
    };
}
