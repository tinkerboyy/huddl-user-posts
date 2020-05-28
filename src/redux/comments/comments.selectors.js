import { createSelector } from 'reselect';

const commentsSelector = (state) => state.comments;

export const commentsLoadingSelector = createSelector(
  commentsSelector,
  ({ isLoading }) => isLoading
);

export const getAllComments = createSelector(
  commentsSelector,
  ({ comments }) => comments
);
