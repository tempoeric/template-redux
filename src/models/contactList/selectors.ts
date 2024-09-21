import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'states';
import { initialState } from './slice';

const selectDomain = (state: RootState) => state?.contactList || initialState;

export const selectContactList = createSelector(
  [selectDomain],
  contactListState => ({
    customerList: contactListState.customerList,
    isLoading: contactListState.isLoading,
    responseMessage: contactListState.responseMessage,
  })
);

export const selectContactListData = createSelector(
  [selectDomain],
  contactListState => contactListState?.customerList
);

export const selectContactListLoading = createSelector(
  [selectDomain],
  contactListState => contactListState?.isLoading
);

export const selectContactResponseMessage = createSelector(
  [selectDomain],
  contactListState => contactListState?.responseMessage
);
