import { configureStore } from '@reduxjs/toolkit';
import { createInjectorsEnhancer, forceReducerReload } from 'redux-injectors';
import createSagaMiddleware from 'redux-saga';
import { createReducer } from './reducers';
import { logger } from 'utils';

export function configureAppStore() {
  const reduxSagaMonitorOptions = {};
  const sagaMiddleware = createSagaMiddleware(reduxSagaMonitorOptions);

  const { run: runSaga } = sagaMiddleware;

  const active = import.meta.env.MODE !== 'production';

  // Create the injectors enhancer

  // Use a function to get default middleware and include your custom middlewares
  const middleware = (getDefaultMiddleware: any) => {
    return getDefaultMiddleware().concat(sagaMiddleware, logger(active));
  };

  const enhancers = createInjectorsEnhancer({
    createReducer,
    runSaga,
  });

  // Create the store with middleware and enhancers
  const store = configureStore({
    reducer: createReducer(),
    middleware,
    devTools: active,
    enhancers: getDefaultEnhancers =>
      [...getDefaultEnhancers(), enhancers] as any,
  });

  if (import.meta.hot) {
    import.meta.hot.accept('./reducers', () => {
      forceReducerReload(store);
    });
  }

  return store;
}
