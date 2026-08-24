/* =====================================================================
   AI IDEA GENERATOR — SCRIPT
   No API, no AI model, no internet connection needed. Everything here
   is plain JavaScript that combines your three answers with pre-written
   text "building blocks" to assemble a concept. It LOOKS AI-generated,
   but it's really just smart templates — that's what makes it free,
   simple, and something you can fully understand and edit.

   Sections:
   1. Word banks (the building blocks used to assemble results)
   2. The generator function (combines your inputs + word banks)
   3. Form handling (validation, loading state, showing results)
   ===================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* -------------------------------------------------------------------
     1. WORD BANKS
     These are lists of ready-made phrases. The generator randomly
     picks a few from each list every time, so results feel slightly
     different if you tap "Generate Another Version." Feel free to add
     your own lines to any list below.
  ------------------------------------------------------------------- */

  const SOLUTION_TEMPLATES = [
    (b, p, c) => `An AI-assisted tool built for ${b} businesses that directly tackles "${p}" by automating the repetitive parts of the process for ${c}.`,
    (b, p, c) => `A smart assistant designed for ${b} that helps solve "${p}" through automation, freeing up time to focus on ${c}.`,
    (b, p, c) => `A lightweight AI concept for ${b} businesses: it listens for common versions of "${p}" and responds instantly, built specifically with ${c} in mind.`,
  ];

  const FEATURE_BANK = [
    'AI-powered chat assistant that answers common questions instantly',
    'Simple dashboard showing key activity at a glance',
    'Automated reminders and follow-ups',
    'Quick-reply templates for repeated situations',
    'Basic customer request tracking',
    'Mobile-first interface, usable on any phone',
    'One-click sharing of results or updates',
    'Searchable history of past interactions',
    'Personalized suggestions based on past activity',
    'Simple analytics: what\'s working, what\'s not',
  ];

  const TECH_BANK = [
    'HTML, CSS & JavaScript for the interface (what you already know)',
    'A free-tier AI API (e.g. for text generation) once basics are working',
    'Firebase or a similar free backend for saving user data',
    'GitHub Pages or Netlify for free hosting',
    'A simple form + spreadsheet (like Google Sheets) as an early "fake backend"',
    'Python for any automation scripts behind the scenes',
  ];

  const EARNING_BANK = [
    'Freemium: free basic version, paid upgrade for advanced features',
    'One-time setup fee for small businesses who want it customized',
    'Monthly subscription for continued access and updates',
    'Pay-per-use credits for occasional users',
    'Simple ad-supported free tier',
    'Offer it as a paid add-on service to existing clients',
  ];

  const ROADMAP_TEMPLATES = (b, p) => [
    `Sketch the core screens on paper: what does someone using this for "${p}" actually tap through?`,
    `Build a static version in HTML/CSS — no logic yet, just the look and layout.`,
    `Add JavaScript to make the main action work (even with fake/sample data).`,
    `Test it yourself as if you were a ${b} business owner — note anything confusing.`,
    `Replace fake data with something closer to real (a small free API or your own written examples).`,
    `Deploy a working demo for free and share it for feedback.`,
  ];

  /* -------------------------------------------------------------------
     2. THE GENERATOR FUNCTION
     Takes the three typed answers and returns one object containing
     everything the results section needs to display.
  ------------------------------------------------------------------- */

  // Picks `count` random, non-repeating items from an array
  function pickRandom(array, count) {
    const shuffled = [...array].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  }

  function generateIdeaConcept(businessType, problem, customers) {
    const solutionTemplate = SOLUTION_TEMPLATES[Math.floor(Math.random() * SOLUTION_TEMPLATES.length)];

    return {
      solution: solutionTemplate(businessType, problem, customers),
      features: pickRandom(FEATURE_BANK, 4),
      audience: `Primarily ${customers}, connected to ${businessType} businesses that deal with "${problem}" on a regular basis.`,
      tech: pickRandom(TECH_BANK, 4),
      earning: pickRandom(EARNING_BANK, 3),
      roadmap: ROADMAP_TEMPLATES(businessType, problem),
    };
  }


  /* -------------------------------------------------------------------
     3. FORM HANDLING
     Validates the three fields, shows a short "thinking" pause for
     feel, then fills in and reveals the results section.
  ------------------------------------------------------------------- */

  const form = document.getElementById('ideaForm');
  const loadingPanel = document.getElementById('loadingPanel');
  const resultsPanel = document.getElementById('resultsPanel');
  const generateBtn = document.getElementById('generateBtn');

  const fields = {
    businessType: document.getElementById('businessType'),
    problem: document.getElementById('problem'),
    customers: document.getElementById('customers'),
  };

  // Keeps the last valid inputs so "Generate Another Version" can reuse them
  let lastInputs = null;

  function validateFields() {
    let isValid = true;

    Object.keys(fields).forEach((key) => {
      const input = fields[key];
      const wrapper = input.closest('.field');
      const value = input.value.trim();

      if (value.length === 0) {
        wrapper.classList.add('has-error');
        isValid = false;
      } else {
        wrapper.classList.remove('has-error');
      }
    });

    return isValid;
  }

  function fillResults(concept, businessType) {
    document.getElementById('resultHeading').textContent = `Idea Concept for a ${businessType} Business`;
    document.getElementById('resSolution').textContent = concept.solution;
    document.getElementById('resAudience').textContent = concept.audience;

    const featuresEl = document.getElementById('resFeatures');
    featuresEl.innerHTML = '';
    concept.features.forEach((item) => {
      const li = document.createElement('li');
      li.textContent = item;
      featuresEl.appendChild(li);
    });

    const techEl = document.getElementById('resTech');
    techEl.innerHTML = '';
    concept.tech.forEach((item) => {
      const li = document.createElement('li');
      li.textContent = item;
      techEl.appendChild(li);
    });

    const earningEl = document.getElementById('resEarning');
    earningEl.innerHTML = '';
    concept.earning.forEach((item) => {
      const li = document.createElement('li');
      li.textContent = item;
      earningEl.appendChild(li);
    });

    const roadmapEl = document.getElementById('resRoadmap');
    roadmapEl.innerHTML = '';
    concept.roadmap.forEach((item) => {
      const li = document.createElement('li');
      li.textContent = item;
      roadmapEl.appendChild(li);
    });
  }

  function runGeneration(businessType, problem, customers) {
    // Show the loading state and hide any previous results
    form.closest('.form-panel').hidden = true;
    resultsPanel.hidden = true;
    loadingPanel.hidden = false;
    generateBtn.disabled = true;

    // Small delay purely so it feels like it's "thinking" —
    // remove this setTimeout wrapper if you'd rather it be instant.
    setTimeout(() => {
      const concept = generateIdeaConcept(businessType, problem, customers);
      fillResults(concept, businessType);

      loadingPanel.hidden = true;
      resultsPanel.hidden = false;
      generateBtn.disabled = false;

      resultsPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 900);
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    if (!validateFields()) return;

    lastInputs = {
      businessType: fields.businessType.value.trim(),
      problem: fields.problem.value.trim(),
      customers: fields.customers.value.trim(),
    };

    runGeneration(lastInputs.businessType, lastInputs.problem, lastInputs.customers);
  });

  // "Generate Another Version" reuses the same inputs, new random picks
  document.getElementById('regenerateBtn').addEventListener('click', () => {
    if (!lastInputs) return;
    runGeneration(lastInputs.businessType, lastInputs.problem, lastInputs.customers);
  });

  // "Start a New Idea" clears the form and brings it back into view
  document.getElementById('newIdeaBtn').addEventListener('click', () => {
    form.reset();
    resultsPanel.hidden = true;
    form.closest('.form-panel').hidden = false;
    form.closest('.form-panel').scrollIntoView({ behavior: 'smooth', block: 'start' });
    fields.businessType.focus();
  });

});

