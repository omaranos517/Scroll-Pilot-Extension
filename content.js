// Create modern scroll buttons
function createModernScrollButtons() {
  // Remove existing buttons if they exist (to prevent duplicates)
  const existingTop = document.getElementById('modernScrollTopBtn');
  const existingBottom = document.getElementById('modernScrollBottomBtn');
  if (existingTop) existingTop.remove();
  if (existingBottom) existingBottom.remove();

  // Create top button
  const scrollTopBtn = document.createElement('button');
  scrollTopBtn.id = 'modernScrollTopBtn';
  scrollTopBtn.innerHTML = `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M12 19V5M5 12l7-7 7 7"/>
    </svg>
    <svg class="scroll-progress-ring" width="48" height="48">
      <circle class="scroll-progress-circle" cx="24" cy="24" r="22"></circle>
      <circle class="scroll-progress-fill" cx="24" cy="24" r="22"></circle>
    </svg>
    <span class="scroll-button-tooltip">Scroll to Top</span>
  `;

  // Create bottom button
  const scrollBottomBtn = document.createElement('button');
  scrollBottomBtn.id = 'modernScrollBottomBtn';
  scrollBottomBtn.innerHTML = `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M12 5v14M19 12l-7 7-7-7"/>
    </svg>
    <svg class="scroll-progress-ring" width="48" height="48">
      <circle class="scroll-progress-circle" cx="24" cy="24" r="22"></circle>
      <circle class="scroll-progress-fill" cx="24" cy="24" r="22"></circle>
    </svg>
    <span class="scroll-button-tooltip">Scroll to Bottom</span>
  `;

  // Add buttons to body
  document.body.appendChild(scrollTopBtn);
  document.body.appendChild(scrollBottomBtn);

  // Smooth scroll functions
  function smoothScrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  function smoothScrollToBottom() {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth'
    });
  }

  // Add click event listeners
  scrollTopBtn.addEventListener('click', smoothScrollToTop);
  scrollBottomBtn.addEventListener('click', smoothScrollToBottom);

  // Add keyboard shortcuts
  function handleKeyDown(e) {
    // Ctrl+Alt+Up for top, Ctrl+Alt+Down for bottom
    if (e.ctrlKey && e.altKey) {
      if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        smoothScrollToTop();
      } else if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        e.preventDefault();
        smoothScrollToBottom();
      }
    }
    
    // Home and End keys with Ctrl
    if (e.ctrlKey) {
      if (e.key === 'Home') {
        e.preventDefault();
        smoothScrollToTop();
      } else if (e.key === 'End') {
        e.preventDefault();
        smoothScrollToBottom();
      }
    }
  }

  // Track scroll position
  function updateScrollButtons() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const documentHeight = Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight,
      document.body.offsetHeight,
      document.documentElement.offsetHeight,
      document.body.clientHeight,
      document.documentElement.clientHeight
    );
    
    const scrollPercentage = scrollTop / (documentHeight - windowHeight);
    const circumference = 138; // 2 * π * r (r = 22)
    const offset = circumference - (scrollPercentage * circumference);
    
    // Update progress indicators
    const progressFills = document.querySelectorAll('.scroll-progress-fill');
    progressFills.forEach(circle => {
      circle.style.strokeDashoffset = offset;
    });
    
    // Show/hide top button
    if (scrollTop > 300) {
      scrollTopBtn.classList.add('show');
    } else {
      scrollTopBtn.classList.remove('show');
    }
    
    // Show/hide bottom button
    const distanceFromBottom = documentHeight - (scrollTop + windowHeight);
    if (distanceFromBottom > 100) {
      scrollBottomBtn.classList.add('show');
    } else {
      scrollBottomBtn.classList.remove('show');
    }
  }

  // Set up event listeners
  window.addEventListener('scroll', updateScrollButtons, { passive: true });
  window.addEventListener('resize', updateScrollButtons, { passive: true });
  document.addEventListener('keydown', handleKeyDown);

  // Initialize
  updateScrollButtons();
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', createModernScrollButtons);
} else {
  createModernScrollButtons();
}

// Re-inject on dynamic page changes (for SPAs)
let lastUrl = location.href;
new MutationObserver(() => {
  const url = location.href;
  if (url !== lastUrl) {
    lastUrl = url;
    setTimeout(createModernScrollButtons, 1000);
  }
}).observe(document, { subtree: true, childList: true });