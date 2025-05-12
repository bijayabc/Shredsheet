# ShredSheet - Fitness Tracking Application

ShredSheet is a comprehensive web application for tracking workouts, managing exercise routines, and monitoring fitness progress. Built with React and Node.js, it provides a user-friendly interface for maintaining your fitness journey.

## Features

- **User Authentication**: Secure login and registration system
- **Workout Logging**: Track your daily workouts with detailed exercise information
- **Custom Routines**: Create and manage workout routines
- **Exercise Management**: 
  - Record sets, reps, and weights for each exercise
  - Track one-rep max (1RM) for strength exercises
  - Add notes for each exercise
- **Profile Management**: Update personal information and track progress

## Tech Stack

### Frontend
- React.js
- React Router for navigation
- TailwindCSS for styling
- Axios for API requests
- React Icons
- React Toastify for notifications
- Vite for build tooling

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- Bcrypt for password hashing
- CORS support

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB installed and running
- npm or yarn package manager

### Installation

1. Clone the repository
```bash
git clone https://github.com/bijayabc/Shredsheet
``` 

2. Install backend dependencies
```bash
npm install
``` 

3. Install frontend dependencies
```bash
cd src
npm install
``` 

4. Create .env files in both the root and src/ directories. Copu variables from the respective .env.example files and fill in your actual credentials and configuration values.

### Running the Application

1. Start the backend server.
```bash
npm run dev
``` 
2. In a separate terminal, start the frontend development server
```bash 
cd src
npm run dev
``` 
The application will be available at http://localhost:5173

## Project Structure

fitness-tracker/
├── server/
│ ├── controllers/
│ │ ├── routineController.js
│ │ └── workoutController.js
│ ├── models/
│ │ ├── user.js
│ │ ├── routine.js
│ │ └── workout.js
│ └── routes/
│ └── apiRoutes.js
├── src/
│ ├── components/
│ │ ├── RoutineInfo.jsx
│ │ ├── WorkoutCard.jsx
│ │ ├── WorkoutsList.jsx
│ │ ├── WorkoutForm.jsx
│ │ └── WorkoutInfo.jsx
│ ├── api/
│ ├── assets/
│ ├── App.jsx
│ ├── main.jsx
│ └── index.html
├── package.json
└── README.md

## Feedback & Contributions

If you find this project useful or have suggestions to improve it, I’d love to hear from you!  
Feel free to [open an issue](https://github.com/bijayabc/Shredsheet/issues) for feedback, feature requests, or bug reports.

You're also welcome to fork the repository and contribute. Let's make it better together!

Alternatively, you can email me directly at [bijayabc1234@gmail.com](mailto:bijayabc1234@gmail.com) for any inquiries or feedback.


