# Work Order Scheduler – Technical Submission

A high-performance, Gantt-style production scheduler built with **Angular 21**. This application manages complex timeline rendering across multi-year intervals (2026–2027) with dynamic zooming and "Today" tracking capabilities.

## 🚀 How to Run the Application

1.  **Install Dependencies:**
    ```bash
    npm install
    ```
2.  **Start Development Server:**
    ```bash
    ng serve
    ```
3.  **Access the UI:**
    Open your browser to `http://localhost:4200`.

## ⚙️ Setup Requirements

* **Node.js:** v20.x or higher.
* **Angular CLI:** v19.0.0 or higher (compatible with v21 features).
* **Linting:** Run `npm run lint` to verify code quality and style consistency.

## 🧠 Technical Approach

### 1. Timeline Mathematics & Rendering
Rather than using heavy third-party Gantt libraries, I implemented a custom "Daily Pixel" engine to ensure full control over the rendering pipeline.
* **Single Source of Truth:** The system uses a `pxPerDay` variable to synchronize the grid header, the background columns, and the absolute positioning of work order bars.
* **Dynamic Interval Generation:** Using `date-fns`, the grid generates dynamic "increments" (Days, Weeks, or Months). This allows the UI to scale from a micro-view (100px per day) to a macro-view (3px per day) seamlessly.

### 2. Angular 21 Modernization
The application leverages the latest features of the Angular ecosystem to ensure long-term maintainability:
* **Built-in Control Flow:** Utilizes `@for` and `@if` blocks for optimized DOM rendering, replacing legacy structural directives.
* **Functional Injection:** Replaced constructor-based injection with the `inject()` function, aligning with modern standalone component patterns.
* **Standalone Architecture:** Eliminated `NgModule` overhead by using standalone components and direct provider injection.

### 3. Performance Optimization
* **Pre-calculated Metadata:** Properties like `isCurrent` and specific column widths are calculated once during the timescale change event. This prevents expensive string formatting and date comparisons during Angular's change detection cycles.
* **Viewport Management:** Implemented an auto-centering logic using `scrollTo` that calculates the "Today" offset relative to the viewport width, providing immediate visual context upon initialization or zoom.



## 🛠️ Libraries Used

| Library | Purpose |
| :--- | :--- |
| **date-fns** | Used for immutable date manipulation, interval generation (eachDayOfInterval), and precise day-difference calculations. |
| **@ng-select/ng-select** | A lightweight, high-performance dropdown. Chosen for its robust keyboard support and custom template capabilities. |
| **Bootstrap** | Provides the foundational grid system and utility classes for a clean, ERP-grade layout. |
| **typescript-eslint** | Configured with the modern **Flat Config** (`eslint.config.mjs`) to enforce Angular 21 best practices and strict typing. |

---
