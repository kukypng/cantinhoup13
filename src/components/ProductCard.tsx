
import React, { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { useStore } from "@/context/StoreContext";
import { useStoreHours } from "@/hooks/useStoreHours";
import { Product } from "@/types";
import { ShoppingCart, XCircle, Package, Heart, Check, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const { settings } = useStore();
  const { isStoreOpen } = useStoreHours();
  const [isAdding, setIsAdding] = useState(false);
  
  const isOutOfStock = product.stock !== undefined && product.stock <= 0;
  const isStoreClosed = !settings.alwaysOpen && !isStoreOpen;
  const isDisabled = isOutOfStock || isAdding || isStoreClosed;

  const handleAddToCart = async () => {
    if (isDisabled) return;
    
    setIsAdding(true);
    addToCart(product);
    
    // Resetar o estado após 1.5 segundos
    setTimeout(() => {
      setIsAdding(false);
    }, 1500);
  };

  const getButtonContent = () => {
    if (isOutOfStock) {
      return (
        <>
          <XCircle className="mr-1 h-3 w-3" />
          Esgotado
        </>
      );
    }
    
    if (isStoreClosed) {
      return (
        <>
          <Clock className="mr-1 h-3 w-3" />
          Loja Fechada
        </>
      );
    }
    
    if (isAdding) {
      return (
        <div className="flex items-center justify-center">
          <div className="mr-1 h-2 w-2 bg-white rounded-full animate-ping"></div>
          <span className="font-semibold">Ok!</span>
        </div>
      );
    }
    
    return (
      <>
        <ShoppingCart className="mr-1 h-3 w-3 transition-transform duration-300 group-hover:scale-110" />
        Adicionar
      </>
    );
  };

  const getButtonClassName = () => {
    if (isOutOfStock || isStoreClosed) {
      return 'bg-gray-400 hover:bg-gray-400 cursor-not-allowed';
    }
    
    if (isAdding) {
      return 'bg-green-500 hover:bg-green-500 scale-105 shadow-xl border-2 border-green-300 opacity-90';
    }
    
    return 'bg-store-pink hover:bg-store-pink/90 shadow-sm hover:shadow-lg hover:scale-105 hover:-translate-y-0.5';
  };

  return (
    <Card className="overflow-hidden border bg-white shadow-md transition-all hover:shadow-lg h-full group flex flex-col">
      <div className="relative">
        <div className="aspect-square overflow-hidden">
          <img
            src={product.imageUrl || "https://placehold.co/400x400"}
            alt={product.name}
            className={`h-full w-full object-cover transition-transform duration-500 group-hover:scale-110 ${isOutOfStock || isStoreClosed ? 'opacity-70' : ''}`}
            loading="lazy"
          />
        </div>
        {product.featured && (
          <div className="absolute top-2 left-2 bg-store-pink text-white text-xs font-bold px-2 py-1 rounded-full shadow-sm animate-pulse">
            Top
          </div>
        )}
        
        {/* Stock badges */}
        <div className="absolute top-2 right-2 flex flex-col gap-1">
          {/* Stock count badge */}
          {product.stock !== undefined && product.stock > 0 && !isStoreClosed && (
            <div className="flex items-center gap-1 bg-white/80 backdrop-blur-sm text-xs font-semibold px-2 py-1 rounded-full shadow-sm">
              <Package className="h-3 w-3 text-green-600" />
              <span className="text-green-700">{product.stock}</span>
            </div>
          )}
        </div>

        {isOutOfStock && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold py-1.5 px-2 flex items-center justify-center gap-1 shadow-lg">
            <XCircle className="h-3 w-3" /> Esgotado
          </div>
        )}

        {isStoreClosed && !isOutOfStock && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold py-1.5 px-2 flex items-center justify-center gap-1 shadow-lg">
            <Clock className="h-3 w-3" /> Loja Fechada
          </div>
        )}
        
        {/* Quick action button that appears on hover */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Button 
            variant="outline" 
            size="icon" 
            className="rounded-full bg-white/90 hover:bg-white hover:text-store-pink shadow-lg h-8 w-8"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              handleAddToCart();
            }}
            disabled={isDisabled}
          >
            {isDisabled ? <XCircle className="h-4 w-4" /> : <Heart className="h-4 w-4" />}
          </Button>
        </div>
      </div>
      
      <CardContent className="p-3 text-left flex-1 flex flex-col">
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-gray-900 leading-tight mb-2 line-clamp-2">
            {product.name}
          </h3>
        </div>
        <p className="text-sm font-bold text-store-pink mt-auto">
          R$ {product.price.toFixed(2)}
        </p>
      </CardContent>
      
      <CardFooter className="p-3 pt-0">
        <Button
          onClick={handleAddToCart}
          disabled={isDisabled}
          className={`w-full rounded-full text-white text-xs py-1 h-7 transition-all duration-400 transform ${getButtonClassName()}`}
        >
          {getButtonContent()}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
