# Mr. Vet - Admin Dashboard

Welcome to the Admin Dashboard for Mr. Vet, a sophisticated e-learning platform. This dashboard is built with Next.js and provides a comprehensive set of tools for administrators to manage users, courses, and platform activities with ease and precision.

## ✨ Features

- **📊 Comprehensive Dashboard:** An overview of key platform statistics, including user distribution, course counts, and carnet request statuses.
- **👥 User Management:** Full CRUD (Create, Read, Update, Delete) functionality for all user roles (Students, Instructors, Admins).
- **📚 Course Management:** Easily add, edit, and manage courses, including their sections, pricing, and instructors.
- **💳 Carnet Requests:** A dedicated interface to review, approve, or reject student ID (carnet) verification requests.
- **🎫 Subscriptions Management:** Manually manage student subscriptions to courses.
- **🔔 Notification System:** Send targeted push notifications to all users, specific roles (students/instructors), or individual users.
- **📜 Activity Logs:** Track important actions performed by administrators for accountability and monitoring.
- **⚙️ Admin Settings:** A secure page for administrators to update their own login credentials.
- **🌓 Light & Dark Mode:** A sleek, user-friendly interface with full support for both light and dark themes.
- **📱 Fully Responsive:** A beautiful and functional design that works seamlessly across all devices, from mobile phones to desktops.

## 🚀 Tech Stack

- **Framework:** [Next.js](https://nextjs.org/)
- **UI Library:** [React](https://reactjs.org/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Component Library:** [ShadCN UI](https://ui.shadcn.com/)
- **AI Integration:** [Google Genkit](https://firebase.google.com/docs/genkit)
- **HTTP Client:** [Axios](https://axios-http.com/)
- **Form Management:** [React Hook Form](https://react-hook-form.com/)

---

## 🏁 Getting Started

Follow these instructions to get the project up and running on your local machine for development and testing purposes.

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later recommended)
- `npm` or `yarn`

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd <project-directory>
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

### Environment Setup

This frontend application requires a backend API to function. You must configure the API's base URL in an environment file.

1.  Locate the `.env` file in the root of the project.
2.  You will find the following line:
    ```
    # NEXT_PUBLIC_API_BASE_URL=https://your-api-backend.com
    ```
3.  Uncomment the line by removing the `#` and replace `https://your-api-backend.com` with the actual URL of your running backend server.

### Running the Application

Once the dependencies are installed and the environment is configured, you can start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:9002`.

---

## 👨‍💻 Developed By

**Eng- Angluos Rezq**

This project was meticulously crafted to provide a powerful and elegant administration experience.
