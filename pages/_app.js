import "../styles/globals.css";
import "@fontsource/roboto";
import { ToastProvider } from "react-toast-notifications";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  fonts: {
    heading: "Roboto",
    body: "Roboto",
  },
});

import Toast from "components/Toast";

const App = ({ Component, pageProps }) => {
  return (
    <ChakraProvider theme={theme}>
      <ToastProvider components={{ Toast }} placement="top-center" autoDismiss>
        <Component {...pageProps} />
      </ToastProvider>
    </ChakraProvider>
  );
};

export default App;
