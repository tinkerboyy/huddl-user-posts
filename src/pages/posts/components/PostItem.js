import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import './PostItem.css';

import Card from '../../../components/atoms/card/Card';
import { getAllUsersSelector } from '../../../redux/users/user-selectors';

const PostItem = ({ id, title, userId }) => {
  const users = useSelector((state) => getAllUsersSelector(state));
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

export default PostItem;
