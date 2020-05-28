import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import ErrorModal from '../../../components/organisms/error-modal/ErrorModal';
import Spinner from '../../../components/atoms/spinner/Spinner';
import PostsList from '../components/PostsList';
import { getPosts, setError } from '../../../redux/posts/posts-actions';
import {
  postsLoading,
  postsErrorSelector,
  getAllPostsSelector,
} from '../../../redux/posts/posts-selectors';

const Posts = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const isLoading = useSelector((state) => postsLoading(state));
  const error = useSelector((state) => postsErrorSelector(state));
  const posts = useSelector((state) => getAllPostsSelector(state));

  useEffect(() => {
    dispatch(getPosts());
    return () => console.log('I am unmounting');
  }, [dispatch]);

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

export default Posts;
