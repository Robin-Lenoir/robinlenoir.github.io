/**
 * Theme Toggle System
 * - Respects system preference (prefers-color-scheme) by default
 * - Allows manual override via localStorage
 * - Cycles through: auto → light → dark → auto
 */

(function() {
    'use strict';

    const STORAGE_KEY = 'theme-preference';
    const html = document.documentElement;
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const themeLabel = document.getElementById('theme-label');

    // Icon and label mappings
    const THEMES = {
        auto: { icon: '●', label: 'Auto' },
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
     * Apply theme to document
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

        // Update toggle button appearance
        if (themeIcon && themeLabel) {
            themeIcon.textContent = THEMES[theme].icon;
            themeLabel.textContent = THEMES[theme].label;
        }
    }

    /**
     * Cycle to next theme: auto → light → dark → auto
     */
    function cycleTheme() {
        const current = getThemePreference();
        let next;

        switch(current) {
            case 'auto':
                next = 'light';
                break;
            case 'light':
                next = 'dark';
                break;
            case 'dark':
                next = 'auto';
                break;
            default:
                next = 'auto';
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
                // Re-apply auto theme to pick up new system preference
                applyTheme('auto');
            }
        });
    }
})();
