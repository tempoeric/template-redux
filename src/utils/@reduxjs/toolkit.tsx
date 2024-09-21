import {
  createSlice as createSliceOriginal,
  CreateSliceOptions,
  SliceCaseReducers,
} from '@reduxjs/toolkit';

import { RootStateKeyType } from 'store/injector-typing';

export const createSlice = <
  State,
  CaseReducers extends SliceCaseReducers<State>,
  Name extends RootStateKeyType,
>(
  options: CreateSliceOptions<State, CaseReducers, Name>
) => {
  return createSliceOriginal(options);
};
