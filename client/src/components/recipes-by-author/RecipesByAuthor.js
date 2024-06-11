import "./RecipesByAuthor.css";
import { axiosWithToken } from '../../axiosWithToken';
import { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { useNavigate, Outlet } from "react-router-dom";
import { MdDelete, MdRestore } from "react-icons/md";
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { FcClock } from "react-icons/fc";
import { GiKnifeFork } from "react-icons/gi";
import { BiDish } from "react-icons/bi";

function RecipesByAuthor() {
  const [recipesList, setRecipesList] = useState([]);
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.userAuthoruserAuthorLoginReducer.currentUser);

  const getRecipesOfCurrentAuthor = useCallback(async () => {
    try {
      const res = await axiosWithToken.get(`http://localhost:4000/author-api/recipes/${currentUser.username}`);
      if (Array.isArray(res.data.payload)) {
        setRecipesList(res.data.payload);
      } else {
        throw new Error('Invalid recipes data received');
      }
    } catch (error) {
      console.error('Error fetching recipes:', error);
    }
  }, [currentUser.username]);

  const readRecipeByRecipeId = (recipeObj) => {
    navigate(`../recipe/${recipeObj.recipeId}`, { state: recipeObj });
  };

  const toggleHeart = (recipeId) => {
    setRecipesList((prevState) =>
      prevState.map((recipe) =>
        recipe.recipeId === recipeId ? { ...recipe, liked: !recipe.liked } : recipe
      )
    );
  };

  const deleteRecipe = async (recipeId) => {
    try {
      const res = await axiosWithToken.delete(`http://localhost:4000/author-api/recipe/${recipeId}`);
      if (res.data.message === 'Recipe deleted') {
        setRecipesList(prevState => prevState.map(recipe =>
          recipe.recipeId === recipeId ? { ...recipe, status: 'deleted' } : recipe
        ));
      }
    } catch (error) {
      console.error('Error deleting recipe:', error);
    }
  };

  const restoreRecipe = async (recipeId) => {
    try {
      const res = await axiosWithToken.put(`http://localhost:4000/author-api/recipe/${recipeId}/restore`);
      if (res.data.message === 'Recipe restored') {
        setRecipesList(prevState => prevState.map(recipe =>
          recipe.recipeId === recipeId ? { ...recipe, status: 'active' } : recipe
        ));
      }
    } catch (error) {
      console.error('Error restoring recipe:', error);
    }
  };

  useEffect(() => {
    getRecipesOfCurrentAuthor();
  }, [getRecipesOfCurrentAuthor]);

  return (
    <div className="container">
      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4 mt-5">
        {Array.isArray(recipesList) && recipesList.map((recipe) => (
          <div className="col" key={recipe.recipeId}>
            <div className="card h-100 card-hover">
              <div className="like-buttons" onClick={() => toggleHeart(recipe.recipeId)} role="button" tabIndex="0" aria-label={`Toggle like for ${recipe.title}`}>
                {recipe.liked ? <FaHeart className="like-icon" /> : <FaRegHeart className="like-icon" />}
              </div>
              <img src={recipe.imageUrl} className="card-img-top" alt={recipe.title} />
              <div className="card-body">
                <h5 className="card-title">{recipe.title}</h5>
                {recipe.content && typeof recipe.content === 'string' && (
                  <p className="card-text">{recipe.content.substring(0, 80) + '....'}</p>
                )}
                <button className="custom-btn btn-hover" onClick={() => readRecipeByRecipeId(recipe)}>
                  <span>Cook</span>
                </button>
                <div className="mt-3 recipe-info">
                  <p className="lead">
                    <FcClock className="icon" /> Prep: {recipe.prepTime} min
                  </p>
                  <p className="lead">
                    <FcClock className="icon" /> Cook: {recipe.cookingTime} min
                  </p>
                  <p className="lead">
                    <GiKnifeFork className="icon" /> Serves: {recipe.serves}
                  </p>
                  <p className="lead">
                    <BiDish className="icon" /> Calories: {recipe.calories}
                  </p>
                </div>
                <div className="recipe-footer">
                  {recipe.status === 'active' ? (
                    <button className="btn btn-danger" onClick={() => deleteRecipe(recipe.recipeId)}>
                      <MdDelete /> Delete Recipe
                    </button>
                  ) : (
                    <button className="btn btn-warning" onClick={() => restoreRecipe(recipe.recipeId)}>
                      <MdRestore /> Restore Recipe
                    </button>
                  )}
                </div>
              </div>
              <div className="card-footer">
                <small className="text-body-secondary">
                  Last updated on {new Date(recipe.dateOfModification).toLocaleDateString()}
                </small>
              </div>
            </div>
          </div>
        ))}
      </div>
      <Outlet />
    </div>
  );
}

export default RecipesByAuthor;