import React, { useRef, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import TimelineContext from "../TimelineContext"


function useOutsideClick(ref) {
  const context = useContext(TimelineContext);
  useEffect(() => {
    function handleOutsideClick(event) {
      if (ref.current && !ref.current.contains(event.target) && event.target.className !== "categories button") {
        context.outsideClickUpdate();
      }
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      // Unbind the event listener on clean up

      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [context, ref]);
}

//Component that alerts if you click outside of it

function OutsideClick(props) {
  const wrapperRef = useRef(null);
  useOutsideClick(wrapperRef);

  return <div ref={wrapperRef}>{props.children}</div>;
}

OutsideClick.propTypes = {
  children: PropTypes.element.isRequired,
};

export default OutsideClick;
