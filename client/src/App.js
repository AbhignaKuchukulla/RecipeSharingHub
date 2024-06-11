import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import './App.css';
import RootLayout from './RootLayout'
import { lazy, Suspense } from 'react'
import Home from './components/home/Home';
import Signup from './components/signup/Signup';
import Signin from './components/signin/Signin';
import UserProfile from './components/user-profile/UserProfile';
import AuthorProfile from './components/author-profile/AuthorProfile'
import Recipes from './components/recipes/Recipes';
import AdminProfile from './components/admin-profile/AdminProfile';

//import AddRecipe from './components/add-recipe/AddRecipe';
import RecipesByAuthor from './components/recipes-by-author/RecipesByAuthor';
import Recipe from './components/recipe/Recipe';
import ErrorPage from './components/ErrorPage';
//dynamic import of Recipes
//const Recipes = lazy(() => import('./components/recipes/Recipes'))
const AddRecipe = lazy(() => import('./components/add-recipe/AddRecipe'))
function App() {

  const browserRouter = createBrowserRouter([{
    path: '',
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '',
        element: <Home />
      },
      {
        path: '/signup',
        element: <Signup />
      },
      {
        path: "/signin",
        element: <Signin />
      },
      {
        path: "/user-profile",
        element: <UserProfile />,
        children: [
          {
            path: "recipes",
            element: <Recipes />
          },
          {
            path: "recipe/:recipeId",
            element: <Recipe />
          },
          {
            path: '',
            element: <Navigate to='recipes' />
          }
        ]
      },
      {
        path: "/author-profile",
        element: <AuthorProfile />,
        children: [
          {
            path: 'new-recipe',
            element: <Suspense fallback="loading..."><AddRecipe /></Suspense>
          },
          {
            path: 'recipes-by-author/:author',
            element: <RecipesByAuthor />,

          },
          {
            path: "recipe/:recipeId",
            element: <Recipe />
          },
          {
            path: '',
            element: <Navigate to='recipes-by-author/:author' />
          }
        ]
      },
      {
        path: "/admin-profile",
        element: <AdminProfile />,
        children: [
          {
            path: "recipes",
            element: <Recipes />
          },
          {
            path: "recipe/:recipeId",
            element: <Recipe />
          },
          {
            path: '',
            element: <Navigate to='recipes' />
          }
        ]
      }
    ]
  }])

  return (
    <div>
      <RouterProvider router={browserRouter} />
    </div>
  );
}

export default App;
