import { takeLatest, put, all, call, cancel } from 'redux-saga/effects';
import axios from '../axios';
import { commentsFailure, commentsSuccess } from './comments-actions';

function* handleGetComments({ postId }) {
  try {
    const { data } = yield call(axios.get, `/posts/${postId}/comments`);
    yield put(commentsSuccess(data));
  } catch (e) {
    yield put(commentsFailure());
  }
}

export function* onGetComments() {
  yield takeLatest('LOAD_COMMENTS', handleGetComments);
}

export function* onCancelComments() {
  yield cancel(handleGetComments);
}

export function* commentsSagas() {
  yield all([call(onGetComments)]);
}
