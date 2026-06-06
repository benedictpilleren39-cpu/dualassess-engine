/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/ClientSide/javascript.js to edit this template
 */


// Variable context arrays to monitor independent counters per discipline
// Monitor active subject selections
// Monitor active subject selections
const trackingState = {
    activeSubject: 'science'
};

// Sidebar Subject Toggle Handler
document.getElementById('sidebarContainer').addEventListener('click', (event) => {
    if (!event.target.classList.contains('subject-btn')) return;
    
    document.querySelectorAll('.subject-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    const targetSubject = event.target.getAttribute('data-subject');
    trackingState.activeSubject = targetSubject;
    
    document.querySelectorAll('.subject-panel').forEach(panel => panel.classList.remove('active'));
    document.getElementById(`panel-${targetSubject}`).classList.add('active');
});

function getActivePanel() {
    return document.getElementById(`panel-${trackingState.activeSubject}`);
}

// 1. ADD SECTION BREAK TO WORKSPACE
document.getElementById('addSectionBtn').addEventListener('click', () => {
    const parentPanel = getActivePanel();
    const sectionWrapper = document.createElement('div');
    sectionWrapper.classList.add('section-card');
    
    sectionWrapper.innerHTML = `
        <input type="text" class="input-flat section-title-field" value="PART 1: MULTIPLE CHOICE" style="font-size: 22px; font-weight: bold; margin-bottom: 10px;">
        <input type="text" class="input-flat" placeholder="Description (optional)" style="font-size: 14px; color: #606266; margin-bottom: 15px;">
        <div style="text-align: right;">
            <button class="btn-utility" onclick="this.closest('.section-card').remove()" style="color: #ff4d4d; border-color: #ff4d4d;">Delete Section</button>
        </div>
    `;
    parentPanel.appendChild(sectionWrapper);
});

// Helper function to dynamically update the answer key dropdown list choices based on option inputs
function updateAnswerKeyDropdown(cardWrapper) {
    const type = cardWrapper.querySelector('.type-toggle-select').value;
    const keySelect = cardWrapper.querySelector('.correct-answer-select');
    
    if (!keySelect) return;
    keySelect.innerHTML = '';
    
    if (type === 'MC') {
        const options = cardWrapper.querySelectorAll('.choice-text-input');
        options.forEach((opt, idx) => {
            const charLabel = String.fromCharCode(97 + idx); // a, b, c, d
            const optVal = opt.value || `Option ${idx + 1}`;
            keySelect.innerHTML += `<option value="${optVal}">Choice ${charLabel.toUpperCase()} (${optVal})</option>`;
        });
    } else if (type === 'TF') {
        keySelect.innerHTML = `
            <option value="True">True</option>
            <option value="False">False</option>
        `;
    } else if (type === 'ID') {
        keySelect.innerHTML = `<option value="TEXT_INPUT">Short Answer (Evaluates Student Text String)</option>`;
    }
}

// 2. CREATE QUESTION CARD SUITE
function generateNewQuestionCard() {
    const parentPanel = getActivePanel();
    const cardWrapper = document.createElement('div');
    cardWrapper.classList.add('question-card');
    
    cardWrapper.innerHTML = `
        <div style="display: flex; gap: 15px; align-items: center; width: 100%;">
            <input type="text" class="input-flat question-prompt-field" placeholder="Enter your evaluation or quiz prompt text here" style="flex: 1; font-weight: bold;">
            <select class="dropdown-select type-toggle-select">
                <option value="MC">Multiple Choice</option>
                <option value="TF">True / False</option>
                <option value="ID">Identification</option>
            </select>
        </div>
        
        <div class="options-list">
            <div class="option-row" style="margin-top: 8px;"><input type="radio" disabled> <input type="text" class="input-flat choice-text-input" value="Option 1" style="width: 250px; margin-left: 5px;"> <button class="btn-utility option-remove-btn">-</button></div>
            <div class="option-row" style="margin-top: 8px;"><input type="radio" disabled> <input type="text" class="input-flat choice-text-input" value="Option 2" style="width: 250px; margin-left: 5px;"> <button class="btn-utility option-remove-btn">-</button></div>
        </div>

        <!-- NEW ANSWER SELECTOR GRID ROW FOR JAVA SWING SCORING LOGIC -->
        <div class="answer-key-row" style="margin-top: 15px; padding: 10px; background-color: #fcf8e3; border: 1px solid #faebcc; border-radius: 4px; display: flex; align-items: center; gap: 10px;">
            <span style="font-size: 13px; font-weight: bold; color: #8a6d3b;">Target Correct Answer Key:</span>
            <select class="dropdown-select correct-answer-select" style="flex: 1; background: #fff; border-color: #faebcc;"></select>
            <input type="text" class="input-flat identification-key-field" placeholder="Type expected verification answer..." style="display:none; flex:1; background: #fff; padding: 4px 8px; font-size:13px;">
        </div>
        
        <div style="display: flex; justify-content: space-between; margin-top: 15px; border-top: 1px solid #f0f2f5; padding-top: 12px;">
            <button class="btn-utility add-choice-item-btn">Add Option</button>
            <div style="display: flex; gap: 10px;">
                <button class="btn-utility inside-add-btn" style="background-color: #0000ff; color: white; font-weight: bold;">Add Question</button>
                <button class="btn-utility" onclick="this.closest('.question-card').remove()" style="background-color: #e4e7ed;">Delete</button>
            </div>
        </div>
    `;

    const typeSelect = cardWrapper.querySelector('.type-toggle-select');
    const optionsBlock = cardWrapper.querySelector('.options-list');
    const optAddBtn = cardWrapper.querySelector('.add-choice-item-btn');
    const idKeyField = cardWrapper.querySelector('.identification-key-field');
    const keySelect = cardWrapper.querySelector('.correct-answer-select');
    
    // Standard setup triggers
    updateAnswerKeyDropdown(cardWrapper);

    typeSelect.addEventListener('change', () => {
        idKeyField.style.display = "none";
        keySelect.style.display = "inline-block";
        
        if (typeSelect.value === 'MC') {
            optAddBtn.style.display = "inline-block";
            optionsBlock.innerHTML = `
                <div class="option-row" style="margin-top: 8px;"><input type="radio" disabled> <input type="text" class="input-flat choice-text-input" value="Option 1" style="width: 250px; margin-left: 5px;"> <button class="btn-utility option-remove-btn">-</button></div>
                <div class="option-row" style="margin-top: 8px;"><input type="radio" disabled> <input type="text" class="input-flat choice-text-input" value="Option 2" style="width: 250px; margin-left: 5px;"> <button class="btn-utility option-remove-btn">-</button></div>
            `;
        } else if (typeSelect.value === 'TF') {
            optAddBtn.style.display = "none";
            optionsBlock.innerHTML = `
                <div class="option-row" style="margin-top: 8px;"><input type="radio" disabled> <span style="font-family: Arial, sans-serif; font-size:14px; margin-left: 5px;">True</span></div>
                <div class="option-row" style="margin-top: 8px;"><input type="radio" disabled> <span style="font-family: Arial, sans-serif; font-size:14px; margin-left: 5px;">False</span></div>
            `;
        } else {
            optAddBtn.style.display = "none";
            keySelect.style.display = "none";
            idKeyField.style.display = "inline-block";
            optionsBlock.innerHTML = `<div style="padding: 10px 0;"><input type="text" class="input-flat" placeholder="Short response answer underline space..." style="width: 80%; border-bottom: 1px dashed #909399;" disabled></div>`;
        }
        updateAnswerKeyDropdown(cardWrapper);
    });

    // Update keys dynamically if choice text names are typed/altered
    cardWrapper.addEventListener('input', (e) => {
        if (e.target.classList.contains('choice-text-input')) {
            updateAnswerKeyDropdown(cardWrapper);
        }
    });

    // Handle choice row removal updates cleanly
    cardWrapper.addEventListener('click', (e) => {
        if (e.target.classList.contains('option-remove-btn')) {
            e.target.parentElement.remove();
            updateAnswerKeyDropdown(cardWrapper);
        }
    });

    optAddBtn.addEventListener('click', () => {
        const rowCount = optionsBlock.querySelectorAll('.option-row').length + 1;
        const newRow = document.createElement('div');
        newRow.classList.add('option-row');
        newRow.style.marginTop = "8px";
        newRow.innerHTML = `<input type="radio" disabled> <input type="text" class="input-flat choice-text-input" value="Option ${rowCount}" style="width: 250px; margin-left: 5px;"> <button class="btn-utility option-remove-btn">-</button>`;
        optionsBlock.appendChild(newRow);
        updateAnswerKeyDropdown(cardWrapper);
    });

    cardWrapper.querySelector('.inside-add-btn').addEventListener('click', () => {
        generateNewQuestionCard();
    });

    parentPanel.appendChild(cardWrapper);
}

document.getElementById('createQuestionBtn').addEventListener('click', () => {
    generateNewQuestionCard();
});

// EMBEDDED BASE64 ENCODED ACLC SYSTEM LOGO DATA EMBEDDINGS (Stops broker link errors)
const aclcLogoBase64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFgAAABYCAMAAAC7jXnRAAAAMFBMVEVHcEwAAAD///8gICD/mZn/zMz/5ub/8vL/AAnMADAAMADw8PDw8PDw8PDw8PDw8PDw8PC0Z9scAAAACXBIWXMAAA7EAAAOxAGVKw4bAAABMElEQVRYhe3Xy3LDMAhFUTg4YOf//9pOmzSpm9pOnXvR7gskgXwI7Gg0Gv076m06fXp3a0T0wUoPZkWv8mCmh9Cg6Cl0EFrpIDTSgXfSQZjeSfA6Yv6K97LqU1InDqSOnTiwInViP7GfOCwHUsdOHFiR6vD+H6mOBM72gWscuT9w4DofHwAnvgu4YAnwAs7XgXNgO/8AnLkWOPNdwDnXAmdcC6x9v60WOPNdQDwWwHgtgPFaAOO1AMZrAYzXAhivBTBeC2C8FsB4LYDxWgDjtfCO9/O2gscCGK8FMF4LYLwWwHgtgPFaAOO1AMZrAYzXAhivBTBeC2C8FsB4LYDxWgDjtfCO1/G2gscCGK8FMF4LYLwWwHgtgPFaAOO1AMZrAYzXAhivBTBeC2C8FsB4LYDxWgDjtfCO16X6wB8w2wNf69OfjUajv6L+AKm0E6f1Z97OAAAAAElFTkSuQmCC";

// 3. EXPORT TO WORD
document.getElementById('exportToWordBtn').addEventListener('click', () => {
    const targetPanel = getActivePanel();
    const childrenElements = targetPanel.children;
    
    if (childrenElements.length === 0) {
        alert("Compile Warning! Your workspace panel is empty. Add elements before exporting.");
        return;
    }

    const currentSubjectStr = trackingState.activeSubject.charAt(0).toUpperCase() + trackingState.activeSubject.slice(1);

    let docHtml = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
        <title>Exported Assessment</title>
        <style>
            body { font-family: 'Times New Roman', Times, serif; line-height: 1.4; padding: 40px; color: #000000; }
            .header-table { width: 100%; border-collapse: collapse; margin-bottom: 15px; border: none; }
            .header-table td { text-align: center; border: none; padding: 0; }
            .school-title { font-size: 16pt; font-weight: bold; text-transform: uppercase; margin: 0; }
            .school-location { font-size: 11pt; font-weight: bold; margin: 2px 0; }
            .department-title { font-size: 11pt; font-weight: bold; margin: 2px 0; text-transform: uppercase; }
            .exam-title { font-size: 13pt; font-style: italic; font-weight: bold; margin-top: 5px; }
            
            .info-table { width: 100%; border-collapse: collapse; margin-bottom: 25px; border: none; }
            .info-table td { font-size: 11pt; padding: 5px 2px; border: none; }
            .underline-field { border-bottom: 1px solid #000000 !important; }
            
            .section-header-title { font-size: 12pt; font-weight: bold; text-transform: uppercase; margin-top: 25px; margin-bottom: 12px; text-align: left; border-bottom: 1px solid #000; padding-bottom: 3px; }
            .question-item { font-size: 11pt; margin-top: 10px; margin-bottom: 4px; margin-left: 15px; }
            .options-container { margin-left: 45px; }
            .option-line { font-size: 11pt; margin-bottom: 3px; }
            .id-underline { font-size: 11pt; margin-top: 5px; margin-bottom: 15px; margin-left: 45px; }
        </style>
    </head>
    <body>

        <table class="header-table">
            <tr>
                <td>
                    <img src="${aclcLogoBase64}" width="75" height="75" style="display:block; margin:0 auto 10px auto;"><br>
                    <div class="school-title">ACLC College of Ormoc</div>
                    <div class="school-location">Brgy. Cogon, Ormoc City, Leyte</div>
                    <div class="department-title">-SENIOR HIGH SCHOOL DEPARTMENT-</div>
                    <div class="exam-title">${currentSubjectStr} Examination</div>
                </td>
            </tr>
        </table>

        <table class="info-table">
            <tr>
                <td style="width: 10%;">NAME:</td>
                <td class="underline-field" style="width: 50%;">__________________________________________________</td>
                <td style="width: 10%; padding-left: 15px;">SCORE:</td>
                <td class="underline-field" style="width: 30%;">___________________________</td>
            </tr>
            <tr>
                <td style="width: 10%;">SECTION:</td>
                <td class="underline-field" style="width: 50%;">__________________________________________________</td>
                <td style="width: 10%; padding-left: 15px;">DATE:</td>
                <td class="underline-field" style="width: 30%;">___________________________</td>
            </tr>
        </table>
    `;
    
    let countNum = 1;

    Array.from(childrenElements).forEach(element => {
        if (element.classList.contains('section-card')) {
            const titleValue = element.querySelector('.section-title-field').value || "Untitled Section";
            docHtml += `<div class="section-header-title">${titleValue.toUpperCase()}</div>`;
        } 
        else if (element.classList.contains('question-card')) {
            const promptValue = element.querySelector('.question-prompt-field').value || "Untitled Question";
            const typeValue = element.querySelector('.type-toggle-select').value;

            docHtml += `<div class="question-item"><strong>${countNum}. ${promptValue}</strong></div>`;
            
            if (typeValue === 'MC') {
                docHtml += `<div class="options-container">`;
                const optionInputs = element.querySelectorAll('.choice-text-input');
                optionInputs.forEach((opt, idx) => {
                    const charLabel = String.fromCharCode(97 + idx); // a, b, c, d
                    docHtml += `<div class="option-line">&nbsp;&nbsp;&nbsp;&nbsp;[ &nbsp; ] &nbsp; <strong>${charLabel}.</strong> ${opt.value}</div>`;
                });
                docHtml += `</div>`;
            } else if (typeValue === 'TF') {
                docHtml += `<div class="options-container">`;
                docHtml += `<div class="option-line">&nbsp;&nbsp;&nbsp;&nbsp;[ &nbsp; ] &nbsp; a. True</div>`;
                docHtml += `<div class="option-line">&nbsp;&nbsp;&nbsp;&nbsp;[ &nbsp; ] &nbsp; b. False</div>`;
                docHtml += `</div>`;
            } else if (typeValue === 'ID') {
                docHtml += `<div class="id-underline">Answer: __________________________________________________</div>`;
            }
            countNum++;
        }
    });

    docHtml += `</body></html>`;

    const blob = new Blob(['\ufeff' + docHtml], { type: "application/msword" });
    const downloadLink = document.createElement("a");
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = `DualAssess_${trackingState.activeSubject}_ExamSheet.doc`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
});

// 4. SAVE AND PUBLISH - WITH INTEGRATED AUTO-CHECKING SCORE MACHINE LOGIC
document.getElementById('savePublishBtn').addEventListener('click', () => {
    const targetPanel = getActivePanel();
    const childrenElements = targetPanel.children;
    
    if (childrenElements.length === 0) {
        alert("Cannot Publish! Please assemble at least one question card item beforehand.");
        return;
    }

    const currentSubjectStr = trackingState.activeSubject.charAt(0).toUpperCase() + trackingState.activeSubject.slice(1);
    let formElementsHtml = '';
    let countNum = 1;

    Array.from(childrenElements).forEach((element, index) => {
        if (element.classList.contains('section-card')) {
            const title = element.querySelector('.section-title-field').value || "Section";
            formElementsHtml += `<div class="section-banner-title"><h3>${title.toUpperCase()}</h3></div>`;
        } else if (element.classList.contains('question-card')) {
            const prompt = element.querySelector('.question-prompt-field').value || "Question Prompt";
            const type = element.querySelector('.type-toggle-select').value;
            
            // Determine the answer key value based on card configuration types
            let keyAnswer = '';
            if (type === 'ID') {
                keyAnswer = element.querySelector('.identification-key-field').value.trim().toLowerCase();
            } else {
                keyAnswer = element.querySelector('.correct-answer-select').value;
            }

            // data-key embeds the solution cleanly without revealing it directly to the UI view lines
            formElementsHtml += `<div class="quiz-question-row q-item" data-type="${type}" data-key="${keyAnswer}">
                <p class="prompt-text"><strong>${countNum}. ${prompt}</strong></p>`;

            if (type === 'MC') {
                const optionInputs = element.querySelectorAll('.choice-text-input');
                optionInputs.forEach((opt, idx) => {
                    const charLabel = String.fromCharCode(97 + idx); // a, b, c, d
                    formElementsHtml += `
                        <label class="quiz-option-label">
                            <input type="radio" name="answer_${index}" value="${opt.value}"> <strong>${charLabel}.</strong> ${opt.value}
                        </label><br>`;
                });
            } else if (type === 'TF') {
                formElementsHtml += `
                    <label class="quiz-option-label"><input type="radio" name="answer_${index}" value="True"> <strong>a.</strong> True</label><br>
                    <label class="quiz-option-label"><input type="radio" name="answer_${index}" value="False"> <strong>b.</strong> False</label><br>`;
            } else if (type === 'ID') {
                formElementsHtml += `<input type="text" class="quiz-id-field text-user-answer" placeholder="Type your response verification answer...">`;
            }

            formElementsHtml += `</div>`;
            countNum++;
        }
    });

    const fullPageCode = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>${currentSubjectStr} Examination - ACLC Portal</title>
    <style>
        body { font-family: 'Times New Roman', Times, serif; background-color: #f0f2f5; color: #333; padding: 20px; margin: 0; }
        .exam-sheet-card { max-width: 750px; background: white; margin: 20px auto; padding: 40px; border-radius: 4px; box-shadow: 0 2px 8px rgba(0,0,0,0.15); border: 1px solid #ccc; }
        .brand-header-block { text-align: center; margin-bottom: 25px; border-bottom: 2px solid #000; padding-bottom: 20px; }
        .logo-img { width: 75px; height: 75px; margin-bottom: 10px; }
        .title-h1 { font-size: 20pt; font-weight: bold; text-transform: uppercase; margin: 0; }
        .sub-p { font-size: 12pt; font-weight: bold; margin: 3px 0; }
        
        .student-grid { width: 100%; margin-bottom: 30px; }
        .student-grid td { padding: 6px 4px; font-size: 11pt; font-weight: bold; }
        .fill-line { font-family: inherit; font-size: 11pt; font-weight: bold; width: 100%; padding: 4px; border: none; border-bottom: 1px dashed #000; outline: none; }
        
        .section-banner-title { margin-top: 30px; margin-bottom: 15px; border-bottom: 2px solid #000; padding-bottom: 4px; background-color: #9060b8; color: white; padding: 8px 12px; border-radius: 4px; }
        .section-banner-title h3 { margin: 0; font-size: 13pt; font-weight: bold; text-transform: uppercase; }
        
        .quiz-question-row { margin: 18px 0; padding: 15px; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 6px; }
        .prompt-text { font-size: 12pt; margin-top:0; margin-bottom: 10px; color: #000; }
        .quiz-option-label { font-size: 11pt; cursor: pointer; display: inline-block; margin: 4px 0 4px 15px; }
        .quiz-id-field { width: 70%; padding: 6px; margin-top: 5px; margin-left: 15px; border: none; border-bottom: 1px solid #000; font-family: inherit; font-size: 11pt; outline: none; }
        
        .action-button { width: 100%; padding: 14px; background: #0000ff; color: white; font-weight: bold; font-size: 13pt; border: none; cursor: pointer; margin-top: 30px; text-transform: uppercase; letter-spacing: 1px; border-radius:4px; }
        .action-button:hover { background: #0000cc; }
    </style>
</head>
<body>
    <div class="exam-sheet-card">
        <div class="brand-header-block">
            <img src="${aclcLogoBase64}" class="logo-img" alt="ACLC Logo">
            <div class="title-h1">ACLC College of Ormoc</div>
            <div class="sub-p">Brgy. Cogon, Ormoc City, Leyte</div>
            <div class="sub-p">-SENIOR HIGH SCHOOL DEPARTMENT-</div>
            <div class="sub-p" style="font-style: italic; font-size: 13pt; margin-top: 5px;">${currentSubjectStr} Examination</div>
        </div>

        <table class="student-grid">
            <tr>
                <td style="width:10%;">NAME:</td>
                <td style="width:50%;"><input type="text" class="fill-line" placeholder="Enter Full Student Name"></td>
                <td style="width:12%; padding-left:15px;">SCORE:</td>
                <td style="width:28%;"><input type="text" id="scoreDisplayField" class="fill-line" style="text-align: center; color: red; font-size: 14pt;" readonly placeholder="-- / --"></td>
            </tr>
            <tr>
                <td style="width:10%;">SECTION:</td>
                <td style="width:50%;"><input type="text" class="fill-line" placeholder="Grade and Track Section"></td>
                <td style="width:12%; padding-left:15px;">DATE:</td>
                <td style="width:28%;"><input type="text" class="fill-line" placeholder="MM/DD/YYYY"></td>
            </tr>
        </table>

        <form id="quizForm">
            ${formElementsHtml}
            <button type="button" class="action-button" onclick="runAutomatedGradeEvaluation()">Submit Examination</button>
        </form>
    </div>

    <!-- NATIVE AUTOMATED CHECKING SCRIPT CORE -->
    <script>
        function runAutomatedGradeEvaluation() {
            const questionCards = document.querySelectorAll('.q-item');
            let computedScore = 0;
            const totalQuestionsCount = questionCards.length;

            questionCards.forEach(card => {
                const type = card.getAttribute('data-type');
                const key = card.getAttribute('data-key');
                let selectedUserString = "";

                if (type === 'MC' || type === 'TF') {
                    const selectedOption = card.querySelector('input[type="radio"]:checked');
                    if (selectedOption) {
                        selectedUserString = selectedOption.value;
                    }
                } else if (type === 'ID') {
                    const textInputField = card.querySelector('.text-user-answer');
                    if (textInputField) {
                        selectedUserString = textInputField.value.trim().toLowerCase();
                    }
                }

                // Check answers against the keys
                if (type === 'ID') {
                    if (selectedUserString === key) {
                        computedScore++;
                        card.style.borderColor = "#27ae60"; // Highlight green on success
                        card.style.backgroundColor = "#f2f9f5";
                    } else {
                        card.style.borderColor = "#c0392b"; // Highlight red on failure
                        card.style.backgroundColor = "#fdf2f2";
                    }
                } else {
                    if (selectedUserString === key && selectedUserString !== "") {
                        computedScore++;
                        card.style.borderColor = "#27ae60";
                        card.style.backgroundColor = "#f2f9f5";
                    } else {
                        card.style.borderColor = "#c0392b";
                        card.style.backgroundColor = "#fdf2f2";
                    }
                }
            });

            // Update UI dashboard score box fields immediately
            document.getElementById('scoreDisplayField').value = computedScore + " / " + totalQuestionsCount;
            alert("🎉 Examination Evaluation Complete!\\n\\nYour score: " + computedScore + " out of " + totalQuestionsCount + " points has been logged inside the Exam Sheet panel info field.");
        }
    </script>
</body>
</html>`;

    const blob = new Blob([fullPageCode], { type: "text/html" });
    const downloadAnchor = document.createElement("a");
    downloadAnchor.href = URL.createObjectURL(blob);
    downloadAnchor.download = "index.html"; 
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    document.body.removeChild(downloadAnchor);

    alert("🎉 SUCCESS!\n\nYour automated online exam has been downloaded as 'index.html'.\n\nUpload it to GitHub Pages, and it will auto-grade student submissions instantly!");
});