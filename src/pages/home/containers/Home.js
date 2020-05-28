import React, { useMemo, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import './Home.css';
import Button from '../../../components/atoms/form-elements/button/Button';
import { getAllUsersSelector } from '../../../redux/users/user-selectors';
import Combobox from '../../../components/atoms/combobox/Combobox';

const Home = () => {
  const history = useHistory();
  const users = useSelector((state) => getAllUsersSelector(state));

  const handleSelected = useCallback(
    ({ id }) => {
      history.push(`users/${id}`);
    },
    [history]
  );

  const combobox = useMemo(
    () => <Combobox items={users} onSelect={handleSelected} />,
    [users, handleSelected]
  );

  return (
    <React.Fragment>
      <div className="autocomplete">{combobox}</div>
      <div className="home">
        <Button to="/posts">Load Posts</Button>
      </div>
    </React.Fragment>
  );
};

export default Home;
