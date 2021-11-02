import React from "react";
import TimelineContext from "../TimelineContext";
import { BsBoxArrowUpRight } from "react-icons/bs";
import { FaDownload } from "react-icons/fa";
import facts from "../TIMELINE-FUN-FACTS-SDForward-AUGUST-13PM-2021.pdf";
import stories from "../TimelineStories.pdf";

import "./about.css";

const About = () => {
  return (
    <TimelineContext.Consumer>
      {({ summaryDescription, aboutDescription, openMenuItem, updateOpenMenuItem }) => (
        <div className="about-container">
          <h1>
            The San Diego Region{" "}
            <span>A Special Place, Built by People Focused on the Future</span>
          </h1>
          <p className="tl-summ">{summaryDescription}</p>
          <div className="bottom-container">
            <div className="abt-desc">
              <button className={openMenuItem === "about" ? "open" : ""} onClick={(e) => updateOpenMenuItem("about")}>About</button>
              <p>{aboutDescription}</p>
            </div>
            <div className="stories-container">
              <button className={openMenuItem === "stories" ? "open" : ""} onClick={(e) => updateOpenMenuItem("stories")}>Stories</button>
              <p>
                Learn about 6 major stories that helped shape the history of the San
                Diego region.
                <a href={stories} target="_blank" rel="noopener noreferrer">
                  Timeline Stories
                </a>
                <span>
                  This document opens in a new tab
                  <BsBoxArrowUpRight />
                </span>
              </p>
            </div>
            <div className="facts-container">
              <button className={openMenuItem === "facts" ? "open" : ""} onClick={(e) => updateOpenMenuItem("facts")}>Fun Facts</button>
              <p>
                Discover fun facts about different cities in the San Diego region.
                <span>
                  <a href={facts} target="_blank" rel="noopener noreferrer">
                    San Diego Fun Facts
                  </a>
                </span>
                <span>
                  This document opens in a new tab
                  <BsBoxArrowUpRight />
                </span>
              </p>
            </div>
            <div className="download-container">
              <button className={openMenuItem === "download" ? "open" : ""} onClick={(e) => updateOpenMenuItem("download")}>Download All Data</button>
              <p>
                Download all timeline data to an excel file
                <a
                  download="all-data-by-date-and-category.csv"
                  href={`${process.env.PUBLIC_URL}/all-data-by-date-and-category.csv`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Download All Data
                  <FaDownload />
                </a>
              </p>
            </div>
            <div className="espanol-container">
              <button className={openMenuItem === "espanol" ? "open" : ""} onClick={(e) => updateOpenMenuItem("espanol")}>Vea La Versión en Español</button>
              <p>
                Vea la información de esta línea de tiempo en español.
                <a href={`${process.env.PUBLIC_URL}/Fun Facts Spanish.pdf`} target="_blank" rel="noopener noreferrer">
                  Vea La Versión en Español
                </a>
                <span>
                  Este documento se abre en una nueva pestaña
                  <BsBoxArrowUpRight />
                </span>

              </p>
            </div>
          </div>
        </div>
      )}
    </TimelineContext.Consumer>
  );
};

export default About;
