# VoiceCompus

VoiceCompus is a comprehensive platform designed to facilitate communication within a campus or organization. It allows users to submit reports, make suggestions, and engage with the community through voting and feedback. The system features dedicated dashboards for administrators and departmental managers to oversee and respond to submissions efficiently.

## Features

- **User Reporting:** Submit reports regarding various issues or topics.
- **Suggestions System:** Propose ideas and suggestions for improvement.
- **Voting Mechanism:** Community voting on suggestions (`SuggestionVote`).
- **Departmental Management:** Organized by Departments and Locations.
- **Role-Based Access:**
  - **User:** Submit reports/suggestions.
  - **Admin:** Global system administration.
  - **Departmental Admin:** Manage specific department activities.
- **Dashboards:** Dedicated views for Admins and Departmental Admins.

## Tech Stack

### Frontend
- **Framework:** React
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **Routing:** React Router (inferred from pages structure)

### Backend
- **Framework:** Laravel
- **Database:** MySQL (implied by standard Laravel setup)
- **API:** RESTful API with Sanctum authentication

## Project Structure

- `backend/`: Contains the Laravel backend application code.
- `src/`: Contains the React frontend application code.
- `public/`: Static assets.

## Getting Started

### Prerequisites
- Node.js & npm
- PHP & Composer
- MySQL or compatible database

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install PHP dependencies:
   ```bash
   composer install
   ```
3. Copy the environment file and configure your database settings:
   ```bash
   cp .env.example .env
   ```
4. Generate the application key:
   ```bash
   php artisan key:generate
   ```
5. Run database migrations:
   ```bash
   php artisan migrate
   ```
6. Start the development server:
   ```bash
   php artisan serve
   ```

### Frontend Setup

1. Navigate to the root directory (where `package.json` is located):
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```

## License

[MIT](https://choosealicense.com/licenses/mit/)
