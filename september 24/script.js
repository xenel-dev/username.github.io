let players = [];
let currentPage = 1;
const rowsPerPage = 10;
let currentSort = { key: null, direction: 'asc' };

async function loadData() {
  const response = await fetch('leaderboard.json');
  const data = await response.json();
  players = data.map((player, index) => {
    const [firstName, ...lastNameParts] = player.name.split(' ');
    const fullName = player.name;

    return {
      rank: index + 1,
      avatar: `https://api.dicebear.com/7.x/lorelei/svg?seed=${encodeURIComponent(fullName)}`,
      firstName,
      lastName: lastNameParts.join(' '),
      score: player.score,
      level: player.level,
      joinDate: player.join_date,
      country: player.country
    };
  });
  renderTable();
  updatePageSelector();
}

function renderTable() {
  const tbody = document.querySelector('#leaderboard tbody');
  tbody.innerHTML = '';

  let sortedPlayers = [...players];
  if (currentSort.key) {
    sortedPlayers.sort((a, b) => {
      const valA = a[currentSort.key];
      const valB = b[currentSort.key];

      if (typeof valA === 'number') {
        return currentSort.direction === 'asc' ? valA - valB : valB - valA;
      } else {
        return currentSort.direction === 'asc'
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      }
    });
  }

  const start = (currentPage - 1) * rowsPerPage;
  const end = start + rowsPerPage;
  const pagePlayers = sortedPlayers.slice(start, end);

  pagePlayers.forEach(player => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${player.rank}</td>
      <td class="avatar-cell"><img src="${player.avatar}" alt="${player.firstName || 'Player'} ${player.lastName || ''}" /></td>
      <td>${player.firstName}</td>
      <td>${player.lastName}</td>
      <td>${player.score}</td>
      <td>${player.level}</td>
      <td>${player.joinDate}</td>
      <td>${player.country}</td>
    `;
    tbody.appendChild(row);
  });

  updateSortIndicators();
}

function updatePageSelector() {
  const pageSelect = document.getElementById('pageSelect');
  pageSelect.innerHTML = '';

  const totalPages = Math.ceil(players.length / rowsPerPage);
  for (let i = 1; i <= totalPages; i++) {
    const option = document.createElement('option');
    option.value = i;
    option.textContent = `Page ${i}`;
    if (i === currentPage) option.selected = true;
    pageSelect.appendChild(option);
  }

  document.getElementById('prevPage').disabled = currentPage === 1;
  document.getElementById('nextPage').disabled = currentPage === totalPages;
}

function updateSortIndicators() {
  document.querySelectorAll('#leaderboard th').forEach(th => {
    const keyMap = {
      'Rank': 'rank',
      'Avatar': null,
      'First Name': 'firstName',
      'Last Name': 'lastName',
      'Score': 'score',
      'Level': 'level',
      'Join Date': 'joinDate',
      'Country': 'country'
    };

    const key = keyMap[th.textContent.replace(/ ↑| ↓/, '').trim()];
    if (!key) return;

    if (key === currentSort.key) {
      th.textContent = th.textContent.replace(/ ↑| ↓/, '').trim() + (currentSort.direction === 'asc' ? ' ↑' : ' ↓');
    } else {
      th.textContent = th.textContent.replace(/ ↑| ↓/, '').trim();
    }
  });
}

document.getElementById('pageSelect').addEventListener('change', (e) => {
  currentPage = parseInt(e.target.value);
  renderTable();
  updatePageSelector();
});

document.getElementById('prevPage').addEventListener('click', () => {
  if (currentPage > 1) {
    currentPage--;
    renderTable();
    updatePageSelector();
  }
});

document.getElementById('nextPage').addEventListener('click', () => {
  const totalPages = Math.ceil(players.length / rowsPerPage);
  if (currentPage < totalPages) {
    currentPage++;
    renderTable();
    updatePageSelector();
  }
});

document.querySelectorAll('#leaderboard th').forEach(th => {
  th.addEventListener('click', () => {
    const keyMap = {
      'Rank': 'rank',
      'Avatar': null,
      'First Name': 'firstName',
      'Last Name': 'lastName',
      'Score': 'score',
      'Level': 'level',
      'Join Date': 'joinDate',
      'Country': 'country'
    };

    const key = keyMap[th.textContent.replace(/ ↑| ↓/, '').trim()];
    if (!key) return;

    if (currentSort.key === key) {
      currentSort.direction = currentSort.direction === 'asc' ? 'desc' : 'asc';
    } else {
      currentSort.key = key;
      currentSort.direction = 'asc';
    }

    renderTable();
    updatePageSelector();
  });
});

loadData();
