import { Link } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { Minus, Plus, X, ShoppingBag } from "lucide-react";
import { toast } from "sonner";

export default function Cart() {
  const { items, removeItem, updateQuantity, total, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="py-32 text-center">
        <ShoppingBag className="mx-auto mb-4 text-muted-foreground" size={48} />
        <h1 className="font-serif text-3xl mb-4">Your Cart is Empty</h1>
        <p className="text-muted-foreground mb-8">Explore our gallery and shop to find something special.</p>
        <div className="flex gap-4 justify-center">
          <Link to="/gallery" className="bg-charcoal text-cream px-6 py-3 text-sm tracking-wider uppercase">
            Gallery
          </Link>
          <Link to="/shop" className="border border-foreground px-6 py-3 text-sm tracking-wider uppercase">
            Shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-24 bg-background">
      <div className="container mx-auto px-6 max-w-3xl">
        <h1 className="font-serif text-4xl mb-12 text-center">Shopping Cart</h1>

        <div className="space-y-6">
          {items.map((item) => (
            <div key={item.id + (item.variant || "")} className="flex gap-4 border-b border-border pb-6">
              <img src={item.image} alt={item.title} className="w-24 h-24 object-cover flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <h3 className="font-serif text-sm truncate">{item.title}</h3>
                <p className="text-gold text-sm mt-1">€{item.price}</p>
                <div className="flex items-center gap-3 mt-3">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1, item.variant)}
                    className="w-8 h-8 border border-border flex items-center justify-center hover:bg-secondary transition-colors"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="text-sm w-8 text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1, item.variant)}
                    className="w-8 h-8 border border-border flex items-center justify-center hover:bg-secondary transition-colors"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>
              <div className="flex flex-col items-end justify-between">
                <button
                  onClick={() => removeItem(item.id, item.variant)}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X size={16} />
                </button>
                <span className="font-serif text-sm">€{(item.price * item.quantity).toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 pt-8 border-t border-border">
          <div className="flex justify-between items-center mb-8">
            <span className="text-lg">Total</span>
            <span className="font-serif text-2xl">€{total.toLocaleString()}</span>
          </div>
          <button
            onClick={() => toast.info("Checkout with Lemon Squeezy would redirect here. Connect backend to enable.")}
            className="w-full bg-charcoal text-cream py-4 text-sm tracking-wider uppercase hover:bg-charcoal-light transition-colors"
          >
            Proceed to Checkout
          </button>
          <button
            onClick={clearCart}
            className="w-full mt-3 text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
          >
            Clear Cart
          </button>
        </div>
      </div>
    </div>
  );
}
