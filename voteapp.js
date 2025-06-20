// document.addEventListener('DOMContentLoaded', () => {

//   // Load PO initials as before
//   const poInitials = localStorage.getItem('productOwnerInitials');
//   const poCircle = document.getElementById('po-circle');
//   if (poCircle) {
//     poCircle.textContent = poInitials;
//   }

//   // Load teammates initials
//   const teammates = JSON.parse(localStorage.getItem('teammatesInitials') || '[]');
//   const grid = document.getElementById('teammate-slots');

//   teammates.forEach(initials => {
//     // Create slot div
//     const slot = document.createElement('div');
//     slot.className = 'col-6 col-md-4 d-flex justify-content-center mb-4 teammate-slot';

//     // Create circle div with initials
//     const circle = document.createElement('div');
//     circle.className = 'circle';
//     circle.textContent = initials;

//     // Append circle to slot, slot to grid
//     slot.appendChild(circle);
//     grid.appendChild(slot);
//   });
// });

// document.addEventListener('DOMContentLoaded', () => {
//   // Load PO initials
//   const poInitials = localStorage.getItem('productOwnerInitials');
//   const poCircle = document.getElementById('po-circle');
//   if (poInitials && poCircle) {
//     poCircle.textContent = poInitials;
//   }

//   // Load teammates
//   const grid = document.getElementById('teammate-slots');
//   if (!grid) return;

//   const teammates = JSON.parse(localStorage.getItem('teammatesInitials') || '[]');

//   teammates.forEach(initials => {
//     const slot = document.createElement('div');
//     slot.className = 'col-6 col-md-4 d-flex justify-content-center mb-4 teammate-slot';

//     const circle = document.createElement('div');
//     circle.className = 'circle';
//     circle.textContent = initials;

//     slot.appendChild(circle);
//     grid.appendChild(slot);
//   });
// });

document.addEventListener('DOMContentLoaded', () => {
  // Load PO initials from localStorage and display
  const poInitials = localStorage.getItem('productOwnerInitials');
  const poCircle = document.getElementById('po-circle');
  if (poCircle && poInitials) {
    poCircle.textContent = poInitials;
  }

  // Load teammates initials array from localStorage
  const teammates = JSON.parse(localStorage.getItem('teammatesInitials') || '[]');

    console.log('Teammates:', teammates);

  // Get the container where teammate circles will be added
  const grid = document.getElementById('teammate-slots');
  if (!grid || !Array.isArray(teammates)) return;

  // For each teammate initial, create the column and circle and append
  teammates.forEach(initials => {
    const slot = document.createElement('div');
    slot.className = 'col-6 col-md-4 d-flex justify-content-center mb-4 teammate-slot';

    const circle = document.createElement('div');
    circle.className = 'circle';
    circle.textContent = initials;

    slot.appendChild(circle);
    grid.appendChild(slot);
  });
});