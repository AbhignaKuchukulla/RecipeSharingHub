// client/src/redux/recipeActions.js
export const DELETE_RECIPE = 'DELETE_RECIPE';
export const RESTORE_RECIPE = 'RESTORE_RECIPE';

export const deleteRecipeAction = (recipeId) => ({
  type: DELETE_RECIPE,
  payload: recipeId
});

export const restoreRecipeAction = (recipeId) => ({
  type: RESTORE_RECIPE,
  payload: recipeId
});
