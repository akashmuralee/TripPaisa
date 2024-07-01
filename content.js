// Function to calculate trip cost
function calculateTripCost(distance, fuelPrice, mileage) {
    return (distance / mileage) * fuelPrice;
  }
  
  // Function to add trip cost below distance
  function addTripCost() {
    // Attempt to find the distance elements
    const tripElements = document.querySelectorAll('.UgZKXd .XdKEzd .ivN21e');
    console.log('Checking for trip elements:', tripElements);
  
    if (tripElements.length > 0) {
      tripElements.forEach(distanceElement => {
        const distanceText = distanceElement.innerText;
        console.log('Distance text found:', distanceText);
  
        const distance = parseFloat(distanceText.replace(' km', ''));
        console.log('Parsed distance:', distance);
  
        chrome.storage.sync.get(['fuelPrice', 'mileage'], function (data) {
          console.log('Stored data:', data);
          if (data.fuelPrice && data.mileage) {
            const tripCost = calculateTripCost(distance, data.fuelPrice, data.mileage);
            console.log('Trip cost calculated:', tripCost);
  
            const tripCostElement = document.createElement('div');
            tripCostElement.innerText = `Trip Cost: ${tripCost.toFixed(2)} INR`;
            tripCostElement.style.fontWeight = 'bold';
            tripCostElement.style.marginTop = '5px';
            distanceElement.parentElement.appendChild(tripCostElement);
  
            console.log('Trip cost element added:', tripCostElement);
          } else {
            console.log('Fuel price or mileage not set.');
          }
        });
      });
    } else {
      console.log('Distance elements not found.');
    }
  }
  
  // Function to wait for the distance elements to load
  function waitForDistanceElement() {
    const observer = new MutationObserver((mutations, obs) => {
      const tripElements = document.querySelectorAll('.UgZKXd .XdKEzd .ivN21e');
      if (tripElements.length > 0) {
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
  const observer = new MutationObserver(waitForDistanceElement);
  observer.observe(document.body, { childList: true, subtree: true });
  