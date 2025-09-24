# RC Planes Manager

## Overview
RC Planes Manager is a web application designed to help users manage a database of remote-controlled (RC) planes. The application allows users to add, view, and edit planes and their components through an intuitive and appealing user interface.

## Features
- **Add RC Planes**: Users can add new RC planes with details such as name and components (Motor, ESC, Battery, Servos, etc.).
- **View RC Planes**: A comprehensive list of all RC planes is available for users to view.
- **Edit RC Planes**: Users can select a plane to edit its details and components.
- **User-Friendly Interface**: The application is designed with an appealing user interface for a seamless experience.

## Project Structure
```
rc-planes-manager
├── src
│   ├── App.tsx               # Main component with routing setup
│   ├── index.tsx             # Entry point of the application
│   ├── components             # Contains reusable components
│   │   ├── PlaneList.tsx     # Displays a list of RC planes
│   │   ├── PlaneForm.tsx     # Form for adding new RC planes
│   │   └── ComponentEditor.tsx# Interface for editing components
│   ├── pages                 # Contains page components
│   │   ├── Home.tsx          # Homepage component
│   │   ├── AddPlane.tsx      # Page for adding a new plane
│   │   └── EditPlane.tsx     # Page for editing a selected plane
│   ├── types                 # TypeScript interfaces
│   │   └── index.ts          # Defines data structures
│   ├── services              # Functions for managing planes data
│   │   └── planesService.ts   # API for planes management
│   └── styles                # CSS styles for the application
│       └── main.css          # Main stylesheet
├── public
│   └── index.html            # Main HTML file
├── package.json              # npm configuration file
├── tsconfig.json             # TypeScript configuration file
└── README.md                 # Project documentation
```

## Getting Started
1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```
   cd rc-planes-manager
   ```
3. Install dependencies:
   ```
   npm install
   ```
4. Start the application:
   ```
   npm start
   ```

## License
This project is licensed under the MIT License.