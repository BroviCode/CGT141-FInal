document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('submitForm');
  const messageEl = document.getElementById('formMessage');
  if (!form) return;

  const showMessage = (type, text) => {
    if (!messageEl) {
      alert(text);
      return;
    }
    messageEl.className = type === 'success' ? 'success' : 'error';
    messageEl.textContent = text;
  };

  const clearFieldErrors = () => {
    ['nameError', 'emailError', 'detailsError'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.textContent = '';
    });
  };

  const validate = () => {
    clearFieldErrors();
    let hasErrors = false;
    const name = (form.elements['name'] && form.elements['name'].value || '').trim();
    const emailEl = form.elements['email'];
    const details = (form.elements['details'] && form.elements['details'].value || '').trim();

    if (!name) {
      const el = document.getElementById('nameError');
      if (el) el.textContent = 'Please enter your name.';
      hasErrors = true;
    }
    if (!emailEl || !emailEl.value) {
      const el = document.getElementById('emailError');
      if (el) el.textContent = 'Please enter your email.';
      hasErrors = true;
    } else if (!emailEl.checkValidity()) {
      const el = document.getElementById('emailError');
      if (el) el.textContent = 'Please enter a valid email address.';
      hasErrors = true;
    }
    if (!details || details.length < 10) {
      const el = document.getElementById('detailsError');
      if (el) el.textContent = 'Please provide at least 10 characters for details.';
      hasErrors = true;
    }

    return !hasErrors;
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearFieldErrors();

    if (!validate()) {
      return;
    }

    const submitBtn = document.getElementById('submitBtn') || form.querySelector('input[type="submit"]');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.classList.add('loading');
    }

    const formData = new FormData(form);

    try {
      // Save submission to localStorage first (no network dependency)
      const submissions = JSON.parse(localStorage.getItem('submissions') || '[]');
      const submissionId = 'SUB-' + Date.now();
      submissions.push({
        id: submissionId,
        name: form.elements['name'].value,
        email: form.elements['email'].value,
        artType: form.elements['artType'].value,
        details: form.elements['details'].value,
        status: 'Pending',
        submittedAt: new Date().toLocaleString()
      });
      localStorage.setItem('submissions', JSON.stringify(submissions));

      if (form.action && form.action !== 'https://httpbin.org/post') {
        try {
          const res = await fetch(form.action, {
            method: form.method || 'POST',
            body: formData,
          });
        } catch (e) {
          console.log('Server submission skipped (offline or server unavailable)');
        }
      }

      showMessage('success', 'Submission successful. Thank you! (ID: ' + submissionId + ')');
      form.reset();
    } catch (err) {
      console.error('Submit error', err);
      showMessage('error', 'Submission failed — please try again later.');
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.classList.remove('loading');
      }
    }
  });
});
