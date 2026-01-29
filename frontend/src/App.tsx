import { Routes, Route } from 'react-router-dom';
import { AppShell } from '@/components/layout/AppShell';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { LoginPage } from '@/pages/LoginPage';
import { RegisterPage } from '@/pages/RegisterPage';
import { HomePage } from '@/pages/HomePage';
import { RecipesPage } from '@/pages/RecipesPage';
import { RecipeCreatePage } from '@/pages/RecipeCreatePage';
import { RecipeDetailPage } from '@/pages/RecipeDetailPage';
import { RecipeEditPage } from '@/pages/RecipeEditPage';
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
        <Route element={<AppShell />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/recipes" element={<RecipesPage />} />
          <Route path="/recipes/new" element={<RecipeCreatePage />} />
          <Route path="/recipes/:id" element={<RecipeDetailPage />} />
          <Route path="/recipes/:id/edit" element={<RecipeEditPage />} />
          <Route path="/meal-plans" element={<PlaceholderPage title="Meal Plans" description="Plan your weekly meals and generate shopping lists." />} />
          <Route path="/meal-plans/new" element={<PlaceholderPage title="Create Meal Plan" description="Start a new meal plan for the week." />} />
          <Route path="/meal-plans/:id" element={<PlaceholderPage title="Meal Plan Detail" description="View and manage your meal plan." />} />
          <Route path="/shopping-list" element={<PlaceholderPage title="Shopping List" description="Your generated shopping lists will appear here." />} />
        </Route>
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

// Placeholder component for routes not yet implemented
function PlaceholderPage({ title, description }: { title: string; description: string }) {
  return (
    <div className="card text-center py-12">
      <h1 className="font-serif text-2xl font-bold text-cookbook-900">{title}</h1>
      <p className="mt-2 text-cookbook-600">{description}</p>
      <p className="mt-4 text-sm text-cookbook-400">Coming soon!</p>
    </div>
  );
}

export default App;
