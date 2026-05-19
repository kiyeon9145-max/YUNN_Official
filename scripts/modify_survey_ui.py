import re

with open('/Users/apple/Desktop/YUNN_Mobile/survey.html', 'r') as f:
    content = f.read()

# 1. Update CSS for Progress Bar, Buttons, and Layout
css_updates = """
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

        .bottom-action {
            margin-top: 40px;
            display: flex;
            gap: 16px;
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
        .btn-primary { background-color: var(--primary); }
        .btn-primary:disabled {
            background-color: #CCCCCC;
            cursor: not-allowed;
            border: none;
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
"""

content = re.sub(r'\.survey-header \{.*?\.progress-bar \{.*?\}', css_updates, content, flags=re.DOTALL)

# 2. Update Header HTML
header_replacement = """
        <div class="survey-header">
            <div class="progress-wrapper">
                <div class="progress-bar" id="progress-bar"></div>
            </div>
            <div class="step-indicator" id="step-indicator">1 of 11</div>
        </div>
"""
content = re.sub(r'<div class="survey-header">.*?</div>\s*</div>', header_replacement.strip(), content, flags=re.DOTALL)

# 3. Add bottom actions to all steps
# Find all <div class="survey-step" ...> ... </div> and ensure they have the new bottom-action

def replace_bottom_action(match):
    step_content = match.group(0)
    
    # Remove existing bottom-action if any
    step_content = re.sub(r'<div class="bottom-action">.*?</div>', '', step_content, flags=re.DOTALL)
    
    # Check if this is the first step (we might want a different back button behavior, or hide it)
    step_num = re.search(r'data-step="(\d+)"', step_content).group(1)
    
    back_btn = f'<button type="button" class="btn-outline" onclick="goBack()">Back</button>'
    if step_num == "1":
        # Usually step 1 back goes to intro
        back_btn = f'<button type="button" class="btn-outline" onclick="goBack()">Back</button>'
        next_btn = f'<button type="button" class="btn-primary" id="btn-next-1" onclick="nextStep()" disabled>Next <i class="ph-bold ph-arrow-right" style="margin-left:8px;"></i></button>'
    else:
        next_btn = f'<button type="button" class="btn-primary" onclick="nextStep()">Next <i class="ph-bold ph-arrow-right" style="margin-left:8px;"></i></button>'
        
    bottom_action = f"""
                    <div class="bottom-action">
                        {back_btn}
                        {next_btn}
                    </div>
                    <div class="secure-text">
                        <i class="ph-light ph-lock-key"></i> YUNN keeps your information safe and secure.
                    </div>
    """
    
    # Insert before the closing div of survey-step
    # Actually, survey-step could end with </div>. We find the last </div> before another step or form end.
    # A cleaner way: split by <div class="survey-step" and rebuild, but regex substitution is tricky.
    return step_content.rstrip()[:-6] + bottom_action + "</div>"

# Use a split to reliably append to each step
steps = re.split(r'(<div class="survey-step".*?)(?=\n\s*<div class="survey-step"|</form>)', content, flags=re.DOTALL)

new_content = ""
for part in steps:
    if '<div class="survey-step"' in part:
        # Remove old bottom-action
        part = re.sub(r'<div class="bottom-action">.*?</div>\s*(<div class="secure-text">.*?</div>\s*)?', '', part, flags=re.DOTALL)
        
        step_num = re.search(r'data-step="(\d+)"', part).group(1)
        next_id = ' id="btn-next-1" disabled' if step_num == "1" else ''
        
        bottom_action = f"""
                    <div class="bottom-action">
                        <button type="button" class="btn-outline" onclick="goBack()">Back</button>
                        <button type="button" class="btn-primary"{next_id} onclick="nextStep()">Next <i class="ph-bold ph-arrow-right" style="margin-left:8px;"></i></button>
                    </div>
                    <div class="secure-text">
                        <i class="ph-light ph-lock-key"></i> YUNN keeps your information safe and secure.
                    </div>
"""
        # Append before the last </div> of the step
        # Since part doesn't include the closing </div> of the form, it ends with the </div> of the step
        part = part.rstrip()
        if part.endswith('</div>'):
            part = part[:-6] + bottom_action + "</div>\n"
        
    new_content += part

# Update the JS to handle the step indicator
js_indicator_update = """
        function updateProgress() {
            const percent = ((currentStep - 1) / (totalSteps - 1)) * 100;
            progressBar.style.width = percent + '%';
            const indicator = document.getElementById('step-indicator');
            if (indicator) indicator.innerText = currentStep + ' of ' + totalSteps;
        }
"""
new_content = re.sub(r'function updateProgress\(\) \{.*?\}', js_indicator_update.strip(), new_content, flags=re.DOTALL)


with open('/Users/apple/Desktop/YUNN_Mobile/survey.html', 'w') as f:
    f.write(new_content)

print("Updated UI successfully.")
