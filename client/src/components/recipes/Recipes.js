import { useState, useEffect } from 'react';
import { axiosWithToken } from '../../axiosWithToken';
import { useNavigate, Outlet } from 'react-router-dom';
import { MdLocalFireDepartment, MdGroup, MdAccessTime } from 'react-icons/md';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import './Recipes.css';

function Recipes() {
  const [recipesList, setRecipesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [authorFilter, setAuthorFilter] = useState('');
  const [recipeTypeFilter, setRecipeTypeFilter] = useState('');
  const navigate = useNavigate();

  const getRecipes = async (author = '', recipeType = '') => {
    try {
      const res = await axiosWithToken.get('http://localhost:4000/user-api/recipes', {
        params: { author, recipeType },
      });
      console.log('Server response:', res.data); // Log the server response

      if (res.data.payload && Array.isArray(res.data.payload)) {
        setRecipesList(res.data.payload);
      } else {
        console.error('Invalid response format:', res.data);
        setError('Invalid response format from server.');
      }
    } catch (error) {
      console.error('Error fetching recipes:', error);
      setError('Error fetching recipes. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const readRecipeByRecipeId = (recipeObj) => {
    navigate(`../recipe/${recipeObj.recipeId}`, { state: recipeObj });
  };

  useEffect(() => {
    getRecipes(authorFilter, recipeTypeFilter);
  }, [authorFilter, recipeTypeFilter]);

  const toggleHeart = (recipeId) => {
    setRecipesList((prevState) =>
      prevState.map((recipe) =>
        recipe.recipeId === recipeId ? { ...recipe, liked: !recipe.liked } : recipe
      )
    );
  };

  const handleAuthorFilterChange = (event) => {
    setAuthorFilter(event.target.value);
  };

  const handleRecipeTypeFilterChange = (event) => {
    setRecipeTypeFilter(event.target.value);
  };

  if (loading) {
    return <div className="loader">Loading...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="container">
      <div className="filter-container">
        <div className="filter">
          <label htmlFor="author-filter">Filter by Author:</label>
          <select id="author-filter" value={authorFilter} onChange={handleAuthorFilterChange}>
            <option value="">All</option>
            <option value="author1">Anshu</option>
            <option value="author2">hello123</option>
          </select>
        </div>
        <div className="filter">
          <label htmlFor="recipe-type-filter">Filter by Recipe Type:</label>
          <select id="recipe-type-filter" value={recipeTypeFilter} onChange={handleRecipeTypeFilterChange}>
            <option value="">All</option>
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
      </div>
      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4 mt-5">
        {recipesList.map((recipe) => (
          <div className="col" key={recipe.recipeId}>
            <div className="card h-100 card-hover">
              <div className="like-buttons" onClick={() => toggleHeart(recipe.recipeId)} role="button" tabIndex="0" aria-label={`Toggle like for ${recipe.title}`}>
                {recipe.liked ? <FaHeart className="like-icon" /> : <FaRegHeart className="like-icon" />}
              </div>
              <img src={recipe.imageUrl} className="card-img-top" alt={recipe.title} />
              <div className="card-body">
                <div className="card-title">
                  <span>{recipe.title}</span>
                  <button className="custom-btn btn-hover" onClick={() => readRecipeByRecipeId(recipe)} aria-label={`Read more about ${recipe.title}`}>
                    <span>Cook</span>
                  </button>
                </div>
                <div className="info-row">
                  <span><MdAccessTime /> Time: {(recipe.prepTime || 0) + (recipe.cookTime || 0)} mins</span>
                  <span><MdGroup /> Serves: {recipe.serves}</span>
                  <span><MdLocalFireDepartment /> Calories: {recipe.calories}</span>
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

export default Recipes;
