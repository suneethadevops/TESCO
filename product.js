// Product Management Module
class Product {
    constructor(id, name, price, category, description, image) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.category = category;
        this.description = description;
        this.image = image;
    }

    // Get product details
    getDetails() {
        return {
            id: this.id,
            name: this.name,
            price: this.price,
            category: this.category,
            description: this.description,
            image: this.image
        };
    }

    // Update product price
    updatePrice(newPrice) {
        if (newPrice > 0) {
            this.price = newPrice;
            return true;
        }
        console.error("Price must be greater than 0");
        return false;
    }

    // Apply discount
    applyDiscount(discountPercent) {
        if (discountPercent > 0 && discountPercent < 100) {
            const discountedPrice = this.price * (1 - discountPercent / 100);
            return discountedPrice.toFixed(2);
        }
        console.error("Discount must be between 0 and 100");
        return null;
    }
}

// Product Inventory Management
class ProductInventory {
    constructor() {
        this.products = [];
    }

    // Add product to inventory
    addProduct(product) {
        this.products.push(product);
        return true;
    }

    // Get all products
    getAllProducts() {
        return this.products;
    }

    // Get product by ID
    getProductById(id) {
        return this.products.find(product => product.id === id);
    }

    // Get products by category
    getProductsByCategory(category) {
        return this.products.filter(product => product.category === category);
    }

    // Search products by name
    searchProducts(searchTerm) {
        return this.products.filter(product =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }

    // Remove product from inventory
    removeProduct(id) {
        const index = this.products.findIndex(product => product.id === id);
        if (index > -1) {
            this.products.splice(index, 1);
            return true;
        }
        return false;
    }

    // Get total inventory value
    getTotalInventoryValue() {
        return this.products.reduce((total, product) => total + product.price, 0).toFixed(2);
    }

    // Get product count
    getProductCount() {
        return this.products.length;
    }
}

// Sample Product Data
const sampleProducts = [
    new Product(1, "Fresh Vegetables", 5.99, "Vegetables", "Assorted fresh vegetables", "https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"),
    new Product(2, "Milk (1L)", 1.50, "Dairy", "Fresh pasteurized milk", "https://images.unsplash.com/photo-1550583724-b2692b85b150?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"),
    new Product(3, "Premium Meat", 12.99, "Meat", "High-quality beef cuts", "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"),
    new Product(4, "Organic Apples", 3.99, "Fruits", "Fresh organic apples", "https://images.unsplash.com/photo-1560806887-1195c9fb2756?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"),
    new Product(5, "Whole Wheat Bread", 2.49, "Bakery", "Fresh whole wheat bread", "https://images.unsplash.com/photo-1555507036-ab1f4038808a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"),
    new Product(6, "Yogurt (500g)", 1.99, "Dairy", "Creamy natural yogurt", "https://images.unsplash.com/photo-1563869733338-46c48c69cb9b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"),
    new Product(7, "Dish Soap", 2.49, "Cleaning", "Effective dishwashing liquid", "https://images.unsplash.com/photo-1583947215259-38e31be8751f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"),
    new Product(8, "All-Purpose Cleaner", 3.99, "Cleaning", "Multi-surface cleaning spray", "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"),
    new Product(9, "Laundry Detergent", 4.99, "Cleaning", "Powerful laundry detergent", "https://images.unsplash.com/photo-1626808642875-0aa545482dfb?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80")
];

// Initialize inventory
const inventory = new ProductInventory();

// Add sample products to inventory
sampleProducts.forEach(product => {
    inventory.addProduct(product);
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        Product,
        ProductInventory,
        inventory,
        sampleProducts
    };
}
