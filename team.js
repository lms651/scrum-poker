document.addEventListener('DOMContentLoaded', () => {
  // Show PO initials
  const poInitials = localStorage.getItem('productOwnerInitials');
  const poCircle = document.getElementById('po-circle');
  if (poCircle) {
    poCircle.textContent = poInitials;
  }

  // Add teammate button logic
  const addBtn = document.getElementById('add-teammate-btn');
  const input = document.getElementById('new-initials');
  if (!addBtn || !input) return;

  // Enable/disable button based on input
  input.addEventListener('input', () => {
    const isValid = /^[A-Za-z]{1,2}$/.test(input.value.trim());
    addBtn.disabled = !isValid;
  });

  addBtn.addEventListener('click', () => {
    const initials = input.value.trim().toUpperCase();
    if (!/^[A-Z]{1,2}$/.test(initials)) return;

    const slots = document.querySelectorAll('.teammate-slot');
    for (const slot of slots) {
      if (slot.innerHTML.trim() === '') {
        const circle = document.createElement('div');
        circle.className = 'circle';
        circle.textContent = initials;
        slot.appendChild(circle);
        input.value = '';
        addBtn.disabled = true;
        input.focus();
        return;
      }
    }
  });

  addBtn.disabled = true; // initial state
});