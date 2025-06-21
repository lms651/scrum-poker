// used for saving and loading PO's scoring method

document.addEventListener('DOMContentLoaded', () => {
  const radioInputs = document.querySelectorAll('input[name="scoring"]');

  // Load saved method on page load and set checked
  const savedMethod = localStorage.getItem('scoringMethod');
  if (savedMethod) {
    const toSelect = document.querySelector(`input[name="scoring"][value="${savedMethod}"]`);
    if (toSelect) toSelect.checked = true;
  }

  // Save method when changed
  radioInputs.forEach(radio => {
    radio.addEventListener('change', () => {
      if (radio.checked) {
        localStorage.setItem('scoringMethod', radio.value);
      }
    });
  });
});