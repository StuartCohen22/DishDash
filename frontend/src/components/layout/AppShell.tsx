import { Outlet } from 'react-router-dom';
import { Header } from './Header';

export function AppShell() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-cookbook-50 to-cookbook-100">
      <Header />
      <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-10 py-10">
        <Outlet />
      </main>
      <footer className="border-t border-cookbook-200/60 mt-16">
        <div className="mx-auto max-w-6xl px-4 py-8 text-center text-cookbook-500 text-sm">
          Dish Dash - Your Personal Recipe Cookbook
        </div>
      </footer>
    </div>
  );
}
