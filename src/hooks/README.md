# Testing Hooks

When testing hooks, it's important to remember the most important rule of hooks - they can only be used within react components. Because of this, we must use a setup function to render an instance of an empty component so that we can access the hook return values outside of the component.
