import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

import Login from './pages/Login';
import Register from './pages/Register';
import VerifyEmail from './pages/VerifyEmail';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import PizzaBuilder from './pages/PizzaBuilder';
import Checkout from './pages/Checkout';
import MyOrders from './pages/MyOrders';

import AdminDashboard from './pages/admin/AdminDashboard';
import AdminInventory from './pages/admin/AdminInventory';
import AdminOrders from './pages/admin/AdminOrders';

export default function App() {
    return (
        <div>
            <Navbar />
            <div className="page">
                <Routes>
                    {/* public / auth pages */}
                    <Route path="/" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/verify/:token" element={<VerifyEmail />} />
                    <Route path="/forgot" element={<ForgotPassword />} />
                    <Route path="/reset/:token" element={<ResetPassword />} />

                    {/* user pages */}
                    <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                    <Route path="/build" element={<ProtectedRoute><PizzaBuilder /></ProtectedRoute>} />
                    <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
                    <Route path="/orders" element={<ProtectedRoute><MyOrders /></ProtectedRoute>} />

                    {/* admin pages */}
                    <Route path="/admin" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
                    <Route path="/admin/inventory" element={<ProtectedRoute adminOnly><AdminInventory /></ProtectedRoute>} />
                    <Route path="/admin/orders" element={<ProtectedRoute adminOnly><AdminOrders /></ProtectedRoute>} />
                </Routes>
            </div>
        </div>
    );
}
