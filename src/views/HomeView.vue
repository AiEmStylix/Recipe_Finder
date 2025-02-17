<script setup lang="ts">
//Recipe interface
import type { Recipe } from '@/types/Recipe';
import type { RecipeInstruction } from '@/types/RecipeInstructions';

//PrimeVue Components
import Button from 'primevue/button';
import Chip from 'primevue/chip';
import InputGroup from 'primevue/inputgroup';
import Checkbox from 'primevue/checkbox';
import Slider from 'primevue/slider';
import InputNumber from 'primevue/inputnumber';
import Select from 'primevue/select';
import AutoComplete from 'primevue/autocomplete';
import Dialog from 'primevue/dialog';

import { ref } from 'vue';
import {
  autoCompleteIngredient,
  getRecipeByIngredient,
  getRecipeInstruction,
} from '@/services/spoonacular';

//Props
const showDialog = ref(false);
const ignorePantry = ref<boolean>(false);

const newTag = ref<string>('');
const suggestions = ref<string[]>([]);
const tags = ref<{ id: string; name: string }[]>([]);
const recipeNumber = ref<number>(10);
const recipeInstructions = ref<RecipeInstruction[]>([]);

const selectedRecipe = ref<Recipe | null>(null);
const options = ref<{ name: string; ranking: number }[]>([
  { name: 'Maximize Used Ingredients', ranking: 1 },
  { name: 'Minimize Missing Ingredients', ranking: 2 },
]);

const selectedOption = ref<{ name: string; ranking: number }>(
  options.value.find((option) => option.ranking === 1)!,
);

const recipes = ref<Recipe[]>([]);

// Methods
const addTag = (): void => {
  if (newTag.value.trim()) {
    tags.value.push({
      id: `${newTag.value.trim()} - ${Date.now()}`,
      name: newTag.value.trim(),
    }); // Add the tag
    newTag.value = '';
  }
};

// Remove the tag at the specified index
const removeTag = (index: number): void => {
  console.log('Before removing:', [...tags.value]);
  tags.value.splice(index, 1);
  console.log('After removing:', [...tags.value]);
};

const queryApi = async () => {
  if (tags.value.length > 0) {
    try {
      //Clear the existing recipes before new query
      recipes.value = [];

      //Map the ingredients name to array
      const ingredientNames = tags.value.map((tag) => tag.name);
      const response = await getRecipeByIngredient(
        ingredientNames,
        recipeNumber.value,
        selectedOption.value?.ranking,
        ignorePantry.value,
      );
      recipes.value = response;
      console.log(recipes.value);
    } catch (error) {
      console.error('Error fetching data: ', error);
    }
  }
};

const autoComplete = async (event: { query: string }) => {
  try {
    const response = await autoCompleteIngredient(event.query, 10, 'en', false, '');
    suggestions.value = response.map((item: { name: string }) => item.name);
  } catch (error) {
    console.error('Error fetching autocomplete data: ', error);
  }
};

const getInstructions = async (id: number) => {
  try {
    const response = await getRecipeInstruction(id, true);
    recipeInstructions.value = response; // Store the instructions
  } catch (error) {
    console.error('Error fetching recipe instructions: ', error);
  }
};

// Function to open the dialog with selected recipe
const openRecipeDialog = async (recipe: Recipe) => {
  selectedRecipe.value = recipe;
  recipeInstructions.value = [];
  await getInstructions(recipe.id);
  showDialog.value = true;
};
</script>

<template>
  <div class="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
    <div class="container w-full max-w-2xl p-6 bg-white rounded-lg shadow-lg">
      <h1 class="mb-6 text-2xl font-bold text-center">Spoonacular Recipe</h1>

      <!-- Input for adding ingredients -->
      <div class="my-4">
        <InputGroup>
          <AutoComplete id="ingredients" v-model="newTag" :suggestions="suggestions" @keyup.enter="addTag"
            @item-select="addTag" @complete="autoComplete" class="w-full" placeholder="Search ingredients" />
          <Button label="Add Ingredients" icon="pi pi-plus-circle" icon-pos="right" @click="addTag" />
        </InputGroup>
      </div>

      <!-- Tags container -->
      <div class="flex flex-wrap gap-2 mb-6 tags-container">
        <Chip v-for="(tag, index) in tags" :key="tag.id" :label="tag.name" removeIcon="pi pi-times-circle" removable
          @remove="removeTag(index)" />
      </div>

      <!-- Ignore Pantry checkbox -->
      <InputGroup class="my-4">
        <Checkbox v-model="ignorePantry" binary input-id="ignorePantry" />
        <label class="px-3" for="ignorePantry">Ignore Pantry</label>
      </InputGroup>

      <!-- Options dropdown -->
      <InputGroup class="my-4">
        <Select v-model="selectedOption" :options="options" optionLabel="name" placeholder="Select options" checkmark
          :highlightOnSelect="false" class="w-full" />
      </InputGroup>

      <!-- Number of recipes input and slider -->
      <div class="flex flex-col items-center my-4">
        <label class="px-3" for="input-id">Number of Recipe</label>
        <InputNumber v-model="recipeNumber" :min="1" :max="100" class="my-3" input-id="number"
          input-class="w-[3.25rem] text-center" />
        <Slider v-model="recipeNumber" :min="1" :max="100" class="w-full my-3" />
      </div>

      <!-- Query API button -->
      <div class="flex justify-center">
        <Button label="Query Spoonacular API" @click="queryApi" class="mt-4" />
      </div>
    </div>

    <!-- Recipes Display -->
    <div v-if="recipes.length" class="mt-6 max-w-96">
      <h2 class="mb-4 text-xl font-semibold text-center">Recipes</h2>
      <ul class="space-y-4">
        <li v-for="recipe in recipes" :key="recipe.id" class="p-4 border rounded-lg shadow">
          <h3 class="text-lg font-bold">{{ recipe.title }}</h3>
          <img :src="recipe.image" :alt="recipe.title" class="object-cover w-full h-40 mt-2 rounded-md" />
          <p class="mt-2 text-sm text-gray-700">
            Used Ingredients ({{ recipe.usedIngredientCount }}):
            <span v-if="recipe.usedIngredients && recipe.usedIngredients.length">
              {{recipe.usedIngredients.map((ingredient) => ingredient.name).join(', ')}}
            </span>
          </p>
          <br />
          <p class="text-sm text-gray-700">
            Missed Ingredients ({{ recipe.missedIngredientCount }}):
            <span v-if="recipe.missedIngredients && recipe.missedIngredients.length">
              {{recipe.missedIngredients.map((ingredient) => ingredient.name).join(', ')}}
            </span>
          </p>
          <div class="flex items-center gap-2 mt-2">
            <i class="text-red-500 pi pi-heart"></i>
            <span class="text-sm text-gray-700">{{ recipe.likes }}</span>
          </div>
          <div class="flex flex-row justify-between">
            <Button label="Like" icon="pi pi-thumbs-up" class="mt-2" />
            <Button label="View Recipe" icon="pi pi-eye" class="mt-2" @click="openRecipeDialog(recipe)" />
          </div>
        </li>
      </ul>
    </div>

    <!-- Recipe Dialog -->
    <Dialog v-model:visible="showDialog" modal header="Recipe Details" :style="{ width: '50vw' }">
      <template v-if="selectedRecipe">
        <div class="p-4">
          <img :src="selectedRecipe.image" :alt="selectedRecipe.title"
            class="object-cover w-full h-64 mb-4 rounded-md" />
          <h2 class="text-2xl font-bold">{{ selectedRecipe.title }}</h2>

          <!-- Used Ingredients -->
          <h3 class="mt-4 text-lg font-semibold">Used Ingredients:</h3>
          <ul class="pl-5 list-disc">
            <li v-for="ingredient in selectedRecipe.usedIngredients" :key="ingredient.id">
              {{ ingredient.amount }} {{ ingredient.unitShort }} - {{ ingredient.name }}
            </li>
          </ul>

          <!-- Missed Ingredients -->
          <h3 class="mt-4 text-lg font-semibold">Missed Ingredients:</h3>
          <ul class="pl-5 list-disc">
            <li v-for="ingredient in selectedRecipe.missedIngredients" :key="ingredient.id">
              {{ ingredient.amount }} {{ ingredient.unitShort }} - {{ ingredient.name }}
            </li>
          </ul>

          <!-- Instructions -->
          <h3 class="mt-4 text-xl font-semibold">Instructions:</h3>
          <ul class="pl-2 list-none">
            <template v-if="recipeInstructions.length">
              <li v-for="(instruction, index) in recipeInstructions" :key="index">
                <h4 class="font-semibold">{{ instruction.name }}</h4>
                <ul class="list-none">
                  <li class="my-2" v-for="(step, stepIndex) in instruction.steps" :key="stepIndex">
                    <span class="font-bold">Step {{ step.number }}:</span>
                    {{ step.step }}
                  </li>
                </ul>
              </li>
            </template>
            <template v-else>
              <p class="text-gray-500">No instructions available.</p>
            </template>
          </ul>

          <div class="flex justify-end mt-4">
            <Button label="Close" icon="pi pi-times" @click="showDialog = false" />
          </div>
        </div>
      </template>
    </Dialog>
  </div>
</template>
