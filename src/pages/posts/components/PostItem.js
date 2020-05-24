import React from 'react';
import { Link } from 'react-router-dom';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import Card from '../../../components/card/Card';

import './PostItem.css';
import { getAllUsersSelector } from '../../../redux/users/user-selectors';

const PostItem = ({ id, title, body, userId, users }) => {
  const user = users && users.find((user) => user.id === userId);
  return (
    <li className="post-item">
      <Card className="post-item__content">
        <Link to={`/users/${userId}`}>
          <div className="post-item__info">
            Author: <h2>{user && user.name}</h2>
          </div>
        </Link>
        <Link to={`/posts/${id}`}>
          <div className="post-item__info">
            Title: <p>{title}</p>
          </div>
        </Link>
      </Card>
    </li>
  );
};

const mapStateToProps = (state) => {
  return {
    users: getAllUsersSelector(state),
  };
};

const enhance = compose(connect(mapStateToProps));

export default enhance(PostItem);
