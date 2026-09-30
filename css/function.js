let isLoginMode = false;

    function scrollToSection(id) {
      const el = document.getElementById(id);
      if (!el) return;
      const navHeight = document.querySelector('.main-nav')?.offsetHeight || 68;
      const elementPosition = el.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({
        top: elementPosition - navHeight - 10,
        behavior: 'smooth'
      });
    }

    function openModal(title, message) {
      document.getElementById('modalTitle').innerText = title;
      if (message) document.getElementById('modalDesc').innerText = message;
      document.getElementById('customModal').style.display = 'flex';
    }

    function closeModal() {
      document.getElementById('customModal').style.display = 'none';
    }

    function submitModal() {
      alert('Thank you! Your request has been sent to our customer care team.');
      closeModal();
    }

    // Sign Up Modal Functions
    function openSignupModal() {
      const savedUser = localStorage.getItem('bhfinder_user');
      if (savedUser) {
        const user = JSON.parse(savedUser);
        if (confirm(`Signed in as ${user.name} (${user.role}). Would you like to log out?`)) {
          localStorage.removeItem('bhfinder_user');
          updateNavUserState();
        }
        return;
      }

      document.getElementById('signupFormContainer').style.display = 'block';
      document.getElementById('signupSuccessContainer').style.display = 'none';
      document.getElementById('signupError').style.display = 'none';
      document.getElementById('signupModal').style.display = 'flex';
      document.body.style.overflow = 'hidden';
    }

    function closeSignupModal() {
      document.getElementById('signupModal').style.display = 'none';
      document.body.style.overflow = '';
    }

    function selectRole(role, btnElement) {
      document.getElementById('selectedRole').value = role;
      document.querySelectorAll('.role-btn').forEach(btn => btn.classList.remove('active'));
      btnElement.classList.add('active');
    }

    function togglePasswordVisibility(inputId, btn) {
      const input = document.getElementById(inputId);
      const icon = btn.querySelector('i');
      if (input.type === 'password') {
        input.type = 'text';
        icon.classList.replace('fa-eye', 'fa-eye-slash');
      } else {
        input.type = 'password';
        icon.classList.replace('fa-eye-slash', 'fa-eye');
      }
    }

    function toggleAuthMode(e) {
      if (e) e.preventDefault();
      isLoginMode = !isLoginMode;

      const nameGroup = document.getElementById('nameGroup');
      const phoneGroup = document.getElementById('phoneGroup');
      const confirmGroup = document.getElementById('confirmPasswordGroup');
      const roleSelector = document.getElementById('roleSelector');
      const termsGroup = document.getElementById('termsGroup');
      const signupName = document.getElementById('signupName');
      const signupPhone = document.getElementById('signupPhone');
      const signupConfirm = document.getElementById('signupConfirmPassword');
      const signupTerms = document.getElementById('signupTerms');

      document.getElementById('signupError').style.display = 'none';

      if (isLoginMode) {
        document.getElementById('authBadgeText').innerText = 'Welcome Back';
        document.getElementById('authModalTitle').innerText = 'Log In to BHFinder';
        document.getElementById('authModalSubtitle').innerText = 'Enter your credentials to access your account.';
        document.getElementById('authSubmitBtn').innerText = 'Log In';
        document.getElementById('authSwitchText').innerText = "Don't have an account?";
        document.getElementById('authSwitchLink').innerText = 'Sign Up';

        nameGroup.style.display = 'none';
        phoneGroup.style.display = 'none';
        confirmGroup.style.display = 'none';
        roleSelector.style.display = 'none';
        termsGroup.style.display = 'none';

        signupName.required = false;
        signupPhone.required = false;
        signupConfirm.required = false;
        signupTerms.required = false;
      } else {
        document.getElementById('authBadgeText').innerText = 'Join BHFinder';
        document.getElementById('authModalTitle').innerText = 'Create an Account';
        document.getElementById('authModalSubtitle').innerText = 'Find or list boarding houses in Tupi quickly and easily.';
        document.getElementById('authSubmitBtn').innerText = 'Create Account';
        document.getElementById('authSwitchText').innerText = 'Already have an account?';
        document.getElementById('authSwitchLink').innerText = 'Log In';

        nameGroup.style.display = 'block';
        phoneGroup.style.display = 'block';
        confirmGroup.style.display = 'block';
        roleSelector.style.display = 'grid';
        termsGroup.style.display = 'flex';

        signupName.required = true;
        signupPhone.required = true;
        signupConfirm.required = true;
        signupTerms.required = true;
      }
    }

    function handleSignupSubmit(e) {
      e.preventDefault();
      const errorBox = document.getElementById('signupError');
      errorBox.style.display = 'none';

      const name = document.getElementById('signupName').value.trim();
      const email = document.getElementById('signupEmail').value.trim();
      const phone = document.getElementById('signupPhone').value.trim();
      const password = document.getElementById('signupPassword').value;
      const confirmPassword = document.getElementById('signupConfirmPassword').value;
      const role = document.getElementById('selectedRole').value;

      if (!isLoginMode && password !== confirmPassword) {
        errorBox.innerText = 'Passwords do not match. Please try again.';
        errorBox.style.display = 'block';
        return;
      }

      const displayName = isLoginMode ? email.split('@')[0] : name;
      const userData = {
        name: displayName,
        email: email,
        phone: phone,
        role: isLoginMode ? 'Member' : role
      };

      localStorage.setItem('bhfinder_user', JSON.stringify(userData));
      updateNavUserState();
      initializeUniqueWebViews();

      document.getElementById('signupFormContainer').style.display = 'none';
      document.getElementById('signupSuccessContainer').style.display = 'block';
      document.getElementById('successTitle').innerText = isLoginMode
        ? `Welcome back, ${displayName}!`
        : `Welcome to BHFinder, ${displayName}!`;
      document.getElementById('successMessage').innerText = isLoginMode
        ? 'You are now logged in and ready to browse boarding houses.'
        : `Your ${role.toLowerCase()} account has been created successfully.`;

      document.getElementById('signupForm').reset();
    }

    // Mobile Navigation Drawer Functions
    function toggleMobileNav() {
      const drawer = document.getElementById('mobileNavDrawer');
      const backdrop = document.getElementById('mobileNavBackdrop');
      const hamburger = document.getElementById('hamburgerBtn');
      if (!drawer) return;
      const isOpen = drawer.classList.contains('active');
      if (isOpen) {
        closeMobileNav();
      } else {
        drawer.classList.add('active');
        if (backdrop) backdrop.classList.add('active');
        if (hamburger) {
          hamburger.classList.add('active');
          hamburger.setAttribute('aria-expanded', 'true');
        }
        document.body.style.overflow = 'hidden';
      }
    }

    function closeMobileNav() {
      const drawer = document.getElementById('mobileNavDrawer');
      const backdrop = document.getElementById('mobileNavBackdrop');
      const hamburger = document.getElementById('hamburgerBtn');
      if (drawer) drawer.classList.remove('active');
      if (backdrop) backdrop.classList.remove('active');
      if (hamburger) {
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
      }
      document.body.style.overflow = '';
    }

    // Auto-close mobile drawer when window resized above tablet breakpoint
    window.addEventListener('resize', function() {
      if (window.innerWidth > 992) {
        closeMobileNav();
      }
    });

    // Survey Modal Functions
    function openSurveyModal() {
      document.getElementById('surveyModal').style.display = 'flex';
      document.body.style.overflow = 'hidden';
    }

    function closeSurveyModal() {
      document.getElementById('surveyModal').style.display = 'none';
      document.body.style.overflow = '';
    }

    function updateNavUserState() {
      const navBtn = document.getElementById('surveyNavBtn') || document.getElementById('signupNavBtn');
      if (navBtn) {
        navBtn.innerHTML = `<span>Survey Here!</span> <ion-icon name="open-outline"></ion-icon>`;
      }
    }

    // Close modals and drawer on Escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        closeMobileNav();
        closeSurveyModal();
        closeSignupModal();
        closeModal();
      }
    });

    // Initialize nav button state on load
    updateNavUserState();

    // Real-Time Global Web Views Counter (Multi-Device Synchronized)
    const WEB_VIEW_API_KEY = 'bhfinder_tupi_unique_views';
    const WEB_VIEW_API_BASE = 'https://countapi.mileshilliard.com/api/v1';
    const WEB_VIEW_CACHE_KEY = 'bhfinder_cached_live_views_v2';
    const WEB_VIEW_SESSION_KEY = 'bhfinder_session_view_counted_v2';
    const WEB_VIEW_DEFAULT_BASELINE = 1;

    function renderWebViews(val, animate = false) {
      const viewCount = document.getElementById('uniqueWebViews');
      if (!viewCount) return;
      const parsed = Number.parseInt(val, 10);
      const safeVal = Number.isSafeInteger(parsed) && parsed >= WEB_VIEW_DEFAULT_BASELINE ? parsed : WEB_VIEW_DEFAULT_BASELINE;
      const current = Number.parseInt(viewCount.textContent, 10);

      if (animate && current !== safeVal) {
        viewCount.textContent = String(safeVal);
        viewCount.style.transition = 'transform 0.25s ease, color 0.25s ease';
        viewCount.style.transform = 'scale(1.2)';
        viewCount.style.color = 'var(--primary, #f0523d)';
        setTimeout(() => {
          viewCount.style.transform = 'scale(1)';
          viewCount.style.color = '';
        }, 300);
      } else {
        viewCount.textContent = String(safeVal);
      }
    }

    async function fetchLatestWebViews(isLiveUpdate = true) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3500);

        const response = await fetch(`${WEB_VIEW_API_BASE}/get/${WEB_VIEW_API_KEY}`, {
          method: 'GET',
          signal: controller.signal,
          headers: { 'Accept': 'application/json' }
        });
        clearTimeout(timeoutId);

        if (response.ok) {
          const data = await response.json();
          if (data && typeof data.value === 'number') {
            const count = Math.max(data.value, WEB_VIEW_DEFAULT_BASELINE);
            renderWebViews(count, isLiveUpdate);
            localStorage.setItem(WEB_VIEW_CACHE_KEY, String(count));
          }
        }
      } catch (err) {
        // Silently retain current count on network hiccup
      }
    }

    async function initializeUniqueWebViews(forceIncrement = false) {
      const viewCount = document.getElementById('uniqueWebViews');
      if (!viewCount) return;

      // 1. Immediately render cached value or baseline (1)
      let cached = Number.parseInt(localStorage.getItem(WEB_VIEW_CACHE_KEY) || String(WEB_VIEW_DEFAULT_BASELINE), 10);
      if (!Number.isSafeInteger(cached) || cached < WEB_VIEW_DEFAULT_BASELINE) {
        cached = WEB_VIEW_DEFAULT_BASELINE;
      }
      renderWebViews(cached, false);

      // 2. Count new visit across devices or sessions
      const alreadyCountedInSession = sessionStorage.getItem(WEB_VIEW_SESSION_KEY) === 'true';
      const endpoint = (!alreadyCountedInSession || forceIncrement)
        ? `${WEB_VIEW_API_BASE}/hit/${WEB_VIEW_API_KEY}`
        : `${WEB_VIEW_API_BASE}/get/${WEB_VIEW_API_KEY}`;

      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3500);

        const response = await fetch(endpoint, {
          method: 'GET',
          signal: controller.signal,
          headers: { 'Accept': 'application/json' }
        });
        clearTimeout(timeoutId);

        if (response.ok) {
          const data = await response.json();
          if (data && typeof data.value === 'number') {
            const liveTotal = Math.max(data.value, WEB_VIEW_DEFAULT_BASELINE);
            renderWebViews(liveTotal, alreadyCountedInSession);
            localStorage.setItem(WEB_VIEW_CACHE_KEY, String(liveTotal));
            sessionStorage.setItem(WEB_VIEW_SESSION_KEY, 'true');
            return;
          }
        }
      } catch (err) {
        console.warn('Real-time counter offline/blocked, using fallback.', err);
      }

      // 3. Fallback: if network fails, ensure it increments locally once per session
      if (!alreadyCountedInSession) {
        cached += 1;
        localStorage.setItem(WEB_VIEW_CACHE_KEY, String(cached));
        sessionStorage.setItem(WEB_VIEW_SESSION_KEY, 'true');
        renderWebViews(cached, true);
      }
    }

    // Run on initial page load
    initializeUniqueWebViews();

    // Real-Time Background Synchronization:
    // Polls for updates from other devices every 7 seconds when tab is active
    setInterval(() => {
      if (!document.hidden) {
        fetchLatestWebViews(true);
      }
    }, 7000);

    // Refresh immediately when user returns to tab / focuses window
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        fetchLatestWebViews(true);
      }
    });

    window.addEventListener('focus', () => {
      fetchLatestWebViews(true);
    });

    function viewDetails(title, price) {
      openModal(title, `Schedule a viewing or send a direct inquiry for this space listed at ${price}.`);
    }

    function setQuickFilter(type, btnElement) {
      document.getElementById('type').value = type;
      if (btnElement) {
        document.querySelectorAll('.type-pill').forEach(btn => btn.classList.remove('active'));
        btnElement.classList.add('active');
      }
      handleSearch();
    }

    function handleSearch(e) {
      if (e) e.preventDefault();

      const keyword = document.getElementById('keyword').value.toLowerCase().trim();
      const type = document.getElementById('type').value;
      const status = document.getElementById('status').value;
      const location = document.getElementById('location').value;
      const cards = document.querySelectorAll('.property-card');
      let visibleCount = 0;

      cards.forEach(card => {
        const title = (card.getAttribute('data-title') || '').toLowerCase();
        const cardType = card.getAttribute('data-type') || '';
        const cardStatus = card.getAttribute('data-status') || '';
        const cardLocation = card.getAttribute('data-location') || '';

        const matchKeyword = !keyword || title.includes(keyword);
        const matchType = !type || cardType === type;
        const matchStatus = !status || cardStatus === status;
        const matchLocation = !location || cardLocation === location;

        if (matchKeyword && matchType && matchStatus && matchLocation) {
          card.style.display = 'flex';
          visibleCount++;
        } else {
          card.style.display = 'none';
        }
      });

      // Sync category quick-filter pills
      document.querySelectorAll('.type-pill').forEach(pill => {
        const onclickAttr = pill.getAttribute('onclick') || '';
        const match = (!type && onclickAttr.includes("''")) || (type && onclickAttr.includes(`'${type}'`));
        pill.classList.toggle('active', match);
      });

      const emptyState = document.getElementById('emptySearchState');
      if (emptyState) {
        emptyState.style.display = visibleCount === 0 ? 'block' : 'none';
      }
    }

    function resetFilters() {
      document.getElementById('keyword').value = '';
      document.getElementById('type').value = '';
      document.getElementById('status').value = '';
      document.getElementById('location').value = '';
      document.querySelectorAll('.type-pill').forEach((btn, idx) => {
        btn.classList.toggle('active', idx === 0);
      });
      handleSearch();
    }

    function openOwnerSignupModal() {
      openSignupModal();
      const ownerBtn = document.querySelector('.role-btn[data-role="Owner"]');
      if (ownerBtn) selectRole('Owner', ownerBtn);
    }

    function handleWaitlistSubmit(e) {
      e.preventDefault();
      const input = document.getElementById('waitlistInput');
      const val = input.value.trim();
      if (!val) return;

      const successMsg = document.getElementById('waitlistSuccess');
      successMsg.style.display = 'inline-flex';

      try {
        let waitlist = JSON.parse(localStorage.getItem('bhfinder_waitlist') || '[]');
        waitlist.push({ contact: val, date: new Date().toISOString() });
        localStorage.setItem('bhfinder_waitlist', JSON.stringify(waitlist));
      } catch (err) {}

      input.value = '';
    }

    function toggleFaq(element) {
      const parent = element.parentElement;
      parent.classList.toggle('active');
    }