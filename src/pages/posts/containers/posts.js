import React, { useEffect } from 'react';
import { compose } from 'recompose';
import { connect } from 'react-redux';

import ErrorModal from '../../../components/organisms/error-modal/ErrorModal';
import Spinner from '../../../components/atoms/spinner/Spinner';
import PostsList from '../components/PostsList';
import { getPosts, setError } from '../../../redux/posts/posts-actions';
import {
  postsLoading,
  postsErrorSelector,
  getAllPostsSelector,
} from '../../../redux/posts/posts-selectors';
import { useHistory } from 'react-router-dom';

const Posts = ({ getPosts, posts, isLoading, error }) => {
  const history = useHistory();

  useEffect(() => {
    getPosts();
    return () => console.log('I am unmounting');
  }, [getPosts]);

  const clearError = () => {
    setError();
    history.push('/home');
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <Spinner>Loading Posts</Spinner>
        </div>
      )}
      {!isLoading && posts && <PostsList items={posts} />}
    </React.Fragment>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    getPosts: () => dispatch(getPosts()),
    setError: () => dispatch(setError()),
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
