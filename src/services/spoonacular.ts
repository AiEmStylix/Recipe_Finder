import type { Recipe } from '@/types/Recipe';
import type { AutoCompleteIngredient } from '@/types/AutoCompleteIngredient';
import axios from 'axios';

const API_KEY = '4a17dd59772a4818ba29360973571492 ';

const BASE_RECIPES_URL = 'https://api.spoonacular.com/recipes';
const BASE_INGREDIENT_URL = 'https://api.spoonacular.com/food/ingredients';

const spoonacularRecipeApi = axios.create({
  baseURL: BASE_RECIPES_URL,
  headers: {
    'x-api-key': API_KEY,
  },
});

const spoonacularIngredientAPI = axios.create({
  baseURL: BASE_INGREDIENT_URL,
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
    const response = await spoonacularRecipeApi.get('/findByIngredients', {
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

export const autoCompleteIngredient = async (
  query: string,
  number: number,
  language: string,
  metaInformation: boolean,
  intolerances: string,
): Promise<AutoCompleteIngredient[]> => {
  try {
    const response = await spoonacularIngredientAPI.get('/autocomplete', {
      params: {
        query: query,
        number: number,
        language: language,
        metaInformation: metaInformation,
        intolerances: intolerances,
      },
    });
    return response.data.map((ingredient: AutoCompleteIngredient) => ({
      name: ingredient.name,
      image: ingredient.image,
      id: ingredient.id,
      aisle: ingredient.aisle,
      possibleUnits: ingredient.possileUnit,
    }));
  } catch (error) {
    console.error('Error fetching data: ', error);
    return [];
  }
};
