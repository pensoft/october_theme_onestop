/**
 * Living Labs Map Interactive Functionality
 * Handles click-based popups and hover tooltips for the living labs map
 */

(function() {
    'use strict';

    // Country code mapping based on actual path data
    const COUNTRY_PATH_MAP = {
        'M628 539.75C632.832 539.75 636.75 535.832 636.75 531C636.75 526.168 632.832 522.25 628 522.25C623.168 522.25 619.25 526.168 619.25 531C619.25 535.832 623.168 539.75 628 539.75Z': 'RO', // Romania (Constanta)
        'M357.5 466.25C362.332 466.25 366.25 462.332 366.25 457.5C366.25 452.668 362.332 448.75 357.5 448.75C352.668 448.75 348.75 452.668 348.75 457.5C348.75 462.332 352.668 466.25 357.5 466.25Z': 'BE', // Belgium (Brussels)
        'M196 586.75C200.832 586.75 204.75 582.832 204.75 578C204.75 573.168 200.832 569.25 196 569.25C191.168 569.25 187.25 573.168 187.25 578C187.25 582.832 191.168 586.75 196 586.75Z': 'PT', // Portugal (Porto)
        'M299.5 425.25C304.332 425.25 308.25 421.332 308.25 416.5C308.25 411.668 304.332 407.75 299.5 407.75C294.668 407.75 290.75 411.668 290.75 416.5C290.75 421.332 294.668 425.25 299.5 425.25Z': 'GB', // United Kingdom (Coventry)
        'M536 284.75C540.832 284.75 544.75 280.832 544.75 276C544.75 271.168 540.832 267.25 536 267.25C531.168 267.25 527.25 271.168 527.25 276C527.25 280.832 531.168 284.75 536 284.75Z': 'FI'  // Finland (Uusimaa)
    };

    let tooltip = null;

    /**
     * Initialize the living labs map functionality
     */
    function initializeLivingLabsMap() {
        // Get the SVG container
        const svg = document.querySelector('.living-labs-map svg');
        if (!svg) return;

        // Get partner data from global variables
        const partnersData = window.livingLabsPartners || {};
        const countryNames = window.countryNames || {};
        const cityNames = window.cityNames || {};

        // Get popup element
        const popup = document.getElementById('living-labs-popup');
        if (!popup) return;

        // Create tooltip element
        createTooltip();

        // Get all paths in the SVG that match our living labs paths
        const paths = svg.querySelectorAll('path');

        paths.forEach(path => {
            const pathData = path.getAttribute('d');
            const countryCode = COUNTRY_PATH_MAP[pathData];

            if (countryCode && partnersData[countryCode]) {
                const countryData = partnersData[countryCode];
                const locationName = `${cityNames[countryCode]}, ${countryNames[countryCode]}`;

                // Add event listeners for hover
                path.addEventListener('mouseenter', (event) => {
                    showTooltip(event, locationName);
                });

                path.addEventListener('mousemove', updateTooltipPosition);

                path.addEventListener('mouseleave', hideTooltip);

                // Add event listener for click
                path.addEventListener('click', () => {
                    showLivingLabsPopup(countryCode, countryData, locationName);
                });

                // Add cursor pointer style
                path.style.cursor = 'pointer';
            }
        });
    }

    /**
     * Create tooltip element
     */
    function createTooltip() {
        tooltip = document.createElement('div');
        tooltip.className = 'map-tooltip';
        document.body.appendChild(tooltip);
    }

    /**
     * Show tooltip with country name
     * @param {Event} event - Mouse event
     * @param {string} locationName - Name of the location (city, country)
     */
    function showTooltip(event, locationName) {
        if (!tooltip) return;
        
        tooltip.textContent = locationName;
        updateTooltipPosition(event);
        
        // Add show class with a small delay for smooth animation
        setTimeout(() => {
            tooltip.classList.add('show');
        }, 10);
    }

    /**
     * Hide tooltip
     */
    function hideTooltip() {
        if (!tooltip) return;
        tooltip.classList.remove('show');
    }

    /**
     * Update tooltip position based on mouse position
     * @param {Event} event - Mouse event
     */
    function updateTooltipPosition(event) {
        if (!tooltip) return;
        
        // Get mouse position relative to the page (including scroll)
        const mouseX = event.pageX;
        const mouseY = event.pageY;
        
        // Get tooltip dimensions
        const tooltipRect = tooltip.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Calculate position
        let left = mouseX - (tooltipRect.width / 2);
        let top = mouseY - tooltipRect.height - 15; // 15px offset above cursor
        
        // Prevent tooltip from going off screen horizontally
        if (left < 10) {
            left = 10;
        } else if (left + tooltipRect.width > viewportWidth - 10) {
            left = viewportWidth - tooltipRect.width - 10;
        }
        
        // Prevent tooltip from going off screen vertically
        // Check against viewport bounds considering scroll
        if (top - scrollTop < 10) {
            top = mouseY + 15; // Show below cursor if no space above
        }
        
        tooltip.style.left = left + 'px';
        tooltip.style.top = top + 'px';
    }

    /**
     * Show living labs popup with country and partner data
     * @param {string} countryCode - The country code
     * @param {Object} countryData - The country data object
     * @param {string} locationName - The location display name (city, country)
     */
    function showLivingLabsPopup(countryCode, countryData, locationName) {
        const popup = document.getElementById('living-labs-popup');
        const countryNameEl = document.getElementById('popup-country-name');
        
        if (!popup || !countryNameEl) return;

        // Set location name (city, country)
        countryNameEl.textContent = locationName || countryCode;

        // Get the first partner (since we're showing only one)
        const firstPartner = countryData.partners && countryData.partners[0];
        if (!firstPartner) return;

        // Populate partner information
        populatePartnerInfo(firstPartner);

        // Show popup
        popup.style.display = 'block';
        
        // Add event listeners for closing popup
        setTimeout(() => {
            document.addEventListener('click', handlePopupOutsideClick);
            document.addEventListener('keydown', handlePopupKeydown);
        }, 100);
    }

    /**
     * Populate the partner information in the popup
     * @param {Object} partner - The partner data object
     */
    function populatePartnerInfo(partner) {
        // Get all the elements
        const partnerName = document.getElementById('partner-name');
        const partnerDescription = document.getElementById('partner-description');
        const partnerActions = document.getElementById('partner-actions');
        const partnerLogoContainer = document.getElementById('partner-logo-container');
        const partnerLogo = document.getElementById('partner-logo');

        // Set partner name
        if (partnerName) {
            partnerName.textContent = partner.institution || '';
        }

        // Set partner description
        if (partnerDescription) {
            partnerDescription.textContent = partner.description || '';
            partnerDescription.style.display = partner.description ? 'block' : 'none';
        }

        // Set partner logo
        if (partnerLogo && partnerLogoContainer) {
            if (partner.logo) {
                partnerLogo.src = partner.logo;
                partnerLogo.alt = partner.institution || '';
                partnerLogoContainer.style.display = 'block';
            } else {
                partnerLogoContainer.style.display = 'none';
            }
        }

        // Set partner actions
        if (partnerActions) {
            let actionsHtml = '';
            
            if (partner.url) {
                actionsHtml += `
                    <a href="${partner.url}" target="_blank" class="btn btn-primary btn-website">
                        <span class="btn-icon icon-external-link"></span>
                        Visit website
                    </a>
                `;
            }
            
            if (partner.email) {
                actionsHtml += `
                    <a href="mailto:${partner.email}" class="btn btn-primary btn-contact">
                        <span class="btn-icon icon-mail-send"></span>
                        Contact
                    </a>
                `;
            }
            
            partnerActions.innerHTML = actionsHtml;
        }
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
        document.addEventListener('DOMContentLoaded', initializeLivingLabsMap);
    } else {
        initializeLivingLabsMap();
    }

})(); 