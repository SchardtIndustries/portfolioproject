(() => {
  const search = document.getElementById('job-search');
  const department = document.getElementById('job-department');
  const type = document.getElementById('job-type');
  const results = document.getElementById('job-results');
  const count = document.getElementById('job-count');
  const empty = document.getElementById('job-empty');
  const error = document.getElementById('job-error');
  const clear = document.getElementById('clear-filters');
  const dialog = document.getElementById('job-dialog');
  const title = document.getElementById('job-title');
  const slot = document.getElementById('application-slot');
  const formTemplate = slot.querySelector('form').cloneNode(true);
  const drafts = new Map(); // Kept in this tab only; never persisted to browser storage.
  let jobs = [];
  let activeJob = null;
  let opener = null;

  function element(tag, text, className) {
    const node = document.createElement(tag);
    node.textContent = text;
    if (className) node.className = className;
    return node;
  }

  function application(job) {
    if (drafts.has(job.id)) return drafts.get(job.id);
    const form = formTemplate.cloneNode(true);
    form.elements.namedItem('job-id').value = job.id;
    form.elements.namedItem('position').value = job.title;
    form.elements.namedItem('department').value = job.department;
    form.querySelector('label[for="application-message"]').textContent = job.applicationPrompt;
    const resume = form.elements.namedItem('resume');
    const feedback = form.querySelector('.form-error');
    function validateResume() {
      const file = resume.files[0];
      let message = '';
      if (file && !/\.(pdf|doc|docx)$/i.test(file.name)) message = 'Choose a PDF, DOC, or DOCX résumé.';
      else if (file && file.size > 5 * 1024 * 1024) message = 'Your résumé exceeds 5 MB. Please choose a smaller file.';
      else if (file && file.size === 0) message = 'This file is empty. Please choose your résumé again.';
      resume.setCustomValidity(message);
      feedback.textContent = message;
      resume.setAttribute('aria-invalid', message ? 'true' : 'false');
    }
    resume.addEventListener('change', validateResume);
    form.addEventListener('submit', (event) => {
      validateResume();
      if (!activeJob || activeJob.id !== job.id || !form.reportValidity()) event.preventDefault();
    });
    drafts.set(job.id, form);
    return form;
  }

  function openJob(job, trigger) {
    if (trigger) opener = trigger;
    activeJob = job;
    title.textContent = job.title;
    document.getElementById('job-category').textContent = `${job.company} / ${job.department}`;
    document.getElementById('job-meta').textContent = `${job.type} · ${job.location}`;
    document.getElementById('job-pay').textContent = job.compensation;
    document.getElementById('application-position').textContent = `Applying for: ${job.title}`;
    const description = document.getElementById('job-description');
    description.replaceChildren();
    job.sections.forEach((section) => {
      description.append(element('h3', section.heading));
      (section.paragraphs || []).forEach((text) => description.append(element('p', text)));
      if (section.bullets) {
        const list = document.createElement('ul');
        section.bullets.forEach((text) => list.append(element('li', text)));
        description.append(list);
      }
    });
    slot.replaceChildren(application(job));
    if (!dialog.open) dialog.showModal();
    document.body.classList.add('career-modal-open');
    dialog.scrollTop = 0;
    title.focus({ preventScroll: true });
  }

  function syncHash() {
    const job = jobs.find((item) => `#${item.id}` === location.hash);
    if (job) openJob(job);
    else if (dialog.open) dialog.close();
  }

  function render() {
    const words = search.value.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
    const matches = jobs.filter((job) => {
      const searchable = [job.title, job.company, job.department, job.type, job.location, job.summary, job.compensation,
        ...job.sections.flatMap((section) => [section.heading, ...(section.paragraphs || []), ...(section.bullets || [])])].join(' ').toLocaleLowerCase();
      return (!department.value || department.value === job.department) && (!type.value || type.value === job.type) && words.every((word) => searchable.includes(word));
    });
    results.replaceChildren();
    matches.forEach((job) => {
      const card = element('button', '', 'career-job-card');
      card.type = 'button';
      card.setAttribute('aria-haspopup', 'dialog');
      card.setAttribute('aria-label', `View ${job.title}`);
      const content = element('span', '', 'career-job-content');
      content.append(element('span', `${job.company} / ${job.department}`, 'career-eyebrow'));
      content.append(element('span', job.title, 'career-job-title'));
      content.append(element('span', job.summary, 'career-job-summary'));
      content.append(element('span', `${job.type} · ${job.location}`, 'career-job-meta'));
      const action = element('span', '', 'career-job-action');
      action.append(element('span', job.compensation, 'career-pay'), element('span', 'View opportunity →', 'career-job-link'));
      card.append(content, action);
      card.addEventListener('click', () => {
        history.pushState(null, '', `#${job.id}`);
        openJob(job, card);
      });
      results.append(card);
    });
    count.textContent = `${matches.length} ${matches.length === 1 ? 'opportunity' : 'opportunities'}${matches.length !== jobs.length ? ` of ${jobs.length}` : ''}`;
    const filtered = Boolean(search.value || department.value || type.value);
    clear.hidden = !filtered;
    empty.hidden = matches.length !== 0;
    empty.querySelector('h3').textContent = jobs.length ? 'No matching opportunities' : 'No open positions right now';
    empty.querySelector('p').textContent = jobs.length ? 'Try a different keyword or clear your filters to see all open positions.' : 'Please check back for new opportunities as our teams grow.';
  }

  async function load() {
    error.hidden = true;
    count.textContent = 'Loading opportunities…';
    try {
      const response = await fetch('data/careers.json');
      if (!response.ok) throw new Error('Unable to load careers');
      const data = await response.json();
      const ids = new Set();
      if (!Array.isArray(data)) throw new Error('Invalid careers data');
      data.forEach((job) => {
        const fields = ['id', 'status', 'title', 'company', 'department', 'type', 'location', 'compensation', 'summary', 'applicationPrompt'];
        if (fields.some((key) => typeof job[key] !== 'string' || !job[key].trim()) || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(job.id) || ids.has(job.id) || !['open', 'closed'].includes(job.status) || !Array.isArray(job.sections)) throw new Error('Invalid job');
        job.sections.forEach((section) => {
          if (typeof section.heading !== 'string' || ['paragraphs', 'bullets'].some((key) => section[key] !== undefined && (!Array.isArray(section[key]) || section[key].some((text) => typeof text !== 'string')))) throw new Error('Invalid job section');
        });
        ids.add(job.id);
      });
      jobs = data.filter((job) => job.status === 'open');
      for (const [select, key] of [[department, 'department'], [type, 'type']]) {
        while (select.options.length > 1) select.remove(1);
        [...new Set(jobs.map((job) => job[key]))].sort().forEach((value) => select.add(new Option(value, value)));
      }
      [search, department, type].forEach((control) => { control.disabled = false; });
      render();
      syncHash();
    } catch {
      results.replaceChildren();
      empty.hidden = true;
      error.hidden = false;
      count.textContent = 'Openings unavailable';
    }
  }

  document.querySelector('.career-filters').addEventListener('submit', (event) => event.preventDefault());
  search.addEventListener('input', render);
  [department, type].forEach((select) => select.addEventListener('change', render));
  clear.addEventListener('click', () => {
    search.value = department.value = type.value = '';
    render();
    search.focus();
  });
  document.getElementById('retry-jobs').addEventListener('click', load);
  document.getElementById('close-job').addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => {
    document.body.classList.remove('career-modal-open');
    if (activeJob && location.hash === `#${activeJob.id}`) history.replaceState(null, '', location.pathname + location.search);
    activeJob = null;
    if (opener && opener.isConnected) opener.focus();
    else search.focus();
  });
  let backdropDown = false;
  dialog.addEventListener('pointerdown', (event) => { backdropDown = event.target === dialog; });
  dialog.addEventListener('click', (event) => {
    if (backdropDown && event.target === dialog) dialog.close();
    backdropDown = false;
  });
  document.getElementById('jump-apply').addEventListener('click', (event) => {
    event.preventDefault();
    document.getElementById('application-title').scrollIntoView({ block: 'start' });
    slot.querySelector('[name="name"]').focus({ preventScroll: true });
  });
  window.addEventListener('hashchange', syncHash);
  window.addEventListener('popstate', syncHash);
  load();
})();
