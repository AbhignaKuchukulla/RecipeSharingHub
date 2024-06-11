import { combineReducers } from 'redux';
import recipeReducer from './recipeReducer';
import userAuthorLoginReducer from './userAuthorLoginReducer';

const rootReducer = combineReducers({
  recipes: recipeReducer,
  userAuthorLoginReducer: userAuthorLoginReducer,
});

export default rootReducer;
