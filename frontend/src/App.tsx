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
import { MealPlannerPage } from '@/pages/MealPlannerPage';
import { ShoppingListPage } from '@/pages/ShoppingListPage';
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
          <Route path="/planner" element={<MealPlannerPage />} />
          <Route path="/shopping" element={<ShoppingListPage />} />
        </Route>
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
