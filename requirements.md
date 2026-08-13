# Requirements Document

## Introduction

The Todo List Life Dashboard is a personal productivity web application that runs entirely in the browser with no backend or server-side dependencies. It combines four core productivity widgets — a time/greeting display, a Pomodoro focus timer, a task manager, and a quick-links launcher — into a single, clean dashboard interface. All user data is persisted using the browser's Local Storage API. The application is built with HTML, CSS, and Vanilla JavaScript only, and is compatible with modern desktop browsers.

---

## Glossary

- **Dashboard**: The main single-page interface presenting all four productivity widgets.
- **Greeting_Widget**: The UI component that displays the current date, time, and a time-based greeting message.
- **Focus_Timer**: The Pomodoro-style countdown timer widget with 25-minute sessions.
- **Todo_List**: The task management widget that allows adding, editing, completing, and deleting tasks.
- **Quick_Links**: The widget that displays user-configured shortcut buttons that open favorite URLs.
- **Local_Storage**: The browser's `window.localStorage` API used for all client-side data persistence.
- **Task**: A single to-do item containing a text description and a completion status.
- **Link_Entry**: A user-defined record containing a display label and a URL for the Quick Links widget.
- **Session**: A single 25-minute Focus Timer countdown interval.
- **Active_Task**: A task whose completion status is `false`.
- **Completed_Task**: A task whose completion status is `true`.

---

## Requirements

---

### Requirement 1: Dashboard Layout and Rendering

**User Story:** As a user, I want a single-page dashboard that loads instantly in my browser, so that I can access all productivity tools in one place without any installation or setup.

#### Acceptance Criteria

1. THE Dashboard SHALL render fully within a single HTML file that references exactly one CSS file located in `css/` and exactly one JavaScript file located in `js/`.
2. THE Dashboard SHALL display all four widgets — Greeting_Widget, Focus_Timer, Todo_List, and Quick_Links — simultaneously on a single page without requiring navigation or page reloads.
3. WHEN the Dashboard is loaded, THE Dashboard SHALL present a layout where each widget is visually separated by a distinct border or background contrast, all body text is at minimum 14px, and all interactive elements are reachable without scrolling on viewports of 1280px width or wider.
4. THE Dashboard SHALL function correctly in the latest stable releases of Chrome, Firefox, Edge, and Safari without polyfills or transpilation.
5. WHEN the browser window is resized, THE Dashboard SHALL reflow all four widgets to remain fully visible and operable without horizontal scrolling at any viewport width between 320px and 2560px.
6. WHEN the Dashboard is loaded from the local filesystem without a server, THE Dashboard SHALL display all four widgets with correct styles and behavior within 3 seconds on a machine with no active network connection.

---

### Requirement 2: Greeting Widget — Time and Date Display

**User Story:** As a user, I want to see the current time, date, and a personalized greeting, so that I feel oriented and welcomed each time I open the dashboard.

#### Acceptance Criteria

1. THE Greeting_Widget SHALL display the current local time in HH:MM:SS format, updated every second.
2. THE Greeting_Widget SHALL display the current local date in a human-readable format that includes the full weekday name, day, month name, and year (e.g., "Wednesday, 13 August 2025").
3. IF the local time is between 05:00 (inclusive) and 11:59:59 (inclusive), THEN THE Greeting_Widget SHALL display the message "Good Morning".
4. IF the local time is between 12:00 (inclusive) and 17:59:59 (inclusive), THEN THE Greeting_Widget SHALL display the message "Good Afternoon".
5. IF the local time is between 18:00 (inclusive) and 20:59:59 (inclusive), THEN THE Greeting_Widget SHALL display the message "Good Evening".
6. IF the local time is between 21:00 (inclusive) and 04:59:59 (inclusive, crossing midnight), THEN THE Greeting_Widget SHALL display the message "Good Night".
7. WHEN one second has elapsed, THE Greeting_Widget SHALL update the displayed time and greeting without altering the layout or content of other widgets on the dashboard.
8. IF the system clock is unavailable, THEN THE Greeting_Widget SHALL display an error message indicating that the time cannot be retrieved, and shall not display a time, date, or greeting value.

---

### Requirement 3: Focus Timer — Pomodoro Session

**User Story:** As a user, I want a 25-minute countdown timer with Start, Stop, and Reset controls, so that I can structure my work into focused sessions.

#### Acceptance Criteria

1. WHEN the Focus_Timer is first rendered, THE Focus_Timer SHALL display a countdown value of 25:00 (twenty-five minutes and zero seconds).
2. WHEN the user activates the Start control, THE Focus_Timer SHALL begin decrementing the displayed countdown by one second per real-world second.
3. WHILE the Focus_Timer is counting down, THE Focus_Timer SHALL update the displayed MM:SS value once per second with no accumulated drift exceeding 1 second over a 25-minute session.
4. WHEN the user activates the Stop control, THE Focus_Timer SHALL pause the countdown at the current displayed value without resetting it.
5. WHEN the user activates the Reset control, THE Focus_Timer SHALL stop any active countdown and restore the displayed value to 25:00.
6. WHEN the countdown reaches 00:00, THE Focus_Timer SHALL stop automatically and display a visible in-page indicator (e.g., a message such as "Session complete!") that requires no user interaction to appear.
7. WHILE the Focus_Timer is counting down, THE Focus_Timer SHALL disable the Start control to prevent duplicate timer instances.
8. WHILE the Focus_Timer is paused or reset, THE Focus_Timer SHALL disable the Stop control.
9. WHEN the countdown reaches 00:00 and stops automatically, THE Focus_Timer SHALL disable the Stop control and re-enable the Start and Reset controls.
10. THE Focus_Timer SHALL NOT require page reload to start a new session after the previous session ends or is reset.

---

### Requirement 4: To-Do List — Task Management

**User Story:** As a user, I want to add, edit, complete, and delete tasks that persist across browser sessions, so that I can track my daily responsibilities reliably.

#### Acceptance Criteria

1. WHEN the user submits a non-empty task description (1–500 characters) via the input field, THE Todo_List SHALL add a new Active_Task and display it in the task list.
2. IF the user submits an empty or whitespace-only task description, THEN THE Todo_List SHALL reject the submission and display an inline validation message without adding a task.
3. WHEN the user activates the complete control on an Active_Task, THE Todo_List SHALL update that task's status to completed and apply strikethrough text styling to distinguish it from Active_Tasks.
4. WHEN the user activates the complete control on a Completed_Task, THE Todo_List SHALL restore that task's status to active and remove the strikethrough text styling.
5. WHEN the user activates the edit control on a task, THE Todo_List SHALL present the task's current description in an editable field pre-populated with the existing text, and SHALL display a cancel control to discard the edit.
6. WHEN the user confirms an edit with a non-empty description (1–500 characters), THE Todo_List SHALL update the task's stored description and refresh the displayed task text.
7. IF the user confirms an edit with an empty or whitespace-only description, THEN THE Todo_List SHALL reject the edit and retain the task's previous description.
8. WHEN the user activates the cancel control during an edit, THE Todo_List SHALL discard all changes and restore the task to its previous display mode and description without modifying Local_Storage.
9. WHEN the user activates the delete control on a task, THE Todo_List SHALL permanently remove that task from the list and from Local_Storage.
10. WHEN any task is added, edited, completed, or deleted, THE Todo_List SHALL synchronize the full task list to Local_Storage before the operation's visual change is rendered.
11. IF the Local_Storage write operation fails, THEN THE Todo_List SHALL display an inline error message indicating that the task could not be saved, and SHALL NOT apply the visual change that would misrepresent the persisted state.
12. WHEN the Dashboard loads, THE Todo_List SHALL read all previously saved tasks from Local_Storage and render them in the same order and state as when they were last saved.
13. IF Local_Storage contains no task data, THEN THE Todo_List SHALL render an empty list with no error.

---

### Requirement 5: Quick Links — Favorite Website Shortcuts

**User Story:** As a user, I want to add and manage buttons that open my favorite websites, so that I can launch frequently visited pages with a single click.

#### Acceptance Criteria

1. WHEN the user submits a Link_Entry with a label (1–100 characters) and a URL (1–2048 characters), and the total number of saved Link_Entries is fewer than 50, THE Quick_Links widget SHALL add a new shortcut button displaying the label and save the Link_Entry to Local_Storage.
2. IF the user submits a Link_Entry with an empty label, a label exceeding 100 characters, an empty URL, or a URL exceeding 2048 characters, THEN THE Quick_Links widget SHALL reject the submission and display an inline validation message adjacent to the invalid field indicating the specific violated constraint.
3. IF the user submits a Link_Entry whose URL does not begin with `http://` or `https://`, THEN THE Quick_Links widget SHALL automatically prepend `https://` to the URL before saving.
4. WHEN the user activates a shortcut button, THE Quick_Links widget SHALL open the associated URL in a new browser tab.
5. WHEN the user activates the delete control on a shortcut button, THE Quick_Links widget SHALL permanently remove that Link_Entry from the display and from Local_Storage.
6. WHEN any Link_Entry is added or deleted, THE Quick_Links widget SHALL confirm the Local_Storage write succeeds before updating the display.
7. IF the Local_Storage write operation fails when adding or deleting a Link_Entry, THEN THE Quick_Links widget SHALL display an inline error message and SHALL NOT update the display to misrepresent the persisted state.
8. IF the user submits a Link_Entry whose URL (after any `https://` prepend) is identical to a URL already saved in Local_Storage, THEN THE Quick_Links widget SHALL reject the submission and display an inline validation message indicating the URL already exists.
9. WHEN the Dashboard loads, THE Quick_Links widget SHALL read all previously saved Link_Entries from Local_Storage and render a shortcut button for each entry.
10. IF Local_Storage contains no Quick_Links data, THEN THE Quick_Links widget SHALL render an empty links area with no error.

---

### Requirement 6: Local Storage Data Integrity

**User Story:** As a user, I want my tasks and quick links to survive browser restarts and tab closures, so that I never lose my data unexpectedly.

#### Acceptance Criteria

1. THE Dashboard SHALL store all Task data under the dedicated Local_Storage key `tld_tasks` as a JSON-serialized array.
2. THE Dashboard SHALL store all Link_Entry data under the dedicated Local_Storage key `tld_links` as a JSON-serialized array.
3. WHEN data is written to Local_Storage, THE Dashboard SHALL serialize the complete updated array as valid JSON before the operation is considered complete.
4. WHEN data is read from Local_Storage and the key is present and its value is a valid JSON array, THE Dashboard SHALL parse it and produce an array with the same count of items, identical field values, and identical completion statuses as the serialized source.
5. IF the value for `tld_tasks` or `tld_links` in Local_Storage is absent, null, malformed JSON, or not an array, THEN THE Dashboard SHALL discard the value, initialize the affected widget with an empty dataset, and continue normal operation without throwing an unhandled exception.

---

### Requirement 7: Performance and Responsiveness

**User Story:** As a user, I want the dashboard to feel fast and responsive at all times, so that it does not distract me from my work.

#### Acceptance Criteria

1. WHEN the Dashboard page is loaded from the local file system or a static web server with a warm browser cache on a device with a dual-core 2.0 GHz CPU, 4 GB RAM, and a modern browser, THE Dashboard SHALL become interactive within 2 seconds.
2. WHEN the user interacts with any widget control (button click, form submit, checkbox toggle), THE Dashboard SHALL reflect the updated state in the UI within 100 milliseconds.
3. IF a widget interaction fails to update the UI within 100 milliseconds, THEN THE Dashboard SHALL display an observable error indication within the affected widget without disrupting other widgets.
4. WHILE the Focus_Timer is counting down, THE Dashboard SHALL maintain UI responsiveness for all other widgets with no interaction latency exceeding 100 milliseconds.
5. THE Dashboard SHALL NOT load any external fonts, scripts, stylesheets, or other resources that would require a network connection for the application to function.
