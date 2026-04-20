import { lazy } from "react";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import Layout from "./routes/Layout";

const Upcoming = lazy(() => import("./routes/Upcoming"));
const Past = lazy(() => import("./routes/Past"));
const Bookmarks = lazy(() => import("./routes/Bookmarks"));

const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        children: [
            { index: true, element: <Upcoming /> },
            { path: "past", element: <Past /> },
            { path: "bookmarks", element: <Bookmarks /> },
            { path: "*", element: <Navigate to="/" replace /> },
        ],
    },
]);

const App = () => <RouterProvider router={router} />;

export default App;
