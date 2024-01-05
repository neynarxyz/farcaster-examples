import React from "react";
import Layout from "./src/components/Layout";
import Home from "./src/components/Screens/Home";

const App: React.FC = () => {
  return (
    <Layout>
      <Home />
    </Layout>
  );
};

export default App;
