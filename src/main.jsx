import * as React from "react";
import * as ReactDOM from "react-dom/client";
import App from "./App";
import { ChakraProvider } from "@chakra-ui/react";
import reportWebVitals from "./reportWebVitals";

const rootElement = document.getElementById("root");
ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
        <ChakraProvider>
            <App />
        </ChakraProvider>
    </React.StrictMode>
);

reportWebVitals(console.log);
