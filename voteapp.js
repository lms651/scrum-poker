// import { calculateVote } from "./calculateVote";

document.addEventListener('DOMContentLoaded', () => {
  // Clear votes on page load/navigation to start fresh each time
  localStorage.removeItem('votes');

  // User Story set up
const storyInput = document.getElementById('story-input');
const submitBtn = document.getElementById('submit-story');
const storyForm = document.getElementById('story-form');
const storyDisplay = document.getElementById('story-display');
const storyText = document.getElementById('story-text');
const editBtn = document.getElementById('edit-story');

// Submit story and display it
submitBtn.addEventListener('click', () => {
  const text = storyInput.value.trim();
  if (!text) return;

  storyText.textContent = text;
  storyForm.classList.add('d-none');
  storyDisplay.classList.remove('d-none');
  storyInput.value = '';
});

// Show input again to enter a new story
editBtn.addEventListener('click', () => {
  storyForm.classList.remove('d-none');
  storyDisplay.classList.add('d-none');
  storyInput.focus();

  // Reset votes in memory and localStorage
  votes = {};
  localStorage.removeItem('votes');

  // Remove voted styling from teammate circles
  document.querySelectorAll('.circle').forEach(c => c.classList.remove('voted'));
});

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

    console.log('Loaded teammates:', teammates);


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

    // Helper: next Fibonacci >= n
  function nextFibonacci(n) {
    let a = 1, b = 1;
    while (b < n) {
      [a, b] = [b, a + b];
    }
    return b;
  }

  // Tally votes
  const tallyBtn = document.getElementById('tally-votes');
  if (tallyBtn) {
    tallyBtn.addEventListener('click', () => {
      const allVotes = JSON.parse(localStorage.getItem('votes') || '{}');
      console.log('--- Vote Details ---');
      Object.entries(allVotes).forEach(([init, val]) => console.log(`${init}: ${val}`));

      const method = localStorage.getItem('scoringMethod') || 'days';
      let result;

      if (method === 'days') {
        const vals = Object.values(allVotes).map(v => parseFloat(v)).filter(v => !isNaN(v));
        const avg = vals.reduce((a, b) => a + b, 0) / vals.length;
        result = avg.toFixed(2);
      } else if (method === 'fibonacci') {
        const vals = Object.values(allVotes).map(v => parseFloat(v)).filter(v => !isNaN(v));
        const avg = vals.reduce((a, b) => a + b, 0) / vals.length;
        result = nextFibonacci(avg);
      } else if (method === 'tshirt') {
        const sizeMap = { XS: 1, S: 2, M: 3, L: 4, XL: 5 };
        const reverseMap = { 1: 'XS', 2: 'S', 3: 'M', 4: 'L', 5: 'XL' };
        const mapped = Object.values(allVotes)
          .map(v => sizeMap[v.toUpperCase()])
          .filter(v => v !== undefined);

        if (mapped.length === 0) {
          result = 'No valid votes';
        } else {
          const avg = mapped.reduce((a, b) => a + b, 0) / mapped.length;
          const rounded = Math.ceil(avg);
          result = reverseMap[rounded] || 'Unknown';
        }
      }

      document.getElementById('resultsBody').textContent = `Result (${method}): ${result}`;
      new bootstrap.Modal(document.getElementById('resultsModal')).show();
    });
  }
});

// Clear on unload
window.addEventListener('beforeunload', () => {
  localStorage.removeItem('votes');
});