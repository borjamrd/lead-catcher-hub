import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import "./App.css";
import Authentication from "./pages/Authentication";
import Dashboard from "./pages/Dashboard";
import Tests from "./pages/Tests";
import TestDetail from "./pages/TestDetail";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Authentication />,
    errorElement: <Navigate to="/" />,
  },
  {
    path: "/dashboard/*",
    element: <Dashboard />,
    errorElement: <Navigate to="/" />,
    children: [
      {
        path: "tests",
        element: <Tests />,
      },
      {
        path: "tests/:id",
        element: <TestDetail />,
      },
    ],
  },
]);

function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;
