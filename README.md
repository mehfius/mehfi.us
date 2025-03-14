# Mehfi.us Project

## Overview
This project is a web application built with JavaScript, HTML, and CSS, utilizing various modern web technologies. It includes features for authentication, file management, and content processing.

## Key Features
- **Authentication System**
  - User registration and login
  - Social login with GitHub and Google
  - Session management with Supabase
- **File Management**
  - File upload and processing
  - Image resizing and compression
  - Audio file caching
- **Content Processing**
  - Link processing functionality
  - JSON-based element creation
  - Dynamic content loading

## Technologies Used
- **Frontend**
  - Vanilla JavaScript
  - HTML5
  - CSS3
  - Font Awesome Icons
- **Backend Services**
  - Supabase (Authentication and Storage)
  - Socket.IO
- **Utilities**
  - Speedj.js (Dynamic script loading)
  - Moment.js (Date handling)
  - Canvas API (Image processing)

## Project Structure 

## Authentication Flow
The application uses Supabase for authentication with the following features:
- Email/password registration and login
- OAuth with GitHub and Google
- JWT token handling and decoding
- Session management with automatic redirects

## File Handling
- **Audio Files**
  - Caching mechanism using Service Workers
  - Signed URLs for secure access
  - Metadata display (name, date, size, type)
- **Image Processing**
  - Automatic resizing with maximum width constraint
  - Canvas-based compression
  - JPEG quality control

## API Integration
The project integrates with Supabase for:
- User authentication
- File storage
- Database operations
- RPC (Remote Procedure Calls)

## Development Utilities
- **Speedj.js** - Dynamic script loading
- **Moment.js** - Date formatting and manipulation
- **Font Awesome** - Icon library
- **Roboto Font** - Primary typography

## Error Handling
- Comprehensive error handling for:
  - Authentication failures
  - File upload errors
  - API request failures
  - Session management issues

## Security Features
- JWT token validation
- Secure file access with signed URLs
- Input validation for authentication forms
- Protected routes based on authentication state

## Performance Optimization
- Image compression for faster loading
- Audio file caching for repeated access
- Lazy loading of components
- Efficient DOM manipulation with JSON-based element creation

## Environment Configuration
- Development and production URL handling
- Local storage for session management
- Configuration through environment variables
- Cross-origin resource sharing (CORS) support

## Script Loading System
The project uses a custom script loading system with:
- Dynamic script injection
- Error handling for failed loads
- Version control for cache busting
- Conditional loading based on environment

## Future Improvements
- Implement service workers for offline functionality
- Add more OAuth providers
- Enhance file type support
- Improve error handling and user feedback 

## Setup Instructions

### Prerequisites
- Node.js (version X.X.X)
- Supabase account

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/your-repo.git
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Update the `.env` file with your Supabase credentials.

### Configuration
Set up the following global variables in your `index.html`:
```javascript
globalThis.auth = {
    SUPABASE_KEY: "your-supabase-key",
    SUPABASE_URL: "https://your-supabase-url.supabase.co",
    ACCESS_TOKEN: "your-access-token",
    URL_HOST_PRODUCTION: "your-production-domain",
    URL_REDIRECT_PRODUCTION: "https://your-production-domain",
    URL_REDIRECT_DEV: "http://localhost:3001"
};
```

## Project Structure
The project structure includes the following directories and files:
- `src/`: Contains the main application code
- `public/`: Contains static assets
- `config/`: Contains configuration files
- `scripts/`: Contains utility scripts
- `styles/`: Contains CSS styles
- `templates/`: Contains HTML templates
- `tests/`: Contains test files

## Authentication Flow
The application uses Supabase for authentication with the following features:
- Email/password registration and login
- OAuth with GitHub and Google
- JWT token handling and decoding
- Session management with automatic redirects

## File Handling
- **Audio Files**
  - Caching mechanism using Service Workers
  - Signed URLs for secure access
  - Metadata display (name, date, size, type)
- **Image Processing**
  - Automatic resizing with maximum width constraint
  - Canvas-based compression
  - JPEG quality control

## API Integration
The project integrates with Supabase for:
- User authentication
- File storage
- Database operations
- RPC (Remote Procedure Calls)

## Development Utilities
- **Speedj.js** - Dynamic script loading
- **Moment.js** - Date formatting and manipulation
- **Font Awesome** - Icon library
- **Roboto Font** - Primary typography

## Error Handling
- Comprehensive error handling for:
  - Authentication failures
  - File upload errors
  - API request failures
  - Session management issues

## Security Features
- JWT token validation
- Secure file access with signed URLs
- Input validation for authentication forms
- Protected routes based on authentication state

## Performance Optimization
- Image compression for faster loading
- Audio file caching for repeated access
- Lazy loading of components
- Efficient DOM manipulation with JSON-based element creation

## Environment Configuration
- Development and production URL handling
- Local storage for session management
- Configuration through environment variables
- Cross-origin resource sharing (CORS) support

## Script Loading System
The project uses a custom script loading system with:
- Dynamic script injection
- Error handling for failed loads
- Version control for cache busting
- Conditional loading based on environment

## Future Improvements
- Implement service workers for offline functionality
- Add more OAuth providers
- Enhance file type support
- Improve error handling and user feedback 