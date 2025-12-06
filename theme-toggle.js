/**
 * Theme Toggle System
 * - Respects system preference (prefers-color-scheme) by default on first visit
 * - Allows manual override via localStorage
 * - Toggles between light and dark
 * - Button shows next state (not current state)
 */

(function() {
    'use strict';

    const STORAGE_KEY = 'theme-preference';
    const html = document.documentElement;
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const themeLabel = document.getElementById('theme-label');

    // Icon and label mappings (for next state display)
    const THEMES = {
        light: { icon: '○', label: 'Light' },
        dark: { icon: '●', label: 'Dark' }
    };

    /**
     * Get current theme preference from localStorage
     * @returns {string} 'auto', 'light', or 'dark'
     */
    function getThemePreference() {
        return localStorage.getItem(STORAGE_KEY) || 'auto';
    }

    /**
     * Apply theme to document and update button to show NEXT state
     * @param {string} theme - 'auto', 'light', or 'dark'
     */
    function applyTheme(theme) {
        if (theme === 'auto') {
            // Remove data-theme attribute to let CSS media query handle it
            html.removeAttribute('data-theme');
        } else {
            // Set explicit theme
            html.setAttribute('data-theme', theme);
        }

        // Determine what theme is actually active
        let activeTheme;
        if (theme === 'auto') {
            // Check system preference
            activeTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        } else {
            activeTheme = theme;
        }

        // Show the OPPOSITE theme in the button (next state)
        const nextTheme = (activeTheme === 'dark') ? 'light' : 'dark';

        // Update toggle button appearance to show next state
        if (themeIcon && themeLabel) {
            themeIcon.textContent = THEMES[nextTheme].icon;
            themeLabel.textContent = THEMES[nextTheme].label;
        }
    }

    /**
     * Toggle between light and dark themes
     */
    function cycleTheme() {
        const current = getThemePreference();

        // Simple toggle between light and dark
        // If coming from 'auto', determine current state and toggle to opposite
        let next;
        if (current === 'auto') {
            // Check what's currently active and toggle to opposite
            const isCurrentlyDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            next = isCurrentlyDark ? 'light' : 'dark';
        } else {
            // Toggle between saved preferences
            next = (current === 'dark') ? 'light' : 'dark';
        }

        localStorage.setItem(STORAGE_KEY, next);
        applyTheme(next);
    }

    /**
     * Initialize theme on page load
     */
    function init() {
        const savedTheme = getThemePreference();
        applyTheme(savedTheme);

        // Add event listener to toggle button
        if (themeToggle) {
            themeToggle.addEventListener('click', cycleTheme);
        }
    }

    // Initialize immediately to prevent flash
    init();

    // Listen for system theme changes (only affects 'auto' mode)
    if (window.matchMedia) {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
            if (getThemePreference() === 'auto') {
                // Re-apply to update button label
                applyTheme('auto');
            }
        });
    }
})();
