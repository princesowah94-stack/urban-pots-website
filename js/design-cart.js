const STORAGE_KEY = 'urbanpots_designs';

class DesignCart {
  static addToCart(config) {
    const cart = this.getCart();
    const id = `design_${Date.now()}`;
    const design = {
      id,
      shape: 'square-edge',
      length: config.length,
      width: config.width,
      height: config.height,
      thickness: config.thickness,
      material: config.material,
      colour: config.colour,
      quantity: config.quantity || 1,
      price: config.price,
      timestamp: new Date().toISOString(),
    };
    cart.push(design);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    return id;
  }

  static getCart() {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  static removeFromCart(id) {
    const cart = this.getCart();
    const filtered = cart.filter(d => d.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  }

  static editCart(id, newConfig) {
    const cart = this.getCart();
    const design = cart.find(d => d.id === id);
    if (design) {
      Object.assign(design, newConfig, { timestamp: new Date().toISOString() });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    }
  }

  static clearCart() {
    localStorage.removeItem(STORAGE_KEY);
  }

  static getDesignById(id) {
    const cart = this.getCart();
    return cart.find(d => d.id === id);
  }

  static getTotalQuantity() {
    const cart = this.getCart();
    return cart.reduce((sum, d) => sum + d.quantity, 0);
  }

  static getTotalPrice() {
    const cart = this.getCart();
    return cart.reduce((sum, d) => sum + d.price * d.quantity, 0);
  }
}

export default DesignCart;
