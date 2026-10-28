import { useState } from "react";
import { Lock, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import QueryError from "@/components/QueryError";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import AdminProductForm from "@/components/dashboard/AdminProductForm";
import { useDeleteProduct } from "@/features/products/useDeleteProduct";
import { useProducts } from "@/features/products/useProducts";
import { useUser } from "@/features/users/useUser";
import { formatPrice } from "@/lib/format";
import { imageAt } from "@/lib/utils";
import type { Product } from "@/types/ProductsTypes";

export default function AdminProductTable() {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  const { data: products = [], isPending, error } = useProducts();
  const { deleteProduct, isDeleting } = useDeleteProduct();
  const { isAdmin } = useUser();

  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);

  if (error) return <QueryError />;

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>{t("admin.products.tableTitle")}</CardTitle>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("admin.products.product")}</TableHead>
                <TableHead>{t("admin.products.category")}</TableHead>
                <TableHead>{t("admin.products.price")}</TableHead>
                <TableHead>{t("admin.products.status")}</TableHead>
                <TableHead className="w-[80px]">
                  <span className="sr-only">{t("admin.products.actions")}</span>
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isPending &&
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell colSpan={5}>
                      <Skeleton className="h-12 w-full" />
                    </TableCell>
                  </TableRow>
                ))}

              {products.map((product) => {
                const isLocked = product.is_seed && !isAdmin;
                const name = isArabic ? product.name_ar : product.name_en;

                return (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <img
                          src={imageAt(product.image_url, 120)}
                          alt={name}
                          className="h-12 w-12 object-cover"
                        />

                        <div>
                          <p className="font-medium">{name}</p>
                          <p className="text-sm text-muted-foreground">
                            ID: {product.id}
                          </p>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      {product.category && t(`categories.${product.category}`)}
                    </TableCell>

                    <TableCell>{formatPrice(product.price, i18n.language)}</TableCell>

                    <TableCell>
                      <Badge
                        variant={product.is_available ? "default" : "secondary"}
                      >
                        {product.is_available
                          ? t("admin.products.available")
                          : t("admin.products.unavailable")}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      {isLocked ? (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="flex size-10 items-center justify-center text-muted-foreground">
                              <Lock className="h-4 w-4" />
                              <span className="sr-only">
                                {t("admin.products.protected")}
                              </span>
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            {t("admin.products.protectedHint")}
                          </TooltipContent>
                        </Tooltip>
                      ) : (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">
                                {t("admin.products.actions")}
                              </span>
                            </Button>
                          </DropdownMenuTrigger>

                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => setEditingProduct(product)}
                            >
                              <Pencil className="h-4 w-4" />
                              {t("admin.products.edit")}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              variant="destructive"
                              disabled={isDeleting}
                              onClick={() => setDeletingProduct(product)}
                            >
                              <Trash2 className="h-4 w-4" />
                              {t("admin.products.delete")}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          {!isPending && products.length === 0 && (
            <p className="py-6 text-center text-sm text-muted-foreground">
              {t("admin.products.empty")}
            </p>
          )}
        </CardContent>
      </Card>

      <Dialog
        open={!!editingProduct}
        onOpenChange={(open) => !open && setEditingProduct(null)}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{t("admin.products.editTitle")}</DialogTitle>
            <DialogDescription>
              {t("admin.products.editDescription")}
            </DialogDescription>
          </DialogHeader>

          {editingProduct && (
            <AdminProductForm
              // Remount per product so the form never shows stale values.
              key={editingProduct.id}
              product={editingProduct}
              onSuccess={() => setEditingProduct(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={!!deletingProduct}
        onOpenChange={(open) => !open && setDeletingProduct(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t("admin.products.deleteTitle", {
                name: isArabic
                  ? deletingProduct?.name_ar
                  : deletingProduct?.name_en,
              })}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t("admin.products.deleteDescription")}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={() => deletingProduct && deleteProduct(deletingProduct.id)}
            >
              {t("admin.products.delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
