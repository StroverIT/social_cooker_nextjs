import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "@/context/AppContext";
import HomePage from "./pages/HomePage";
import SearchPage from "./pages/SearchPage";
import ShoppingPage from "./pages/ShoppingPage";
import ProfilePage from "./pages/ProfilePage";
import RecipeDetailPage from "./pages/RecipeDetailPage";
import RecipeSubmissionPage from "./pages/RecipeSubmissionPage";
import AdminPage from "./pages/AdminPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AppProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/shopping" element={<ShoppingPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/recipe/:id" element={<RecipeDetailPage />} />
            <Route path="/submit-recipe" element={<RecipeSubmissionPage />} />
            <Route path="/admin" element={<AdminPage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AppProvider>
  </QueryClientProvider>
);

export default App;
