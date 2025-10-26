// Global appearance function to trigger fade-in animation on an element
export const triggerAppearance = (element, delay = 0) => {
    if (!element) return;

    // Reset classes
    element.classList.remove('site-enter-active');
    element.classList.add('site-enter');

    // Trigger animation after delay
    setTimeout(() => {
        element.classList.add('site-enter-active');
    }, delay);
};
