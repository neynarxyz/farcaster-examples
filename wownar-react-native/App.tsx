import React from "react";
import Layout from "./src/components/Layout";
import Home from "./src/components/Screens/Home";
import Signin from "./src/components/Screens/Signin";
import { AppProvider } from "./src/Context/AppContext";

const App: React.FC = () => {
  return (
    <AppProvider>
      <Layout>
        <Signin />
      </Layout>
    </AppProvider>
  );
};

export default App;
