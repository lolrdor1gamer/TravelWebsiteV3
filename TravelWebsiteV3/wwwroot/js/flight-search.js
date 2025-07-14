// Carousel functionality
let slideIndex = 0;
const slideContent = [
    {
        headline: "Your Journey, Your Way",
        description: "Already have a destination in mind? Perfect. Use our seamless booking tool to find the best flights, manage your itinerary, and start packing. Your next great trip is just a few clicks away."
    },
    {
        headline: "Find Your Next Adventure",
        description: "Feeling spontaneous but not sure where to go? Let us guide you. Explore our curated collections of unique destinations and travel ideas to spark your imagination and uncover hidden gems."
    },
    {
        headline: "Live Like a Local",
        description: "You've booked your flight and packed your bags, but what's next? Discover and book unforgettable tours, must-see attractions, and local experiences to make your trip truly special."
    }
];

function carousel() {
    const slides = document.getElementsByClassName("slide-main");
    const circles = document.getElementsByClassName("nav-circle");
    const headlineElement = document.querySelector(".slide-headline");
    const descriptionElement = document.querySelector(".slide-description");

    for (let i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
        circles[i].classList.remove("active");
    }

    slideIndex++;
    if (slideIndex > slides.length) {slideIndex = 1}

    slides[slideIndex-1].style.display = "block";
    circles[slideIndex-1].classList.add("active");
    
    const content = slideContent[slideIndex-1];
    headlineElement.textContent = content.headline;
    descriptionElement.textContent = content.description;

    setTimeout(carousel, 15000);
}

// Initialize carousel
document.addEventListener('DOMContentLoaded', function() {
    carousel();
});

// Datepicker functionality
function setupDatepicker(inputId) {
    const input = document.getElementById(inputId);
    const today = new Date();
    const minDate = today.toISOString().split('T')[0];

    // Set min date to today
    input.min = minDate;

    // Format the date to DD/MM/YYYY for display
    function formatDateForDisplay(dateStr) {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }

    // Convert DD/MM/YYYY to YYYY-MM-DD for the input
    function formatDateForInput(dateStr) {
        if (!dateStr) return '';
        const [day, month, year] = dateStr.split('/');
        return `${year}-${month}-${day}`;
    }

    // Create a hidden input to store the actual date value
    const hiddenInput = document.createElement('input');
    hiddenInput.type = 'hidden';
    hiddenInput.id = inputId + '_hidden';
    input.parentNode.appendChild(hiddenInput);

    // Update the display when the date changes
    input.addEventListener('change', function() {
        if (this.value) {
            hiddenInput.value = this.value; // Store the YYYY-MM-DD value
            this.value = formatDateForDisplay(this.value); // Display as DD/MM/YYYY
        }
    });

    // Show the calendar picker when clicking the input
    input.addEventListener('click', function() {
        const tempInput = document.createElement('input');
        tempInput.type = 'date';
        tempInput.style.position = 'absolute';
        tempInput.style.opacity = '0';
        tempInput.style.pointerEvents = 'none';
        tempInput.value = hiddenInput.value || minDate;
        
        document.body.appendChild(tempInput);
        tempInput.showPicker();
        
        tempInput.addEventListener('change', function() {
            if (this.value) {
                hiddenInput.value = this.value;
                input.value = formatDateForDisplay(this.value);
            }
            document.body.removeChild(tempInput);
        });

        tempInput.addEventListener('blur', function() {
            document.body.removeChild(tempInput);
        });
    });

    // Prevent direct input
    input.addEventListener('keydown', function(e) {
        e.preventDefault();
    });
}

// Passenger dropdown functionality
function setupPassengerDropdown() {
    console.log('setupPassengerDropdown called');
    const button = document.querySelector('.passenger-button');
    const dropdown = document.querySelector('.passenger-dropdown-menu');
    if (!button) { console.error('No .passenger-button found'); return; }
    if (!dropdown) { console.error('No .passenger-dropdown-menu found'); return; }
    const passengerText = button.querySelector('.passenger-text');
    if (!passengerText) { console.error('No .passenger-text found inside button'); }
    
    // Create backdrop if it doesn't exist
    let backdrop = document.querySelector('.dropdown-backdrop');
    if (!backdrop) {
        backdrop = document.createElement('div');
        backdrop.className = 'dropdown-backdrop';
        document.body.appendChild(backdrop);
    }

    let adults = 1;
    let children = 0;
    let cabinClass = 'ECONOMY';

    function updateButtonText() {
        const passengerText = `${adults} Adult${adults > 1 ? 's' : ''}, ${children} Child${children > 1 ? 'ren' : ''}, ${cabinClass}`;
        button.querySelector('.passenger-text').textContent = passengerText;
    }

    function toggleDropdown() {
        const isExpanded = button.classList.contains('active');
        button.classList.toggle('active');
        dropdown.classList.toggle('show');
        backdrop.classList.toggle('show');
    }

    // Toggle dropdown on button click
    button.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleDropdown();
    });

    // Close dropdown when clicking outside
    backdrop.addEventListener('click', () => {
        if (button.classList.contains('active')) {
            toggleDropdown();
        }
    });

    // Handle counter buttons
    const adultCounter = dropdown.querySelector('.passenger-option:nth-child(1) .passenger-counter');
    const childCounter = dropdown.querySelector('.passenger-option:nth-child(2) .passenger-counter');
    const cabinSelect = dropdown.querySelector('.cabin-select');

    // Adult counter
    const adultMinus = adultCounter.querySelector('.minus');
    const adultPlus = adultCounter.querySelector('.plus');
    const adultInput = adultCounter.querySelector('.counter-input');

    adultMinus.addEventListener('click', () => {
        if (adults > 1) {
            adults--;
            adultInput.value = adults;
            adultMinus.disabled = adults === 1;
            updateButtonText();
        }
    });

    adultPlus.addEventListener('click', () => {
        if (adults < 9) {
            adults++;
            adultInput.value = adults;
            adultMinus.disabled = false;
            updateButtonText();
        }
    });

    // Child counter
    const childMinus = childCounter.querySelector('.minus');
    const childPlus = childCounter.querySelector('.plus');
    const childInput = childCounter.querySelector('.counter-input');

    childMinus.addEventListener('click', () => {
        if (children > 0) {
            children--;
            childInput.value = children;
            childMinus.disabled = children === 0;
            updateButtonText();
        }
    });

    childPlus.addEventListener('click', () => {
        if (children < 9) {
            children++;
            childInput.value = children;
            childMinus.disabled = false;
            updateButtonText();
        }
    });

    // Cabin class select
    cabinSelect.addEventListener('change', (e) => {
        cabinClass = e.target.value;
        updateButtonText();
    });

    // Prevent dropdown from closing when clicking inside it
    dropdown.addEventListener('click', (e) => {
        e.stopPropagation();
    });

    // Initialize button text
    updateButtonText();
}

// Initialize all functionality
document.addEventListener('DOMContentLoaded', function() {
    const departureInput = document.getElementById('departure');
    const destinationInput = document.getElementById('destination');
    const departureDateInput = document.getElementById('departureDate');
    const returnDateInput = document.getElementById('returnDate');
    const searchForm = document.querySelector('.search-form');
    const departureSuggestions = document.getElementById('departure-suggestions');
    const destinationSuggestions = document.getElementById('destination-suggestions');

    let selectedDepartureAirport = null;
    let selectedDestinationAirport = null;
    let lastDepartureAirports = [];
    let lastDestinationAirports = [];

    // Setup datepickers
    setupDatepicker('departureDate');
    setupDatepicker('returnDate');

    // Setup passenger dropdown
    setupPassengerDropdown();

    // --- Inspiration Section ---
    const inspirationForm = document.getElementById('inspiration-form');
    const inspDepartureInput = document.getElementById('insp-departure');
    const inspDepartureSuggestions = document.getElementById('insp-departure-suggestions');
    
    let selectedInspirationAirport = null;
    let lastInspirationAirports = [];

    // Setup datepicker for inspiration form
    setupDatepicker('insp-date');

    // Helper to show/hide spinner
    function showSpinner(inputId, show) {
        let input = document.getElementById(inputId);
        let spinner = input.parentNode.querySelector('.input-spinner');
        if (show) {
            if (!spinner) {
                spinner = document.createElement('span');
                spinner.className = 'input-spinner';
                input.parentNode.appendChild(spinner);
            }
        } else {
            if (spinner) spinner.remove();
        }
    }

    // Handle location search for departure
    departureInput.addEventListener('input', async function(e) {
        const keyword = e.target.value;
        selectedDepartureAirport = null;
        document.getElementById('departure-airports').innerHTML = '';
        if (keyword.length < 3) {
            departureSuggestions.innerHTML = '';
            showSpinner('departure', false);
            return;
        }
        showSpinner('departure', true);
        try {
            const response = await fetch(`?handler=SearchLocations&keyword=${encodeURIComponent(keyword)}`);
            const locations = await response.json();
            showSpinner('departure', false);
            departureSuggestions.innerHTML = '';
            locations.forEach(location => {
                const div = document.createElement('div');
                div.className = 'suggestion';
                div.textContent = `${location.name}, ${location.address.countryCode}`;
                div.addEventListener('click', async () => {
                    departureInput.value = `${location.name}, ${location.address.countryCode}`;
                    showSpinner('departure', true);
                    // Fetch airports for this city
                    try {
                        const airportResponse = await fetch(
                            `?handler=FindNearestAirport&latitude=${location.geoCode.latitude}&longitude=${location.geoCode.longitude}`
                        );
                        const airports = await airportResponse.json();
                        lastDepartureAirports = airports;
                        renderDepartureAirportPanel();
                    } catch (error) {
                        console.error('Error finding nearest airport:', error);
                    }
                    showSpinner('departure', false);
                    departureSuggestions.innerHTML = '';
                });
                departureSuggestions.appendChild(div);
            });
        } catch (error) {
            showSpinner('departure', false);
            console.error('Error searching locations:', error);
        }
    });

    function renderDepartureAirportPanel() {
        showAirportSelectionPanelSingle(
            lastDepartureAirports,
            'departure-airports',
            (selected) => {
                selectedDepartureAirport = selected;
                renderDepartureAirportPanel();
            },
            selectedDepartureAirport
        );
    }

    // Handle location search for destination
    destinationInput.addEventListener('input', async function(e) {
        const keyword = e.target.value;
        selectedDestinationAirport = null;
        document.getElementById('destination-airports').innerHTML = '';
        if (keyword.length < 3) {
            destinationSuggestions.innerHTML = '';
            showSpinner('destination', false);
            return;
        }
        showSpinner('destination', true);
        try {
            const response = await fetch(`?handler=SearchLocations&keyword=${encodeURIComponent(keyword)}`);
            const locations = await response.json();
            showSpinner('destination', false);
            destinationSuggestions.innerHTML = '';
            locations.forEach(location => {
                const div = document.createElement('div');
                div.className = 'suggestion';
                div.textContent = `${location.name}, ${location.address.countryCode}`;
                div.addEventListener('click', async () => {
                    destinationInput.value = `${location.name}, ${location.address.countryCode}`;
                    showSpinner('destination', true);
                    // Fetch airports for this city
                    try {
                        const airportResponse = await fetch(
                            `?handler=FindNearestAirport&latitude=${location.geoCode.latitude}&longitude=${location.geoCode.longitude}`
                        );
                        const airports = await airportResponse.json();
                        lastDestinationAirports = airports;
                        renderDestinationAirportPanel();
                    } catch (error) {
                        console.error('Error finding nearest airport:', error);
                    }
                    showSpinner('destination', false);
                    destinationSuggestions.innerHTML = '';
                });
                destinationSuggestions.appendChild(div);
            });
        } catch (error) {
            showSpinner('destination', false);
            console.error('Error searching locations:', error);
        }
    });

    function renderDestinationAirportPanel() {
        showAirportSelectionPanelSingle(
            lastDestinationAirports,
            'destination-airports',
            (selected) => {
                selectedDestinationAirport = selected;
                renderDestinationAirportPanel();
            },
            selectedDestinationAirport
        );
    }

    function renderInspirationAirportPanel() {
        showAirportSelectionPanelSingle(
            lastInspirationAirports,
            'insp-departure-airports',
            (selected) => {
                selectedInspirationAirport = selected;
                renderInspirationAirportPanel();
            },
            selectedInspirationAirport
        );
    }

    // Handle location search for inspiration departure
    inspDepartureInput.addEventListener('input', async function(e) {
        const keyword = e.target.value;
        selectedInspirationAirport = null;
        document.getElementById('insp-departure-airports').innerHTML = '';
        if (keyword.length < 3) {
            inspDepartureSuggestions.innerHTML = '';
            showSpinner('insp-departure', false);
            return;
        }
        showSpinner('insp-departure', true);
        try {
            const response = await fetch(`?handler=SearchLocations&keyword=${encodeURIComponent(keyword)}`);
            const locations = await response.json();
            showSpinner('insp-departure', false);
            inspDepartureSuggestions.innerHTML = '';
            locations.forEach(location => {
                const div = document.createElement('div');
                div.className = 'suggestion';
                div.textContent = `${location.name}, ${location.address.countryCode}`;
                div.addEventListener('click', async () => {
                    inspDepartureInput.value = `${location.name}, ${location.address.countryCode}`;
                    showSpinner('insp-departure', true);
                    try {
                        const airportResponse = await fetch(
                            `?handler=FindNearestAirport&latitude=${location.geoCode.latitude}&longitude=${location.geoCode.longitude}`
                        );
                        const airports = await airportResponse.json();
                        lastInspirationAirports = airports;
                        renderInspirationAirportPanel();
                    } catch (error) {
                        console.error('Error finding nearest airport:', error);
                    }
                    showSpinner('insp-departure', false);
                    inspDepartureSuggestions.innerHTML = '';
                });
                inspDepartureSuggestions.appendChild(div);
            });
        } catch (error) {
            showSpinner('insp-departure', false);
            console.error('Error searching locations:', error);
        }
    });

    // Handle inspiration form submission
    inspirationForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const resultsContainer = document.getElementById('inspiration-results');
        resultsContainer.innerHTML = '<div class="input-spinner" style="margin: 2rem auto;"></div>'; // Show spinner

        if (!selectedInspirationAirport) {
            alert('Please select a valid departure location');
            resultsContainer.innerHTML = '';
            return;
        }

        const departureDateInput = document.getElementById('insp-date');
        const duration = document.getElementById('insp-duration').value;
        const maxPrice = document.getElementById('insp-maxprice').value;

        if (!departureDateInput.value) {
            alert('Please select a departure date');
            resultsContainer.innerHTML = '';
            return;
        }

        // Convert DD/MM/YYYY to YYYY-MM-DD
        function convertDateFormat(dateStr) {
            if (!dateStr) return null;
            const [day, month, year] = dateStr.split('/');
            return `${year}-${month}-${day}`;
        }

        const departureDate = convertDateFormat(departureDateInput.value);

        const token = document.querySelector('input[name="__RequestVerificationToken"]')?.value;

        try {
            const response = await fetch('?handler=SearchInspirations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'RequestVerificationToken': token
                },
                body: JSON.stringify({
                    origin: selectedInspirationAirport.iataCode,
                    departureDate: departureDate,
                    duration: duration,
                    maxPrice: maxPrice
                })
            });

            if (!response.ok) {
                const errorData = await response.text();
                throw new Error(errorData || `HTTP error! status: ${response.status}`);
            }

            const inspirations = await response.json();
            displayInspirationResults(inspirations);

        } catch (error) {
            console.error('Error searching for inspirations:', error);
            resultsContainer.innerHTML = `<p class="airport-panel-empty">Could not find any trips. Please broaden your search criteria.</p>`;
        }
    });

    function displayInspirationResults(inspirations) {
        const resultsContainer = document.getElementById('inspiration-results');
        resultsContainer.innerHTML = '';

        if (!inspirations || inspirations.length === 0) {
            resultsContainer.innerHTML = '<p class="airport-panel-empty">No flight inspirations found. Try a broader search!</p>';
            return;
        }

        const inspirationGrid = document.createElement('div');
        inspirationGrid.className = 'inspiration-grid';

        inspirations.forEach(inspiration => {
            const card = document.createElement('div');
            card.className = 'inspiration-card'; 

            card.innerHTML = `
                <div class="inspiration-card-header">
                    <h4>${inspiration.destination}</h4>
                </div>
                <div class="inspiration-card-body">
                    <p><strong>Price:</strong> ${inspiration.price.total} ${inspiration.price.currency}</p>
                    <p><strong>Departure:</strong> ${inspiration.departureDate}</p>
                    <p><strong>Return:</strong> ${inspiration.returnDate}</p>
                    <a href="${inspiration.links.flightDates}" target="_blank" class="select-flight">Check Dates</a>
                </div>
            `;
            inspirationGrid.appendChild(card);
        });
        resultsContainer.appendChild(inspirationGrid);
    }

    // Function to display flight results
    function displayFlightResults(flights) {
        // Create a container for results if it doesn't exist
        let resultsContainer = document.getElementById('flight-results');
        if (!resultsContainer) {
            resultsContainer = document.createElement('div');
            resultsContainer.id = 'flight-results';
            searchForm.parentNode.insertBefore(resultsContainer, searchForm.nextSibling);
        }

        resultsContainer.innerHTML = '';

        if (!flights || flights.length === 0) {
            resultsContainer.innerHTML = '<p>No flights found matching your criteria.</p>';
            return;
        }

        flights.forEach(flight => {
            const itinerary = flight.itineraries[0];
            const segments = itinerary.segments;
            const firstSegment = segments[0];
            const lastSegment = segments[segments.length - 1];

            const departureIata = firstSegment.departure.iataCode;
            const departureTime = new Date(firstSegment.departure.at).toLocaleTimeString();
            const arrivalIata = lastSegment.arrival.iataCode;
            const arrivalTime = new Date(lastSegment.arrival.at).toLocaleTimeString();
            const totalDuration = itinerary.duration;

            const flightCard = document.createElement('div');
            flightCard.className = 'flight-card';
            
            flightCard.innerHTML = `
                <div class="flight-info">
                    <div class="flight-route">
                        <div class="departure">
                            <h3>${departureIata}</h3>
                            <p>${departureTime}</p>
                        </div>
                        <div class="flight-duration">
                            <p>${totalDuration}</p>
                        </div>
                        <div class="arrival">
                            <h3>${arrivalIata}</h3>
                            <p>${arrivalTime}</p>
                        </div>
                    </div>
                    <div class="flight-details">
                        <p>Airline: ${firstSegment.carrierCode}</p>
                        <p>Flight: ${firstSegment.number}</p>
                    </div>
                </div>
                <div class="flight-price">
                    <h3>${flight.price.total} ${flight.price.currency}</h3>
                    <button class="select-flight" 
                        data-destination-city="${lastSegment.arrival.iataCode}" 
                        data-destination-lat="${lastSegment.arrival.latitude || ''}"
                        data-destination-lng="${lastSegment.arrival.longitude || ''}">
                        Select
                    </button>
                </div>
            `;
            
            resultsContainer.appendChild(flightCard);
        });

        // Add event listeners to all select buttons
        resultsContainer.querySelectorAll('.select-flight').forEach(button => {
            button.addEventListener('click', function() {
                // Scroll to or show the 'What to do' section
                const whatToDoSection = document.getElementById('what-to-do-section');
                if (whatToDoSection) {
                    whatToDoSection.scrollIntoView({ behavior: 'smooth' });
                }
                // Optionally, trigger map rendering with destination info
                const city = this.getAttribute('data-destination-city');
                const lat = this.getAttribute('data-destination-lat');
                const lng = this.getAttribute('data-destination-lng');
                if (window.renderWhatToDoMap) {
                    window.renderWhatToDoMap(city, lat, lng);
                }
            });
        });
    }

    // Handle form submission
    searchForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Clear previous flight results
        let resultsContainer = document.getElementById('flight-results');
        if (resultsContainer) resultsContainer.innerHTML = '';

        if (!selectedDepartureAirport || !selectedDestinationAirport) {
            alert('Please select valid departure and destination locations');
            return;
        }

        // Get dates from the datepicker inputs
        const departureDateInput = document.getElementById('departureDate');
        const returnDateInput = document.getElementById('returnDate');
        
        if (!departureDateInput.value) {
            alert('Please select a departure date');
            return;
        }

        // Convert DD/MM/YYYY to YYYY-MM-DD
        function convertDateFormat(dateStr) {
            if (!dateStr) return null;
            const [day, month, year] = dateStr.split('/');
            return `${year}-${month}-${day}`;
        }

        const departureDate = convertDateFormat(departureDateInput.value);
        const returnDate = returnDateInput.value ? convertDateFormat(returnDateInput.value) : null;
        
        // Get passenger and cabin class values from the dropdown
        let adults = parseInt(document.querySelector('.passenger-option:nth-child(1) .counter-input').value);
        const children = parseInt(document.querySelector('.passenger-option:nth-child(2) .counter-input').value);
        let travelClass = document.querySelector('.cabin-select').value;

        if(adults === 0) {
            adults = 1;
        }
        if(travelClass == null) {
            travelClass = 'ECONOMY';
        }
        
        console.log('Selected Departure Airport:', selectedDepartureAirport);
        console.log('Selected Destination Airport:', selectedDestinationAirport);
        console.log('Adults:', adults);
        console.log('Departure Date:', departureDate);
        console.log('Return Date:', returnDate);
        console.log('Children:', children);
        console.log('Travel Class:', travelClass);
        
        // Get the anti-forgery token
        const token = document.querySelector('input[name="__RequestVerificationToken"]')?.value;
        if (!token) {
            console.error('Anti-forgery token not found');
            alert('Security token not found. Please refresh the page and try again.');
            return;
        }

        try {
            const response = await fetch('?handler=SearchFlights', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'RequestVerificationToken': token
                },
                body: JSON.stringify({
                    originLocationCode: selectedDepartureAirport.iataCode,
                    destinationLocationCode: selectedDestinationAirport.iataCode,
                    departureDate: departureDate,
                    returnDate: returnDate,
                    adults: adults,
                    children: children,
                    travelClass: travelClass
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }

            const flights = await response.json();
            displayFlightResults(flights);
        } catch (error) {
            console.error('Error searching flights:', error);
            alert('Error searching flights: ' + error.message);
        }
    });

    // Close suggestions when clicking outside
    document.addEventListener('click', function(e) {
        if (!departureInput.contains(e.target) && !departureSuggestions.contains(e.target)) {
            departureSuggestions.innerHTML = '';
        }
        if (!destinationInput.contains(e.target) && !destinationSuggestions.contains(e.target)) {
            destinationSuggestions.innerHTML = '';
        }
        if (!inspDepartureInput.contains(e.target) && !inspDepartureSuggestions.contains(e.target)) {
            inspDepartureSuggestions.innerHTML = '';
        }
    });

    // Helper to show single-airport selection panel (with country and distance)
    function showAirportSelectionPanelSingle(airports, panelId, onSelect, selectedAirport = null) {
        const panel = document.getElementById(panelId);
        panel.innerHTML = '';
        if (selectedAirport) {
            // Show chip with pin and cross
            panel.innerHTML = `<div class='airport-chip'><span class='airport-pin'>📍</span>${selectedAirport.name} (${selectedAirport.iataCode})<button class='airport-chip-remove' title='Remove'>&times;</button></div>`;
            const removeBtn = panel.querySelector('.airport-chip-remove');
            removeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                onSelect(null);
            });
            return;
        }
        if (!airports || airports.length === 0) {
            panel.innerHTML = `<div class="airport-panel-empty"><span class='empty-icon'>🛫</span>No airports found.<br><span style='font-size:0.95em'>Try another city nearby!</span></div>`;
            return;
        }
        airports.forEach(airport => {
            const card = document.createElement('div');
            card.className = 'airport-card';
            let distanceStr = '';
            if (airport.distance && typeof airport.distance.value !== 'undefined' && airport.distance.unit) {
                distanceStr = `${airport.distance.value} ${airport.distance.unit}`;
            }
            card.innerHTML = `<div class="airport-main"><span class="airport-card-icon">🛬</span><span class="airport-name">${airport.name}</span> <span class="airport-code">(${airport.iataCode})</span> <span class="airport-country">${airport.address.countryName}</span> <span class="airport-distance">${distanceStr}</span></div>`;
            if (selectedAirport && selectedAirport.iataCode === airport.iataCode) {
                card.classList.add('selected');
            }
            card.addEventListener('click', () => {
                onSelect(airport);
            });
            panel.appendChild(card);
        });
    }
});

