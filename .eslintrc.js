module.exports = {
    "env": {
        "browser": true,
        "es2021": true
    },
    "extends": [
        "plugin:@typescript-eslint/recommended",
        "standard-with-typescript",
        "plugin:jsx-a11y/recommended", 
        "prettier"
    ],
    "overrides": [
        {
            "env": {
                "node": true
            },
            "files": ["src/**/*.ts", "src/**/*.tsx"],
            "parserOptions": {
                "sourceType": "script"
            }
        }
    ],
    "parser": '@typescript-eslint/parser', 
    "parserOptions": {
        "ecmaVersion": "latest",
        "sourceType": "module",
        "project": "./tsconfig.eslint.json"
    },
    "plugins": [
        'jsx-a11y', 
        '@typescript-eslint'
    ],
    "rules": {
        "@typescript-eslint/explicit-function-return-type": "off",
        "indent": ['error', 2],
        "semi": ["error", "never"],
        "@typescript-eslint/semi": ["error", "never"]
    }
}
