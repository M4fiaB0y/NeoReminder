/**
 * NeoReminder — Main Application Controller
 * Handles UI interactions, file uploads, timetable rendering, modals, and calendar sync
 */

document.addEventListener('DOMContentLoaded', () => {
  // Application State
  const state = {
    currentClasses: [],
    fileName: 'Routine',
    selectedBatchKey: localStorage.getItem('neoreminder_batch_key') || 'batch_14_sec_b',
    selectedDays: 30,
    startDate: getTodayIsoString(),
    alarmMinutes: 10,
    activeTab: 'grid', // 'grid' or 'list'
    theme: localStorage.getItem('neoreminder_theme') || 'dark',
    aiEnabled: localStorage.getItem('neoreminder_ai_enabled') === 'true',
    geminiApiKey: localStorage.getItem('neoreminder_gemini_key') || ''
  };

  // Color palette for subjects
  const SUBJECT_COLORS = [
    '#3b82f6', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b', '#06b6d4', '#6366f1', '#14b8a6'
  ];
  const subjectColorMap = new Map();

  function getSubjectColor(subj) {
    if (!subj) return SUBJECT_COLORS[0];
    const key = subj.trim().toLowerCase();
    if (!subjectColorMap.has(key)) {
      const idx = subjectColorMap.size % SUBJECT_COLORS.length;
      subjectColorMap.set(key, SUBJECT_COLORS[idx]);
    }
    return subjectColorMap.get(key);
  }

  // DOM Elements
  const batchSelectorSection = document.getElementById('batchSelectorSection');
  const batchSelectDropdown = document.getElementById('batchSelectDropdown');
  const quickBatchPills = document.getElementById('quickBatchPills');
  const toggleUploadBtn = document.getElementById('toggleUploadBtn');

  const dropzone = document.getElementById('dropzone');
  const fileInput = document.getElementById('fileInput');
  const uploadSection = document.getElementById('uploadSection');
  const processingSection = document.getElementById('processingSection');
  const reviewSection = document.getElementById('reviewSection');

  const progressBarFill = document.getElementById('progressBarFill');
  const progressStatusText = document.getElementById('progressStatusText');
  const progressPercentText = document.getElementById('progressPercentText');
  const scanLogs = document.getElementById('scanLogs');

  const routineFileName = document.getElementById('routineFileName');
  const routineSummaryText = document.getElementById('routineSummaryText');
  const timetableGrid = document.getElementById('timetableGrid');
  const classCardsList = document.getElementById('classCardsList');
  const gridWrapper = document.getElementById('gridWrapper');
  const listWrapper = document.getElementById('listWrapper');

  const tabGridBtn = document.getElementById('tabGridBtn');
  const tabListBtn = document.getElementById('tabListBtn');
  const addClassBtn = document.getElementById('addClassBtn');
  const reScanBtn = document.getElementById('reScanBtn');

  const daysPresetGroup = document.getElementById('daysPresetGroup');
  const customDaysInput = document.getElementById('customDaysInput');
  const startDateInput = document.getElementById('startDateInput');
  const reminderAlarmSelect = document.getElementById('reminderAlarmSelect');
  const printRoutineBtn = document.getElementById('printRoutineBtn');
  const routineSearchInput = document.getElementById('routineSearchInput');
  const clearSearchBtn = document.getElementById('clearSearchBtn');

  const phoneAutoSaveBtn = document.getElementById('phoneAutoSaveBtn');
  const saveCalendarBtn = document.getElementById('saveCalendarBtn');
  const copySummaryBtn = document.getElementById('copySummaryBtn');

  const todayBanner = document.getElementById('todayBanner');
  const todayBannerTitle = document.getElementById('todayBannerTitle');
  const todayBannerSubtitle = document.getElementById('todayBannerSubtitle');
  const todayBadgeText = document.getElementById('todayBadgeText');

  const statTotalClasses = document.getElementById('statTotalClasses');
  const statTotalHours = document.getElementById('statTotalHours');
  const statActiveDays = document.getElementById('statActiveDays');
  const statFreeDays = document.getElementById('statFreeDays');

  // Modals
  const classModal = document.getElementById('classModal');
  const classForm = document.getElementById('classForm');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const cancelModalBtn = document.getElementById('cancelModalBtn');
  const deleteClassBtn = document.getElementById('deleteClassBtn');
  const editClassId = document.getElementById('editClassId');
  const editCourseCode = document.getElementById('editCourseCode');
  const editCourseName = document.getElementById('editCourseName');
  const editDay = document.getElementById('editDay');
  const editRoom = document.getElementById('editRoom');
  const editStartTime = document.getElementById('editStartTime');
  const editEndTime = document.getElementById('editEndTime');
  const editTeacher = document.getElementById('editTeacher');
  const modalTitle = document.getElementById('modalTitle');

  const aiSettingsBtn = document.getElementById('aiSettingsBtn');
  const aiModal = document.getElementById('aiModal');
  const closeAiModalBtn = document.getElementById('closeAiModalBtn');
  const saveAiKeyBtn = document.getElementById('saveAiKeyBtn');
  const clearAiKeyBtn = document.getElementById('clearAiKeyBtn');
  const geminiApiKeyInput = document.getElementById('geminiApiKeyInput');
  const enableAiToggle = document.getElementById('enableAiToggle');
  const aiStatusBadge = document.getElementById('aiStatusBadge');

  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const themeIcon = document.getElementById('themeIcon');
  const toastContainer = document.getElementById('toastContainer');
  const browseFilesBtn = document.getElementById('browseFilesBtn');

  // Creator Follow Modal elements (@M4fiaB0y)
  const creatorModal = document.getElementById('creatorModal');
  const dismissCreatorBtn = document.getElementById('dismissCreatorBtn');
  const followGithubBtn = document.getElementById('followGithubBtn');

  // Phone Calendar Guidance elements
  const openPhoneGuideBtn = document.getElementById('openPhoneGuideBtn');
  const phoneGuideBox = document.getElementById('phoneGuideBox');
  const tabIosBtn = document.getElementById('tabIosBtn');
  const tabAndroidBtn = document.getElementById('tabAndroidBtn');
  const iosStepsContent = document.getElementById('iosStepsContent');
  const androidStepsContent = document.getElementById('androidStepsContent');

  const phoneDownloadModal = document.getElementById('phoneDownloadModal');
  const closePhoneModalBtn = document.getElementById('closePhoneModalBtn');
  const closePhoneModalDoneBtn = document.getElementById('closePhoneModalDoneBtn');
  const modalTabIosBtn = document.getElementById('modalTabIosBtn');
  const modalTabAndroidBtn = document.getElementById('modalTabAndroidBtn');
  const modalIosSteps = document.getElementById('modalIosSteps');
  const modalAndroidSteps = document.getElementById('modalAndroidSteps');

  // ==========================================
  // Initialization
  // ==========================================
  initTheme();
  initFormValues();
  initBatchSelector();
  initEventListeners();
  updateAiBadge();

  function getTodayIsoString() {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }

  function initTheme() {
    document.documentElement.setAttribute('data-theme', state.theme);
    if (themeIcon) {
      themeIcon.setAttribute('data-lucide', state.theme === 'dark' ? 'moon' : 'sun');
    }
  }

  function initFormValues() {
    startDateInput.value = state.startDate;
    customDaysInput.value = state.selectedDays;
    geminiApiKeyInput.value = state.geminiApiKey;
    enableAiToggle.checked = state.aiEnabled;
  }

  function updateAiBadge() {
    if (state.aiEnabled && state.geminiApiKey) {
      aiStatusBadge.textContent = 'Active';
      aiStatusBadge.style.background = 'rgba(16, 185, 129, 0.2)';
      aiStatusBadge.style.color = '#10b981';
    } else {
      aiStatusBadge.textContent = 'Optional';
      aiStatusBadge.style.background = 'rgba(99, 102, 241, 0.2)';
      aiStatusBadge.style.color = '#818cf8';
    }
  }

  // ==========================================
  // University Batch Selection System
  // ==========================================
  function initBatchSelector() {
    if (!batchSelectDropdown || typeof UNIVERSITY_ROUTINES === 'undefined') return;

    // Group batches by batch number/name for organized <optgroup>
    const batches = Object.values(UNIVERSITY_ROUTINES);
    const groups = {};
    batches.forEach(b => {
      const groupName = b.batch || 'Other Batches';
      if (!groups[groupName]) groups[groupName] = [];
      groups[groupName].push(b);
    });

    batchSelectDropdown.innerHTML = '';
    Object.keys(groups).forEach(groupName => {
      const optgroup = document.createElement('optgroup');
      optgroup.label = groupName;
      groups[groupName].forEach(b => {
        const option = document.createElement('option');
        option.value = b.key;
        option.textContent = `${b.batch}, ${b.section} (${b.classes.length} classes)`;
        if (b.key === state.selectedBatchKey) {
          option.selected = true;
        }
        optgroup.appendChild(option);
      });
      batchSelectDropdown.appendChild(optgroup);
    });

    // Populate quick batch pills
    if (quickBatchPills) {
      quickBatchPills.innerHTML = '';
      const quickKeys = [
        'batch_14_sec_b',
        'batch_14_sec_a',
        'batch_15_sec_b',
        'batch_16_sec_a',
        'batch_17_sec_a',
        'batch_18_sec_a',
        'batch_19_sec_a',
        'batch_20_sec_a'
      ];
      quickKeys.forEach(k => {
        const b = UNIVERSITY_ROUTINES[k];
        if (!b) return;
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = `quick-batch-pill ${k === state.selectedBatchKey ? 'active' : ''}`;
        btn.dataset.batchKey = k;
        btn.innerHTML = `<i data-lucide="bookmark"></i> <span>${b.batch} (${b.section.replace('Section ', 'Sec ')})</span>`;
        btn.addEventListener('click', () => {
          selectBatch(k);
        });
        quickBatchPills.appendChild(btn);
      });
    }

    // Dropdown change listener
    batchSelectDropdown.addEventListener('change', (e) => {
      selectBatch(e.target.value);
    });

    // Toggle custom upload box listener
    if (toggleUploadBtn) {
      toggleUploadBtn.addEventListener('click', () => {
        uploadSection.classList.toggle('hidden');
        if (!uploadSection.classList.contains('hidden')) {
          uploadSection.scrollIntoView({ behavior: 'smooth' });
        }
      });
    }

    // Load initial batch
    selectBatch(state.selectedBatchKey);
  }

  function selectBatch(batchKey) {
    if (typeof UNIVERSITY_ROUTINES === 'undefined') return;
    const routineData = UNIVERSITY_ROUTINES[batchKey] || UNIVERSITY_ROUTINES['batch_14_sec_b'];
    if (!routineData) return;

    state.selectedBatchKey = routineData.key;
    localStorage.setItem('neoreminder_batch_key', routineData.key);

    if (batchSelectDropdown) {
      batchSelectDropdown.value = routineData.key;
    }

    if (quickBatchPills) {
      quickBatchPills.querySelectorAll('.quick-batch-pill').forEach(pill => {
        if (pill.dataset.batchKey === routineData.key) {
          pill.classList.add('active');
        } else {
          pill.classList.remove('active');
        }
      });
    }

    state.fileName = routineData.name;
    state.currentClasses = JSON.parse(JSON.stringify(routineData.classes));

    renderTimetable();
    lucide.createIcons();
  }

  // ==========================================
  // Event Listeners
  // ==========================================
  function initEventListeners() {
    // Theme toggle
    themeToggleBtn.addEventListener('click', () => {
      state.theme = state.theme === 'dark' ? 'light' : 'dark';
      localStorage.setItem('neoreminder_theme', state.theme);
      initTheme();
      lucide.createIcons();
    });

    // File Drag & Drop
    ['dragenter', 'dragover'].forEach(eventName => {
      dropzone.addEventListener(eventName, e => {
        e.preventDefault();
        dropzone.classList.add('dragover');
      });
    });

    ['dragleave', 'drop'].forEach(eventName => {
      dropzone.addEventListener(eventName, e => {
        e.preventDefault();
        dropzone.classList.remove('dragover');
      });
    });

    dropzone.addEventListener('drop', e => {
      e.preventDefault();
      dropzone.classList.remove('dragover');
      if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        handleFileSelection(e.dataTransfer.files[0]);
      }
    });

    // Reliable 1-click upload trigger anywhere on dropzone or browse button
    dropzone.addEventListener('click', e => {
      // Prevent infinite loop if click hit the hidden file input itself
      if (e.target !== fileInput) {
        fileInput.click();
      }
    });

    if (browseFilesBtn) {
      browseFilesBtn.addEventListener('click', e => {
        e.stopPropagation();
        fileInput.click();
      });
    }

    // Keyboard support: Enter or Space on dropzone opens picker
    dropzone.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        fileInput.click();
      }
    });

    fileInput.addEventListener('change', e => {
      if (e.target.files && e.target.files.length > 0) {
        handleFileSelection(e.target.files[0]);
      }
      // Reset input value so re-selecting the exact same file fires 'change' again
      fileInput.value = '';
    });

    // Phone Calendar Guidance tabs & modal events
    if (openPhoneGuideBtn) {
      openPhoneGuideBtn.addEventListener('click', () => {
        if (phoneGuideBox) {
          phoneGuideBox.scrollIntoView({ behavior: 'smooth' });
        }
      });
    }
    if (tabIosBtn && tabAndroidBtn) {
      tabIosBtn.addEventListener('click', () => switchPhoneGuideTab('ios'));
      tabAndroidBtn.addEventListener('click', () => switchPhoneGuideTab('android'));
    }
    if (modalTabIosBtn && modalTabAndroidBtn) {
      modalTabIosBtn.addEventListener('click', () => switchPhoneGuideTab('ios'));
      modalTabAndroidBtn.addEventListener('click', () => switchPhoneGuideTab('android'));
    }
    if (closePhoneModalBtn) {
      closePhoneModalBtn.addEventListener('click', closePhoneDownloadModal);
    }
    if (closePhoneModalDoneBtn) {
      closePhoneModalDoneBtn.addEventListener('click', closePhoneDownloadModal);
    }

    // Creator Modal events (@M4fiaB0y)
    if (dismissCreatorBtn) {
      dismissCreatorBtn.addEventListener('click', closeCreatorModal);
    }
    if (followGithubBtn) {
      followGithubBtn.addEventListener('click', () => {
        showToast('Thank you so much for following and supporting NeoReminder! ❤️', 'success');
        setTimeout(closeCreatorModal, 1200);
      });
    }

    // Tab switching (Grid vs List)
    tabGridBtn.addEventListener('click', () => switchTab('grid'));
    tabListBtn.addEventListener('click', () => switchTab('list'));

    // Rescan / Re-select Batch
    if (reScanBtn) {
      reScanBtn.addEventListener('click', () => {
        if (batchSelectorSection) {
          batchSelectorSection.scrollIntoView({ behavior: 'smooth' });
        }
        showToast('Select a batch from the dropdown or click "Or upload custom routine file" above.', 'info');
      });
    }

    // Days Presets
    daysPresetGroup.addEventListener('click', e => {
      const btn = e.target.closest('.preset-pill');
      if (!btn) return;

      document.querySelectorAll('.preset-pill').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const days = parseInt(btn.dataset.days, 10);
      state.selectedDays = days;
      customDaysInput.value = days;
    });

    customDaysInput.addEventListener('input', e => {
      const val = parseInt(e.target.value, 10);
      if (!isNaN(val) && val > 0) {
        state.selectedDays = val;
        document.querySelectorAll('.preset-pill').forEach(b => {
          if (parseInt(b.dataset.days, 10) === val) {
            b.classList.add('active');
          } else {
            b.classList.remove('active');
          }
        });
      }
    });

    startDateInput.addEventListener('change', e => {
      state.startDate = e.target.value;
    });

    reminderAlarmSelect.addEventListener('change', e => {
      state.alarmMinutes = parseInt(e.target.value, 10);
    });

    // Print Routine
    if (printRoutineBtn) {
      printRoutineBtn.addEventListener('click', () => window.print());
    }

    // Search and Filter
    if (routineSearchInput) {
      routineSearchInput.addEventListener('input', e => {
        const q = e.target.value.trim().toLowerCase();
        if (q) {
          clearSearchBtn.classList.remove('hidden');
        } else {
          clearSearchBtn.classList.add('hidden');
        }
        filterClassesBySearch(q);
      });
    }

    if (clearSearchBtn) {
      clearSearchBtn.addEventListener('click', () => {
        routineSearchInput.value = '';
        clearSearchBtn.classList.add('hidden');
        filterClassesBySearch('');
      });
    }

    // Keyboard Shortcuts
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        closeModal();
        if (aiModal) aiModal.classList.add('hidden');
        closeCreatorModal();
        closeIdealModal();
        closePhoneDownloadModal();
      }
      if (e.key === '/' && document.activeElement !== routineSearchInput && !classModal.classList.contains('hidden') === false) {
        if (!reviewSection.classList.contains('hidden')) {
          e.preventDefault();
          routineSearchInput?.focus();
        }
      }
    });

    // Calendar actions
    if (phoneAutoSaveBtn) {
      phoneAutoSaveBtn.addEventListener('click', handlePhoneAutoSave);
    }
    if (saveCalendarBtn) {
      saveCalendarBtn.addEventListener('click', handleSaveCalendar);
    }
    if (copySummaryBtn) {
      copySummaryBtn.addEventListener('click', handleCopySummary);
    }

    // Modal Events
    addClassBtn.addEventListener('click', openAddClassModal);
    closeModalBtn.addEventListener('click', closeModal);
    cancelModalBtn.addEventListener('click', closeModal);
    classForm.addEventListener('submit', handleClassFormSubmit);
    deleteClassBtn.addEventListener('click', handleDeleteCurrentClass);

    // AI Settings Modal
    aiSettingsBtn.addEventListener('click', () => aiModal.classList.remove('hidden'));
    closeAiModalBtn.addEventListener('click', () => aiModal.classList.add('hidden'));
    saveAiKeyBtn.addEventListener('click', () => {
      state.geminiApiKey = geminiApiKeyInput.value.trim();
      state.aiEnabled = enableAiToggle.checked;
      localStorage.setItem('neoreminder_gemini_key', state.geminiApiKey);
      localStorage.setItem('neoreminder_ai_enabled', state.aiEnabled);
      updateAiBadge();
      aiModal.classList.add('hidden');
      showToast('AI Settings updated successfully!', 'success');
    });

    clearAiKeyBtn.addEventListener('click', () => {
      state.geminiApiKey = '';
      state.aiEnabled = false;
      geminiApiKeyInput.value = '';
      enableAiToggle.checked = false;
      localStorage.removeItem('neoreminder_gemini_key');
      localStorage.removeItem('neoreminder_ai_enabled');
      updateAiBadge();
      showToast('AI settings cleared', 'info');
    });
  }

  // ==========================================
  // File Upload & Routine Parsing
  // ==========================================
  async function handleFileSelection(file) {
    if (!file) return;

    const isImage = (file.type && file.type.startsWith('image/')) || /\.(png|jpe?g|webp|jfif|bmp|svg)$/i.test(file.name);
    const isPdf = file.type === 'application/pdf' || /\.pdf$/i.test(file.name);

    if (!isImage && !isPdf) {
      showToast('Please upload a valid routine image (PNG, JPG, WEBP) or single-page PDF.', 'error');
      return;
    }

    state.fileName = file.name;
    uploadSection.classList.add('hidden');
    processingSection.classList.remove('hidden');
    scanLogs.innerHTML = '';

    const onProgress = (percent, statusText, logDetail) => {
      progressBarFill.style.width = `${percent}%`;
      progressPercentText.textContent = `${percent}%`;
      progressStatusText.textContent = statusText;

      if (logDetail) {
        const line = document.createElement('div');
        line.className = 'log-line';
        line.innerHTML = `<i data-lucide="check-circle-2"></i> <span>${escapeHtml(logDetail)}</span>`;
        scanLogs.appendChild(line);
        scanLogs.scrollTop = scanLogs.scrollHeight;
        lucide.createIcons();
      }
    };

    try {
      const options = {
        useAi: state.aiEnabled,
        geminiApiKey: state.geminiApiKey
      };

      const result = await RoutineParser.parseRoutineFile(file, options, onProgress);
      state.currentClasses = result.classes || [];

      setTimeout(() => {
        processingSection.classList.add('hidden');
        reviewSection.classList.remove('hidden');

        if (state.currentClasses.length === 0) {
          showToast('No structured classes found. You can add classes manually using the "Add Class" button!', 'info');
        } else {
          showToast(`Successfully parsed ${state.currentClasses.length} classes!`, 'success');
        }

        renderTimetable();
        reviewSection.scrollIntoView({ behavior: 'smooth' });

        // Show popup to follow the owner (@M4fiaB0y on GitHub) after upload
        setTimeout(() => {
          openCreatorModal();
        }, 750);
      }, 500);

    } catch (err) {
      console.error(err);
      processingSection.classList.add('hidden');
      uploadSection.classList.remove('hidden');
      showToast(`Error processing file: ${err.message || 'Unknown error'}`, 'error');
    }
  }

  function loadSample(sampleData) {
    state.fileName = sampleData.name;
    state.currentClasses = JSON.parse(JSON.stringify(sampleData.classes));
    uploadSection.classList.add('hidden');
    reviewSection.classList.remove('hidden');
    renderTimetable();
    showToast(`Loaded sample routine: ${sampleData.name}`, 'success');
    reviewSection.scrollIntoView({ behavior: 'smooth' });
  }

  // ==========================================
  // Timetable Rendering (Grid & List)
  // ==========================================
  function switchTab(tab) {
    state.activeTab = tab;
    if (tab === 'grid') {
      tabGridBtn.classList.add('active');
      tabListBtn.classList.remove('active');
      gridWrapper.classList.remove('hidden');
      listWrapper.classList.add('hidden');
    } else {
      tabListBtn.classList.add('active');
      tabGridBtn.classList.remove('active');
      listWrapper.classList.remove('hidden');
      gridWrapper.classList.add('hidden');
    }
  }

  function renderTimetable() {
    routineFileName.textContent = state.fileName;
    const daysSet = new Set(state.currentClasses.map(c => c.day));
    routineSummaryText.textContent = `${state.currentClasses.length} classes detected across ${daysSet.size} days`;

    renderWeeklyGrid();
    renderClassList();
    updateScheduleStats();
    updateTodayBanner();
    lucide.createIcons();
  }

  // ==========================================
  // Advanced Features: Today Banner & Stats
  // ==========================================
  function updateTodayBanner() {
    if (!todayBanner || state.currentClasses.length === 0) return;

    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const now = new Date();
    const currentDayName = dayNames[now.getDay()];
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    const todayClasses = state.currentClasses
      .filter(c => c.day === currentDayName)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));

    todayBadgeText.textContent = `${currentDayName} Timeline`;

    if (todayClasses.length === 0) {
      todayBannerTitle.textContent = `Today is ${currentDayName} — No Classes! 🎉`;
      todayBannerSubtitle.textContent = 'Enjoy your free day or prepare for your upcoming schedule.';
      return;
    }

    // Check if a class is happening right now or find the next upcoming one
    let ongoing = null;
    let nextUpcoming = null;

    for (const cls of todayClasses) {
      const [sh, sm] = cls.startTime.split(':').map(Number);
      const [eh, em] = cls.endTime.split(':').map(Number);
      const startTotal = sh * 60 + sm;
      const endTotal = eh * 60 + em;

      if (currentMinutes >= startTotal && currentMinutes < endTotal) {
        ongoing = cls;
        break;
      }
      if (currentMinutes < startTotal && !nextUpcoming) {
        nextUpcoming = cls;
      }
    }

    if (ongoing) {
      todayBannerTitle.innerHTML = `🟢 Happening Now: <strong>${escapeHtml(ongoing.courseCode || ongoing.subject)}</strong>`;
      todayBannerSubtitle.textContent = `${ongoing.courseName || ongoing.subject} in Room ${ongoing.room || 'TBA'} (Teacher: ${ongoing.teacher || 'TBA'}) until ${ongoing.endTime}`;
    } else if (nextUpcoming) {
      const [sh, sm] = nextUpcoming.startTime.split(':').map(Number);
      const diff = (sh * 60 + sm) - currentMinutes;
      const hours = Math.floor(diff / 60);
      const mins = diff % 60;
      const timeRemaining = hours > 0 ? `${hours}h ${mins}m` : `${mins} mins`;

      todayBannerTitle.innerHTML = `⏳ Next Class: <strong>${escapeHtml(nextUpcoming.courseCode || nextUpcoming.subject)}</strong> in ${timeRemaining}`;
      todayBannerSubtitle.textContent = `Starts at ${nextUpcoming.startTime} in Room ${nextUpcoming.room || 'TBA'} • Teacher: ${nextUpcoming.teacher || 'TBA'}`;
    } else {
      todayBannerTitle.textContent = `All classes finished for ${currentDayName}! ✨`;
      todayBannerSubtitle.textContent = `You completed ${todayClasses.length} ${todayClasses.length === 1 ? 'class' : 'classes'} today.`;
    }
  }

  function updateScheduleStats() {
    if (!statTotalClasses) return;

    const total = state.currentClasses.length;
    statTotalClasses.textContent = total;

    // Calculate weekly study/class hours
    let totalMinutes = 0;
    const activeDaysSet = new Set();

    state.currentClasses.forEach(cls => {
      activeDaysSet.add(cls.day);
      const [sh, sm] = cls.startTime.split(':').map(Number);
      const [eh, em] = cls.endTime.split(':').map(Number);
      const diff = (eh * 60 + em) - (sh * 60 + sm);
      if (diff > 0) totalMinutes += diff;
    });

    const hours = (totalMinutes / 60).toFixed(1);
    statTotalHours.textContent = `${hours} hrs`;
    statActiveDays.textContent = `${activeDaysSet.size} Days`;

    const allDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const freeDays = allDays.filter(d => !activeDaysSet.has(d));
    statFreeDays.textContent = freeDays.length > 0 ? freeDays.join(', ') : 'None';
  }

  function filterClassesBySearch(query) {
    const cards = document.querySelectorAll('.class-slot-card, .list-item-card');
    if (!query) {
      cards.forEach(card => {
        card.classList.remove('search-match', 'search-dimmed');
      });
      return;
    }

    cards.forEach(card => {
      const text = card.textContent.toLowerCase();
      if (text.includes(query)) {
        card.classList.add('search-match');
        card.classList.remove('search-dimmed');
      } else {
        card.classList.add('search-dimmed');
        card.classList.remove('search-match');
      }
    });
  }

  function renderWeeklyGrid() {
    timetableGrid.innerHTML = '';
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    days.forEach(day => {
      const dayClasses = state.currentClasses
        .filter(c => c.day === day)
        .sort((a, b) => a.startTime.localeCompare(b.startTime));

      const col = document.createElement('div');
      col.className = 'day-column';

      const header = document.createElement('div');
      header.className = 'day-header';
      header.innerHTML = `
        <span class="day-name">${day}</span>
        ${dayClasses.length > 0 ? `<span class="day-count-badge">${dayClasses.length} ${dayClasses.length === 1 ? 'class' : 'classes'}</span>` : ''}
      `;
      col.appendChild(header);

      const classesContainer = document.createElement('div');
      classesContainer.className = 'day-classes';

      if (dayClasses.length === 0) {
        const emptyState = document.createElement('div');
        emptyState.className = 'empty-day-state';
        emptyState.textContent = 'Free Day';
        classesContainer.appendChild(emptyState);
      } else {
        dayClasses.forEach(cls => {
          const card = document.createElement('div');
          card.className = 'class-slot-card';
          const color = getSubjectColor(cls.courseCode || cls.subject);
          card.style.borderLeftColor = color;

          const code = cls.courseCode || (cls.subject.match(/^[A-Za-z0-9\s]{3,8}/) ? cls.subject.split('-')[0].trim() : '');
          const name = cls.courseName || cls.subject.replace(code, '').replace(/^[-–\s]+/, '').trim();

          card.innerHTML = `
            <div class="card-top-row">
              <span class="course-code-badge" style="background: ${color}22; color: ${color}; border: 1px solid ${color}44;">${escapeHtml(code || 'CLASS')}</span>
            </div>
            <div class="class-title" title="${escapeHtml(name || cls.subject)}">${escapeHtml(name || cls.subject)}</div>
            <div class="class-time-chip">
              <i data-lucide="clock" style="width: 12px; height: 12px;"></i>
              <span>${cls.startTime} - ${cls.endTime}</span>
            </div>
            <div class="template-footer-row">
              <span class="teacher-tag" title="Teacher (Before | )">
                <i data-lucide="user" style="width: 11px; height: 11px;"></i>
                <strong>${escapeHtml(cls.teacher || 'TBA')}</strong>
              </span>
              <span class="pipe-separator">|</span>
              <span class="room-tag" title="Room (After | )">
                <i data-lucide="map-pin" style="width: 11px; height: 11px;"></i>
                <strong>${escapeHtml(cls.room || 'TBA')}</strong>
              </span>
            </div>
          `;

          card.addEventListener('click', () => openEditClassModal(cls));
          classesContainer.appendChild(card);
        });
      }

      col.appendChild(classesContainer);
      timetableGrid.appendChild(col);
    });
  }

  function renderClassList() {
    classCardsList.innerHTML = '';

    if (state.currentClasses.length === 0) {
      classCardsList.innerHTML = `
        <div style="text-align: center; padding: 2rem; color: var(--text-muted);">
          No classes registered. Click "+ Add Class" to manually insert one.
        </div>
      `;
      return;
    }

    // Sort by day then by time
    const dayOrder = { 'Monday': 1, 'Tuesday': 2, 'Wednesday': 3, 'Thursday': 4, 'Friday': 5, 'Saturday': 6, 'Sunday': 7 };
    const sorted = [...state.currentClasses].sort((a, b) => {
      const dDiff = (dayOrder[a.day] || 9) - (dayOrder[b.day] || 9);
      if (dDiff !== 0) return dDiff;
      return a.startTime.localeCompare(b.startTime);
    });

    sorted.forEach(cls => {
      const item = document.createElement('div');
      item.className = 'list-item-card';

      item.innerHTML = `
        <div class="list-item-info">
          <div class="day-badge">${cls.day.substr(0, 3).toUpperCase()}</div>
          <div>
            <div style="font-weight: 700; font-size: 0.95rem;">${escapeHtml(cls.subject)}</div>
            <div style="font-size: 0.82rem; color: var(--text-secondary); display: flex; gap: 0.75rem; margin-top: 0.2rem;">
              <span><i data-lucide="clock" style="width: 12px; height: 12px;"></i> ${cls.startTime} - ${cls.endTime}</span>
              ${cls.room ? `<span><i data-lucide="map-pin" style="width: 12px; height: 12px;"></i> ${escapeHtml(cls.room)}</span>` : ''}
              ${cls.teacher ? `<span><i data-lucide="user" style="width: 12px; height: 12px;"></i> ${escapeHtml(cls.teacher)}</span>` : ''}
            </div>
          </div>
        </div>
        <button class="icon-btn edit-item-btn" title="Edit Class">
          <i data-lucide="pencil" style="width: 16px; height: 16px;"></i>
        </button>
      `;

      item.querySelector('.edit-item-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        openEditClassModal(cls);
      });
      item.addEventListener('click', () => openEditClassModal(cls));

      classCardsList.appendChild(item);
    });
  }

  // ==========================================
  // Class Modal (Add & Edit)
  // ==========================================
  function openAddClassModal() {
    modalTitle.textContent = 'Add New Class';
    editClassId.value = '';
    if (editCourseCode) editCourseCode.value = '';
    if (editCourseName) editCourseName.value = '';
    editDay.value = 'Sunday';
    editRoom.value = '';
    editStartTime.value = '09:00';
    editEndTime.value = '10:30';
    editTeacher.value = '';
    deleteClassBtn.classList.add('hidden');
    classModal.classList.remove('hidden');
  }

  function openEditClassModal(cls) {
    modalTitle.textContent = 'Edit Class';
    editClassId.value = cls.id;
    const code = cls.courseCode || (cls.subject ? cls.subject.split('-')[0].trim() : '');
    const name = cls.courseName || (cls.subject ? cls.subject.replace(code, '').replace(/^[-–\s]+/, '').trim() : '');
    if (editCourseCode) editCourseCode.value = code;
    if (editCourseName) editCourseName.value = name || cls.subject;
    editDay.value = cls.day;
    editRoom.value = cls.room || '';
    editStartTime.value = cls.startTime;
    editEndTime.value = cls.endTime;
    editTeacher.value = cls.teacher || '';
    deleteClassBtn.classList.remove('hidden');
    classModal.classList.remove('hidden');
  }

  function closeModal() {
    classModal.classList.add('hidden');
  }

  function handleClassFormSubmit(e) {
    e.preventDefault();
    const id = editClassId.value;
    const code = editCourseCode ? editCourseCode.value.trim() : '';
    const name = editCourseName ? editCourseName.value.trim() : '';

    if (!name && !code) {
      showToast('Please provide a course code or name.', 'error');
      return;
    }

    const classData = {
      courseCode: code,
      courseName: name,
      subject: code ? `${code} - ${name}` : name,
      day: editDay.value,
      startTime: editStartTime.value,
      endTime: editEndTime.value,
      room: editRoom.value.trim(),
      teacher: editTeacher.value.trim()
    };

    if (id) {
      const idx = state.currentClasses.findIndex(c => c.id === id);
      if (idx !== -1) {
        state.currentClasses[idx] = { ...state.currentClasses[idx], ...classData };
        showToast('Class updated!', 'success');
      }
    } else {
      classData.id = 'manual_' + Math.random().toString(36).substr(2, 9);
      state.currentClasses.push(classData);
      showToast('Class added!', 'success');
    }

    closeModal();
    renderTimetable();
  }

  function handleDeleteCurrentClass() {
    const id = editClassId.value;
    if (!id) return;
    state.currentClasses = state.currentClasses.filter(c => c.id !== id);
    closeModal();
    renderTimetable();
    showToast('Class deleted from routine.', 'info');
  }

  // ==========================================
  // Calendar Export & Device Sync
  // ==========================================
  async function handlePhoneAutoSave() {
    if (state.currentClasses.length === 0) {
      showToast('No classes to export! Please upload a routine or load a sample first.', 'error');
      return;
    }

    const totalDays = state.selectedDays || 30;
    const alarmMinutes = state.alarmMinutes;
    const startDate = state.startDate || getTodayIsoString();

    const icsString = CalendarSync.generateIcs(state.currentClasses, {
      startDate,
      totalDays,
      alarmMinutes
    });

    const safeName = state.fileName.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9_-]/g, '_');
    const filename = `${safeName}_${totalDays}days.ics`;

    showToast('Opening phone calendar sync...', 'info');

    const result = await CalendarSync.autoSaveToPhoneCalendar(icsString, filename);
    if (result && result.message) {
      showToast(result.message, result.method === 'cancelled' ? 'info' : 'success');
    }

    // Show step-by-step mobile guidance modal
    setTimeout(() => {
      openPhoneDownloadModal();
    }, 500);
  }

  function handleSaveCalendar() {
    if (state.currentClasses.length === 0) {
      showToast('No classes to export! Please upload a routine or add classes first.', 'error');
      return;
    }

    const totalDays = state.selectedDays || 30;
    const alarmMinutes = state.alarmMinutes;
    const startDate = state.startDate || getTodayIsoString();

    const icsString = CalendarSync.generateIcs(state.currentClasses, {
      startDate,
      totalDays,
      alarmMinutes
    });

    const safeName = state.fileName.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9_-]/g, '_');
    const filename = `${safeName}_routine_${totalDays}days.ics`;

    CalendarSync.downloadIcsFile(icsString, filename);

    showToast(
      `Saved ${state.currentClasses.length} classes for ${totalDays} days with ${alarmMinutes >= 0 ? alarmMinutes + 'm' : 'no'} reminder alarm!`,
      'success'
    );

    // Show step-by-step mobile guidance modal
    setTimeout(() => {
      openPhoneDownloadModal();
    }, 500);
  }

  function handleCopySummary() {
    if (state.currentClasses.length === 0) return;

    let text = `📅 Class Routine (${state.fileName})\n`;
    text += `Reminders: ${state.selectedDays} days duration | Alert: ${state.alarmMinutes}m before\n\n`;

    const dayOrder = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    dayOrder.forEach(day => {
      const classes = state.currentClasses.filter(c => c.day === day).sort((a, b) => a.startTime.localeCompare(b.startTime));
      if (classes.length > 0) {
        text += `🔹 ${day}:\n`;
        classes.forEach(c => {
          text += `  • ${c.startTime} - ${c.endTime}: ${c.subject} (${c.room || 'Room N/A'})\n`;
        });
        text += '\n';
      }
    });

    navigator.clipboard.writeText(text).then(() => {
      showToast('Routine text copied to clipboard!', 'success');
    }).catch(() => {
      showToast('Could not copy to clipboard.', 'error');
    });
  }

  // ==========================================
  // Helper Modals & Phone Calendar Guide
  // ==========================================
  function switchPhoneGuideTab(os) {
    if (os === 'ios') {
      if (tabIosBtn) tabIosBtn.classList.add('active');
      if (tabAndroidBtn) tabAndroidBtn.classList.remove('active');
      if (iosStepsContent) iosStepsContent.classList.remove('hidden');
      if (androidStepsContent) androidStepsContent.classList.add('hidden');

      if (modalTabIosBtn) modalTabIosBtn.classList.add('active');
      if (modalTabAndroidBtn) modalTabAndroidBtn.classList.remove('active');
      if (modalIosSteps) modalIosSteps.classList.remove('hidden');
      if (modalAndroidSteps) modalAndroidSteps.classList.add('hidden');
    } else {
      if (tabAndroidBtn) tabAndroidBtn.classList.add('active');
      if (tabIosBtn) tabIosBtn.classList.remove('active');
      if (androidStepsContent) androidStepsContent.classList.remove('hidden');
      if (iosStepsContent) iosStepsContent.classList.add('hidden');

      if (modalTabAndroidBtn) modalTabAndroidBtn.classList.add('active');
      if (modalTabIosBtn) modalTabIosBtn.classList.remove('active');
      if (modalAndroidSteps) modalAndroidSteps.classList.remove('hidden');
      if (modalIosSteps) modalIosSteps.classList.add('hidden');
    }
  }

  function openCreatorModal() {
    if (creatorModal) {
      creatorModal.classList.remove('hidden');
      if (window.lucide) lucide.createIcons();
    }
  }

  function closeCreatorModal() {
    if (creatorModal) {
      creatorModal.classList.add('hidden');
    }
  }


  function openPhoneDownloadModal() {
    if (phoneDownloadModal) {
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
      switchPhoneGuideTab(isIOS ? 'ios' : 'android');
      phoneDownloadModal.classList.remove('hidden');
      if (window.lucide) lucide.createIcons();
    }
  }

  function closePhoneDownloadModal() {
    if (phoneDownloadModal) {
      phoneDownloadModal.classList.add('hidden');
    }
  }

  // ==========================================
  // Helper Toast Notifications
  // ==========================================
  function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    let icon = 'info';
    if (type === 'success') icon = 'check-circle';
    if (type === 'error') icon = 'alert-triangle';

    toast.innerHTML = `
      <i data-lucide="${icon}" style="width: 18px; height: 18px; flex-shrink: 0;"></i>
      <span>${escapeHtml(message)}</span>
    `;

    toastContainer.appendChild(toast);
    lucide.createIcons();

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 4500);
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
});
