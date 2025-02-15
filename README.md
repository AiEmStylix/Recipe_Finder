# 📝 Recipe Finder

An app to find the recipe based on ingredient that you provided using Spoonacular API

## 🚀Techonologies Used

- **TypeScript**: Adds type safety and improves developer productivity.
- **Vue 3**: A progressive JavaScript framework for building user interfaces.
- **PrimeVue**: A rich set of UI components for Vue applications.
- **TailwindCSS**: A utility-first CSS framework for rapidly building custom designs.
- **Vitest**: A fast and modern testing framework for Vue applications.
- **Spoonacular API**: Provides access to a vast database of recipes and food-related data

### 🛠️ Prerequisites

- Node.js (v18+)
- npm (v10+) or yarn
- A Spoonacular API key (sign up at [Spoonacular](https://spoonacular.com/food-api) to get your API key)

## 💻️ Project Setup

1. **Clone the repository**:

```sh
git clone https://github.com/AiEmStylix/Recipe_Finder.git
```

2. **Install Dependacies**

```sh
npm install
```

3. **Setup Enviroment Variables**

Create a file name .env in the root folder (outside the src folder) then inside the file adds your spoonacular api key

```env
VITE_SPOONACULAR_APIKEY = your_api_key_here
```

4. **Run the applicaition**

```sh
npm run dev
```

Now the webserver has been running, access it at http://localhost:3000, you can config the port at `vite.config.ts`

## 🪛 Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

### Unit test with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```
