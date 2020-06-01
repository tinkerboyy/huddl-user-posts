import { all, fork } from 'redux-saga/effects';

import { userSagas } from './users/user-sagas';
import { postsSagas } from './posts/posts-sagas';
import { commentsSagas } from './comments/comments-sagas';

export default function* rootSaga() {
  yield all([fork(userSagas), fork(postsSagas), fork(commentsSagas)]);
}
