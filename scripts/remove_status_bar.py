import re

with open('/Users/apple/Desktop/YUNN_Mobile/survey.html', 'r') as f:
    content = f.read()

# Remove CSS
content = re.sub(r'/\* --- Status Bar Fake UI --- \*/.*?/\* --- Global Header & Modals --- \*/', '/* --- Global Header & Modals --- */', content, flags=re.DOTALL)

# Remove HTML
content = re.sub(r'<!-- Fake Status Bar -->.*?<!-- Global Header -->', '<!-- Global Header -->', content, flags=re.DOTALL)

with open('/Users/apple/Desktop/YUNN_Mobile/survey.html', 'w') as f:
    f.write(content)

print("Status bar removed.")
