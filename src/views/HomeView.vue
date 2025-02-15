<script setup lang="ts">
//Recipe interface
import type { Recipe } from '@/types/Recipe';

//PrimeVue Components
import Button from 'primevue/button';
import Chip from 'primevue/chip';
import InputGroup from 'primevue/inputgroup';
import Checkbox from 'primevue/checkbox';
import Slider from 'primevue/slider';
import InputNumber from 'primevue/inputnumber';
import Select from 'primevue/select';

import { ref } from 'vue';
import { autoCompleteIngredient, getRecipeByIngredient } from '@/services/spoonacular';
import { AutoComplete } from 'primevue';

//Props
const newTag = ref<string>('');
const suggestions = ref<string[]>([]);
const tags = ref<string[]>([]);
const ignorePantry = ref<boolean>(false);
const recipeNumber = ref<number>(10);
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
    tags.value.push(newTag.value.trim()); // Add the tag
    newTag.value = '';
  }
};

// Remove the tag at the specified index
const removeTag = (index: number): void => {
  tags.value.splice(index, 1);
};

const queryApi = async () => {
  if (tags.value.length > 0) {
    try {
      const response = await getRecipeByIngredient(
        tags.value,
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
        <Chip v-for="(tag, index) in tags" :key="index" :label="tag" removable @remove="removeTag(index)" />
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
        <InputNumber v-model="recipeNumber" :min="1" :max="100" class="my-3" input-id="number" />
        <Slider v-model="recipeNumber" :min="1" :max="100" class="w-full my-3" />
      </div>

      <!-- Query API button -->
      <div class="flex justify-center">
        <Button label="Query Spoonacular API" @click="queryApi" class="mt-4" />
      </div>
    </div>
  </div>

  <!-- Recipe list -->
  <div class="flex flex-col items-center p-4 bg-gray-100">
    <div class="container w-full max-w-2xl p-6 bg-white rounded-lg shadow-lg">
      <h2 class="">Recipe List</h2>
    </div>
  </div>
</template>
<style scoped>
:deep(.p-inputnumber input) {
  width: 75px !important;
  height: 40px !important;
  font-size: 16px !important;
  text-align: center;
}
</style>
