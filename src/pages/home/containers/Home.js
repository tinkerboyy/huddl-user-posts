import React, { useState } from 'react';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';

import './Home.css';
import Button from '../../../components/atoms/form-elements/button/Button';
import Autocomplete from '../../../components/atoms/combobox/AutoComplete';
import { sortValues, matchStateToTerm } from '../../../components/utils/utils';
import { getAllUsersSelector } from '../../../redux/users/user-selectors';

const Home = ({ users }) => {
  const [value, setValue] = useState('');
  const history = useHistory();

  const handleSelected = ({ id }) => {
    history.push(`users/${id}`);
  };

  return (
    <React.Fragment>
      <div className="autocomplete">
        {users && (
          <Autocomplete
            value={value}
            inputProps={{ id: 'states-autocomplete' }}
            wrapperStyle={{ position: 'relative', display: 'inline-block' }}
            items={users}
            getItemValue={handleSelected}
            shouldItemRender={matchStateToTerm}
            sortItems={sortValues}
            onChange={(event, value) => setValue(value)}
            onSelect={(value) => setValue(value)}
            renderMenu={(children) => <div className="menu">{children}</div>}
            renderItem={(item, isHighlighted) => (
              <div
                className={`item ${isHighlighted ? 'item-highlighted' : ''}`}
                key={item.id}
              >
                {item.name}
              </div>
            )}
          />
        )}
      </div>
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
