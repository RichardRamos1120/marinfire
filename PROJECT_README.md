# Marin Fire React App

This React application is a conversion of the Marin County Fire Services HTML dashboard into a modern React/TypeScript application with Tailwind CSS.

## Project Structure

The app has been organized into reusable components:

### Components Created:

1. **Header** (`/components/Header/Header.tsx`)
   - Main navigation with search functionality
   - Navigation pills for section switching

2. **AlertBanner** (`/components/AlertBanner/AlertBanner.tsx`)
   - Displays fire weather warnings and alerts

3. **Section Components** (in `/components/sections/`)
   - **IncidentManagement**: Full implementation with tabs for active incidents, history, Cal Fire network, North Bay IMT, and tools
   - **Weather**: Full implementation with tabs for current conditions, alerts, lightning activity, and fire cameras
   - **Resources**: Placeholder component (tabs content to be implemented)
   - **Staffing**: Placeholder component (tabs content to be implemented)
   - **Command**: Placeholder component (tabs content to be implemented)

4. **Sidebar Widgets** (`/components/sidebar/`)
   - StatusWidget: System status display
   - WeatherWidget: Current weather summary
   - QuickActions: Action buttons grid
   - RecentIncidents: Recent incident list

5. **Common Components** (`/components/common/`)
   - Tabs: Reusable tabs component

## Running the Application

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build
```

## Next Steps

The following sections need their tab content implemented:
- Resources section tabs (Response, Training, GIS/Maps, Forms, Out of County)
- Staffing section tabs (Current Staffing, Duty Schedule, Training, Reports)
- Command section tabs (Command Structure, Duty Assignments, Communications, Emergency Contacts, Protocols)

The placeholder components have been created with the basic structure, ready for content implementation when needed.

## Styling

The app uses Tailwind CSS for styling, closely matching the original design while making it more maintainable and responsive. Custom animations like `pulse-subtle` have been added to the Tailwind config.