import React from "react";
import Layout from "./src/components/Layout";
import Home from "./src/components/Screens/Home";
import Signin from "./src/components/Screens/Signin";

const App: React.FC = () => {
  return (
    <Layout>
      <Signin />
    </Layout>
  );
};

export default App;
