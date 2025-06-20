// voteapp.js

document.addEventListener('DOMContentLoaded', () => {
  // Clear votes on page load/navigation to start fresh each time
  localStorage.removeItem('votes');

  // Load PO initials
  const poInitials = localStorage.getItem('productOwnerInitials');
  const poCircle = document.getElementById('po-circle');

  // Initialize votes object in-memory
  let votes = {};

  if (poCircle && poInitials) {
    poCircle.textContent = poInitials;
    poCircle.dataset.initials = poInitials;
    poCircle.style.cursor = 'pointer';

    // PO voting handler
    poCircle.addEventListener('click', () => {
      document.getElementById('voteModalLabel').textContent = `Vote for ${poInitials}`;
      document.getElementById('voteInput').value = votes[poInitials] || '';
      document.getElementById('submitVote').dataset.initials = poInitials;
      new bootstrap.Modal(document.getElementById('voteModal')).show();
    });
  }

  // Load teammates from localStorage
  const teammates = JSON.parse(localStorage.getItem('teammatesInitials') || '[]');
  const grid = document.getElementById('teammate-slots');
  if (!grid || !Array.isArray(teammates)) return;

  // Render each teammate
  teammates.forEach(initials => {
    const slot = document.createElement('div');
    slot.className = 'col-6 col-md-4 d-flex align-items-center mb-4 teammate-slot';

    // Circle
    const circle = document.createElement('div');
    circle.className = 'circle';
    circle.textContent = initials;
    circle.dataset.initials = initials;
    circle.style.cursor = 'pointer';

    circle.addEventListener('click', () => {
      document.getElementById('voteModalLabel').textContent = `Vote for ${initials}`;
      document.getElementById('voteInput').value = votes[initials] || '';
      document.getElementById('submitVote').dataset.initials = initials;
      new bootstrap.Modal(document.getElementById('voteModal')).show();
    });

    // Remove button
    const removeBtn = document.createElement('button');
    removeBtn.textContent = '×';
    removeBtn.className = 'btn btn-sm btn-outline-danger ms-2';
    removeBtn.title = `Remove ${initials}`;
    removeBtn.style.cursor = 'pointer';
    removeBtn.addEventListener('click', e => {
      e.stopPropagation();
      slot.remove();
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
    });

    slot.appendChild(circle);
    slot.appendChild(removeBtn);
    grid.appendChild(slot);
  });

  // Submit vote handler
  document.getElementById('submitVote').addEventListener('click', () => {
    const initials = document.getElementById('submitVote').dataset.initials;
    const voteValue = document.getElementById('voteInput').value.trim();
    if (!voteValue) return;

    // Update in-memory and persist to localStorage
    votes[initials] = voteValue;
    localStorage.setItem('votes', JSON.stringify(votes));

    // Mark voted
    document.querySelectorAll('.circle').forEach(c => {
      if (c.dataset.initials === initials) c.classList.add('voted');
    });

    bootstrap.Modal.getInstance(document.getElementById('voteModal')).hide();
  });

  // Tally votes
  const tallyBtn = document.getElementById('tally-votes');
  if (tallyBtn) {
    tallyBtn.addEventListener('click', () => {
      const allVotes = JSON.parse(localStorage.getItem('votes') || '{}');

      console.log('--- Vote Details ---');
      Object.entries(allVotes).forEach(([init, val]) => console.log(`${init}: ${val}`));

      const values = Object.values(allVotes)
        .map(v => parseFloat(v))
        .filter(v => !isNaN(v));

      if (values.length === 0) {
        alert('No votes cast yet!');
        return;
      }

      const sum = values.reduce((a, b) => a + b, 0);
      const avg = sum / values.length;

      document.getElementById('resultsBody').textContent = `Average vote: ${avg.toFixed(2)}`;
      new bootstrap.Modal(document.getElementById('resultsModal')).show();
    });
  }
});

// Clear votes when leaving page
window.addEventListener('beforeunload', () => {
  localStorage.removeItem('votes');
});
