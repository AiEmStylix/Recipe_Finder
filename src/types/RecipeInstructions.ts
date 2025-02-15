import type { Ingredient } from './Ingredient';

interface Temperature {
  number: number;
  unit: string;
}

interface Equiqment {
  id: number;
  image: string;
  name: string;
  temperature?: Temperature; //Set the temperature to optional
}

interface Length {
  number: number;
  unit: string;
}

interface Step {
  equipment: Equiqment[];
  ingredients: Ingredient[];
  number: number;
  step: string;
  length?: Length;
}

export interface RecipeInstruction {
  name: string;
  steps: Step[];
}
