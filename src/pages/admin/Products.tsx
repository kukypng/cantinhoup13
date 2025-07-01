import React, { useState, useRef } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useProducts } from "@/context/ProductContext";
import { Product } from "@/types";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import ProductForm from "@/components/products/ProductForm";
import ProductTable from "@/components/products/ProductTable";
import DeleteProductDialog from "@/components/products/DeleteProductDialog";
import ConfirmationDialog from "@/components/ui/confirmation-dialog";
import { useConfirmation } from "@/hooks/useConfirmation";

const emptyProduct: Omit<Product, "id"> = {
  name: "",
  description: "",
  price: 0,
  imageUrl: "",
  featured: false,
  category: "",
  stock: 0,
  maxPurchaseQuantity: 5
};

const ProductsPage = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const confirmation = useConfirmation();
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | Omit<Product, "id">>(
    emptyProduct
  );
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [inputError, setInputError] = useState<{field: string, message: string} | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (inputError?.field === name) {
      setInputError(null);
    }
    
    if (type === "number") {
      if (value === "") {
        setCurrentProduct((prev) => ({
          ...prev,
          [name]: "",
        }));
      } else {
        const numberValue = parseFloat(value);
        if (!isNaN(numberValue)) {
          setCurrentProduct((prev) => ({
            ...prev,
            [name]: numberValue,
          }));
        }
      }
    } else {
      setCurrentProduct((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleCheckboxChange = (checked: boolean) => {
    setCurrentProduct((prev) => ({
      ...prev,
      featured: checked,
    }));
  };

  const validateProduct = () => {
    if (!currentProduct.name?.trim()) {
      setInputError({field: "name", message: "Nome do produto é obrigatório"});
      return false;
    }
    
    const priceValue = typeof currentProduct.price === 'string' 
      ? parseFloat(currentProduct.price) 
      : currentProduct.price;
      
    if (
      priceValue === 0 || 
      isNaN(priceValue) || 
      (typeof currentProduct.price === 'string' && currentProduct.price === '')
    ) {
      setInputError({field: "price", message: "Preço deve ser maior que zero"});
      return false;
    }
    
    if (!currentProduct.description?.trim()) {
      setInputError({field: "description", message: "Descrição do produto é obrigatória"});
      return false;
    }
    
    return true;
  };

  const handleAddProduct = async () => {
    if (!validateProduct()) {
      return;
    }

    const confirmed = await confirmation.confirm({
      title: "Adicionar Produto",
      description: `Tem certeza que deseja adicionar o produto "${currentProduct.name}"? Ele ficará disponível na loja.`,
      confirmText: "Adicionar",
      cancelText: "Cancelar",
      variant: "success"
    });

    if (!confirmed) return;

    const price = typeof currentProduct.price === 'string' 
      ? parseFloat(currentProduct.price) || 0 
      : currentProduct.price;

    addProduct({
      ...currentProduct,
      price,
      stock: currentProduct.stock || 0,
      maxPurchaseQuantity: currentProduct.maxPurchaseQuantity || 5
    } as Omit<Product, "id">);
    
    setCurrentProduct(emptyProduct);
    setIsAdding(false);
    toast.success("Produto adicionado com sucesso!");
  };

  const handleEditProduct = async () => {
    if (!validateProduct()) {
      return;
    }

    const confirmed = await confirmation.confirm({
      title: "Salvar Alterações",
      description: `Tem certeza que deseja salvar as alterações no produto "${currentProduct.name}"?`,
      confirmText: "Salvar",
      cancelText: "Cancelar",
      variant: "warning"
    });

    if (!confirmed) return;

    const price = typeof currentProduct.price === 'string' 
      ? parseFloat(currentProduct.price) || 0 
      : currentProduct.price;

    updateProduct({
      ...currentProduct,
      price,
      stock: currentProduct.stock || 0,
      maxPurchaseQuantity: currentProduct.maxPurchaseQuantity || 5
    } as Product);
    
    setCurrentProduct(emptyProduct);
    setIsEditing(false);
    toast.success("Produto atualizado com sucesso!");
  };

  const openEditDialog = (product: Product) => {
    setCurrentProduct(product);
    setIsEditing(true);
  };

  const openDeleteDialog = (productId: string) => {
    setProductToDelete(productId);
    setShowDeleteDialog(true);
  };

  const handleDeleteProduct = () => {
    if (productToDelete) {
      deleteProduct(productToDelete);
      setShowDeleteDialog(false);
      setProductToDelete(null);
    }
  };

  const closeAndResetForm = () => {
    setCurrentProduct(emptyProduct);
    setInputError(null);
    setIsAdding(false);
    setIsEditing(false);
  };

  return (
    <AdminLayout title="Gerenciar Produtos">
      <div className="space-y-4 md:space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-xl md:text-2xl font-bold">Produtos</h1>
          <Dialog open={isAdding} onOpenChange={setIsAdding}>
            <DialogTrigger asChild>
              <Button className="w-full sm:w-auto">
                <Plus className="mr-2 h-4 w-4" />
                Adicionar Produto
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Adicionar Produto</DialogTitle>
                <DialogDescription>
                  Preencha os dados do novo produto. Os campos marcados com * são obrigatórios.
                </DialogDescription>
              </DialogHeader>
              
              <ProductForm 
                initialProduct={currentProduct}
                onInputChange={handleInputChange}
                onCheckboxChange={handleCheckboxChange}
                inputError={inputError}
                isUploading={isUploading}
              />
              
              <DialogFooter className="flex-col sm:flex-row gap-2">
                <DialogClose asChild>
                  <Button variant="outline" onClick={closeAndResetForm} className="w-full sm:w-auto">
                    Cancelar
                  </Button>
                </DialogClose>
                <Button type="submit" onClick={handleAddProduct} disabled={isUploading} className="w-full sm:w-auto">
                  Adicionar Produto
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Dialog open={isEditing} onOpenChange={setIsEditing}>
          <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Editar Produto</DialogTitle>
              <DialogDescription>
                Atualize os dados do produto. Os campos marcados com * são obrigatórios.
              </DialogDescription>
            </DialogHeader>
            
            <ProductForm 
              initialProduct={currentProduct}
              onInputChange={handleInputChange}
              onCheckboxChange={handleCheckboxChange}
              inputError={inputError}
              isUploading={isUploading}
              isEditing={true}
            />
            
            <DialogFooter className="flex-col sm:flex-row gap-2">
              <DialogClose asChild>
                <Button variant="outline" onClick={closeAndResetForm} className="w-full sm:w-auto">
                  Cancelar
                </Button>
              </DialogClose>
              <Button type="submit" onClick={handleEditProduct} disabled={isUploading} className="w-full sm:w-auto">
                Salvar Alterações
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <DeleteProductDialog 
          open={showDeleteDialog} 
          onOpenChange={setShowDeleteDialog}
          onConfirmDelete={handleDeleteProduct}
        />

        <ProductTable 
          products={products} 
          onEdit={openEditDialog} 
          onDelete={openDeleteDialog} 
        />

        <ConfirmationDialog
          open={confirmation.isOpen}
          onOpenChange={confirmation.setIsOpen}
          title={confirmation.options.title}
          description={confirmation.options.description}
          confirmText={confirmation.options.confirmText}
          cancelText={confirmation.options.cancelText}
          variant={confirmation.options.variant}
          onConfirm={confirmation.handleConfirm}
        />
      </div>
    </AdminLayout>
  );
};

export default ProductsPage;
