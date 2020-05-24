import { takeLatest, put, all, call } from 'redux-saga/effects';
import axios from 'axios';
import { commentsFailure, commentsSuccess } from './comments-actions';

function* handleGetComments({ postId }) {
  console.log(postId);
  try {
    const { data } = yield call(
      axios.get,
      `https://jsonplaceholder.typicode.com/posts/${postId}/comments`
    );
    yield put(commentsSuccess(data));
  } catch (e) {
    yield put(commentsFailure());
  }
}

export function* onGetComments() {
  yield takeLatest('LOAD_COMMENTS', handleGetComments);
}

export function* commentsSagas() {
  yield all([call(onGetComments)]);
}
