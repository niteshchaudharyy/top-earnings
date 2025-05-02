import React from "react";
import "./style.scss";

const Loader: React.FC = () => {
  return (
    <div data-testid="loader" className="loader-container">
      <div className="loader"></div>
    </div>
  );
};

export default Loader;
