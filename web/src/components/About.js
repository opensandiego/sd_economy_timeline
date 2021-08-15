import React from "react";
import TimelineContext from "../TimelineContext";
import {BsBoxArrowUpRight} from "react-icons/bs";
import {FaDownload} from "react-icons/fa";
import facts from "../TimelineFunFacts.pdf";
import stories from "../TimelineStories.pdf";

import "./about.css";

const About = () => {
  return (
    <TimelineContext.Consumer>
      {({
        summaryDescription,
        aboutDescription,
        showAbout,
        showStories,
        showFunFact,
        showDownload,
        showEspanol,
        toggleShowAbout,
        toggleShowStories,
        toggleFunFacts,
        toggleShowDownload,
        toggleShowEspanol,
      }) => (
        <div className="about-container">
          <h1>
            The San Diego Region{" "}
            <span>A Special Place, Built by People Focused on the Future</span>
          </h1>
          <p className="tl-summ">{summaryDescription}</p>
          <div className="bottom-container">
            <div className="abt-desc">
              <button className="about" onClick={toggleShowAbout}>
                About
              </button>
              <p 
              //className={showAbout ? "tl-desc open" : "tl-desc"}
              >
                {aboutDescription}
              </p>
            </div>
            <div className="stories-container">
              <button className="about" onClick={toggleShowStories}>
                Stories
              </button>
              <p 
              //className={showStories ? "tl-desc open" : "tl-desc"}
              >
                Learn about 6 major stories that helped shape the history of San
                Diego.
                <a href={stories} target="_blank">
                  Timeline Stories
                </a>
                <span>This document opens in a new tab<BsBoxArrowUpRight /></span>
              </p>
            </div>
            <div className="facts-container">
              <button className="" onClick={toggleFunFacts}>
                Fun Facts
              </button>
              <p 
              //className={showFunFact ? "tl-desc open" : "tl-desc"}
              >
                Learn fun facts about different cities in the San Diego region.
                <span>
                  <a href={facts} target="_blank">
                    San Diego Fun Facts
                  </a>
                </span>
                <span>This document opens in a new tab<BsBoxArrowUpRight /></span>
              </p>
            </div>
            <div className="download-container">
              <button className="" onClick={toggleShowDownload}>
                Download All Data
              </button>
              <p 
              //className={showDownload ? "tl-desc open" : "tl-desc"}
              >
                Download all timeline data to an excel file
                <a
                  download="all-data-by-date-and-category.csv"
                  href="../all-data-by-date-and-category.csv"
                  target="_blank"
                >
                  Download All Data<FaDownload />
                </a>
              </p>
            </div>
            <div className="espanol-container">
              <button className="" onClick={toggleShowEspanol}>
                Vea La Versión en Español
              </button>
              <p 
              // className={showEspanol ? "tl-desc open" : "tl-desc"}
              >
                Vea la información de esta línea de tiempo en español.
                <a href="#">Vea La Versión en Español</a>
                <span>Este documento se abre en una nueva pestaña<BsBoxArrowUpRight /></span>
              </p>
            </div>

            {/* <a href={stories} target="_blank">Stories</a>
            <a href={facts} target="_blank">Fun Facts</a>
              <a download="all-data-by-date-and-category.csv" href="../all-data-by-date-and-category.csv" target="_blank">Download All Data</a>
              <a href="#">Vea La Versión en Español</a> */}
          </div>
        </div>
      )}
    </TimelineContext.Consumer>
  );
};

export default About;
