import json

html_content = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>YUNN | Skin Analysis</title>
    <!-- Phosphor Icons -->
    <script src="https://unpkg.com/@phosphor-icons/web"></script>
    <style>
        @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css');
        
        :root {
            --primary: #5CC1A6;
            --primary-dark: #4A9C86;
            --primary-light: #E6F5F0;
            --text-main: #1A1A1A;
            --text-light: #666666;
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
        }

        .container {
            max-width: 480px;
            margin: 0 auto;
            padding: 0 24px;
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
            padding: 18px;
            border-radius: 12px;
            font-size: 1.1rem;
            font-weight: 700;
            text-decoration: none;
            border: none;
            cursor: pointer;
            transition: all 0.2s ease;
        }
        .btn-primary:active { transform: scale(0.98); }
        .btn-primary:disabled {
            background-color: #CCCCCC;
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
            padding: 18px;
            border-radius: 12px;
            font-size: 1.1rem;
            font-weight: 700;
            text-decoration: none;
            border: 2px solid var(--primary);
            cursor: pointer;
            transition: all 0.2s ease;
        }
        .btn-outline:active { transform: scale(0.98); }

        /* --- Step 0: Intro Screen --- */
        #intro-screen {
            display: none;
        }
        #intro-screen.active {
            display: block;
        }

        .top-bar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 16px 24px;
            max-width: 480px;
            margin: 0 auto;
        }
        .logo-text { font-size: 1.4rem; font-weight: 800; letter-spacing: 1px; }

        .hero-intro {
            padding: 20px 24px;
            text-align: left;
        }
        .hero-intro h1 {
            font-size: 2.2rem;
            font-weight: 700;
            line-height: 1.3;
            margin-bottom: 20px;
            letter-spacing: -0.02em;
        }
        .hero-intro h1 .highlight { color: var(--primary); }
        .hero-img {
            width: 100%;
            border-radius: 16px;
            margin-bottom: 24px;
            object-fit: cover;
        }
        .feature-icons {
            display: flex;
            justify-content: space-between;
            margin-bottom: 30px;
            text-align: center;
        }
        .f-icon {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 8px;
            font-size: 0.85rem;
            font-weight: 500;
            color: var(--text-light);
        }
        .f-icon i {
            font-size: 1.8rem;
            color: var(--primary);
        }
        .intro-text {
            font-size: 1.05rem;
            color: var(--text-light);
            margin-bottom: 30px;
        }
        .intro-text strong {
            color: var(--primary);
        }
        
        .trust-badge {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            margin-top: 20px;
            font-size: 0.85rem;
            color: var(--text-light);
            padding: 16px;
            background: var(--bg-gray);
            border-radius: 8px;
            margin-bottom: 40px;
        }

        /* --- Survey Core --- */
        #survey-screen {
            display: none;
            min-height: 100vh;
            background-color: var(--bg-gray);
        }
        #survey-screen.active {
            display: block;
        }
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

        .survey-content {
            padding: 10px 24px 30px 24px;
            max-width: 480px;
            margin: 0 auto;
        }
        
        .survey-step {
            display: none;
            animation: fadeIn 0.4s ease;
        }
        .survey-step.active {
            display: block;
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .question-title {
            font-size: 1.6rem;
            font-weight: 700;
            color: var(--text-main);
            margin-bottom: 8px;
            letter-spacing: -0.02em;
        }
        .question-subtitle {
            font-size: 1rem;
            color: var(--text-light);
            margin-bottom: 30px;
        }

        /* Form Controls */
        .form-group {
            margin-bottom: 24px;
        }
        .form-group label {
            display: block;
            font-size: 0.95rem;
            font-weight: 600;
            margin-bottom: 8px;
            color: var(--text-main);
        }
        .form-control {
            width: 100%;
            padding: 16px;
            border: 2px solid var(--border-color);
            border-radius: 12px;
            font-size: 1rem;
            background: var(--white);
            transition: border-color 0.2s;
        }
        .form-control:focus {
            outline: none;
            border-color: var(--primary);
        }

        /* Radio & Checkbox Cards */
        .option-list {
            display: flex;
            flex-direction: column;
            gap: 12px;
        }
        .option-card {
            background: var(--white);
            border: 2px solid var(--white);
            border-radius: 12px;
            padding: 18px 20px;
            display: flex;
            align-items: center;
            cursor: pointer;
            transition: all 0.2s;
            box-shadow: 0 2px 8px rgba(0,0,0,0.04);
        }
        .option-card:active {
            transform: scale(0.98);
        }
        .option-card.selected {
            border-color: var(--primary);
            background: var(--primary-light);
        }
        .option-card input {
            display: none;
        }
        .option-text {
            font-size: 1.05rem;
            font-weight: 600;
            color: var(--text-main);
            flex-grow: 1;
        }
        
        .check-circle {
            width: 24px;
            height: 24px;
            border-radius: 50%;
            border: 2px solid var(--border-color);
            display: flex;
            align-items: center;
            justify-content: center;
            color: transparent;
            transition: all 0.2s;
        }
        .option-card.selected .check-circle {
            background: var(--primary);
            border-color: var(--primary);
            color: var(--white);
        }

        .checkbox-card .check-circle {
            border-radius: 6px;
        }

        .bottom-action {
            margin-top: 40px;
            display: flex;
            gap: 16px;
        }
        .secure-text {
            text-align: center;
            font-size: 0.8rem;
            color: var(--text-light);
            margin-top: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
        }

        /* Analysis Screen */
        #analysis-screen {
            display: none;
            min-height: 100vh;
            background: var(--white);
            text-align: center;
            padding: 80px 24px;
        }
        .spinner {
            width: 50px;
            height: 50px;
            border: 4px solid var(--primary-light);
            border-top: 4px solid var(--primary);
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 30px;
        }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

    </style>
</head>
<body>

    <!-- STEP 0: Intro -->
    <div id="intro-screen" class="active">
        <div class="top-bar">
            <i class="ph-bold ph-list" style="font-size: 1.5rem;"></i>
            <div class="logo-text">YUNN</div>
            <i class="ph-bold ph-user" style="font-size: 1.5rem;"></i>
        </div>

        <div class="container">
            <div class="hero-intro">
                <h1>Your acne keeps <span class="highlight">coming back.</span><br>Your dark spots <span class="highlight">won't fade.</span><br>Let's find out why.</h1>
                
                <img src="image/YUNN_Web_image_1.png" alt="Skin Analysis" class="hero-img">

                <div class="feature-icons">
                    <div class="f-icon">
                        <i class="ph-light ph-clock"></i>
                        <span>Takes 3 minutes</span>
                    </div>
                    <div class="f-icon">
                        <i class="ph-light ph-lock-key"></i>
                        <span>100% Private</span>
                    </div>
                    <div class="f-icon">
                        <i class="ph-light ph-sparkle"></i>
                        <span>Personalized</span>
                    </div>
                </div>

                <p class="intro-text">
                    Most routines fail because they're built on <strong>guesswork</strong>.<br><br>
                    YUNN <strong>analyzes</strong> your skin, your <strong>environment</strong>, and your <strong>lifestyle</strong> then builds a 14-day routine designed specifically for you.
                </p>

                <button class="btn-primary" onclick="startSurvey()">
                    Start My Skin Analysis <i class="ph-bold ph-arrow-right" style="margin-left:8px;"></i>
                </button>

                <div class="trust-badge">
                    <i class="ph-fill ph-lock-key" style="color:var(--primary); font-size:1.5rem;"></i>
                    <div>
                        <div style="font-weight:700; color:var(--text-main);">Trusted by 10,000+ women across India</div>
                        <div>Your skin. Your data. Your results.</div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- SURVEY CORE -->
    <div id="survey-screen">
        <div class="survey-header">
            <div class="progress-wrapper">
                <div class="progress-bar" id="progress-bar"></div>
            </div>
            <div class="step-indicator" id="step-indicator">1 of 11</div>
        </div>

        <div class="survey-content">
            <form id="assessment-form">
"""

def add_bottom_action(step_num):
    next_id = ' id="btn-next-1" disabled' if step_num == 1 else ''
    return f"""
                    <div class="bottom-action">
                        <button type="button" class="btn-outline" onclick="goBack()">Back</button>
                        <button type="button" class="btn-primary"{next_id} onclick="nextStep()">Next <i class="ph-bold ph-arrow-right" style="margin-left:8px;"></i></button>
                    </div>
                    <div class="secure-text">
                        <i class="ph-light ph-lock-key"></i> YUNN keeps your information safe and secure.
                    </div>
                </div>
"""

html_content += """
                <!-- Step 1: Contact Info -->
                <div class="survey-step active" data-step="1">
                    <h2 class="question-title">Let's start with the basics.</h2>
                    <p class="question-subtitle">Your routine will be delivered via WhatsApp.</p>
                    
                    <div class="form-group">
                        <label>Your name</label>
                        <input type="text" id="userName" class="form-control" placeholder="e.g. Ananya" required>
                    </div>
                    <div class="form-group">
                        <label>Email address</label>
                        <input type="email" id="userEmail" class="form-control" placeholder="e.g. name@gmail.com" required>
                    </div>
                    <div class="form-group">
                        <label>WhatsApp number</label>
                        <input type="tel" id="userWhatsApp" class="form-control" placeholder="10-digit number" maxlength="10" required>
                    </div>
""" + add_bottom_action(1) + """

                <!-- Step 2: Gender -->
                <div class="survey-step" data-step="2">
                    <h2 class="question-title">What's your gender?</h2>
                    <p class="question-subtitle">This helps us refine your routine.</p>
                    <div class="option-list radio-group">
                        <label class="option-card"><input type="radio" name="gender" value="Female"><span class="option-text">Female</span><div class="check-circle"><i class="ph-bold ph-check"></i></div></label>
                        <label class="option-card"><input type="radio" name="gender" value="Male"><span class="option-text">Male</span><div class="check-circle"><i class="ph-bold ph-check"></i></div></label>
                        <label class="option-card"><input type="radio" name="gender" value="Prefer not to say"><span class="option-text">Prefer not to say</span><div class="check-circle"><i class="ph-bold ph-check"></i></div></label>
                    </div>
""" + add_bottom_action(2) + """

                <!-- Step 3: Age -->
                <div class="survey-step" data-step="3">
                    <h2 class="question-title">How old are you?</h2>
                    <div class="option-list radio-group">
                        <label class="option-card"><input type="radio" name="age" value="Under 20"><span class="option-text">Under 20</span><div class="check-circle"><i class="ph-bold ph-check"></i></div></label>
                        <label class="option-card"><input type="radio" name="age" value="20-24"><span class="option-text">20–24</span><div class="check-circle"><i class="ph-bold ph-check"></i></div></label>
                        <label class="option-card"><input type="radio" name="age" value="25-29"><span class="option-text">25–29</span><div class="check-circle"><i class="ph-bold ph-check"></i></div></label>
                        <label class="option-card"><input type="radio" name="age" value="30-34"><span class="option-text">30–34</span><div class="check-circle"><i class="ph-bold ph-check"></i></div></label>
                        <label class="option-card"><input type="radio" name="age" value="35+"><span class="option-text">35+</span><div class="check-circle"><i class="ph-bold ph-check"></i></div></label>
                    </div>
""" + add_bottom_action(3) + """

                <!-- Step 4: Skin Type -->
                <div class="survey-step" data-step="4">
                    <h2 class="question-title">What's your skin type?</h2>
                    <p class="question-subtitle">Choose the description that fits best.</p>
                    <div class="option-list radio-group">
                        <label class="option-card">
                            <input type="radio" name="skinType" value="Oily">
                            <div class="option-text"><div>Oily</div><div style="font-size:0.85rem; color:var(--text-light); font-weight:400; margin-top:4px;">Shine appears within an hour of cleansing</div></div>
                            <div class="check-circle"><i class="ph-bold ph-check"></i></div>
                        </label>
                        <label class="option-card">
                            <input type="radio" name="skinType" value="Dry">
                            <div class="option-text"><div>Dry</div><div style="font-size:0.85rem; color:var(--text-light); font-weight:400; margin-top:4px;">Feels tight or flaky, especially after washing</div></div>
                            <div class="check-circle"><i class="ph-bold ph-check"></i></div>
                        </label>
                        <label class="option-card">
                            <input type="radio" name="skinType" value="Combination">
                            <div class="option-text"><div>Combination</div><div style="font-size:0.85rem; color:var(--text-light); font-weight:400; margin-top:4px;">Oily in the T-zone, drier on the cheeks</div></div>
                            <div class="check-circle"><i class="ph-bold ph-check"></i></div>
                        </label>
                        <label class="option-card">
                            <input type="radio" name="skinType" value="Normal">
                            <div class="option-text"><div>Normal</div><div style="font-size:0.85rem; color:var(--text-light); font-weight:400; margin-top:4px;">Balanced — not too oily, not too dry</div></div>
                            <div class="check-circle"><i class="ph-bold ph-check"></i></div>
                        </label>
                    </div>
""" + add_bottom_action(4) + """

                <!-- Step 5: Skin Concerns -->
                <div class="survey-step" data-step="5">
                    <h2 class="question-title">What's actually bothering you?</h2>
                    <p class="question-subtitle">Select everything that applies.</p>
                    <div class="option-list checkbox-group">
                        <label class="option-card checkbox-card"><input type="checkbox" name="concerns" value="Pigmentation"><span class="option-text">Pigmentation (Dark spots)</span><div class="check-circle"><i class="ph-bold ph-check"></i></div></label>
                        <label class="option-card checkbox-card"><input type="checkbox" name="concerns" value="Uneven skin tone"><span class="option-text">Uneven skin tone (Dullness)</span><div class="check-circle"><i class="ph-bold ph-check"></i></div></label>
                        <label class="option-card checkbox-card"><input type="checkbox" name="concerns" value="Acne"><span class="option-text">Acne (Active breakouts)</span><div class="check-circle"><i class="ph-bold ph-check"></i></div></label>
                        <label class="option-card checkbox-card"><input type="checkbox" name="concerns" value="Acne marks"><span class="option-text">Acne marks (Scars)</span><div class="check-circle"><i class="ph-bold ph-check"></i></div></label>
                        <label class="option-card checkbox-card"><input type="checkbox" name="concerns" value="Enlarged pores"><span class="option-text">Enlarged pores</span><div class="check-circle"><i class="ph-bold ph-check"></i></div></label>
                        <label class="option-card checkbox-card"><input type="checkbox" name="concerns" value="Dryness"><span class="option-text">Dryness (Dehydrated skin)</span><div class="check-circle"><i class="ph-bold ph-check"></i></div></label>
                    </div>
""" + add_bottom_action(5) + """

                <!-- Step 6: Triggers -->
                <div class="survey-step" data-step="6">
                    <h2 class="question-title">When does your skin get worse?</h2>
                    <p class="question-subtitle">Triggers help us build a responsive routine.</p>
                    <div class="option-list radio-group">
                        <label class="option-card"><input type="radio" name="trigger" value="Sun"><span class="option-text">After sun exposure</span><div class="check-circle"><i class="ph-bold ph-check"></i></div></label>
                        <label class="option-card"><input type="radio" name="trigger" value="Stress"><span class="option-text">During high-stress periods</span><div class="check-circle"><i class="ph-bold ph-check"></i></div></label>
                        <label class="option-card"><input type="radio" name="trigger" value="Period"><span class="option-text">Around your period</span><div class="check-circle"><i class="ph-bold ph-check"></i></div></label>
                        <label class="option-card"><input type="radio" name="trigger" value="Sleep"><span class="option-text">When not sleeping enough</span><div class="check-circle"><i class="ph-bold ph-check"></i></div></label>
                        <label class="option-card"><input type="radio" name="trigger" value="Same"><span class="option-text">It's always roughly the same</span><div class="check-circle"><i class="ph-bold ph-check"></i></div></label>
                    </div>
""" + add_bottom_action(6) + """

                <!-- Step 7: Sensitivity -->
                <div class="survey-step" data-step="7">
                    <h2 class="question-title">Skin sensitivity.</h2>
                    <p class="question-subtitle">How does your skin react to external factors?</p>
                    <div class="option-list radio-group">
                        <label class="option-card"><input type="radio" name="sensitivity" value="Fine"><span class="option-text">Usually fine — no reaction</span><div class="check-circle"><i class="ph-bold ph-check"></i></div></label>
                        <label class="option-card"><input type="radio" name="sensitivity" value="Occasional"><span class="option-text">Occasionally breaks out/irritated</span><div class="check-circle"><i class="ph-bold ph-check"></i></div></label>
                        <label class="option-card"><input type="radio" name="sensitivity" value="Reacts often"><span class="option-text">Reacts fairly often</span><div class="check-circle"><i class="ph-bold ph-check"></i></div></label>
                        <label class="option-card"><input type="radio" name="sensitivity" value="Always"><span class="option-text">Almost always has a reaction</span><div class="check-circle"><i class="ph-bold ph-check"></i></div></label>
                    </div>
""" + add_bottom_action(7) + """

                <!-- Step 8: Outdoor -->
                <div class="survey-step" data-step="8">
                    <h2 class="question-title">Outdoor habits.</h2>
                    <p class="question-subtitle">How much time do you spend outdoors?</p>
                    <div class="option-list radio-group">
                        <label class="option-card"><input type="radio" name="outdoor" value="Barely"><span class="option-text">Barely any — mostly indoors</span><div class="check-circle"><i class="ph-bold ph-check"></i></div></label>
                        <label class="option-card"><input type="radio" name="outdoor" value="Under 1h"><span class="option-text">Under 1 hour</span><div class="check-circle"><i class="ph-bold ph-check"></i></div></label>
                        <label class="option-card"><input type="radio" name="outdoor" value="1-3h"><span class="option-text">1–3 hours</span><div class="check-circle"><i class="ph-bold ph-check"></i></div></label>
                        <label class="option-card"><input type="radio" name="outdoor" value="3h+"><span class="option-text">More than 3 hours</span><div class="check-circle"><i class="ph-bold ph-check"></i></div></label>
                    </div>
""" + add_bottom_action(8) + """

                <!-- Step 9: Sunscreen -->
                <div class="survey-step" data-step="9">
                    <h2 class="question-title">Sun protection.</h2>
                    <p class="question-subtitle">How often do you apply sunscreen?</p>
                    <div class="option-list radio-group">
                        <label class="option-card"><input type="radio" name="sunscreen" value="Every day"><span class="option-text">Every day, without fail</span><div class="check-circle"><i class="ph-bold ph-check"></i></div></label>
                        <label class="option-card"><input type="radio" name="sunscreen" value="Most days"><span class="option-text">Most days</span><div class="check-circle"><i class="ph-bold ph-check"></i></div></label>
                        <label class="option-card"><input type="radio" name="sunscreen" value="Occasionally"><span class="option-text">Occasionally</span><div class="check-circle"><i class="ph-bold ph-check"></i></div></label>
                        <label class="option-card"><input type="radio" name="sunscreen" value="Rarely"><span class="option-text">Rarely or never</span><div class="check-circle"><i class="ph-bold ph-check"></i></div></label>
                    </div>
""" + add_bottom_action(9) + """

                <!-- Step 10: Sleep -->
                <div class="survey-step" data-step="10">
                    <h2 class="question-title">Lifestyle intensity.</h2>
                    <p class="question-subtitle">How many hours of sleep do you usually get?</p>
                    <div class="option-list radio-group">
                        <label class="option-card"><input type="radio" name="sleep" value="Under 5h"><span class="option-text">Under 5 hours</span><div class="check-circle"><i class="ph-bold ph-check"></i></div></label>
                        <label class="option-card"><input type="radio" name="sleep" value="5-6h"><span class="option-text">5–6 hours</span><div class="check-circle"><i class="ph-bold ph-check"></i></div></label>
                        <label class="option-card"><input type="radio" name="sleep" value="7-8h"><span class="option-text">7–8 hours</span><div class="check-circle"><i class="ph-bold ph-check"></i></div></label>
                        <label class="option-card"><input type="radio" name="sleep" value="8h+"><span class="option-text">More than 8 hours</span><div class="check-circle"><i class="ph-bold ph-check"></i></div></label>
                    </div>
""" + add_bottom_action(10) + """

                <!-- Step 11: Current Routine -->
                <div class="survey-step" data-step="11">
                    <h2 class="question-title">Current routine.</h2>
                    <p class="question-subtitle">What does your skincare look like right now?</p>
                    <div class="option-list radio-group">
                        <label class="option-card"><input type="radio" name="routineLevel" value="Nothing"><span class="option-text">Nothing — I don't have one</span><div class="check-circle"><i class="ph-bold ph-check"></i></div></label>
                        <label class="option-card"><input type="radio" name="routineLevel" value="Wash only"><span class="option-text">I wash my face, that's it</span><div class="check-circle"><i class="ph-bold ph-check"></i></div></label>
                        <label class="option-card"><input type="radio" name="routineLevel" value="Basic"><span class="option-text">A basic routine (1–2 products)</span><div class="check-circle"><i class="ph-bold ph-check"></i></div></label>
                        <label class="option-card"><input type="radio" name="routineLevel" value="Multi"><span class="option-text">A multi-step routine (3+ products)</span><div class="check-circle"><i class="ph-bold ph-check"></i></div></label>
                    </div>
""" + add_bottom_action(11) + """
            </form>
        </div>
    </div>

    <!-- ANALYSIS SCREEN -->
    <div id="analysis-screen">
        <div class="container">
            <div class="spinner"></div>
            <h2 class="question-title">Building your routine.</h2>
            <p class="question-subtitle">We're cross-referencing your skin profile, lifestyle data, and environment.</p>
            <div id="cycling-status" style="font-weight:600; color:var(--primary);">Analysing skin concern patterns...</div>
        </div>
    </div>

    <!-- RESULT SCREEN -->
    <div id="result-screen" style="display:none; padding-bottom:60px; background:var(--bg-gray); min-height:100vh;">
        <div class="survey-header" style="justify-content:center;">
            <div class="logo-text">YUNN</div>
        </div>
        <div class="survey-content">
            <h2 class="question-title"><span id="res-name">Ananya</span>'s 14-day routine.</h2>
            <p class="question-subtitle">Built around your skin, your triggers, and your lifestyle.</p>
            
            <div id="routine-sections">
                <!-- Injected via JS -->
            </div>

            <div style="background:var(--white); padding:24px; border-radius:16px; text-align:center; margin-top:24px; box-shadow:0 4px 12px rgba(0,0,0,0.05);">
                <p style="font-size:1.1rem; font-weight:600; margin-bottom:8px;">Your routine focuses on <span id="res-focus" style="color:var(--primary);">Acne prevention</span>.</p>
                <div style="font-size:2rem; font-weight:800; margin-bottom:20px;">₹2,850</div>
                <button class="btn-primary" onclick="alert('Proceed to checkout')">Start my 14-day routine</button>
                <p style="font-size:0.85rem; color:var(--text-light); margin-top:16px;">"If your skin doesn't improve, we don't stop. We rebuild."</p>
            </div>
        </div>
    </div>
"""

# Extract JS logic
import re

with open('/Users/apple/Desktop/안티그래비티/survey-form.html', 'r') as f:
    orig = f.read()

match = re.search(r'<script>(.*?)<\/script>', orig, re.DOTALL)
if match:
    orig_script = match.group(1)

new_script = """
        const ROUTINE_DATABASE = """ + re.search(r'const ROUTINE_DATABASE = (\{.*?\});', orig_script, re.DOTALL).group(1) + """;

        let currentStep = 1;
        const totalSteps = 11;
        const progressBar = document.getElementById('progress-bar');
        const steps = document.querySelectorAll('.survey-step');

        function updateProgress() {
            const percent = ((currentStep - 1) / (totalSteps - 1)) * 100;
            progressBar.style.width = percent + '%';
            const indicator = document.getElementById('step-indicator');
            if (indicator) indicator.innerText = currentStep + ' of ' + totalSteps;
        }

        function goToStep(step) {
            if (step < 1 || step > totalSteps) return;
            steps.forEach(s => s.classList.remove('active'));
            document.querySelector(`.survey-step[data-step="${step}"]`).classList.add('active');
            currentStep = step;
            updateProgress();
            window.scrollTo(0, 0);
        }

        function nextStep() {
            // Very simple validation
            if (currentStep === 1) {
                if(!document.getElementById('userName').value || !document.getElementById('userEmail').value || !document.getElementById('userWhatsApp').value) {
                    alert("Please fill out all fields.");
                    return;
                }
            }
            if (currentStep === totalSteps) {
                startAnalysis();
            } else {
                goToStep(currentStep + 1);
            }
        }

        function goBack() {
            if (currentStep > 1) {
                goToStep(currentStep - 1);
            } else {
                // Go back to intro
                document.getElementById('survey-screen').classList.remove('active');
                document.getElementById('intro-screen').classList.add('active');
            }
        }

        function startSurvey() {
            document.getElementById('intro-screen').classList.remove('active');
            document.getElementById('survey-screen').classList.add('active');
            updateProgress();
            window.scrollTo(0, 0);
        }

        // Auto-advance logic for radio cards
        document.querySelectorAll('.option-card').forEach(card => {
            card.addEventListener('click', function(e) {
                if (this.classList.contains('checkbox-card')) {
                    const cb = this.querySelector('input[type="checkbox"]');
                    if (e.target !== cb) {
                        cb.checked = !cb.checked;
                    }
                    if (cb.checked) {
                        this.classList.add('selected');
                    } else {
                        this.classList.remove('selected');
                    }
                    return;
                }

                const radio = this.querySelector('input[type="radio"]');
                if (radio) {
                    const step = this.closest('.survey-step');
                    step.querySelectorAll('.option-card').forEach(c => c.classList.remove('selected'));
                    this.classList.add('selected');
                    radio.checked = true;

                    setTimeout(() => {
                        nextStep();
                    }, 300);
                }
            });
        });

        const step1Inputs = document.querySelectorAll('#userName, #userEmail, #userWhatsApp');
        const btnNext1 = document.getElementById('btn-next-1');
        step1Inputs.forEach(input => {
            input.addEventListener('input', () => {
                const name = document.getElementById('userName').value;
                const email = document.getElementById('userEmail').value;
                const phone = document.getElementById('userWhatsApp').value;
                if(name.length > 1 && email.includes('@') && phone.length >= 10) {
                    btnNext1.disabled = false;
                } else {
                    btnNext1.disabled = true;
                }
            });
        });

        function startAnalysis() {
            document.getElementById('survey-screen').style.display = 'none';
            document.getElementById('analysis-screen').style.display = 'block';
            
            const statusMessages = ["Analysing skin concern patterns...", "Mapping daily environment...", "Calibrating routine intensity...", "Finalising your plan..."];
            let i = 0;
            const interval = setInterval(() => {
                document.getElementById('cycling-status').innerText = statusMessages[i % statusMessages.length];
                i++;
                if (i === 12) {
                    clearInterval(interval);
                    showResults();
                }
            }, 600);
        }

        function showResults() {
            const genderVal = document.querySelector('input[name="gender"]:checked');
            const gender = (genderVal && genderVal.value === "Male") ? "M" : "F";
            
            const concernElements = document.querySelectorAll('input[name="concerns"]:checked');
            let concern = "A";
            if (concernElements.length > 0) {
                const primaryVal = concernElements[0].value;
                if (primaryVal === "Pigmentation" || primaryVal === "Uneven skin tone") {
                    concern = "P";
                }
            }

            const typeVal = document.querySelector('input[name="skinType"]:checked');
            const type = typeVal ? typeVal.value.charAt(0) : "O"; // Default O

            const routineId = `${gender}-${concern}-${type}`;
            const routine = ROUTINE_DATABASE[routineId] || ROUTINE_DATABASE["F-A-O"];

            document.getElementById('analysis-screen').style.display = 'none';
            document.getElementById('result-screen').style.display = 'block';
            
            document.getElementById('res-name').innerText = document.getElementById('userName').value || 'Guest';
            document.getElementById('res-focus').innerText = concern === "P" ? "Hyperpigmentation" : "Acne prevention";

            renderRoutineBox("Morning", routine.morning);
            renderRoutineBox("On-the-go", routine.out);
            renderRoutineBox("Reset", routine.home);
            renderRoutineBox("Evening", routine.evening);
        }

        function renderRoutineBox(title, items) {
            const container = document.getElementById('routine-sections');
            if(!items || items.length === 0) return;
            
            let html = `
            <div style="background:var(--white); padding:24px; border-radius:16px; text-align:left; margin-top:24px; box-shadow:0 4px 12px rgba(0,0,0,0.05);">
                <div style="font-size:0.85rem; font-weight:700; color:var(--primary); text-transform:uppercase; margin-bottom:8px;">${title}</div>
            `;
            
            items.forEach((item, idx) => {
                html += `
                <div style="display:flex; gap:16px; margin-top:16px; align-items:flex-start;">
                    <div style="width:28px; height:28px; border-radius:50%; background:var(--primary-light); color:var(--primary); display:flex; align-items:center; justify-content:center; font-weight:700; font-size:0.9rem; flex-shrink:0;">${idx+1}</div>
                    <div>
                        <div style="font-weight:700; font-size:1.05rem;">${item.name}</div>
                        <div style="font-size:0.9rem; color:var(--text-light); margin-top:4px;">${item.desc}</div>
                    </div>
                </div>
                `;
            });
            html += `</div>`;
            container.innerHTML += html;
        }
"""

html_content += f"""
    <script>
{new_script}
    </script>
</body>
</html>
"""

with open('/Users/apple/Desktop/YUNN_Mobile/survey.html', 'w') as f:
    f.write(html_content)

print("Generated clean layout survey.html")
