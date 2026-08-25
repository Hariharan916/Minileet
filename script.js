/* =========================================================
   CodePractice — application logic
   (static frontend — all execution results are simulated)
   ========================================================= */

const STARTER_CODE = `class Solution:
    def twoSum(self, nums, target):
        pass
`;

/* ---------------------------------------------------------
   Test case data
   Each case is solved locally with a real two-sum algorithm
   purely to produce a plausible "Output" value for the demo —
   no user code is actually executed.
--------------------------------------------------------- */
let testCases = [
  { nums: [2, 7, 11, 15], target: 9, expected: [0, 1], custom: false },
  { nums: [3, 2, 4], target: 6, expected: [1, 2], custom: false },
  { nums: [3, 3], target: 6, expected: [0, 1], custom: false },
];

let activeCaseIndex = 0;

function solveTwoSum(nums, target) {
  const seen = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (seen.has(complement)) return [seen.get(complement), i];
    seen.set(nums[i], i);
  }
  return null;
}

/* ---------------------------------------------------------
   THEME TOGGLE
--------------------------------------------------------- */
const html = document.documentElement;
const themeToggle = document.getElementById('themeToggle');
themeToggle.addEventListener('click', () => {
  const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  if (window.monacoEditorInstance) {
    monaco.editor.setTheme(next === 'dark' ? 'cp-dark' : 'vs');
  }
});

/* ---------------------------------------------------------
   MOBILE NAV
--------------------------------------------------------- */
const hamburgerBtn = document.getElementById('hamburgerBtn');
const topnavLinks = document.getElementById('topnavLinks');
hamburgerBtn.addEventListener('click', () => topnavLinks.classList.toggle('open'));

/* ---------------------------------------------------------
   PROBLEM PANEL TABS (Description / Editorial / Submissions)
--------------------------------------------------------- */
document.querySelectorAll('.ptab').forEach((tab) => {
  tab.addEventListener('click', () => {
    if (tab.disabled) return;
    document.querySelectorAll('.ptab').forEach((t) => t.classList.remove('active'));
    tab.classList.add('active');
  });
});

/* ---------------------------------------------------------
   BOTTOM PANEL TABS (Testcase / Result)
--------------------------------------------------------- */
const btabs = document.querySelectorAll('.btab');
function showBottomTab(name) {
  btabs.forEach((t) => t.classList.toggle('active', t.dataset.btab === name));
  document.getElementById('testcaseTab').classList.toggle('active', name === 'testcase');
  document.getElementById('resultTab').classList.toggle('active', name === 'result');
}
btabs.forEach((t) => t.addEventListener('click', () => showBottomTab(t.dataset.btab)));

/* ---------------------------------------------------------
   TEST CASE SELECTOR
--------------------------------------------------------- */
const caseSelector = document.getElementById('caseSelector');
const caseNumsInput = document.getElementById('caseNumsInput');
const caseTargetInput = document.getElementById('caseTargetInput');
const addCaseBtn = document.getElementById('addCaseBtn');
const customCaseBtn = document.getElementById('customCaseBtn');

function renderCaseChips() {
  caseSelector.querySelectorAll('.case-chip:not(.add-case)').forEach((c) => c.remove());
  testCases.forEach((tc, i) => {
    const chip = document.createElement('button');
    chip.className = 'case-chip' + (i === activeCaseIndex ? ' active' : '');
    chip.dataset.case = i;
    chip.textContent = 'Case ' + (i + 1);
    chip.addEventListener('click', () => selectCase(i));
    caseSelector.insertBefore(chip, addCaseBtn);
  });
}

function selectCase(i) {
  activeCaseIndex = i;
  const tc = testCases[i];
  caseNumsInput.value = `[${tc.nums.join(',')}]`;
  caseTargetInput.value = String(tc.target);
  renderCaseChips();
}

function syncActiveCaseFromFields() {
  const parsed = parseCaseFields();
  if (!parsed) return;
  testCases[activeCaseIndex].nums = parsed.nums;
  testCases[activeCaseIndex].target = parsed.target;
  const solved = solveTwoSum(parsed.nums, parsed.target);
  if (solved) testCases[activeCaseIndex].expected = solved;
}

function parseCaseFields() {
  try {
    const nums = JSON.parse(caseNumsInput.value.trim());
    const target = Number(caseTargetInput.value.trim());
    if (!Array.isArray(nums) || Number.isNaN(target)) return null;
    return { nums, target };
  } catch (e) {
    return null;
  }
}

[caseNumsInput, caseTargetInput].forEach((el) => el.addEventListener('input', syncActiveCaseFromFields));

function addNewCase() {
  const newCase = { nums: [1, 2, 3], target: 5, expected: [0, 2], custom: true };
  testCases.push(newCase);
  selectCase(testCases.length - 1);
}
addCaseBtn.addEventListener('click', addNewCase);
customCaseBtn.addEventListener('click', addNewCase);

renderCaseChips();
selectCase(0);

/* ---------------------------------------------------------
   MONACO EDITOR (with plain-textarea fallback if CDN blocked)
--------------------------------------------------------- */
let monacoEditor = null;
const editorHost = document.getElementById('editorHost');
const editorFallback = document.getElementById('editorFallback');
const fallbackTextarea = document.getElementById('fallbackTextarea');

function getCode() {
  return monacoEditor ? monacoEditor.getValue() : fallbackTextarea.value;
}
function setCode(code) {
  if (monacoEditor) monacoEditor.setValue(code);
  else fallbackTextarea.value = code;
}

function initFallbackEditor() {
  editorFallback.hidden = false;
  fallbackTextarea.value = STARTER_CODE;
  fallbackTextarea.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = fallbackTextarea.selectionStart;
      const end = fallbackTextarea.selectionEnd;
      fallbackTextarea.value =
        fallbackTextarea.value.substring(0, start) + '    ' + fallbackTextarea.value.substring(end);
      fallbackTextarea.selectionStart = fallbackTextarea.selectionEnd = start + 4;
    }
  });
}

let fontSize = 14;
try {
  require.config({ paths: { vs: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.45.0/min/vs' } });
  require(['vs/editor/editor.main'], function () {
    try {
      monaco.editor.defineTheme('cp-dark', {
        base: 'vs-dark',
        inherit: true,
        rules: [],
        colors: {
          'editor.background': '#0b0e13',
          'editor.lineHighlightBackground': '#131826',
          'editorLineNumber.foreground': '#3a4457',
          'editorLineNumber.activeForeground': '#8b95a7',
          'editorGutter.background': '#0b0e13',
          'editor.selectionBackground': '#1f6b5255',
        },
      });
      monacoEditor = monaco.editor.create(editorHost, {
        value: STARTER_CODE,
        language: 'python',
        theme: html.getAttribute('data-theme') === 'dark' ? 'cp-dark' : 'vs',
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: fontSize,
        fontLigatures: false,
        automaticLayout: true,
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        tabSize: 4,
        insertSpaces: true,
        renderLineHighlight: 'line',
        cursorBlinking: 'smooth',
        padding: { top: 14 },
        lineNumbersMinChars: 3,
        smoothScrolling: true,
      });
      window.monacoEditorInstance = monacoEditor;
    } catch (err) {
      console.warn('Monaco failed to initialize, using fallback editor.', err);
      initFallbackEditor();
    }
  });
  // safety net in case the AMD loader silently fails to call back
  setTimeout(() => {
    if (!monacoEditor && editorFallback.hidden) initFallbackEditor();
  }, 4000);
} catch (err) {
  console.warn('Monaco loader unavailable, using fallback editor.', err);
  initFallbackEditor();
}

/* ---- toolbar: format / reset / font size ---- */
document.getElementById('resetBtn').addEventListener('click', () => setCode(STARTER_CODE));

document.getElementById('formatBtn').addEventListener('click', () => {
  // Lightweight, static "formatter": normalizes indentation to 4 spaces.
  const lines = getCode().split('\n');
  const formatted = lines
    .map((line) => line.replace(/^\t+/, (m) => '    '.repeat(m.length)))
    .join('\n');
  setCode(formatted);
  if (monacoEditor) monacoEditor.getAction('editor.action.formatDocument')?.run();
});

document.getElementById('fontPlus').addEventListener('click', () => setFontSize(fontSize + 1));
document.getElementById('fontMinus').addEventListener('click', () => setFontSize(fontSize - 1));
function setFontSize(v) {
  fontSize = Math.min(24, Math.max(10, v));
  document.getElementById('fontSizeVal').textContent = fontSize;
  if (monacoEditor) monacoEditor.updateOptions({ fontSize });
  else fallbackTextarea.style.fontSize = fontSize + 'px';
}

/* ---------------------------------------------------------
   PANEL RESIZING (desktop only)
--------------------------------------------------------- */
function makeResizable(resizerEl, beforeEl, afterEl, containerEl, isVertical) {
  let dragging = false;

  resizerEl.addEventListener('mousedown', (e) => {
    dragging = true;
    resizerEl.classList.add('dragging');
    document.body.style.userSelect = 'none';
    document.body.style.cursor = isVertical ? 'col-resize' : 'row-resize';
    e.preventDefault();
  });

  window.addEventListener('mousemove', (e) => {
    if (!dragging) return;
    const rect = containerEl.getBoundingClientRect();
    if (isVertical) {
      const offset = e.clientX - rect.left;
      const pct = Math.min(75, Math.max(20, (offset / rect.width) * 100));
      beforeEl.style.flexBasis = pct + '%';
      afterEl.style.flexBasis = 100 - pct + '%';
    } else {
      const offset = e.clientY - rect.top;
      const pct = Math.min(80, Math.max(20, (offset / rect.height) * 100));
      beforeEl.style.flexBasis = pct + '%';
      afterEl.style.flexBasis = 100 - pct + '%';
    }
  });

  window.addEventListener('mouseup', () => {
    if (!dragging) return;
    dragging = false;
    resizerEl.classList.remove('dragging');
    document.body.style.userSelect = '';
    document.body.style.cursor = '';
  });

  // basic keyboard support
  resizerEl.addEventListener('keydown', (e) => {
    const step = 2;
    const beforeBasis = parseFloat(beforeEl.style.flexBasis) || 50;
    if ((isVertical && e.key === 'ArrowLeft') || (!isVertical && e.key === 'ArrowUp')) {
      const v = Math.max(20, beforeBasis - step);
      beforeEl.style.flexBasis = v + '%';
      afterEl.style.flexBasis = 100 - v + '%';
    } else if ((isVertical && e.key === 'ArrowRight') || (!isVertical && e.key === 'ArrowDown')) {
      const v = Math.min(80, beforeBasis + step);
      beforeEl.style.flexBasis = v + '%';
      afterEl.style.flexBasis = 100 - v + '%';
    }
  });
}

makeResizable(
  document.getElementById('vResizer'),
  document.getElementById('problemPanel'),
  document.getElementById('rightPanel'),
  document.getElementById('workspace'),
  true
);
makeResizable(
  document.getElementById('hResizer'),
  document.getElementById('editorPanel'),
  document.getElementById('bottomPanel'),
  document.getElementById('rightPanel'),
  false
);

/* ---------------------------------------------------------
   RUN / SUBMIT SIMULATION
--------------------------------------------------------- */
const runBtn = document.getElementById('runBtn');
const submitBtn = document.getElementById('submitBtn');
const actionStatus = document.getElementById('actionStatus');
const resultEmpty = document.getElementById('resultEmpty');
const resultContent = document.getElementById('resultContent');

function fmtArr(a) {
  return '[' + a.join(', ') + ']';
}

function setButtonsBusy(busy) {
  runBtn.disabled = busy;
  submitBtn.disabled = busy;
}

function evaluateCase(tc) {
  const output = solveTwoSum(tc.nums, tc.target);
  const pass = output && tc.expected && output[0] === tc.expected[0] && output[1] === tc.expected[1];
  return { output, pass };
}

runBtn.addEventListener('click', () => {
  setButtonsBusy(true);
  actionStatus.textContent = 'Running…';
  showBottomTab('result');

  setTimeout(() => {
    const tc = testCases[activeCaseIndex];
    const { output, pass } = evaluateCase(tc);

    resultEmpty.hidden = true;
    resultContent.hidden = false;
    resultContent.innerHTML = `
      <div class="result-summary ${pass ? 'accepted' : 'wrong'}">
        <svg class="status-icon" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          ${pass ? '<polyline points="20 6 9 17 4 12"/>' : '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>'}
        </svg>
        <div class="result-summary-text">
          <div class="status-title">${pass ? 'Run successful' : 'Wrong Answer'}</div>
          <div class="status-sub">Output: ${fmtArr(output || [])}</div>
        </div>
      </div>

      <div class="case-result-selector">
        ${testCases
          .map((c, i) => {
            const r = evaluateCase(c);
            return `<span class="result-chip ${r.pass ? 'pass' : 'fail'}"><span class="dot"></span>Case ${i + 1}</span>`;
          })
          .join('')}
      </div>

      <div class="result-detail-grid">
        <div class="result-detail-item">
          <div class="rd-label">nums</div>
          <div class="rd-value">${fmtArr(tc.nums)}</div>
        </div>
        <div class="result-detail-item">
          <div class="rd-label">target</div>
          <div class="rd-value">${tc.target}</div>
        </div>
        <div class="result-detail-item ${pass ? 'match' : ''}">
          <div class="rd-label">Expected Output</div>
          <div class="rd-value">${fmtArr(tc.expected)}</div>
        </div>
        <div class="result-detail-item ${pass ? 'match' : 'mismatch'}">
          <div class="rd-label">Actual Output</div>
          <div class="rd-value">${fmtArr(output || [])}</div>
        </div>
      </div>
    `;

    actionStatus.textContent = 'Last run · just now';
    setButtonsBusy(false);
  }, 500);
});

submitBtn.addEventListener('click', () => {
  setButtonsBusy(true);
  actionStatus.textContent = 'Submitting…';
  showBottomTab('result');

  setTimeout(() => {
    const results = testCases.map((c) => evaluateCase(c));
    const allPass = results.every((r) => r.pass);
    const passCount = results.filter((r) => r.pass).length;

    resultEmpty.hidden = true;
    resultContent.hidden = false;
    resultContent.innerHTML = `
      <div class="result-summary ${allPass ? 'accepted' : 'wrong'}">
        <svg class="status-icon" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          ${allPass ? '<polyline points="20 6 9 17 4 12"/>' : '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>'}
        </svg>
        <div class="result-summary-text">
          <div class="status-title">${allPass ? 'Accepted' : 'Wrong Answer'}</div>
          <div class="status-sub">${passCount}/${testCases.length} test cases passed</div>
        </div>
        <div class="metric-row">
          <div class="metric">
            <div class="metric-val">52 ms</div>
            <div class="metric-label">Runtime</div>
          </div>
          <div class="metric">
            <div class="metric-val">16.4 MB</div>
            <div class="metric-label">Memory</div>
          </div>
        </div>
      </div>

      <div class="case-result-selector">
        ${testCases
          .map((c, i) => `<span class="result-chip ${results[i].pass ? 'pass' : 'fail'}"><span class="dot"></span>Case ${i + 1}</span>`)
          .join('')}
      </div>

      <div class="result-detail-grid">
        <div class="result-detail-item full">
          <div class="rd-label">Test Cases</div>
          <div class="rd-value">${testCases.length} total · ${passCount} passed</div>
        </div>
      </div>
    `;

    actionStatus.textContent = 'Submitted · just now';
    setButtonsBusy(false);
  }, 700);
});
