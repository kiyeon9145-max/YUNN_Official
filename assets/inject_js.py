import re

with open('/Users/apple/Desktop/YUNN_Mobile/survey.html', 'r') as f:
    html = f.read()

with open('/Users/apple/Desktop/안티그래비티/survey-form.html', 'r') as f:
    orig = f.read()

match = re.search(r'<script>(.*?)<\/script>', orig, re.DOTALL)
if not match:
    print("Could not find script in original file")
    exit()

orig_script = match.group(1)

# We need to write a new script that implements our logic.
# I'll just write the new script directly since it's cleaner.
new_script = """
        const ROUTINE_DATABASE = """ + re.search(r'const ROUTINE_DATABASE = (\{.*?\});', orig_script, re.DOTALL).group(1) + """;

        let currentStep = 1;
        const totalSteps = 11;
        const progressBar = document.getElementById('progress-bar');
        const steps = document.querySelectorAll('.survey-step');

        function updateProgress() {
            const percent = ((currentStep - 1) / (totalSteps - 1)) * 100;
            progressBar.style.width = percent + '%';
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
                // If it's a checkbox card, just toggle selected class
                if (this.classList.contains('checkbox-card')) {
                    const cb = this.querySelector('input[type="checkbox"]');
                    // Prevent double toggling if clicking directly on input
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

                // If it's a radio card
                const radio = this.querySelector('input[type="radio"]');
                if (radio) {
                    // Deselect others in the same group
                    const step = this.closest('.survey-step');
                    step.querySelectorAll('.option-card').forEach(c => c.classList.remove('selected'));
                    
                    // Select this one
                    this.classList.add('selected');
                    radio.checked = true;

                    // Auto-advance after a short delay
                    setTimeout(() => {
                        nextStep();
                    }, 300);
                }
            });
        });

        // Step 1 validation
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

html = re.sub(r'<script>.*?</script>', f'<script>\n{new_script}\n    </script>', html, flags=re.DOTALL)

with open('/Users/apple/Desktop/YUNN_Mobile/survey.html', 'w') as f:
    f.write(html)

print("JS Injected successfully.")
