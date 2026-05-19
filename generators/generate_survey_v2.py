import re

with open('/Users/apple/Desktop/YUNN_Mobile/survey.html', 'r') as f:
    html = f.read()

# --- CSS Replacement ---
# We want to replace everything inside <style>...</style> except the general rules.
# Actually, let's just replace the entire <style> block to be clean.

# Extract everything between </style> and <script> (the body)
body_match = re.search(r'</style>\s*</head>\s*<body>(.*?)<script>', html, re.DOTALL)
if not body_match:
    print("Could not find body section.")
    exit(1)
body_content = body_match.group(1)

# Keep the survey core HTML
survey_core_match = re.search(r'(<!-- SURVEY CORE -->.*?<!-- ANALYSIS SCREEN -->)', body_content, re.DOTALL)
survey_core_html = survey_core_match.group(1) if survey_core_match else ""

analysis_result_match = re.search(r'(<!-- ANALYSIS SCREEN -->.*?)</div>\s*$', body_content, re.DOTALL)
analysis_result_html = analysis_result_match.group(1) if analysis_result_match else ""

# Extract JS
js_match = re.search(r'<script>(.*?)</script>', html, re.DOTALL)
js_content = js_match.group(1) if js_match else ""

new_css = """
        @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css');
        
        :root {
            --primary: #3AAE92;
            --primary-dark: #2F8E76;
            --primary-light: #E9F6F3;
            --text-main: #222222;
            --text-light: #A8A8A8;
            --white: #FFFFFF;
            --bg-gray: #F8F9FA;
            --border-color: #EAEAEA;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Pretendard', sans-serif;
            -webkit-tap-highlight-color: transparent;
        }

        body {
            background-color: var(--white);
            color: var(--text-main);
            line-height: 1.6;
            overflow-x: hidden;
        }

        .container {
            max-width: 480px;
            margin: 0 auto;
            padding: 0 16px;
            position: relative;
        }

        /* --- Reusable --- */
        .btn-primary {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
            background-color: var(--primary);
            color: var(--white);
            height: 58px;
            border-radius: 8px;
            font-size: 20px;
            font-weight: 500;
            text-decoration: none;
            border: none;
            cursor: pointer;
            transition: background-color 0.2s ease, transform 0.2s ease;
            box-shadow: 0 4px 12px rgba(58, 174, 146, 0.2);
        }
        .btn-primary:active { transform: scale(0.98); }
        .btn-primary:disabled {
            background-color: #CCCCCC;
            box-shadow: none;
            cursor: not-allowed;
            border: none;
        }

        .btn-outline {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
            background-color: var(--white);
            color: var(--primary);
            height: 58px;
            border-radius: 8px;
            font-size: 20px;
            font-weight: 500;
            text-decoration: none;
            border: 1px solid var(--primary);
            cursor: pointer;
            transition: all 0.2s ease;
        }
        .btn-outline:active { transform: scale(0.98); }

        /* --- Status Bar Fake UI --- */
        .status-bar {
            height: 44px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0 20px;
            font-size: 14px;
            font-weight: 600;
            color: #000;
            max-width: 480px;
            margin: 0 auto;
            background: var(--white);
        }
        .status-icons {
            display: flex;
            align-items: center;
            gap: 6px;
        }

        /* --- Global Header & Modals --- */
        .global-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 12px 16px;
            max-width: 480px;
            margin: 0 auto;
            background: var(--white);
        }
        .header-icon { font-size: 24px; cursor: pointer; color: #000; }
        .header-logo { font-size: 20px; font-weight: 300; letter-spacing: 2px; cursor: pointer; position: relative;}
        .header-logo span { border: 1px solid #ccc; border-radius: 50%; width: 12px; height: 12px; display: inline-block; position: absolute; transform: translate(2px, -6px); }
        .header-actions { display: flex; gap: 16px; align-items: center; }
        .cart-wrapper { position: relative; }
        .cart-badge {
            position: absolute;
            top: -4px;
            right: -6px;
            background: var(--primary);
            color: var(--white);
            font-size: 10px;
            font-weight: 700;
            width: 16px;
            height: 16px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .sidebar-overlay {
            position: fixed;
            top: 0; left: 0; width: 100vw; height: 100vh;
            background: rgba(0,0,0,0.4);
            z-index: 99; opacity: 0; pointer-events: none;
            transition: opacity 0.3s ease;
        }
        .sidebar-overlay.active { opacity: 1; pointer-events: auto; }
        
        .sidebar-menu {
            position: fixed;
            top: 0; left: 0; width: 50%; max-width: 280px; height: 100vh;
            background: var(--white); z-index: 100;
            transform: translateX(-100%);
            transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            padding: 44px 16px; box-shadow: 2px 0 12px rgba(0,0,0,0.1);
        }
        .sidebar-menu.active { transform: translateX(0); }
        .sidebar-menu ul { list-style: none; margin-top: 40px; }
        .sidebar-menu li { margin-bottom: 24px; font-size: 18px; font-weight: 500; color: var(--text-main); cursor:pointer;}
        
        .search-modal {
            position: fixed;
            top: 0; left: 0; width: 100vw; height: 100vh;
            background: var(--white); z-index: 1000;
            transform: translateY(-100%); transition: transform 0.3s ease;
            padding: 44px 16px;
        }
        .search-modal.active { transform: translateY(0); }
        .search-input-wrapper { display: flex; align-items: center; border-bottom: 2px solid var(--text-main); padding-bottom: 8px; margin-top: 20px; }
        .search-input-wrapper input { border: none; outline: none; font-size: 20px; width: 100%; margin-left: 12px;}

        /* --- Step 0: Intro Screen (Design System) --- */
        #intro-screen {
            display: none;
            padding-bottom: 40px;
        }
        #intro-screen.active {
            display: block;
        }

        .hero-section {
            display: flex;
            position: relative;
            margin-top: 24px;
            margin-bottom: 40px;
        }
        .hero-text-col {
            flex: 1;
            padding-right: 10px;
            z-index: 2;
        }
        .hero-img-col {
            width: 160px;
            position: absolute;
            right: -16px; /* Edge to edge */
            top: -20px;
            z-index: 1;
        }
        .hero-img-col img {
            width: 100%;
            border-radius: 12px 0 0 12px;
        }

        .hero-headline {
            font-size: 20px;
            font-weight: 600; /* SemiBold */
            line-height: 1.4;
            margin-bottom: 24px;
        }
        .hero-headline .highlight { color: var(--primary); }

        .body-small {
            font-size: 12px;
            font-weight: 400; /* Regular */
            color: var(--text-main);
            line-height: 1.5;
            max-width: 60%;
        }

        .feature-icons {
            display: flex;
            justify-content: space-between;
            margin-bottom: 30px;
            border-top: 1px solid var(--border-color);
            border-bottom: 1px solid var(--border-color);
            padding: 16px 0;
        }
        .f-icon {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 6px;
            font-size: 12px;
            font-weight: 400;
            color: var(--text-main);
            text-align: center;
            flex: 1;
        }
        .f-icon i {
            font-size: 24px;
            color: var(--primary);
        }

        .desc-paragraph {
            font-size: 14px;
            font-weight: 400;
            line-height: 1.7;
            color: var(--text-main);
            margin-bottom: 40px;
            padding-right: 20px;
        }
        .desc-paragraph .highlight {
            font-weight: 700; /* Bold */
            color: var(--primary);
        }

        .footer-supporting {
            font-size: 12px;
            font-weight: 400;
            color: var(--text-light);
            text-align: center;
            margin-top: 16px;
        }

        /* --- Survey Core CSS (Kept from original) --- */
        .survey-header {
            background: var(--bg-gray);
            padding: 16px 24px;
            position: sticky;
            top: 0;
            z-index: 10;
        }
        .progress-wrapper {
            width: 100%;
            height: 4px;
            background: #EAEAEA;
            border-radius: 2px;
            overflow: hidden;
            margin-bottom: 24px;
        }
        .progress-bar {
            height: 100%;
            width: 0%;
            background: var(--primary);
            transition: width 0.3s ease;
        }
        .step-indicator {
            font-size: 0.9rem;
            color: var(--text-light);
            margin-bottom: 16px;
            font-weight: 500;
        }
        .survey-content { padding: 10px 24px 30px 24px; max-width: 480px; margin: 0 auto; }
        .survey-step { display: none; animation: fadeIn 0.4s ease; }
        .survey-step.active { display: block; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .question-title { font-size: 1.6rem; font-weight: 700; color: var(--text-main); margin-bottom: 8px; letter-spacing: -0.02em; }
        .question-subtitle { font-size: 1rem; color: var(--text-light); margin-bottom: 30px; }
        .form-group { margin-bottom: 24px; }
        .form-group label { display: block; font-size: 0.95rem; font-weight: 600; margin-bottom: 8px; color: var(--text-main); }
        .form-control { width: 100%; padding: 16px; border: 2px solid var(--border-color); border-radius: 12px; font-size: 1rem; background: var(--white); transition: border-color 0.2s; }
        .form-control:focus { outline: none; border-color: var(--primary); }
        .option-list { display: flex; flex-direction: column; gap: 12px; }
        .option-card { background: var(--white); border: 2px solid var(--white); border-radius: 12px; padding: 18px 20px; display: flex; align-items: center; cursor: pointer; transition: all 0.2s; box-shadow: 0 2px 8px rgba(0,0,0,0.04); }
        .option-card:active { transform: scale(0.98); }
        .option-card.selected { border-color: var(--primary); background: var(--primary-light); }
        .option-card input { display: none; }
        .option-text { font-size: 1.05rem; font-weight: 600; color: var(--text-main); flex-grow: 1; }
        .check-circle { width: 24px; height: 24px; border-radius: 50%; border: 2px solid var(--border-color); display: flex; align-items: center; justify-content: center; color: transparent; transition: all 0.2s; }
        .option-card.selected .check-circle { background: var(--primary); border-color: var(--primary); color: var(--white); }
        .checkbox-card .check-circle { border-radius: 6px; }
        .bottom-action { margin-top: 40px; display: flex; gap: 16px; }
        .secure-text { text-align: center; font-size: 0.8rem; color: var(--text-light); margin-top: 24px; display: flex; align-items: center; justify-content: center; gap: 6px; }
        #analysis-screen { display: none; min-height: 100vh; background: var(--white); text-align: center; padding: 80px 24px; }
        .spinner { width: 50px; height: 50px; border: 4px solid var(--primary-light); border-top: 4px solid var(--primary); border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 30px; }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
"""

new_intro_html = """
    <!-- Modals & Overlays -->
    <div class="sidebar-overlay" id="sidebar-overlay" onclick="toggleSidebar()"></div>
    <div class="sidebar-menu" id="sidebar-menu">
        <i class="ph ph-x" style="font-size:24px; cursor:pointer;" onclick="toggleSidebar()"></i>
        <ul>
            <li>Home</li>
            <li>Skin</li>
            <li>Routine Program</li>
            <li>Treatment Finder</li>
            <li>About Us</li>
        </ul>
    </div>
    
    <div class="search-modal" id="search-modal">
        <div style="display:flex; justify-content:space-between; align-items:center;">
            <div style="font-weight:700; font-size:18px;">Search YUNN</div>
            <i class="ph ph-x" style="font-size:24px; cursor:pointer;" onclick="toggleSearch()"></i>
        </div>
        <div class="search-input-wrapper">
            <i class="ph ph-magnifying-glass" style="font-size:24px; color:var(--text-light);"></i>
            <input type="text" placeholder="Search for routines, ingredients...">
        </div>
    </div>

    <!-- STEP 0: Intro -->
    <div id="intro-screen" class="active">
        
        <!-- Fake Status Bar -->
        <div class="status-bar">
            <div>10:07</div>
            <div class="status-icons">
                <i class="ph-fill ph-cell-signal-full"></i>
                <i class="ph-bold ph-wifi-high"></i>
                <i class="ph-fill ph-battery-full"></i>
            </div>
        </div>

        <!-- Global Header -->
        <div class="global-header">
            <i class="ph ph-list header-icon" onclick="toggleSidebar()"></i>
            <div class="header-logo" onclick="goHome()">YUNN<span></span></div>
            <div class="header-actions">
                <i class="ph ph-magnifying-glass header-icon" onclick="toggleSearch()"></i>
                <i class="ph ph-user header-icon" onclick="handleUserClick()"></i>
                <div class="cart-wrapper" onclick="handleCartClick()">
                    <i class="ph ph-shopping-bag header-icon"></i>
                    <div class="cart-badge" id="cart-badge" style="display:none;">2</div>
                </div>
            </div>
        </div>

        <div class="container">
            <div class="hero-section">
                <div class="hero-text-col">
                    <div class="hero-headline">
                        Your acne keeps <span class="highlight">coming back.</span><br><br>
                        Your dark spots <span class="highlight">won't fade.</span><br><br>
                        Let's find out <span class="highlight">why.</span>
                    </div>
                    <div class="body-small">
                        Answer a few quick questions and get your personalized skin routine.
                    </div>
                </div>
                <div class="hero-img-col">
                    <img src="image/YUNN_Web_image_1.png" alt="Skin Analysis" onerror="this.style.display='none';">
                </div>
            </div>

            <div class="feature-icons">
                <div class="f-icon">
                    <i class="ph-light ph-clock"></i>
                    <span>Takes 3 minutes</span>
                </div>
                <div class="f-icon">
                    <i class="ph-light ph-user-focus"></i>
                    <span>100% Private</span>
                </div>
                <div class="f-icon">
                    <i class="ph-light ph-sparkle"></i>
                    <span>Personalized for you</span>
                </div>
            </div>

            <div class="desc-paragraph">
                Most routines fail because they're built on <span class="highlight">guesswork.</span><br><br>
                YUNN <span class="highlight">analyzes</span> your skin, your <span class="highlight">environment</span>, and your <span class="highlight">lifestyle</span> then builds a <span class="highlight">14-day routine</span> designed specifically for you.
            </div>

            <button class="btn-primary" onclick="startSurvey()">
                Start My Skin Analysis <i class="ph ph-arrow-right" style="margin-left:8px;"></i>
            </button>
            <div class="footer-supporting">
                Takes 3 minutes. Results in 24 hours.
            </div>
        </div>
    </div>
"""

new_js = """
        // --- Navigation Logic ---
        let isLoggedIn = false; // Mock login state
        
        function toggleSidebar() {
            document.getElementById('sidebar-menu').classList.toggle('active');
            document.getElementById('sidebar-overlay').classList.toggle('active');
        }
        function toggleSearch() {
            document.getElementById('search-modal').classList.toggle('active');
        }
        function goHome() {
            window.location.href = 'index.html';
        }
        function handleUserClick() {
            if (!isLoggedIn) {
                alert("Login required. Redirecting to login page...");
                // window.location.href = 'login.html';
            } else {
                alert("Redirecting to My Page...");
            }
        }
        function handleCartClick() {
            if (!isLoggedIn) {
                alert("로그인 후 이용하시기 바랍니다.");
                // window.location.href = 'login.html';
            } else {
                alert("Redirecting to Cart Page...");
            }
        }

        // Demo function to simulate login
        function debugLogin() {
            isLoggedIn = true;
            document.getElementById('cart-badge').style.display = 'flex';
            alert("Simulated Login: Success. Cart badge is now visible.");
        }
"""

# Reconstruct entire file
final_html = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>YUNN | Skin Analysis</title>
    <!-- Phosphor Icons -->
    <script src="https://unpkg.com/@phosphor-icons/web"></script>
    <style>
{new_css}
    </style>
</head>
<body>
{new_intro_html}

{survey_core_html}

{analysis_result_html}

    <script>
{new_js}
{js_content}
    </script>
</body>
</html>
"""

with open('/Users/apple/Desktop/YUNN_Mobile/survey.html', 'w') as f:
    f.write(final_html)

print("survey.html completely updated with new Figma UI and logic.")
