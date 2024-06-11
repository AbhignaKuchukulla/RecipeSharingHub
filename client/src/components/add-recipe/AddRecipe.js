import "./AddRecipe.css";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FcClock } from "react-icons/fc";
import { GiKnifeFork } from "react-icons/gi";
import { BiDish } from "react-icons/bi";

function AddRecipe() {
  const { register, handleSubmit, reset } = useForm();
  const { currentUser } = useSelector(
    (state) => state.userAuthoruserAuthorLoginReducer
  );
  const [err, setErr] = useState("");
  const [ingredients, setIngredients] = useState([]);
  const [ingredientName, setIngredientName] = useState("");
  const [ingredientAmount, setIngredientAmount] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  // Create axios instance with token
  const axiosWithToken = axios.create({
    headers: { Authorization: `Bearer ${token}` }
  });

  const postNewRecipe = async (recipe) => {
    recipe.dateOfCreation = new Date().toISOString();
    recipe.dateOfModification = new Date().toISOString();
    recipe.recipeId = Date.now();
    recipe.username = currentUser.username;
    recipe.comments = [];
    recipe.status = true;
    recipe.ingredients = ingredients;

    // Make HTTP post request
    try {
      const res = await axiosWithToken.post('http://localhost:4000/author-api/recipe', recipe);
      console.log('Response:', res);
      if (res.data.message === 'New recipe created') {
        reset(); // Reset form after successful submission
        setIngredients([]); // Clear ingredients
        navigate(`/author-profile/recipes-by-author/${currentUser.username}`);
      } else {
        setErr(res.data.message);
      }
    } catch (error) {
      const errorMessage = error.response ? error.response.data.message : error.message;
      setErr(`Error creating recipe: ${errorMessage}`);
      console.error('Error creating recipe:', error.response || error.message || error);
    }
  };

  const handleAddIngredient = () => {
    if (ingredientName && ingredientAmount) {
      setIngredients([
        ...ingredients,
        { name: ingredientName, amount: ingredientAmount }
      ]);
      setIngredientName("");
      setIngredientAmount("");
    }
  };

  const handleRemoveIngredient = (index) => {
    const newIngredients = ingredients.filter((_, i) => i !== index);
    setIngredients(newIngredients);
  };

  return (
    <div className="container">
      <div className="row justify-content-center mt-5">
        <div className="col-lg-8 col-md-8 col-sm-10">
          <div className="card shadow">
            <div className="card-title text-center border-bottom">
              <h2 className="p-3">Write a Recipe</h2>
            </div>
            <div className="card-body bg-light">
              {err && <p className='text-danger fs-5'>{err}</p>}
              <form onSubmit={handleSubmit(postNewRecipe)}>
                <div className="mb-4">
                  <label htmlFor="title" className="form-label">
                    Title
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="title"
                    {...register("title", { required: true })}
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="category" className="form-label">
                    Select a cusine
                  </label>
                  <select
                    {...register("category", { required: true })}
                    id="category"
                    className="form-select"
                  >
                    <option value="Indian">Indian</option>
                    <option value="Chinese">Chinese</option>
                    <option value="Italian">Italian</option>
                    <option value="Japanese">Japanese</option>
                    <option value="Appetizer">Appetizer</option>
                    <option value="Main Course">Main Course</option>
                    <option value="Dessert">Dessert</option>
                    <option value="Diet">Diet</option>
                  </select>
                </div>

                <div className="row mb-4">
                  <div className="col">
                    <label htmlFor="prepTime" className="form-label">
                      Prep Time (minutes) <FcClock />
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      id="prepTime"
                      {...register("prepTime", { required: true })}
                    />
                  </div>
                  <div className="col">
                    <label htmlFor="cookingTime" className="form-label">
                      Cooking Time (minutes) <FcClock />
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      id="cookingTime"
                      {...register("cookingTime", { required: true })}
                    />
                  </div>
                </div>

                <div className="row mb-4">
                  <div className="col">
                    <label htmlFor="serves" className="form-label">
                      Serves <GiKnifeFork />
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      id="serves"
                      {...register("serves", { required: true })}
                    />
                  </div>
                  <div className="col">
                    <label htmlFor="calories" className="form-label">
                      Calories <BiDish />
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      id="calories"
                      {...register("calories", { required: true })}
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label htmlFor="imageUrl" className="form-label">
                    Image URL
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="imageUrl"
                    {...register("imageUrl")}
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="ingredients" className="form-label">
                    Ingredients
                  </label>
                  <div className="d-flex">
                    <input
                      type="text"
                      className="form-control me-2"
                      placeholder="Ingredient Name"
                      value={ingredientName}
                      onChange={(e) => setIngredientName(e.target.value)}
                    />
                    <input
                      type="text"
                      className="form-control me-2"
                      placeholder="Amount"
                      value={ingredientAmount}
                      onChange={(e) => setIngredientAmount(e.target.value)}
                    />
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={handleAddIngredient}
                    >
                      Add
                    </button>
                  </div>
                </div>

                <div className="mb-4">
                  <ul className="list-group">
                    {ingredients.map((ingredient, index) => (
                      <li
                        key={index}
                        className="list-group-item d-flex justify-content-between align-items-center"
                      >
                        {ingredient.amount} {ingredient.name}
                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          onClick={() => handleRemoveIngredient(index)}
                        >
                          Remove
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mb-4">
                  <label htmlFor="directions" className="form-label">
                    Directions
                  </label>
                  <textarea
                    {...register("directions", { required: true })}
                    className="form-control"
                    id="directions"
                    rows="10"
                  ></textarea>
                </div>

                <div className="text-end">
                  <button type="submit" className="btn btn-primary">
                    Post
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddRecipe;
