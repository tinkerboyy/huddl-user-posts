import React from 'react';
import Card from '../../../components/atoms/card/Card';
import './CommentItem.css';

const CommentsItem = ({ body, email, name }) => {
  return (
    <li className="comment-item">
      <Card className="comment-item__content">
        <div className="comment-item__info">
          <h2>{name}</h2>
        </div>
        <div className="comment-item__info">{body}</div>
        <div className="comment-item__info">
          <span>
            <strong>Email:&nbsp;</strong>
          </span>
          <p>{email}</p>
        </div>
      </Card>
    </li>
  );
};

export default CommentsItem;
