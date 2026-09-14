import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./components/routers/router";

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}