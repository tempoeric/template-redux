import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { ContainerState, IContactData } from './types';

export const initialState: ContainerState = {
  customerData: null,
  customerList: null,
  isLoading: false,
  responseMessage: null,
};

const contactListSlice = createSlice({
  name: 'contactList',
  initialState,
  reducers: {
    addContact(state, _action: PayloadAction<IContactData>) {
      state.isLoading = true;
    },
    addContactCompleted(state, action) {
      state.customerData = action.payload.customerData;
      state.responseMessage = action.payload.responseMessage;
      state.isLoading = false;
    },
    addContactFailed(state) {
      state.isLoading = false;
    },
    getContactList(state) {
      state.isLoading = true;
    },
    getContactListCompleted(state, action: PayloadAction<IContactData[]>) {
      state.isLoading = false;
      state.customerList = action.payload;
    },
    getContactListFailed(state) {
      state.isLoading = false;
    },
    updateContactDetails(state, _action: PayloadAction<IContactData>) {
      state.isLoading = true;
    },
    updateContactDetailsCompleted(state, action: PayloadAction<IContactData>) {
      state.isLoading = false;
      state.customerData = action.payload;
    },
    updateContactDetailsFailed(state) {
      state.isLoading = false;
    },
    resetResponseMessage(state) {
      state.responseMessage = null;
    },
    deleteContact(state, _action: PayloadAction<string>) {
      state.isLoading = true;
      state.customerData = null;
    },
    deleteContactCompleted(state, action: PayloadAction<string>) {
      state.isLoading = false;
      state.responseMessage = action.payload;
    },
    deleteContactFailed(state) {
      state.isLoading = false;
    },
    resetMessageResponse(state) {
      state.responseMessage = null;
    },
  },
});

export const { actions, reducer, name: sliceKey } = contactListSlice;
