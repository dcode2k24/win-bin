
# Win-Bin: Smart Recycling Rewards App

Win-Bin is a modern web application designed to encourage and reward users for recycling plastic bottles. It uses AI-powered image recognition to identify bottles, a points system (EcoCoins) to track contributions, and offers tangible rewards that users can redeem with their earnings.

This project is built with a modern tech stack and serves as a powerful demonstration of integrating real-time AI, user authentication, and interactive UI components in a Next.js application.

## Key Features

*   **AI-Powered Bottle Scanner:** Utilizes the device's camera and the Google Gemini AI API to identify plastic bottles in real-time. It can distinguish between branded bottles and generic water bottles, while actively rejecting non-plastic items like glass or steel.
*   **User Authentication & Persistent Data:** A simple and secure login system based on name and mobile number. User data is persisted on the server-side using a flat-file JSON database, ensuring data survives server restarts. User sessions are maintained in the browser's local storage for a seamless experience.
*   **EcoCoin Rewards System:** Users earn "EcoCoins" for every plastic bottle they successfully scan and recycle.
*   **Reward Redemption:** A rewards catalog where users can redeem their EcoCoins for valuable perks, such as:
    *   Discounts on food delivery services (demonstrated with a mock IRCTC interface).
    *   Making an environmental impact by "planting a tree," complete with an engaging animation.
*   **Dynamic & Responsive UI:** Built with ShadCN UI components and Tailwind CSS, the application is fully responsive and provides a clean, modern user experience on both desktop and mobile devices.

## Technology Stack

*   **Framework:** [Next.js](https://nextjs.org/) (with App Router)
*   **Language:** [TypeScript](https://www.typescriptlang.org/)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/) & [ShadCN UI](https://ui.shadcn.com/)
*   **Generative AI:** [Google Gemini](https://ai.google.dev/) via [Genkit](https://firebase.google.com/docs/genkit)
*   **Animations:** [Framer Motion](https://www.framer.com/motion/)
*   **Server-Side Data Store:** Node.js `fs` module with a JSON file (`user-data.json`) to simulate a persistent database.

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

*   Node.js (v18 or later recommended)
*   npm or yarn

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd <repository-name>
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

### Environment Variables

The application uses Google Gemini for its AI capabilities. You will need a Gemini API key to run the AI features.

1.  Create a file named `.env` in the root of the project.
2.  Add your API key to the `.env` file:
    ```
    GEMINI_API_KEY=YOUR_GEMINI_API_KEY
    ```
    You can obtain a key from the [Google AI Studio](https://aistudio.google.com/app/apikey).

### Running the Application

1.  **Start the development server:**
    ```bash
    npm run dev
    ```

2.  Open your browser and navigate to `http://localhost:9002`.

## Project Structure

*   `src/app/`: Contains the main pages of the application using the Next.js App Router.
*   `src/components/`: Houses all the reusable React components, organized by feature (auth, dashboard, ui).
*   `src/ai/`: Contains the Genkit AI flows.
    *   `flows/suggest-bottle-type.ts`: The core AI logic for analyzing bottle images.
*   `src/contexts/`: Includes the React Context for managing global user state (`user-context.tsx`).
*   `src/lib/`: Core utility functions, including the server-side user store (`user-store.ts`).
*   `public/`: Static assets like images and logos.
*   `user-data.json`: The file that acts as the server-side database for user information. It will be created automatically when the first user registers.

