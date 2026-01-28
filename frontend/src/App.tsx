import { Routes, Route } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { LoginPage } from '@/pages/LoginPage';
import { RegisterPage } from '@/pages/RegisterPage';
import { HomePage } from '@/pages/HomePage';
import { RecipesPage } from '@/pages/RecipesPage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { DemoPage } from '@/pages/DemoPage';

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Demo route - preview UI without authentication */}
      <Route path="/demo" element={<DemoPage />} />

      {/* Protected routes with layout */}
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/recipes" element={<RecipesPage />} />
          {/* TODO: Add more routes as they are implemented */}
          <Route path="/recipes/new" element={<PlaceholderPage title="Create Recipe" />} />
          <Route path="/recipes/:id" element={<PlaceholderPage title="Recipe Detail" />} />
          <Route path="/recipes/:id/edit" element={<PlaceholderPage title="Edit Recipe" />} />
          <Route path="/meal-plans" element={<PlaceholderPage title="Meal Plans" />} />
          <Route path="/meal-plans/new" element={<PlaceholderPage title="Create Meal Plan" />} />
          <Route path="/meal-plans/:id" element={<PlaceholderPage title="Meal Plan Detail" />} />
          <Route path="/shopping-list" element={<PlaceholderPage title="Shopping List" />} />
        </Route>
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

// Placeholder component for routes not yet implemented
function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="card text-center py-12">
      <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
      <p className="mt-2 text-gray-600">
        This page is coming soon. Check back later!
      </p>
    </div>
  );
}

export default App;
