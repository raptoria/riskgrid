import { IRootState } from '../reducers/types';

export const loadState = () => {
  try {
    const serializedState = sessionStorage.getItem('wakanda-config');
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return undefined;
  }
};

export const saveState = (state: Partial<IRootState>) => {
  try {
    const serializedState = JSON.stringify(state);
    sessionStorage.setItem('wakanda-config', serializedState);
    console.log('layout saved');
  } catch (err) {
    // die
  }
};
