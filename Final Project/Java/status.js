document.addEventListener('DOMContentLoaded', () => {
  const table = document.getElementById('statusTable');
  const noSubmissionsMsg = document.getElementById('noSubmissions');

  const loadSubmissions = () => {
    const submissions = JSON.parse(localStorage.getItem('submissions') || '[]');
    
    while (table.rows.length > 1) {
      table.deleteRow(1);
    }

    if (submissions.length === 0) {
      noSubmissionsMsg.style.display = 'block';
      return;
    }

    noSubmissionsMsg.style.display = 'none';

    submissions.forEach((sub, index) => {
      const row = table.insertRow();
      row.innerHTML = `
        <td>${sub.id}</td>
        <td>${sub.name}</td>
        <td>${sub.artType}</td>
        <td>
          <select onchange="updateStatus('${sub.id}', this.value)" style="padding:4px; border-radius:3px;">
            <option value="Pending" ${sub.status === 'Pending' ? 'selected' : ''}>Pending</option>
            <option value="In Progress" ${sub.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
            <option value="Completed" ${sub.status === 'Completed' ? 'selected' : ''}>Completed</option>
          </select>
        </td>
        <td>${sub.submittedAt}</td>
        <td><button onclick="deleteSubmission('${sub.id}')" style="padding:5px 10px; background:#e74c3c; color:white; border:none; border-radius:3px; cursor:pointer;">Delete</button></td>
      `;
    });
  };

  window.updateStatus = (id, newStatus) => {
    const submissions = JSON.parse(localStorage.getItem('submissions') || '[]');
    const sub = submissions.find(s => s.id === id);
    if (sub) {
      sub.status = newStatus;
      localStorage.setItem('submissions', JSON.stringify(submissions));
      loadSubmissions();
    }
  };

  window.deleteSubmission = (id) => {
    if (confirm('Are you sure you want to delete this submission?')) {
      let submissions = JSON.parse(localStorage.getItem('submissions') || '[]');
      submissions = submissions.filter(s => s.id !== id);
      localStorage.setItem('submissions', JSON.stringify(submissions));
      loadSubmissions();
    }
  };

  loadSubmissions();

  setInterval(loadSubmissions, 2000);
});
