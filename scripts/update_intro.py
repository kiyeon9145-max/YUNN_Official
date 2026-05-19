import re

with open('/Users/apple/Desktop/YUNN_Mobile/survey.html', 'r') as f:
    html = f.read()

# 1. Update CSS variables and add new styles
css_updates = """
        @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css');
        
        :root {
            --primary: #3AAE92; /* Updated from prompt */
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
        }

        .container {
            max-width: 480px;
            margin: 0 auto;
            padding: 0 16px; /* Updated from 24px to 16px */
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
            height: 58px; /* 56~60px from prompt */
            border-radius: 8px; /* Soft rounded corners */
            font-size: 20px;
            font-weight: 500; /* Medium */
            text-decoration: none;
            border: none;
            cursor: pointer;
            transition: background-color 0.2s ease, transform 0.2s ease;
            box-shadow: 0 4px 12px rgba(58, 174, 146, 0.2); /* Soft premium shadow */
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
            padding: 0 16px;
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

        /* --- Sidebar & Navigation --- */
        .sidebar-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: rgba(0,0,0,0.4);
            z-index: 99;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.3s ease;
        }
        .sidebar-overlay.active {
            opacity: 1;
            pointer-events: auto;
        }
        .sidebar-menu {
            position: fixed;
            top: 0;
            left: 0;
            width: 50%;
            max-width: 280px;
            height: 100vh;
            background: var(--white);
            z-index: 100;
            transform: translateX(-100%);
            transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            padding: 24px 16px;
            box-shadow: 2px 0 12px rgba(0,0,0,0.1);
        }
        .sidebar-menu.active {
            transform: translateX(0);
        }
        .sidebar-menu ul { list-style: none; margin-top: 40px; }
        .sidebar-menu li { margin-bottom: 24px; font-size: 18px; font-weight: 500; color: var(--text-main); }
        
        .search-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: var(--white);
            z-index: 1000;
            transform: translateY(-100%);
            transition: transform 0.3s ease;
            padding: 24px 16px;
        }
        .search-modal.active { transform: translateY(0); }
        .search-input-wrapper { display: flex; align-items: center; border-bottom: 2px solid var(--text-main); padding-bottom: 8px; margin-top: 40px; }
        .search-input-wrapper input { border: none; outline: none; font-size: 20px; width: 100%; }

        /* --- Global Header --- */
        .global-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 12px 16px;
            max-width: 480px;
            margin: 0 auto;
            background: var(--white);
            position: relative;
        }
        .header-icon { font-size: 24px; cursor: pointer; color: #000; }
        .header-logo { font-size: 20px; font-weight: 300; letter-spacing: 2px; cursor: pointer; }
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

        /* --- Step 0: Intro Screen --- */
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
            width: 140px;
            position: absolute;
            right: 0;
            top: -20px;
            z-index: 1;
        }
        .hero-img-col img {
            width: 100%;
            border-radius: 12px;
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
            margin-bottom: 40px;
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
"""

# Replace all CSS up to survey-header
html = re.sub(r'@import url\(.*?\.intro-text strong \{.*?\}', css_updates, html, flags=re.DOTALL)

# Let's cleanly replace the entire <style> block by doing a careful split
# The above regex might be fragile. I will re-inject the entire block.
