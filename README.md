# Customer Service Chatbot

An animated customer service chatbot built with React, Vite, TypeScript, and Tailwind CSS. It matches user questions against a keyword-based knowledge base and responds with relevant answers, with full conversation history persisted via Supabase.

## Features

- **Keyword-Matching Engine** — Tokenizes the user's query and scores it against a built-in knowledge base to find the best matching answer.
- **Conversation History** — All messages (user and bot) are saved to Supabase and restored on reload.
- **Typing Indicator** — A bouncing-dots animation simulates the bot "typing" before responding (~800ms delay).
- **Suggested Questions** — Quick-start prompt buttons appear on first load for common questions.
- **Clear Conversation** — One click wipes the chat history from both the UI and the database.
- **Responsive Design** — Works seamlessly across mobile, tablet, and desktop.

## Tech Stack

- **React 18** — UI library
- **Vite 5** — Build tool and dev server
- **TypeScript** — Type safety
- **Tailwind CSS 3** — Styling
- **Lucide React** — Icons
- **Supabase** — Backend for conversation history persistence





## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

1. Extract the ZIP or clone the repository.
2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open the URL shown in your terminal (typically `http://localhost:5173`).


## How the Matching Works

1. The user's message is tokenized into lowercase words (punctuation stripped).
2. Each knowledge base entry is tokenized the same way (question + category).
3. For each entry, the engine counts how many query tokens appear in the entry's tokens.
4. The score is normalized by query length to favor coverage.
5. The entry with the highest normalized score wins, as long as it meets a minimum threshold of 0.15.
6. If no entry meets the threshold, the bot responds with a fallback message directing the user to human support.

## Usage

| Action | How |
| --- | --- |
| Send a message | Type in the input box and press Enter or click the send button |
| Use a suggested question | Click a suggested prompt button on first load |
| Clear conversation | Click the trash icon in the header |

## Build

To create a production build:

```bash
npm run build
```

The output is generated in the `dist/` directory. Preview it with:

```bash
npm run preview
```

This project is  just for educational or demo purposes.
