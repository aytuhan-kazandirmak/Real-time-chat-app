import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ThemeContextProvider } from "./context/theme/ThemeProvider";
import "./index.css";

// Render the app
const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <ThemeContextProvider>
        <App />
      </ThemeContextProvider>
    </StrictMode>
  );
}
