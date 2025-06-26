/**
 * Living Labs Map Interactive Functionality
 * Handles click-based popups for the living labs map
 */

(function() {
    'use strict';

    // Country code mapping based on cx coordinates
    const COUNTRY_CODE_MAP = {
        '578.5': 'RO', // Romania
        '560.5': 'FI', // Finland 
        '357.5': 'BE', // Belgium
        '179.5': 'PT', // Portugal
        '299.5': 'GB'  // UK
    };

    /**
     * Initialize living labs map popups
     */
    function initLivingLabsMapPopups() {
        const mapContainer = document.querySelector('.living-labs-map');
        if (!mapContainer) return;

        const svg = mapContainer.querySelector('svg');
        if (!svg) return;

        // Get partner data from global variables
        const partnersData = window.livingLabsPartners || {};
        const countryNames = window.countryNames || {};

        // Get popup element
        const popup = document.getElementById('living-labs-popup');
        if (!popup) return;

        // Get all circles in the SVG
        const circles = svg.querySelectorAll('circle');

        circles.forEach(circle => {
            const cx = circle.getAttribute('cx');
            const countryCode = COUNTRY_CODE_MAP[cx];

            if (countryCode && partnersData[countryCode]) {
                const countryData = partnersData[countryCode];
                
                // Add country code as data attribute
                circle.setAttribute('data-country-code', countryCode);

                // Add click event to show popup
                circle.addEventListener('click', function(e) {
                    e.preventDefault();
                    showLivingLabsPopup(countryCode, countryData, countryNames[countryCode]);
                });

                // Add hover effect for visual feedback
                circle.addEventListener('mouseenter', function() {
                    circle.style.opacity = '0.8';
                    circle.style.cursor = 'pointer';
                });

                circle.addEventListener('mouseleave', function() {
                    circle.style.opacity = '1';
                });
            }
        });
    }

    /**
     * Show living labs popup with country and partner data
     * @param {string} countryCode - The country code
     * @param {Object} countryData - The country data object
     * @param {string} countryName - The country display name
     */
    function showLivingLabsPopup(countryCode, countryData, countryName) {
        const popup = document.getElementById('living-labs-popup');
        const countryNameEl = document.getElementById('popup-country-name');
        const partnersListEl = document.getElementById('popup-partners-list');
        
        if (!popup || !countryNameEl || !partnersListEl) return;

        // Set country name
        countryNameEl.textContent = countryName || countryCode;

        // Hide all country partner sections
        const allCountryPartners = partnersListEl.querySelectorAll('.country-partners');
        allCountryPartners.forEach(section => {
            section.style.display = 'none';
        });

        // Show the selected country's partners
        const selectedCountryPartners = partnersListEl.querySelector(`[data-country="${countryCode}"]`);
        if (selectedCountryPartners) {
            selectedCountryPartners.style.display = 'block';
        }

        // Show popup
        popup.style.display = 'block';
        
        // Add event listeners for closing popup
        setTimeout(() => {
            document.addEventListener('click', handlePopupOutsideClick);
            document.addEventListener('keydown', handlePopupKeydown);
        }, 100);
    }

    /**
     * Close living labs popup
     */
    function closeLivingLabsPopup() {
        const popup = document.getElementById('living-labs-popup');
        if (popup) {
            popup.style.display = 'none';
            document.removeEventListener('click', handlePopupOutsideClick);
            document.removeEventListener('keydown', handlePopupKeydown);
        }
    }

    /**
     * Handle clicking outside popup to close it
     * @param {Event} event - The click event
     */
    function handlePopupOutsideClick(event) {
        const popup = document.getElementById('living-labs-popup');
        if (popup && !popup.contains(event.target)) {
            closeLivingLabsPopup();
        }
    }

    /**
     * Handle keyboard events for popup
     * @param {Event} event - The keyboard event
     */
    function handlePopupKeydown(event) {
        if (event.key === 'Escape') {
            closeLivingLabsPopup();
        }
    }

    // Make closeLivingLabsPopup globally available for the close button onclick
    window.closeLivingLabsPopup = closeLivingLabsPopup;

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initLivingLabsMapPopups);
    } else {
        initLivingLabsMapPopups();
    }

})(); 