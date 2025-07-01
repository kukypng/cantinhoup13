
import React, { useState, useEffect } from "react";
import StoreLayout from "@/components/layout/StoreLayout";
import ProductCard from "@/components/ProductCard";
import { useProducts } from "@/context/ProductContext";
import { useStore } from "@/context/StoreContext";
import { useStoreHours } from "@/hooks/useStoreHours";
import { Button } from "@/components/ui/button";
import { useLocation } from "react-router-dom";
import SearchSection from "@/components/home/SearchSection";
import EasterEggAlert from "@/components/home/EasterEggAlert";
import AnnouncementsSection from "@/components/home/AnnouncementsSection";
import CategoryFilter from "@/components/home/CategoryFilter";
import StoreClosedAlert from "@/components/home/StoreClosedAlert";

const Index = () => {
  const { products } = useProducts();
  const { settings } = useStore();
  const { isStoreOpen } = useStoreHours();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchParam = queryParams.get('search');

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState(searchParam || "");
  const [showEasterEgg, setShowEasterEgg] = useState(false);

  useEffect(() => {
    if (searchParam) {
      setSearchTerm(searchParam);
    }
  }, [searchParam]);

  useEffect(() => {
    setShowEasterEgg(searchTerm.toLowerCase() === "cookie");
  }, [searchTerm]);

  const categories = Array.from(new Set(products.map(product => product.category).filter(Boolean)));

  const filteredProducts = products.filter(product => {
    const categoryMatch = selectedCategory ? product.category === selectedCategory : true;
    const searchMatch = searchTerm 
      ? product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.category && product.category.toLowerCase().includes(searchTerm.toLowerCase()))
      : true;
    return categoryMatch && searchMatch;
  });

  const showStoreClosedAlert = !settings.alwaysOpen && !isStoreOpen;

  return (
    <StoreLayout>
      <div className="container max-w-7xl mx-auto px-3 py-4 sm:py-6">
        <SearchSection searchTerm={searchTerm} onSearchChange={setSearchTerm} />
        <EasterEggAlert show={showEasterEgg} />
        
        {/* Mostrar alerta de loja fechada ou anúncios normais */}
        {showStoreClosedAlert ? (
          <StoreClosedAlert />
        ) : (
          <AnnouncementsSection />
        )}
        
        <CategoryFilter 
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />

        {/* Products grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* No products message */}
        {filteredProducts.length === 0 && (
          <div className="mt-8 sm:mt-12 text-center py-6 sm:py-8">
            <p className="text-lg text-gray-500">Nenhum produto encontrado.</p>
            <Button 
              variant="outline" 
              onClick={() => {
                setSelectedCategory(null);
                setSearchTerm("");
              }} 
              className="mt-4"
            >
              Limpar filtros
            </Button>
          </div>
        )}
      </div>
    </StoreLayout>
  );
};

export default Index;
