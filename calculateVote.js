// Fibonacci function
export function nextFibonacci(number) {
  let a = 1, b = 1;
  while (b < number) {
    [a, b] = [b, a + b];
  }
  return b;
}

export function tally() {
  const allVotes = JSON.parse(localStorage.getItem('votes') || '{}');
  const method = localStorage.getItem('scoringMethod') || 'fibonacci';
  let result;
  const numEntries = Object.keys(allVotes).length
  if (numEntries === 0) {
    document.getElementById('resultsBody').textContent = 'No Votes Cast';
    new bootstrap.Modal(document.getElementById('resultsModal')).show();
    return
  }

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
}

export function productOwnerOnClick(poInitials) {
  const votes = JSON.parse(localStorage.getItem('votes') || '{}');
  document.getElementById('voteModalLabel').textContent = `Vote for ${poInitials}`;
  document.getElementById('voteInput').value = votes[poInitials] || '';
  document.getElementById('submitVote').dataset.initials = poInitials;
  new bootstrap.Modal(document.getElementById('voteModal')).show();
}

export function submitVote() {
  const initials = document.getElementById('submitVote').dataset.initials;
  const voteValue = document.getElementById('voteInput').value.trim();
  if (!voteValue) return;

  const method = localStorage.getItem('scoringMethod') || 'fibonacci';

  // Validation based on scoring method
  if (method === 'fibonacci') {
    const fibSet = new Set([1, 2, 3, 5, 8, 13, 21, 34, 55, 89]);
    const num = parseInt(voteValue, 10);
    if (!fibSet.has(num)) {
      alert("Please enter a valid Fibonacci number: 1, 2, 3, 5, 8, 13, 21, 34, 55, 89...");
      return;
    }
  } else if (method === 'tshirt') {
      const validSizes = ['XS', 'S', 'M', 'L', 'XL'];
      if (!validSizes.includes(voteValue.toUpperCase())) {
        alert("Please enter a valid T-shirt size: XS, S, M, L, XL");
      return;
      }
  } else if (method === 'days') {
    const num = parseFloat(voteValue);
    if (isNaN(num) || num < 0) {
      alert("Please enter a valid number");
    return;
  }
}
  const votes = JSON.parse(localStorage.getItem('votes') || '{}');
  votes[initials] = voteValue
  // Update in-memory and persist to localStorage
  localStorage.setItem('votes', JSON.stringify(votes));

  // Mark voted
  document.querySelectorAll('.circle').forEach(c => {
    if (c.dataset.initials === initials) c.classList.add('voted');
  });

  bootstrap.Modal.getInstance(document.getElementById('voteModal')).hide();
}