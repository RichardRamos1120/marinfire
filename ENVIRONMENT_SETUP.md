# Environment Variables Setup

## Security Notice
API keys are now stored in environment variables to keep them secure and out of version control.

## Setup Instructions

### 1. Create .env file
Copy the example file and add your API keys:
```bash
cp .env.example .env
```

### 2. Add your API keys to .env
Edit the `.env` file and replace the placeholder values:

```
# Stormglass API Key
REACT_APP_STORMGLASS_API_KEY=your_actual_stormglass_api_key_here

# Firebase Configuration
REACT_APP_FIREBASE_API_KEY=your_firebase_api_key_here
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id_here
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id_here
REACT_APP_FIREBASE_APP_ID=your_app_id_here
REACT_APP_FIREBASE_MEASUREMENT_ID=your_measurement_id_here
```

### 3. Get API Keys

#### Stormglass API Key
1. Go to https://stormglass.io/
2. Sign up for an account
3. Copy your API key from the dashboard
4. Paste it into your `.env` file

#### Firebase Configuration
1. Go to Firebase Console: https://console.firebase.google.com/
2. Select your project (marinfire)
3. Go to Project Settings (gear icon)
4. Scroll down to "Your apps" section
5. Find your web app and click the config icon
6. Copy each value into your `.env` file

### 4. Restart Development Server
After adding the API key, restart your development server:
```bash
npm start
```

## Important Notes

- **Never commit .env file**: The `.env` file is in `.gitignore` to prevent API keys from being committed
- **Share .env.example**: This file can be committed to show what environment variables are needed
- **Production deployment**: Make sure to set environment variables in your production environment
- **Validation**: The app will show console errors if API keys are missing

## Environment Variables Used

| Variable | Description | Required |
|----------|-------------|----------|
| `REACT_APP_STORMGLASS_API_KEY` | Stormglass weather API key | Yes |
| `REACT_APP_FIREBASE_API_KEY` | Firebase API key | Yes |
| `REACT_APP_FIREBASE_AUTH_DOMAIN` | Firebase auth domain | Yes |
| `REACT_APP_FIREBASE_PROJECT_ID` | Firebase project ID | Yes |
| `REACT_APP_FIREBASE_STORAGE_BUCKET` | Firebase storage bucket | Yes |
| `REACT_APP_FIREBASE_MESSAGING_SENDER_ID` | Firebase messaging sender ID | Yes |
| `REACT_APP_FIREBASE_APP_ID` | Firebase app ID | Yes |
| `REACT_APP_FIREBASE_MEASUREMENT_ID` | Firebase analytics measurement ID | Yes |

## Troubleshooting

### API Key Not Working
- Check console for error messages
- Verify the API key is correctly copied (no extra spaces)
- Ensure the `.env` file is in the project root
- Restart the development server after changes

### Environment Variable Not Loading
- Variable names must start with `REACT_APP_`
- No spaces around the `=` sign
- No quotes needed around the value
- File must be named `.env` exactly