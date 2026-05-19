import re

with open('/Users/apple/Desktop/YUNN_Mobile/survey.html', 'r') as f:
    content = f.read()

# First, remove ALL <div class="bottom-action">...</div> and <div class="secure-text">...</div> globally inside survey-screen
# But be careful not to remove anything else.
def clean_bottom_action(match):
    s = match.group(0)
    s = re.sub(r'<div class="bottom-action">.*?</div>', '', s, flags=re.DOTALL)
    s = re.sub(r'<div class="secure-text">.*?</div>', '', s, flags=re.DOTALL)
    return s

content = re.sub(r'<div id="survey-screen">.*?</form>', clean_bottom_action, content, flags=re.DOTALL)

# Now, find every <div class="survey-step" ...> ... </div> and append the buttons before the closing </div>
# Since <div class="survey-step" might have nested <div>s, regex is bad. Let's split by '<div class="survey-step"'
parts = content.split('<div class="survey-step"')

new_content = parts[0]
for i in range(1, len(parts)):
    part = parts[i]
    # Extract step number
    match = re.search(r'data-step="(\d+)"', part)
    step_num = match.group(1) if match else "1"
    
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
    
    # We need to find the matching closing </div> for this survey-step.
    # Since we know there are no other major outer divs inside survey-step that are at the very end,
    # we can just split by '</div>' from the right. But survey-step doesn't end cleanly if the next part starts.
    # Wait, splitting by '<div class="survey-step"' means `part` contains the rest of the file OR just until the next survey-step.
    # Because we split by '<div class="survey-step"', `part` goes up to the end of the form, or the start of the next step.
    # If it's not the last step, `part` ends with `</div>\n                \n                <!-- Step X:`
    # If it is the last step, it ends with `</div>\n\n            </form>`
    
    # A safer way is to find the LAST </div> in the part before any HTML comment or form tag
    # Actually, we can just replace the last </div> before the end of the block.
    # Let's find the last occurrence of </div>
    last_div_idx = part.rfind('</div>')
    if last_div_idx != -1:
        part = part[:last_div_idx] + bottom_action + part[last_div_idx:]
        
    new_content += '<div class="survey-step"' + part

with open('/Users/apple/Desktop/YUNN_Mobile/survey.html', 'w') as f:
    f.write(new_content)

print("Fixed buttons.")
