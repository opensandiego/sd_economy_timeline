import React from "react";
import {VscChevronDown} from "react-icons/vsc";
import {FaChevronDown} from "react-icons/fa";
import TimelineContext from "../TimelineContext";
import "./about.css";

const About = () => {
  // const [show, setShow] = useState("close");

  return (
    <TimelineContext.Consumer>
      {({ summaryDescription, aboutDescription }) => (
        <div>
          <h1>San Diego Regional Timeline</h1>
          <p className="tl-summ">{summaryDescription}</p>
          <div className="bottom-container">
            <div>
              <button className="about">About <span><FaChevronDown size={20}/></span></button>
              <p className="tl-desc">{aboutDescription}</p>
            </div>
            <div className="download">
              <button>Download All Data</button>
              <a href="#">Vea La Versión en Español</a>
            </div>
          </div>

          {/* <button onClick={getAboutDescription}>About</button> */}
        </div>
      )}
    </TimelineContext.Consumer>
  );
};

export default About;
