document.addEventListener('DOMContentLoaded', function () {
    const saveButton = document.getElementById('saveButton');
    const fuelPriceInput = document.getElementById('fuelPrice');
    const mileageInput = document.getElementById('mileage');
  
    // Load saved settings
    chrome.storage.sync.get(['fuelPrice', 'mileage'], function (data) {
      if (data.fuelPrice) fuelPriceInput.value = data.fuelPrice;
      if (data.mileage) mileageInput.value = data.mileage;
    });
  
    // Save settings
    saveButton.addEventListener('click', function () {
      const fuelPrice = fuelPriceInput.value;
      const mileage = mileageInput.value;
      chrome.storage.sync.set({ fuelPrice, mileage }, function () {
        alert('Settings saved');
      });
    });
  });
  