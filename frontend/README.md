# Sentinel Scribe Frontend Interface

The frontend application for Sentinel Scribe serves as the primary interface for clinical staff, physicians, and administrative users. It is built to provide a seamless, highly responsive, and accessible user experience for managing patient triage, reviewing AI-generated SOAP documentation, and interacting with the AI Doctor Copilot.

---

### Overview

Designed with modern web architecture principles, this application prioritizes performance and clinical utility. The interface is meticulously crafted to surface critical patient information, such as emergency red flags and priority levels, with zero friction. The integration of a natural language copilot interface allows clinicians to query patient histories dynamically within the same operational context.

---

### Technology Stack

The application leverages a cutting-edge React ecosystem to ensure maintainability, type safety, and optimal rendering performance.

- **Framework:** Next.js (version 16)
- **UI Library:** React (version 19)
- **Language:** TypeScript
- **Styling:** Tailwind CSS (version 4)
- **Component Primitives:** Radix UI and Shadcn
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **Data Fetching:** Axios
- **Content Rendering:** React Markdown for parsing AI responses

---

### Design System and UI Architecture

The user interface strictly adheres to a cohesive design system aimed at reducing cognitive load for medical professionals. 

- **Component-Driven Design:** The application utilizes Radix UI primitives wrapped in customized Shadcn components, ensuring accessibility (WAI-ARIA compliance) without sacrificing design flexibility.
- **Dynamic Feedback:** Subtle animations powered by Framer Motion provide tactile feedback during asynchronous operations, such as generating SOAP notes or processing copilot queries.
- **Responsive Layout:** Tailwind CSS is employed to guarantee that the application scales fluidly from desktop administrative terminals to mobile tablets used during clinical rounds.

---

### Development Setup

To run the frontend environment locally, follow the steps outlined below.

1. **Environment Configuration:**
   Copy the example environment variables file and update it with your local or staging backend endpoints.
   ```bash
   cp .env.local.example .env.local
   ```

2. **Install Dependencies:**
   Ensure you are using a compatible Node.js environment, then install the required packages.
   ```bash
   npm install
   ```

3. **Start the Development Server:**
   Launch the Next.js development server with Hot Module Replacement (HMR).
   ```bash
   npm run dev
   ```
   The application will be accessible at http://localhost:3000.

---

### Directory Structure

The repository follows Next.js App Router conventions and feature-based modularity.

- **app:** Contains the routing logic, page layouts, and core views.
- **components:** Houses reusable, presentation-agnostic UI elements (e.g., buttons, dialogs, typography).
- **lib:** Contains utility functions, Axios interceptors, and shared TypeScript interfaces.
- **public:** Static assets including fonts and brand imagery.

---

### State Management and Data Fetching

Data fetching is handled primarily through Axios, structured to seamlessly interface with the Sentinel Scribe FastAPI backend. The application manages local state via React hooks, optimizing re-renders and ensuring that real-time AI inferences (such as incoming copilot responses) are rendered efficiently without blocking the main thread.
