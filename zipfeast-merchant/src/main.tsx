import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { Toaster } from "sonner";
import AppRoutes from "./AppRoutes.tsx";
import { BrowserRouter as Router } from "react-router-dom";
import { ThemeProvider } from "./components/themes/ThemeProvider.tsx";
import { TooltipProvider } from "./components/ui/tooltip.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="zipfeast-theme">
      <TooltipProvider>
        <Toaster richColors={true} position={"top-right"} closeButton={true} />
        <Router>
          <AppRoutes />
        </Router>
      </TooltipProvider>
    </ThemeProvider>
  </React.StrictMode>
);
