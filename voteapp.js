import { productOwnerOnClick, submitVote, tally } from "./calculateVote.js";
import { initTeammate } from "./teamutil.js";

function onEdit() {
  const storyForm = document.getElementById('story-form');
  const storyDisplay = document.getElementById('story-display');
  const storyInput = document.getElementById('story-input');

  storyForm.classList.remove('d-none');
  storyDisplay.classList.add('d-none');
  storyInput.focus();

  // Reset votes in memory and localStorage
  localStorage.removeItem('votes');

  // Remove voted styling from teammate circles
  document.querySelectorAll('.circle').forEach(c => c.classList.remove('voted'));
}

function onSubmit() {
  const storyForm = document.getElementById('story-form');
  const storyDisplay = document.getElementById('story-display');
  const storyText = document.getElementById('story-text');
  const storyInput = document.getElementById('story-input');
  const text = storyInput.value.trim();
  
  if (!text) return;

  storyText.textContent = text;
  storyForm.classList.add('d-none');
  storyDisplay.classList.remove('d-none');
  storyInput.value = '';
}

function onEndGame() {
  // Clear everything related to the game
  localStorage.removeItem('teammatesInitials');
  localStorage.removeItem('productOwnerInitials');
  localStorage.removeItem('votes');
  localStorage.removeItem('scoringMethod');

  // Clear any displayed content
  document.querySelectorAll('.teammate-slot').forEach(el => el.remove());
  document.getElementById('po-circle').textContent = '';
  document.getElementById('story-text').textContent = '';

  // Redirect to start page
  window.location.href = 'index.html';
}

function init() {
  // Clear votes on page load/navigation to start fresh each time
  localStorage.removeItem('votes');
  
  // Submit story and display it
  const submitBtn = document.getElementById('submit-story');
  submitBtn.addEventListener('click', onSubmit);
  
  // Show input again to enter a new story
  const editBtn = document.getElementById('edit-story');
  editBtn.addEventListener('click', onEdit);

  // Load PO initials
  const poInitials = localStorage.getItem('productOwnerInitials');
  const poCircle = document.getElementById('po-circle');

  if (poCircle && poInitials) {
    poCircle.textContent = poInitials;
    poCircle.dataset.initials = poInitials;
    poCircle.style.cursor = 'pointer';

    // PO voting handler
    poCircle.addEventListener('click', () => {
      productOwnerOnClick(poInitials);
    });
  }

  // Load teammates from localStorage
  const teammates = JSON.parse(localStorage.getItem('teammatesInitials') || '[]');
  const grid = document.getElementById('teammate-slots');
  if (grid || Array.isArray(teammates)) {
    teammates.forEach(initials => {
      initTeammate(initials, grid)
    });
  }

  // Submit vote handler
  document.getElementById('submitVote').addEventListener('click', submitVote)

  // Tally votes
  const tallyBtn = document.getElementById('tally-votes');
  if (tallyBtn) {
    tallyBtn.addEventListener('click', tally)
  }
}

document.addEventListener('DOMContentLoaded', init)
document.getElementById('end-game').addEventListener('click', onEndGame)