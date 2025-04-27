# Drag and Drop Form Builder

A web application allowing users to visually build custom forms using drag-and-drop components and then fill out those forms.

## Tech Stack

*   **Frontend:** React, TypeScript, Material UI, Vite, dnd-kit
*   **Backend:** Node.js, Express
*   **Database:** MySQL

## Project Structure

*   `/client`: Contains the React frontend application.
*   `/server`: Contains the Node.js/Express backend API and database logic.

## Setup Instructions

1.  **Clone the Repository:**
    ```bash
    git clone https://github.com/vvaskin/DnDFormBuilder
    cd DnDFormBuilder
    ```

2.  **Set Up Backend:**
    *   Navigate to the server directory:
        ```bash
        cd server
        ```
    *   Install dependencies:
        ```bash
        npm install
        ```
    *   Create a `.env` file by copying the example:
        ```bash
        cp .env.example .env
        ```
    *   Edit the `.env` file with your actual MySQL database credentials:
        ```env
        MYSQL_HOST=your_host (e.g., localhost)
        MYSQL_USER=your_db_user
        MYSQL_PASSWORD=your_db_password
        MYSQL_DATABASE=your_db_name
        ```
    *   Ensure your MySQL server is running and the specified database exists.
    *   Initialize the database schema using the provided file:
        ```bash
        # Navigate to the server directory first if you aren't already there
        mysql -u your_db_user -p your_db_name < schema.sql
        # Enter your_db_password when prompted
        ```

3.  **Set Up Frontend:**
    *   Navigate to the client directory from the project root:
        ```bash
        cd ../client
        ```
    *   Install dependencies:
        ```bash
        npm install
        ```

## Running the Application

1.  **Start the Backend Server:**
    *   Open a terminal in the `/server` directory.
    *   Run the start command:
        ```bash
        npm run dev
        ```
    *   The server will run on `http://localhost:3000`.

2.  **Start the Frontend Development Server:**
    *   Open a *separate* terminal in the `/client` directory.
    *   Run the development command:
        ```bash
        npm run dev
        ```
    *   The client should typically run on `http://localhost:5173`. Open this address in your web browser.
  
## How it Was Built (Overview)

*   **Backend (`server`):**
    *   An Express.js server provides API endpoints for form management (CRUD operations) and response submission.
    *   It connects to a MySQL database using the `mysql2` library to persist form structures and user responses.
    *   Form component configurations are stored as JSON within the database.
*   **Frontend (`client`):**
    *   Built with React and TypeScript, bootstrapped with Vite.
    *   Uses Material UI for UI components and styling.
    *   **Form Builder:**
        *   Leverages the `dnd-kit` library for drag-and-drop functionality, allowing users to reorder form components.
        *   Components like `TextInput`, `MultipleChoice`, and `Table` manage their specific configurations.
        *   The main `FormBuilder` component orchestrates adding, deleting, updating, and reordering components, and saves/updates the form structure via API calls to the backend.
        *   Conditional logic configuration is handled within the `MultipleChoice` component.
    *   **Form Preview/Filler:**
        *   The `FormPreview` component fetches a specific form's structure by ID.
        *   It dynamically renders the appropriate preview component (`TextInputPreview`, `MultipleChoicePreview`, `TablePreview`) based on the fetched configuration.
        *   State management (`useState`, `useCallback`) handles user input and component navigation.
        *   Complex navigation logic includes handling conditional branching and history for the "Previous" button.
        *   Form responses are collected and submitted to the backend API and stored in the `response` table.
    *   **Routing:** Uses `react-router-dom` for client-side routing between the home page, builder, and preview views.