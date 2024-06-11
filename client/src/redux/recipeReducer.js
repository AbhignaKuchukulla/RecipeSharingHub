import { DELETE_RECIPE, RESTORE_RECIPE } from './recipeActions';

const initialState = {
  recipes: []
};

const recipeReducer = (state = initialState, action) => {
  switch (action.type) {
    case DELETE_RECIPE:
      return {
        ...state,
        recipes: state.recipes.map(recipe =>
          recipe.recipeId === action.payload ? { ...recipe, status: 'deleted' } : recipe
        )
      };
    case RESTORE_RECIPE:
      return {
        ...state,
        recipes: state.recipes.map(recipe =>
          recipe.recipeId === action.payload ? { ...recipe, status: 'active' } : recipe
        )
      };
    default:
      return state;
  }
};

export default recipeReducer;
