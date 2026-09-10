import { RouterProvider } from "@tanstack/react-router";
import "./App.css";
import { Providers } from "./Providers";
import { getRouter } from "@/routes";

const router = getRouter();

function App() {
  return (
    <Providers>
      <RouterProvider router={router} />
    </Providers>
  );
}

export default App;
