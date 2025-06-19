## Project Setup

Clone the repository and install dependencies:

```sh
git clone https://github.com/Surge-Aina/teamC-frontend.git
cd frontend
npm install
```

## Development Server

To start the frontend development server:

```sh
npm run dev
```

The app will run at [http://localhost:3000](http://localhost:3000).


## .env Configuration

Create a `.env` file in this folder.  
**Make sure to add .env to your .gitignore file**  
Example variables you might need:

```
API_BASE_URL=your_backend_api_url
MONGODB_URI=your_mongodb_uri
```

## Scripts

- `npm run dev` - runs the app in development mode
- `npm test` — launches the test runner
- `npm run build` — builds the app for production


## Notes

- This project uses [Tailwind CSS](https://tailwindcss.com/) for styling.
- Make sure your backend server is running and accessible at the API URL configured in your frontend.

