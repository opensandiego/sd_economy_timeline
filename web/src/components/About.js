import React from "react";
// import {VscChevronDown} from "react-icons/vsc";
// import {FaChevronDown} from "react-icons/fa";
import {MdFileDownload} from "react-icons/md";
import TimelineContext from "../TimelineContext";

import "./about.css";

const About = () => {

  return (
    <TimelineContext.Consumer>
      {({ summaryDescription, aboutDescription, showAbout, toggleShowAbout }) => (
        <div className="about-container">
          <h1>The San Diego Region <span>A Special Place, Built by People Focused on the Future</span></h1>
          <p className="tl-summ">{summaryDescription}</p>
          <div className="bottom-container">
            <div className="abt-desc">
            <button className="about" onClick={toggleShowAbout}>About</button>
              <p className={showAbout ? "tl-desc open" : "tl-desc"}>{aboutDescription}</p>
            </div>
            <a download="TimelineStories.pdf" href="/TimelineStories.pdf" target="_blank">Stories</a>
            <a download="TimelineFunFacts.pdf" href="/TimelineFunFacts.pdf" target="_blank">Fun Facts</a>
              <a download="all-data-by-date-and-category.csv" href="../all-data-by-date-and-category.csv" target="_blank">Download All Data</a>
              <a href="#">Vea La Versión en Español</a>
          </div>

        </div>
      )}
    </TimelineContext.Consumer>
  );
};

export default About;
