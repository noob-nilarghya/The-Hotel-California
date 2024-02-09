import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "./ui/ErrorFallback";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ErrorBoundary 
      FallbackComponent={ErrorFallback}
      onReset={()=> window.location.replace('/')} // this prop will be passed to resetErrorBoundary of ErrorFallback components 
    >
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
