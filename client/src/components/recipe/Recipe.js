import "./Recipe.css";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import axios from "axios";
import { FcClock, FcCalendar } from "react-icons/fc";
import { CiEdit } from "react-icons/ci";
import { MdDelete, MdRestore, MdStar, MdStarBorder } from "react-icons/md";
import { GiKnifeFork } from "react-icons/gi";
import { BiDish } from "react-icons/bi";

function Recipe() {
  const { state } = useLocation();
  const { currentUser } = useSelector((state) => state.userAuthoruserAuthorLoginReducer);
  const { register, handleSubmit, setValue } = useForm();
  const [comment, setComment] = useState("");
  const navigate = useNavigate();
  const [recipeEditStatus, setRecipeEditStatus] = useState(false);
  const [currentRecipe, setCurrentRecipe] = useState(state);
  const [ingredients, setIngredients] = useState(state.ingredients || []);
  const [ingredientName, setIngredientName] = useState("");
  const [ingredientAmount, setIngredientAmount] = useState("");
  const [rating, setRating] = useState(0); // State variable for rating

  const token = localStorage.getItem('token');
  const axiosWithToken = axios.create({
    headers: { Authorization: `Bearer ${token}` }
  });

  const deleteRecipe = async () => {
    try {
      const res = await axiosWithToken.delete(`http://localhost:4000/author-api/recipe/${currentRecipe.recipeId}`);
      if (res.data.message === 'Recipe deleted') {
        setCurrentRecipe({ ...currentRecipe, status: 'deleted' });
      }
    } catch (error) {
      console.error('Error deleting recipe:', error);
    }
  };

  const restoreRecipe = async () => {
    try {
      const res = await axiosWithToken.put(`http://localhost:4000/author-api/recipe/${currentRecipe.recipeId}/restore`);
      if (res.data.message === 'Recipe restored') {
        setCurrentRecipe({ ...currentRecipe, status: 'active' });
      }
    } catch (error) {
      console.error('Error restoring recipe:', error);
    }
  };

  const writeComment = async (commentObj) => {
    try {
      commentObj.username = currentUser.username;
      const res = await axiosWithToken.post(`http://localhost:4000/user-api/comment/${currentRecipe.recipeId}`, commentObj);
      if (res.data.message === "Comment posted") {
        setComment("Comment posted successfully!");
        setCurrentRecipe({ ...currentRecipe, comments: [...currentRecipe.comments, commentObj] });
      } else {
        setComment("Failed to post comment.");
      }
    } catch (error) {
      console.error('Error posting comment:', error);
      setComment("Error posting comment.");
    }
  };

  const ISOtoUTC = (isoDate) => {
    const date = new Date(isoDate);
    return `${date.toUTCString().slice(0, -3)}`;
  };

  const handleAddIngredient = () => {
    if (ingredientName && ingredientAmount) {
      setIngredients([
        ...ingredients,
        { name: ingredientName, amount: ingredientAmount, checked: false }
      ]);
      setIngredientName("");
      setIngredientAmount("");
    }
  };

  const handleRemoveIngredient = (index) => {
    const newIngredients = ingredients.filter((_, i) => i !== index);
    setIngredients(newIngredients);
  };

  const handleCheckboxChange = (index) => {
    const newIngredients = ingredients.map((ingredient, i) => {
      if (i === index) {
        return { ...ingredient, checked: !ingredient.checked };
      }
      return ingredient;
    });
    setIngredients(newIngredients);
  };

  const editRecipe = async (updatedRecipe) => {
    updatedRecipe.dateOfModification = new Date().toISOString();
    updatedRecipe.ingredients = ingredients;
    try {
      const res = await axiosWithToken.put(`http://localhost:4000/author-api/recipe/${currentRecipe.recipeId}`, updatedRecipe);
      if (res.data.message === 'Recipe updated') {
        setRecipeEditStatus(false);
        setCurrentRecipe(res.data.recipe);
      }
    } catch (error) {
      console.error('Error updating recipe:', error);
    }
  };

  const submitComment = async (data) => {
    const commentObj = {
      comment: data.comment,
      rating: rating,
    };
    await writeComment(commentObj);
    setRating(0); // Reset rating after submitting
  };

  return (
    <div className="container mt-4 recipe-container">
      <div className="row">
        <div className="col-12 col-lg-8">
          <div className="scrollable-content">
            {currentRecipe.title && (
              <div className="recipe-content">
                <div className="recipe-details">
                  <p className="display-3 me-4">{currentRecipe.title}</p>
                  <span className="py-3">
                    <small className="text-secondary me-4">
                      <FcCalendar className="fs-4" />
                      Created on: {ISOtoUTC(currentRecipe.dateOfCreation)}
                    </small>
                    <small className="text-secondary">
                      <FcClock className="fs-4" />
                      Modified on: {ISOtoUTC(currentRecipe.dateOfModification)}
                    </small>
                  </span>
                  <div className="mt-3">
                    <p className="lead">
                      <FcClock className="fs-4" />
                      Prep Time: {currentRecipe.prepTime} minutes
                    </p>
                    <p className="lead">
                      <FcClock className="fs-4" />
                      Cooking Time: {currentRecipe.cookingTime} minutes
                    </p>
                    <p className="lead">
                      <GiKnifeFork className="fs-4" />
                      Serves: {currentRecipe.serves}
                    </p>
                    <p className="lead">
                      <BiDish className="fs-4" />
                      Calories: {currentRecipe.calories}
                    </p>
                  </div>
                  <div className="mt-4">
                    <h5>Ingredients:</h5>
                    <ul className="list-group">
                      {ingredients.map((ingredient, index) => (
                        <li key={index} className={`list-group-item ${ingredient.checked ? 'checked' : ''}`}>
                          <input type="checkbox" className="form-check-input me-2" checked={ingredient.checked} onChange={() => handleCheckboxChange(index)} />
                          <span>{ingredient.amount} {ingredient.name}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-4">
                    <h5>Directions:</h5>
                    <div className="recipe-directions">
                      {currentRecipe.directions.split('\n').map((step, index) => (
                        <div key={index} className="direction-item">
                          <span className="step-number">{index + 1}</span>
                          <p className="lead">{step}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="recipe-image">
                  <img src={currentRecipe.imageUrl} alt={currentRecipe.title} className="img-fluid" />
                </div>
              </div>
            )}

            {recipeEditStatus && (
              <form onSubmit={handleSubmit(editRecipe)} className="mt-4">
                <div className="mb-4">
                  <label htmlFor="title" className="form-label">Title</label>
                  <input type="text" className="form-control" id="title" defaultValue={currentRecipe.title} {...register("title")} />
                </div>
                <div className="mb-4">
                  <label htmlFor="prepTime" className="form-label">Prep Time</label>
                  <input type="number" className="form-control" id="prepTime" defaultValue={currentRecipe.prepTime} {...register("prepTime")} />
                </div>
                <div className="mb-4">
                  <label htmlFor="cookingTime" className="form-label">Cooking Time</label>
                  <input type="number" className="form-control" id="cookingTime" defaultValue={currentRecipe.cookingTime} {...register("cookingTime")} />
                </div>
                <div className="mb-4">
                  <label htmlFor="serves" className="form-label">Serves</label>
                  <input type="number" className="form-control" id="serves" defaultValue={currentRecipe.serves} {...register("serves")} />
                </div>
                <div className="mb-4">
                  <label htmlFor="calories" className="form-label">Calories</label>
                  <input type="number" className="form-control" id="calories" defaultValue={currentRecipe.calories} {...register("calories")} />
                </div>
                <div className="mb-4">
                  <label htmlFor="directions" className="form-label">Directions</label>
                  <textarea className="form-control" id="directions" rows="5" defaultValue={currentRecipe.directions} {...register("directions")}></textarea>
                </div>
                <button type="submit" className="btn btn-primary">Save Changes</button>
                <button type="button" className="btn btn-secondary ms-2" onClick={() => setRecipeEditStatus(false)}>Cancel</button>
              </form>
            )}
          </div>
        </div>
        <div className="col-12 col-lg-4">
          <div className="scrollable-content">
            <div className="comments-section">
              <h5>Comments</h5>
              <ul className="list-group">
                {currentRecipe.comments && currentRecipe.comments.map((comment, index) => (
                  <li key={index} className="list-group-item">
                    <p><strong>{comment.username}</strong> ({ISOtoUTC(comment.date)})</p>
                    <p>{comment.comment}</p>
                    <div className="star-rating">
                      {[1, 2, 3, 4, 5].map(star => (
                        <span key={star} className={`fs-4 ${star <= comment.rating ? 'text-warning' : ''}`}>
                          <MdStar />
                        </span>
                      ))}
                    </div>
                  </li>
                ))}
              </ul>
              {currentUser && (
                <form onSubmit={handleSubmit(submitComment)} className="mt-4">
                  <div className="mb-3">
                    <label htmlFor="comment" className="form-label">Add Comment</label>
                    <textarea className="form-control" id="comment" rows="3" {...register("comment")}></textarea>
                  </div>
                  <div className="star-rating mb-3">
                    {[1, 2, 3, 4, 5].map(star => (
                      <span key={star} className={`fs-4 ${star <= rating ? 'text-warning' : ''}`} onClick={() => setRating(star)}>
                        {star <= rating ? <MdStar /> : <MdStarBorder />}
                      </span>
                    ))}
                  </div>
                  <button type="submit" className="btn btn-primary">Submit Comment</button>
                </form>
              )}
              {comment && <p className="mt-3">{comment}</p>}
            </div>
            {currentRecipe.status === 'active' ? (
              <button className="btn btn-danger mt-4" onClick={deleteRecipe}><MdDelete /> Delete Recipe</button>
            ) : (
              <button className="btn btn-warning mt-4" onClick={restoreRecipe}><MdRestore /> Restore Recipe</button>
            )}
            <button className="btn btn-primary mt-4" onClick={() => setRecipeEditStatus(true)}><CiEdit /> Edit Recipe</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Recipe;
