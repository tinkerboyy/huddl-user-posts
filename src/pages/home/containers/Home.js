import React from 'react';
import { compose } from 'recompose';
import { connect } from 'react-redux';

import Button from '../../../components/form-elements/button/Button';
import './Home.css';

const Home = () => {
  return (
    <React.Fragment>
      <div className="home">
        <Button to="/posts">Load Posts</Button>
      </div>
    </React.Fragment>
  );
};

const mapStateToProps = (state) => {
  return {};
};

const enhance = compose(connect(mapStateToProps));

export default enhance(Home);
