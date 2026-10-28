import ProtectedRoute from "@/components/auth/ProtectedRoute";
import AdminLayout from "@/layout/AdminLayout";
import AuthLayout from "@/layout/AuthLayout";
import ClientLayout from "@/layout/ClientLayout";
import RootLayout from "@/layout/RootLayout";
import AdminDashboard from "@/pages/Admin/AdminDashboard";
import AdminOrders from "@/pages/Admin/AdminOrders";
import AdminProducts from "@/pages/Admin/AdminProducts";
import Cart from "@/pages/Cart";
import Checkout from "@/pages/Checkout";
import ErrorPage from "@/pages/ErrorPage";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Menu from "@/pages/Menu";
import NotFound from "@/pages/NotFound";
import OrderConfirmed from "@/pages/OrderConfirmed";
import Register from "@/pages/Register";
import TrackOrder from "@/pages/TrackOrder";
import { createBrowserRouter } from "react-router";

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <ClientLayout />,
        children: [
          { index: true, element: <Home /> },
          { path: "menu", element: <Menu />, handle: { title: "menu.title" } },
          {
            path: "checkout",
            handle: { title: "checkout.title" },
            element: (
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            ),
          },
          {
            path: "track-order",
            element: <TrackOrder />,
            handle: { title: "trackOrder.title" },
          },
          { path: "cart", element: <Cart />, handle: { title: "cart.title" } },
          {
            path: "order-confirmed/:orderId",
            element: <OrderConfirmed />,
            handle: { title: "orderConfirmed.title" },
          },
          { path: "*", element: <NotFound />, handle: { title: "notFound.title" } },
        ],
      },
      {
        path: "/admin",
        element: (
          <ProtectedRoute adminOnly>
            <AdminLayout />
          </ProtectedRoute>
        ),
        children: [
          {
            index: true,
            element: <AdminDashboard />,
            handle: { title: "admin.nav.dashboard" },
          },
          {
            path: "products",
            element: <AdminProducts />,
            handle: { title: "admin.nav.products" },
          },
          {
            path: "orders",
            element: <AdminOrders />,
            handle: { title: "admin.nav.orders" },
          },
        ],
      },
      {
        element: <AuthLayout />,
        children: [
          {
            path: "/login",
            element: <Login />,
            handle: { title: "auth.login" },
          },
          {
            path: "/register",
            element: <Register />,
            handle: { title: "auth.signUp" },
          },
        ],
      },
    ],
  },
]);
