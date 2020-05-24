import React from 'react';
import Card from '../../../components/card/Card';
import CommentsItem from './CommentItem';
import './CommentsList.css';

const CommentsList = ({ items }) => {
  if (items.length === 0) {
    return (
      <div className="center">
        <Card>
          <h2>No comments found.</h2>
        </Card>
      </div>
    );
  }

  return (
    <ul className="comments-list">
      {items &&
        items.map((comment) => <CommentsItem key={comment.id} {...comment} />)}
    </ul>
  );
};

export default CommentsList;
