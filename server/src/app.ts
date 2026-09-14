import express from "express";
import cors from "cors";
import userRoutes from "./routes/user.routes";
import categoryRoutes from "./routes/router-category";
import productRoutes from "./routes/product.routes";
import customerRoutes from "./routes/customer.routes";
import saleRoutes from "./routes/sale.routes";
import dashboardRoutes from "./routes/dashbourd-routes";
import stockRoutes from "./routes/stock.routes";
import settingsRoutes from "./routes/settings.routes";
import supplierRoutes from "./routes/router.supplier";
import purchaseRoutes from "./routes/purchase.routes";

const app = express();


app.use(
  cors({
    origin: "http://localhost:5173", // Port-ka React (Vite)
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true, // Si uu u ogolaado headers & cookies
  })
);
// Middleware
app.use(express.json());
 app.use("/api/users", userRoutes);
 app.use("/api/categories", categoryRoutes );
 app.use("/api/products", productRoutes);
 app.use("/api/customers", customerRoutes);
 app.use("/api/sales",saleRoutes);
 app.use("/api/dashboard",dashboardRoutes);
 app.use("/api/stock",stockRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/suppliers",supplierRoutes);
app.use("/api/purchases", purchaseRoutes);
 
app.get("/api/test", (req, res) => {
  res.json({
    message: "API Working",
  });
});

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "POS System API is Running 🚀",
  });
});



export default app;