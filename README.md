---

# OpenMic AI: Patient Appointment Confirmation Agent

This web application is designed to automate the process of confirming patient appointments using a conversational AI agent powered by **OpenMic AI**. It allows healthcare administrators to manage patients, create custom bots, and initiate automated calls to confirm, reschedule, or cancel appointments, updating the status in real-time.

---

## ✨ Features

- **Automated Appointment Calls**: Initiate AI-powered calls to patients to manage their appointments.
- **Dynamic Patient Management**: Add new patients on the fly.
- **Customizable AI Agents**: Create and configure different AI bots with unique prompts and purposes.
- **Real-time Status Updates**: The application reflects changes to appointment statuses immediately after a call concludes.
- **Interactive Voice Response (IVR)**: The AI agent verifies patient identity and handles multiple outcomes like confirmation, cancellation, or rescheduling.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/)
- **AI Agent**: [OpenMic AI](https://www.openmic.ai/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [ShadCN/UI](https://ui.shadcn.com/)
- **Database**: [MongoDB](https://www.mongodb.com/)

---

## 🚀 How It Works

The application provides a seamless flow for managing patient appointments through AI-driven calls.

### Flow 1: Confirming an Appointment with an Existing Patient

This is the primary workflow for managing scheduled appointments.

1.  **Select a Patient**: From the dashboard list, choose the patient you wish to contact.
2.  **Choose a Bot**: Select a pre-configured AI bot from the dropdown menu.
3.  **Initiate Call**: Click the **"Initiate Call"** button.
4.  **AI Interaction**: An automated call is placed to the patient.
    - The bot greets the patient and states the purpose of the call (e.g., "I'm calling to confirm your appointment with Dr. Smith on Tuesday at 3 PM.").
    - For verification, the bot asks the patient to state their **Medical ID**.
    - If the ID is correct, the bot proceeds.
    - The bot then asks if the patient wants to **confirm**, **reschedule**, or **cancel** the appointment.
5.  **Status Update**: After the call ends, the appointment status is automatically updated on your dashboard.

### Flow 2: Adding a Custom Patient

Quickly add new patients to the system.

1.  Click the **"Add Patient"** button.
2.  Fill in the form with the patient's **Name** and **Phone Number**.
3.  Click **"Add Patient"** to save.
4.  An appointment is automatically created for the new patient, and they will appear in the main patient list, ready for a call.

### Flow 3: Creating a Custom Bot

Create specialized AI agents for different types of calls.

1.  Click the **"Add Bot"** button.
2.  Fill in the form with a **Name** for the bot, a custom **Prompt** that defines its personality and script, and the relevant **Domain**.
3.  Click **"Add Bot"** to save.
4.  The new bot will now be available in the dropdown list when initiating calls to patients.

---

## 🔧 Technical Flow

Here is a step-by-step breakdown of the backend and AI processes that occur when a call is initiated.

1.  **Call Initiation**: A user clicks "Initiate Call" for a specific patient and bot.
2.  **Pre-Call Personalization**: Before the call is connected, in `pre-call` webhook the system fetches the selected patient's details (e.g., name, appointment time) and injects them into the bot's base prompt. This makes the conversation feel personal and contextual.
3.  **In-Call Webhook for Verification**: During the call, when the bot asks for the patient's Medical ID, the audio stream is processed. The extracted ID is sent to an `in-call` webhook.
    - This webhook contains logic to verify if the spoken Medical ID matches the ID in the patient's record.
    - It returns a boolean response (`verified: true` or `verified: false`) back to the AI agent in real-time.
4.  **Verification Failure**: If `verified: false`, the bot follows instructions to end the call politely (e.g., "I'm sorry, I couldn't verify that ID. I will have a staff member reach out to you directly.").
5.  **Verification Success**: If `verified: true`, the bot proceeds to the next step in its script: asking the patient to confirm, reschedule, or cancel.
6.  **Handling Patient Responses**:
    - **"Confirm"**: The bot provides a confirmation message (e.g., "Thank you\! Your appointment is confirmed. We look forward to seeing you.") and ends the call.
    - **"Reschedule"**: The bot asks for a preferred new date and time. This information is captured for a staff member to follow up.
    - **"Cancel"**: The bot can optionally ask for a reason for the cancellation before ending the call politely.
7.  **Post-Call Webhook & Status Update**: Once the call is disconnected, a `post-call` webhook is triggered. This webhook receives the final outcome of the call (confirmed, canceled, etc.) and updates the appointment status in the MongoDB database. The frontend then reflects this change.

---

## ⚙️ Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- Node.js (v18 or later)
- npm or pnpm or yarn
- MongoDB instance (local or cloud-based)

### Installation

1.  **Clone the repo**

    ```sh
    git clone https://github.com/arshitcc/openmic-ai-bot.git

    cd openmic-ai-bot
    ```

2.  **Install NPM packages**
    ```sh
    npm install
    pnpm install
    ```
3.  **Set up environment variables**
    Create a `.env.local` file in the root of the project and add the following:
    ```env
    MONGODB_URI=your_mongodb_connection_string
    OPENMIC_API_KEY=your_openmic_api_key
    OPENMIC_PHONE_NUMBER=your_openmic_phone_number
    ```
4.  **Run the development server**
    ```sh
    pnpm dev
    npm dev
    yarn dev
    ```
    Open [http://localhost:3000](https://www.google.com/search?q=http://localhost:3000) with your browser to see the result.
