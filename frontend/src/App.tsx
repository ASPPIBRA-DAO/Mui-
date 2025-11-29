import { Routes, Route } from "react-router-dom";
import LayoutPublic from "./components/LayoutPublic";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import Todos from "./pages/Todos";

function App() {
  return (
    <Routes>
      
      {/* Rotas públicas */}
      <Route
        path="/"
        element={
          <LayoutPublic>
            <Home />
          </LayoutPublic>
        }
      />

      <Route
        path="/login"
        element={
          <LayoutPublic>
            <Login />
          </LayoutPublic>
        }
      />

      <Route
        path="/register"
        element={
          <LayoutPublic>
            <Register />
          </LayoutPublic>
        }
      />

      {/* Rotas privadas */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/todos"
        element={
          <ProtectedRoute>
            <Todos />
          </ProtectedRoute>
        }
      />

    </Routes>
  );
}

export default App;