import { Routes } from "react-router-dom";
import { publicRoutes } from "./publicRoutes";
import { adminRoutes } from "./adminRoutes";

export function AppRouter() {
  return (
    <Routes>
      {publicRoutes()}
      {adminRoutes()}
    </Routes>
  );
}
