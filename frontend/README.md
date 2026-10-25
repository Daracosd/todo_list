# Todo List Frontend

The Angular client for the Todo List application. It expects the Django API to be available at `http://localhost:8000/api/todos/`.

## Run locally

Install dependencies and start the development server:

```powershell
npm install
npm start
```

Open `http://localhost:4200`. Start the backend separately; setup instructions are in the [repository README](../README.md).

## Build and test

```powershell
npm run build
npm test
```

The app uses Angular 21 and Vitest for unit tests.
