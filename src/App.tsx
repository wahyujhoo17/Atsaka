import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";
import ProtectedRoute from "./components/common/ProtectedRoute";
import HomePage from "./pages/HomePage";
import ProductsPage from "./pages/ProductsPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import AboutPage from "./pages/AboutPage";
import GalleryPage from "./pages/GalleryPage";
import ContactPage from "./pages/ContactPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminPage from "./pages/AdminPage";

function App() {
  return (
    <ThemeProvider>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 transition-colors">
          <Routes>
            {/* Admin routes without navbar/footer */}
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminPage />
                </ProtectedRoute>
              }
            />

            {/* Public routes with navbar/footer */}
            <Route
              path="/"
              element={
                <>
                  <Navbar />
                  <main className="flex-grow">
                    <HomePage />
                  </main>
                  <Footer />
                </>
              }
            />
            <Route
              path="/products"
              element={
                <>
                  <Navbar />
                  <main className="flex-grow">
                    <ProductsPage />
                  </main>
                  <Footer />
                </>
              }
            />
            <Route
              path="/products/:productSlug"
              element={
                <>
                  <Navbar />
                  <main className="flex-grow">
                    <ProductDetailPage />
                  </main>
                  <Footer />
                </>
              }
            />
            <Route
              path="/about"
              element={
                <>
                  <Navbar />
                  <main className="flex-grow">
                    <AboutPage />
                  </main>
                  <Footer />
                </>
              }
            />
            <Route
              path="/gallery"
              element={
                <>
                  <Navbar />
                  <main className="flex-grow">
                    <GalleryPage />
                  </main>
                  <Footer />
                </>
              }
            />
            <Route
              path="/contact"
              element={
                <>
                  <Navbar />
                  <main className="flex-grow">
                    <ContactPage />
                  </main>
                  <Footer />
                </>
              }
            />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
