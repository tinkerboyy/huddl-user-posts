import { createSelector } from 'reselect';

const usersSelector = (state) => state.users;

export const getAllUsersSelector = createSelector(
  usersSelector,
  ({ users }) => users
);

export const currentUserSelector = createSelector(
  usersSelector,
  ({ currentUser }) => currentUser && currentUser
);

export const currentUserCompanySelector = createSelector(
  usersSelector,
  ({ currentUser }) => currentUser && currentUser.company
);

export const usersLoadingSelector = createSelector(
  usersSelector,
  ({ isLoading }) => isLoading
);
