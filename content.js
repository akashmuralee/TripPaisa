// Function to calculate trip cost
function calculateTripCost(distance, fuelPrice, mileage) {
    return (distance / mileage) * fuelPrice;
}

// Function to add trip cost to the distance element
function addTripCost() {
    const xpath = "//div[contains(text(), 'km') and not(contains(text(), '₹'))]";
    const tripElements = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    console.log('Checking for trip elements:', tripElements);

    for (let i = 0; i < tripElements.snapshotLength; i++) {
        const distanceTextElement = tripElements.snapshotItem(i);
        if (distanceTextElement) {
            let distanceText = distanceTextElement.innerText.trim(); // Trim to remove any extra spaces
            console.log('Distance text found:', distanceText);

            // Updated regular expression to handle distances with digits
            const distanceMatch = distanceText.match(/([\d.,]+)\s*km/);
            if (distanceMatch && !distanceText.includes('₹')) {
                // Replace any commas with dots to handle formatted numbers
                const distance = parseFloat(distanceMatch[1].replace(',', '')); 
                console.log('Parsed distance:', distance);

                chrome.storage.sync.get(['fuelPrice', 'mileage'], function (data) {
                    console.log('Stored data:', data);
                    if (data.fuelPrice && data.mileage) {
                        const tripCost = calculateTripCost(distance, data.fuelPrice, data.mileage);
                        console.log('Trip cost calculated:', tripCost);

                        const tripCostText = ` (₹ ${tripCost.toFixed(2)})`;
                        distanceTextElement.innerText = `${distanceText} ${tripCostText}`;

                        console.log('Trip cost appended to distance text:', distanceTextElement.innerText);
                    } else {
                        console.log('Fuel price or mileage not set.');
                    }
                });
            }
        }
    }
}

// Function to wait for the distance elements to load
function waitForDistanceElement() {
    const observer = new MutationObserver((mutations, obs) => {
        const xpath = "//div[contains(text(), 'km') and not(contains(text(), '₹'))]";
        const tripElements = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        if (tripElements.snapshotLength > 0) {
            console.log('Distance elements loaded.');
            addTripCost();
            obs.disconnect();
            return;
        }
    });
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}

// Add trip cost when the page loads
window.addEventListener('load', waitForDistanceElement);

// Add trip cost when the URL changes (Google Maps SPA)
const observer = new MutationObserver(() => {
    const xpath = "//div[contains(text(), 'km') and not(contains(text(), '₹'))]";
    const tripElements = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    for (let i = 0; i < tripElements.snapshotLength; i++) {
        const distanceTextElement = tripElements.snapshotItem(i);
        if (distanceTextElement && !distanceTextElement.innerText.includes('₹')) {
            addTripCost();
        }
    }
});
observer.observe(document.body, { childList: true, subtree: true });
