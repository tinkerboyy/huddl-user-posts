import React, { useMemo, useCallback } from 'react';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';

import './Home.css';
import Button from '../../../components/atoms/form-elements/button/Button';
import { getAllUsersSelector } from '../../../redux/users/user-selectors';
import Combobox from '../../../components/atoms/combobox/Combobox';

const Home = ({ users }) => {
  const history = useHistory();

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

const mapStateToProps = (state) => {
  return {
    users: getAllUsersSelector(state),
  };
};

const enhance = compose(connect(mapStateToProps));

export default enhance(Home);
