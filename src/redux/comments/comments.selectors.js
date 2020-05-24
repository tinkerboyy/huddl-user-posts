import { createSelector } from 'reselect';

const commentsSelector = (state) => state.comments;

export const commentsLoading = createSelector(
  commentsSelector,
  ({ isLoading }) => isLoading
);

export const getAllComments = createSelector(
  commentsSelector,
  ({ comments }) => comments
);
