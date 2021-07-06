import "../styles/globals.css";
import { ToastProvider } from "react-toast-notifications";

import Toast from "components/Toast";

const App = ({ Component, pageProps }) => {
  return (
    <ToastProvider components={{ Toast }} placement="top-center" autoDismiss>
      <Component {...pageProps} />
    </ToastProvider>
  );
};

export default App;
