import type { Recipe } from '@/types/Recipe';
import axios from 'axios';

const API_KEY = '4a17dd59772a4818ba29360973571492 ';
const BASE_URL = 'https://api.spoonacular.com/recipes';

const spoonacularApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    'x-api-key': API_KEY,
  },
});

export const getRecipeByIngredient = async (
  ingredients: string[],
  number: number,
  ranking: number,
  ignorePantry: boolean,
): Promise<Recipe[]> => {
  try {
    const response = await spoonacularApi.get('/findByIngredients', {
      params: {
        ingredients: ingredients.join(',+'),
        number: number,
        ranking: ranking,
        ignorePantry: ignorePantry,
      },
    });
    return response.data.map((recipe: Recipe) => ({
      id: recipe.id,
      title: recipe.title,
      image: recipe.image,
      imageType: recipe.imageType,
      usedIngredientCount: recipe.usedIngredientCount,
      missedIngredientCount: recipe.missedIngredientCount,
      missedIngredients: recipe.missedIngredients,
      usedIngredients: recipe.usedIngredients,
      unusedIngredients: recipe.unusedIngredients,
      likes: recipe.likes,
    }));
  } catch (error) {
    console.error('Error fetching recipes: ', error);
    return [];
  }
};
