import React from 'react';

import Card from '../../../components/atoms/card/Card';
import PostItem from './PostItem';

import './PostsList.css';

const PostsList = (props) => {
  if (props.items.length === 0) {
    return (
      <div className="center">
        <Card>
          <h2>No posts found.</h2>
        </Card>
      </div>
    );
  }

  return (
    <ul className="posts-list">
      {props.items.map((post) => (
        <PostItem key={post.id} {...post} />
      ))}
    </ul>
  );
};

export default PostsList;
