/**
 * Combine all reducers in this file and export the combined reducers
 */

import { combineReducers } from '@reduxjs/toolkit';
import { InjectedReducersType } from './injector-typing';

import { UnknownAction, Reducer } from '@reduxjs/toolkit';

/**
 * Merges the main reducer with the router state and dynamically injected reducers
 */

export function createReducer(
  injectedReducers: InjectedReducersType = {}
): Reducer<{}, UnknownAction> {
  // Initially we don't have any injectedReducers, so returning an identity function to avoid the error
  if (Object.keys(injectedReducers).length === 0) {
    return (state: any) => state; // This could be adjusted to return a proper type if needed
  } else {
    return combineReducers({
      ...injectedReducers,
    }) as Reducer<{}, UnknownAction>; // Ensure the return type matches
  }
}
