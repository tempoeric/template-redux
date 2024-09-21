import type { SagaIterator } from 'redux-saga';
import { call, put, select, takeLatest } from 'redux-saga/effects';
import { actions } from './slice';
import { axios } from 'lib/axios';
import { selectContactList } from './selectors';
import { IContactData } from './types';

export function* getContactListSaga(): SagaIterator<void> {
  try {
    const data = yield call(axios.get, '/contact/users');
    yield put(actions.getContactListCompleted(data));
  } catch (error) {
    yield put(actions.getContactListFailed());
  }
}

export function* addContactSaga({
  payload,
}: ReturnType<typeof actions.addContact>): SagaIterator<void> {
  try {
    const response = yield call(axios.post, '/contact/users', payload);
    yield put(
      actions.addContactCompleted({
        customerData: response,
        responseMessage: 'User Successfully Added',
      })
    );
    yield put(actions.getContactList());
  } catch (error) {
    yield put(actions.addContactFailed());
  }
}

export function* updateContactDetailsSaga({
  payload,
}: ReturnType<typeof actions.updateContactDetails>): SagaIterator<void> {
  try {
    const { id, ...updateData } = payload;
    yield call(axios.put, `/contact/users/${id}`, updateData);
    yield put(actions.updateContactDetailsCompleted(payload));
    yield put(actions.getContactList());
  } catch (error) {
    yield put(actions.updateContactDetailsFailed());
  }
}

export function* deleteContactSaga({
  payload,
}: ReturnType<typeof actions.deleteContact>): SagaIterator<void> {
  try {
    yield call(axios.delete, `/contact/users/${payload}`);
    const currentContactList = yield select(selectContactList);
    const updatedList = currentContactList?.customerList?.filter(
      (contact: IContactData) => contact.id !== payload
    );
    yield put(
      actions.deleteContactCompleted('User has been successfully deleted!')
    );
    yield put(actions.updateContactDetails(updatedList));
    yield put(actions.getContactList());
  } catch (error) {
    console.log('error', error);
    yield put(actions.deleteContactFailed());
  }
}

export function* contactListSaga() {
  yield takeLatest(actions.getContactList.type, getContactListSaga);
  yield takeLatest(actions.addContact.type, addContactSaga);
  yield takeLatest(actions.updateContactDetails.type, updateContactDetailsSaga);
  yield takeLatest(actions.deleteContact.type, deleteContactSaga);
}
