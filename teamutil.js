function removeMember(event, slot, initials) {
  const votes = JSON.parse(localStorage.getItem('votes') || '{}');
  event.stopPropagation();
  slot.remove();
  const teammates = JSON.parse(localStorage.getItem('teammatesInitials') || '[]');
  
  const idx = teammates.indexOf(initials);
  if (idx !== -1) {
    teammates.splice(idx, 1);
    localStorage.setItem('teammatesInitials', JSON.stringify(teammates));
  }
  // Remove vote from in-memory and storage
  if (votes[initials]) {
    delete votes[initials];
    localStorage.setItem('votes', JSON.stringify(votes));
  }
}

export function initTeammate(initials, grid) {
  const slot = document.createElement('div');
  slot.className = 'ms-4 d-flex align-items-center mb-4 teammate-slot';

  // Circle
  const circle = document.createElement('div');
  circle.className = 'circle';
  circle.textContent = initials;
  circle.dataset.initials = initials;
  circle.style.cursor = 'pointer';

  circle.addEventListener('click', () => {
    const votes = JSON.parse(localStorage.getItem('votes') || '{}');
    document.getElementById('voteModalLabel').textContent = `Vote for ${initials}`;
    document.getElementById('voteInput').value = votes[initials] || '';
    document.getElementById('submitVote').dataset.initials = initials;
    new bootstrap.Modal(document.getElementById('voteModal')).show();
  });

  // Remove Teammate button
  const removeBtn = document.createElement('button');
  removeBtn.textContent = 'x';
  removeBtn.className = 'btn btn-sm btn-outline-dark ms-1';
  removeBtn.title = `Remove ${initials}`;
  removeBtn.style.cursor = 'pointer';
  removeBtn.addEventListener('click', (event) => {
    removeMember(event, slot, initials);
  });

  slot.appendChild(circle);
  slot.appendChild(removeBtn);
  grid.appendChild(slot);
}