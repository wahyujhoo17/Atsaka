import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";
import ProtectedRoute from "./components/common/ProtectedRoute";
import HomePage from "./pages/HomePage";
import ProductsPage from "./pages/ProductsPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import GalleryPage from "./pages/GalleryPage";
import ContactPage from "./pages/ContactPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminPage from "./pages/AdminPage";
import NotFoundPage from "./pages/NotFoundPage";
import ArticlesPage from "./pages/ArticlesPage";
import ArticleDetailPage from "./pages/ArticleDetailPage";

function App() {
  return (
    <ThemeProvider>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 transition-colors">
          <Routes>
            {/* Admin routes without navbar/footer */}
            <Route path="/sn-admin/login" element={<AdminLoginPage />} />
            <Route
              path="/sn-admin"
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
            <Route
              path="/articles"
              element={
                <>
                  <Navbar />
                  <main className="flex-grow">
                    <ArticlesPage />
                  </main>
                  <Footer />
                </>
              }
            />
            <Route
              path="/articles/:slug"
              element={
                <>
                  <Navbar />
                  <main className="flex-grow">
                    <ArticleDetailPage />
                  </main>
                  <Footer />
                </>
              }
            />

            {/* 404 - Catch all unknown routes */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
