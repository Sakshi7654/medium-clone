import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { Signup } from './pages/Signup';
import { Signin } from './pages/Signin';
import { Blogs } from './pages/Blogs';
import { Blog } from './pages/Blog';
import { EditPost } from "./pages/EditPost";
import { Publish } from './pages/Publish';

// Helper component to guard private dashboard areas
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const token = localStorage.getItem("token");
    
    // If no token exists in memory, force them to authenticate first
    if (!token) {
        return <Navigate to="/signin" replace />;
    }
    
    return <>{children}</>;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Application Gateways */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />

        {/* Protected Dashboard Views */}
        <Route path="/blog" element={
          <ProtectedRoute>
            <Blogs />
          </ProtectedRoute>
        } />
        <Route path="/blog/:id" element={
          <ProtectedRoute>
            <Blog />
          </ProtectedRoute>
        } />
        <Route path="/publish" element={
          <ProtectedRoute>
            <Publish />
          </ProtectedRoute>
        } />
        <Route path="/edit/:id" element={
          <ProtectedRoute>
              <EditPost />
            </ProtectedRoute>
        } />

        {/* Fallback Catch-All Route */}
        <Route path="*" element={<Navigate to="/signin" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;