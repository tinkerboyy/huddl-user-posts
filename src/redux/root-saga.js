import { all, call } from 'redux-saga/effects';

import { userSagas } from './users/user-sagas';
import { postsSagas } from './posts/posts-sagas';
import { commentsSagas } from './comments/comments-sagas';

export default function* rootSaga() {
  yield all([call(userSagas), call(postsSagas), call(commentsSagas)]);
}
