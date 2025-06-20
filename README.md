# Junes Online Video Game Store

Front End service for Junes dummy online video game store.

This is a dummy online web site that sells video games.

# Prerequisites
- Node.js ≥ 18.18.0  
  (Run `node --version` to check)  
- npm ≥ 9.x, yarn ≥ 1.22, or pnpm ≥ 8.x  
  (Run `npm --version` or `yarn --version`)  
  
# Running the Project Locally

1. Clone the repository
```
git clone https://github.com/Gamers-Blended/junes-fe.git
cd junes-fe
```

2. Install dependencies
```
npm install
```

3. Start development server
```
npm run dev
```

4. Open in your browser
Open the default<br>
[http://localhost:5173](http://localhost:5173)

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ["./tsconfig.node.json", "./tsconfig.app.json"],
      tsconfigRootDir: import.meta.dirname,
    },
  },
});
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from "eslint-plugin-react-x";
import reactDom from "eslint-plugin-react-dom";

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    "react-x": reactX,
    "react-dom": reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs["recommended-typescript"].rules,
    ...reactDom.configs.recommended.rules,
  },
});
```
