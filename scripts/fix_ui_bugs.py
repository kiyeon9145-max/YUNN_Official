import re

with open('/Users/apple/Desktop/YUNN_Mobile/survey.html', 'r') as f:
    content = f.read()

# 1. Fix missing #survey-screen display:none
css_fix = """
        /* --- Survey Core CSS (Kept from original) --- */
        #survey-screen {
            display: none;
            min-height: 100vh;
            background-color: var(--white);
        }
        #survey-screen.active {
            display: block;
        }
        .survey-header {
"""
content = content.replace('/* --- Survey Core CSS (Kept from original) --- */\n        .survey-header {', css_fix)

# 2. Fix Hero Headline Layout
# Replace the hero-text-col inner HTML
old_hero_headline = """                    <div class="hero-headline">
                        Your acne keeps <span class="highlight">coming back.</span><br><br>
                        Your dark spots <span class="highlight">won't fade.</span><br><br>
                        Let's find out <span class="highlight">why.</span>
                    </div>"""

new_hero_headline = """                    <div class="hero-headline" style="letter-spacing: -0.02em;">
                        <div style="margin-bottom: 20px;">Your acne keeps<br><span class="highlight">coming back.</span></div>
                        <div style="margin-bottom: 20px;">Your dark spots<br><span class="highlight">won't fade.</span></div>
                        <div>Let's find out <span class="highlight">why.</span></div>
                    </div>"""
content = content.replace(old_hero_headline, new_hero_headline)

# 3. Fix desc-paragraph spacing
old_desc = """            <div class="desc-paragraph">
                Most routines fail because they're built on <span class="highlight">guesswork.</span><br><br>
                YUNN <span class="highlight">analyzes</span> your skin, your <span class="highlight">environment</span>, and your <span class="highlight">lifestyle</span> then builds a <span class="highlight">14-day routine</span> designed specifically for you.
            </div>"""

new_desc = """            <div class="desc-paragraph" style="letter-spacing: -0.01em;">
                <p style="margin-bottom: 20px;">Most routines fail because they're built on <span class="highlight">guesswork.</span></p>
                <p>YUNN <span class="highlight">analyzes</span> your skin, your <span class="highlight">environment</span>, and your <span class="highlight">lifestyle</span> then builds a <span class="highlight">14-day routine</span> designed specifically for you.</p>
            </div>"""
content = content.replace(old_desc, new_desc)

# 4. Fix hero-img-col to prevent overlap
# In image 1, the image is to the right, but it's smaller.
img_css_old = """        .hero-img-col {
            width: 160px;
            position: absolute;
            right: -16px; /* Edge to edge */
            top: -20px;
            z-index: 1;
        }"""
img_css_new = """        .hero-img-col {
            width: 140px;
            position: absolute;
            right: -16px; /* Edge to edge */
            top: 0px;
            z-index: 1;
        }"""
content = content.replace(img_css_old, img_css_new)


with open('/Users/apple/Desktop/YUNN_Mobile/survey.html', 'w') as f:
    f.write(content)

print("UI bugs fixed.")
