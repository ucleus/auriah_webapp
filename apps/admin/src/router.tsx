import { Navigate, Outlet, useRoutes } from "react-router-dom";

import { AuthProvider, useAuth } from "./context/AuthContext";
import { DashboardLayout } from "./layout/DashboardLayout";
import { DashboardPage } from "./pages/DashboardPage";
import { LoginPage } from "./pages/LoginPage";
import { TasksPage } from "./pages/TasksPage";
import { UsersPage } from "./pages/UsersPage";

function Protected() {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
}

function AuthenticatedRedirect() {
  const { user } = useAuth();
  if (user) {
    return <Navigate to="/" replace />;
  }
  return <LoginPage />;
}

export function AppRouter() {
  const element = useRoutes([
    {
      element: (
        <AuthProvider>
          <Outlet />
        </AuthProvider>
      ),
      children: [
        { path: "/login", element: <AuthenticatedRedirect /> },
        {
          element: <Protected />,
          children: [
            {
              element: <DashboardLayout />,
              children: [
                { index: true, element: <DashboardPage /> },
                { path: "tasks", element: <TasksPage /> },
                { path: "users", element: <UsersPage /> },
              ],
            },
          ],
        },
        { path: "*", element: <Navigate to="/" replace /> },
      ],
    },
  ]);

  return element;
}
