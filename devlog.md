# Angular Reactive Forms

### Create project

Install Angular CLI

    npm install -g @angular/cli@17

Create new Angular project using Angular CLI

    ng new reactive-forms --standalone false

Go to dir

    cd reactive-forms

Install linter

    npx eslint --init

✔ How would you like to use ESLint? · problems
✔ What type of modules does your project use? · esm
✔ Which framework does your project use? · none
✔ Does your project use TypeScript? · Yes
✔ Where does your code run? · browser
✔ What format do you want your config file to be in? · JSON
Local ESLint installation not found.
The config that you've selected requires the following dependencies:

@typescript-eslint/eslint-plugin@latest @typescript-eslint/parser@latest eslint@latest
✔ Would you like to install them now? · No / Yes
✔ Which package manager do you want to use? · npm

Add Material Design

    ng add @angular/material

Create form component

    ng generate component components/form

Create nested form component

    ng generate component components/nested-form
