import React, { useRef } from "react";
import "./stage.scss";
import backgroundLandscape from "../backgroundLandscape.png"
import road from "../road.svg"

const Stage = (props) => {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);

  console.log("refs", containerRef, sceneRef);

  return (
    <div className="stage" ref={containerRef}>
      {/* <img src={backgroundLandscape} alt="san diego landscape" />
      <img src={road} alt="stage" /> */}
      <div className="viewport">
        <div className="scene3D-container">
          <div className="scene3D" ref={sceneRef}>
            Timeline events...
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stage;
