import React from 'react';
import { NavLink } from 'react-router-dom';

import './NavLinks.css';

const NavLinks = (props) => {
  return (
    <ul className="nav-links">
      <li>
        <NavLink to="/home" exact>
          Home
        </NavLink>
      </li>

      <li>
        <NavLink to="/posts" exact>
          Posts
        </NavLink>
      </li>
    </ul>
  );
};

export default NavLinks;
