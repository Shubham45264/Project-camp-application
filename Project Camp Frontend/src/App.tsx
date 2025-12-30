import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Project Pages
import CreateProject from "./pages/projects/CreateProject";
import UpdateProject from "./pages/projects/UpdateProject";

// Core Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ProjectDetail from "./pages/ProjectDetail";
import NotFound from "./pages/NotFound";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

// Landing
import { Features } from "./components/landing/Features";
import { Preview } from "./components/landing/Preview";
import Paths from "./components/landing/paths";
import Quote from "./components/landing/Quote";
import Pricing from "./components/landing/pricing";
import { Navbar } from "./components/layout/Navbar";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />

      <BrowserRouter>
        <Routes>
          {/* Landing */}
          <Route path="/" element={<><Navbar /><Index /></>} />
          <Route path="/login" element={<><Navbar /><Login /></>} />
          <Route path="/register" element={<><Navbar /><Register /></>} />
          <Route path="/features" element={<><Navbar /><Features /></>} />
          <Route path="/preview" element={<><Navbar /><Preview /></>} />
          <Route path="/paths" element={<><Navbar /><Paths /></>} />
          <Route path="/quote" element={<><Navbar /><Quote /></>} />
          <Route path="/pricing" element={<><Navbar /><Pricing /></>} />

          {/* Auth */}
          <Route path="/forgot-password" element={<><Navbar /><ForgotPassword /></>} />
          <Route path="/reset-password/:token" element={<><Navbar /><ResetPassword /></>} />

          {/* App */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/project/:projectId" element={<ProjectDetail />} />

          {/* Project CRUD */}
          <Route path="/projects/new" element={<CreateProject />} />
          <Route path="/projects/:projectId/edit" element={<UpdateProject />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
