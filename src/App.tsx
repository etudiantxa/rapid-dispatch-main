import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Auth Pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";

// Vendor Pages
import Tracking from "./pages/vendor/Tracking";
import CreateDelivery from "./pages/vendor/CreateDelivery";

// Courier Pages
import CourierHome from "./pages/courier/Home";
import BatchDetails from "./pages/courier/BatchDetails";
import DeliveryInProgress from "./pages/courier/DeliveryInProgress";
import OTPValidation from "./pages/courier/OTPValidation";

import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          
          <Route path="/vendor/dashboard" element={<Tracking />} />
          <Route path="/vendor/tracking" element={<Tracking />} />
          <Route path="/vendor/create-delivery" element={<CreateDelivery />} />
          
          <Route path="/courier/home" element={<CourierHome />} />
          <Route path="/courier/batch/:batchId" element={<BatchDetails />} />
          <Route path="/courier/delivery-in-progress" element={<DeliveryInProgress />} />
          <Route path="/courier/otp-validation" element={<OTPValidation />} />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
