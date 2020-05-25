import React, { useState, useEffect, useRef } from 'react';

import './Combobox.css';

const Combobox = ({ items, onSelect }) => {
  const [display, setDisplay] = useState(false);
  const [options, setOptions] = useState([]);
  const [search, setSearch] = useState('');
  const wrapperRef = useRef(null);

  useEffect(() => {
    setOptions(items);
  }, [items]);

  useEffect(() => {
    window.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('mousedown', handleClickOutside);
    };
  });

  const handleClickOutside = (event) => {
    const { current: wrap } = wrapperRef;
    if (wrap && !wrap.contains(event.target)) {
      setDisplay(false);
    }
  };

  const selectedOption = (poke) => {
    setSearch(poke.name);
    setDisplay(false);
    onSelect(poke);
  };

  return (
    <div ref={wrapperRef} className="flex-container flex-column pos-rel">
      <input
        id="auto"
        onClick={() => setDisplay(!display)}
        placeholder="Search user"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />
      {display && (
        <div className="autoContainer">
          {options
            .filter(({ name }) => name.indexOf(search.toLowerCase()) > -1)
            .map((value, i) => {
              return (
                <div
                  onClick={() => selectedOption(value)}
                  className="option"
                  key={i}
                  tabIndex="0"
                >
                  <span>{value.name}</span>
                  {/* <img src={value.sprite} alt="" /> */}
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
};

export default Combobox;
