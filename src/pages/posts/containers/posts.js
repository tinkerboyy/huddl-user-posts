import React, { useEffect } from 'react';
import { compose } from 'recompose';
import { connect } from 'react-redux';

import ErrorModal from '../../../components/error-modal/ErrorModal';
import Spinner from '../../../components/spinner/Spinner';

import PostsList from '../components/PostsList';
import { getPosts } from '../../../redux/posts/posts-actions';
import {
  postsLoading,
  postsErrorSelector,
  getAllPostsSelector,
} from '../../../redux/posts/posts-selectors';

const Posts = ({ getPosts, posts, isLoading, error }) => {
  useEffect(() => {
    getPosts();
    return () => console.log('I am unmounting');
  }, [getPosts]);

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={true} />
      {!posts.length && (
        <div className="center">
          <Spinner />
        </div>
      )}
      {posts.length && <PostsList items={posts} />}
    </React.Fragment>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    getPosts: () => dispatch(getPosts()),
  };
};

const mapStateToProps = (state) => {
  return {
    posts: getAllPostsSelector(state),
    isLoading: postsLoading(state),
    error: postsErrorSelector(state),
  };
};

const enhance = compose(connect(mapStateToProps, mapDispatchToProps));

export default enhance(Posts);
