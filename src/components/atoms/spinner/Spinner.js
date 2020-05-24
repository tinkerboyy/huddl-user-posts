import React from 'react';

import './Spinner.css';

const Spinner = (props) => {
  return (
    <div className={`${props.asOverlay && 'loading-spinner__overlay'}`}>
      <div className="lds-dual-ring"></div>
      {props.children && (
        <div className="loading-spinner__text">{props.children}</div>
      )}
    </div>
  );
};

export default Spinner;
