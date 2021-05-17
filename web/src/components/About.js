import React from "react";
// import {VscChevronDown} from "react-icons/vsc";
// import {FaChevronDown} from "react-icons/fa";
import {MdFileDownload} from "react-icons/md";
import TimelineContext from "../TimelineContext";
import { ReactComponent as ArrowUp } from '../assets/Icon-arrow-up.svg';
import { ReactComponent as ArrowDown } from '../assets/Icon-arrow-down.svg';

import "./about.css";

const About = () => {

  return (
    <TimelineContext.Consumer>
      {({ summaryDescription, aboutDescription, showAbout, toggleShowAbout }) => (
        <div className="about-container">
          <h1>The San Diego Region - A Special Place, Built by People Focused on the Future</h1>
          <p className="tl-summ">{summaryDescription}</p>
          <div className="bottom-container">
            <div className="abt-desc">
              <button className="about" onClick={toggleShowAbout}>About {showAbout ? <span><ArrowUp /></span> : <span className="arrow-down"><ArrowDown /></span>}</button>
              <p className={showAbout ? "tl-desc open" : "tl-desc"}>{aboutDescription}</p>
            </div>
            <div className="download">
              <a download="all-data-by-date-and-category.csv" href="../all-data-by-date-and-category.csv" target="_blank"><MdFileDownload size={17}/> Download All Data</a>
              <a href="#">Vea La Versión en Español</a>
            </div>
          </div>

        </div>
      )}
    </TimelineContext.Consumer>
  );
};

export default About;
