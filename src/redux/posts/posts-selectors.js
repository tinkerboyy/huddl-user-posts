import { createSelector } from 'reselect';

const postsSelector = (state) => state.posts;
const usersSelector = (state) => state.users;

export const postsLoading = createSelector(
  postsSelector,
  ({ isLoading }) => isLoading
);

export const getAllPostsSelector = createSelector(
  postsSelector,
  ({ posts }) => posts
);

export const postsErrorSelector = createSelector(
  postsSelector,
  ({ error }) => error
);

export const getPostSelector = createSelector(
  postsSelector,
  ({ post }) => post
);

export const getPostAuthorSelector = createSelector(
  usersSelector,
  postsSelector,
  ({ users }, { post }) => {
    if (users && post) {
      const user = users && users.find((user) => user.id === post.userId);
      return user.name;
    }
  }
);
