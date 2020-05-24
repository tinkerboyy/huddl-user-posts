import React from 'react';
import './NotFound.css';

const NotFound = () => {
  return (
    <div className="not-found">
      <div className="">
        <h1>404: The page you are looking for isn’t here</h1>
        <h2 variant="subtitle2">
          You either tried some shady route or you came here by mistake.
          Whichever it is, try using the navigation
        </h2>
        {/* <img
        alt="Under development"
        className={classes.image}
        src="/images/undraw_page_not_found_su7k.svg"
      /> */}
      </div>
    </div>
  );
};

export default NotFound;
