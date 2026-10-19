"use strict";

/* =========================
   FOOTER YEAR
========================= */

const yearElement = document.getElementById("currentYear");

if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
}


/* =========================
   PHISHING MESSAGE CHECKER
========================= */

const messageInput = document.getElementById("messageInput");
const checkMessageBtn = document.getElementById("checkMessageBtn");
const clearMessageBtn = document.getElementById("clearMessageBtn");
const analysisResult = document.getElementById("analysisResult");


/*
 * These patterns identify common warning signs.
 * They do not prove that a message is malicious.
 */

const phishingPatterns = [
    {
        name: "Urgent or threatening language",
        pattern: /\b(urgent|immediately|act now|account blocked|account suspended|expire today|final warning)\b/i
    },

    {
        name: "Password or OTP requests",
        pattern: /\b(password|passcode|otp|one[- ]time password|banking pin|verify your account)\b/i
    },

    {
        name: "Unexpected rewards or prizes",
        pattern: /\b(you have won|you won|free prize|claim your reward|lottery winner|congratulations winner)\b/i
    },

    {
        name: "Suspicious link language",
        pattern: /\b(click here|click the link|open this link|verify through this link|login immediately)\b/i
    },

    {
        name: "Financial pressure",
        pattern: /\b(transfer money|send payment|refund pending|payment failed|confirm your bank details)\b/i
    }
];


function analyzeMessage() {

    const message = messageInput.value.trim();

    analysisResult.hidden = false;
    analysisResult.className = "analysis-result";

    if (message.length === 0) {

        analysisResult.classList.add("result-danger");

        analysisResult.innerHTML = `
            <h3>⚠️ No Message Entered</h3>
            <p>Please enter a sample message to analyze.</p>
        `;

        return;
    }


    const detectedSigns = phishingPatterns.filter(function (item) {
        return item.pattern.test(message);
    });


    const hasURL = /(?:https?:\/\/|www\.)\S+/i.test(message);

    const hasShortLink = /\b(bit\.ly|tinyurl\.com|t\.co|is\.gd)\b/i.test(message);


    if (hasURL) {
        detectedSigns.push({
            name: "A web link is present",
            pattern: null
        });
    }

    if (hasShortLink) {
        detectedSigns.push({
            name: "A common URL-shortening domain is present",
            pattern: null
        });
    }


    const uniqueSigns = [
        ...new Set(detectedSigns.map(function (item) {
            return item.name;
        }))
    ];


    const isSuspicious = uniqueSigns.length > 0;


    let resultHTML = "";


    if (isSuspicious) {

        analysisResult.classList.add("result-danger");

        resultHTML = `
            <h3>⚠️ Warning Signs Detected</h3>

            <p>
                This message contains ${uniqueSigns.length}
                potential warning sign(s).
            </p>

            <ul>
                ${uniqueSigns.map(function (sign) {
                    return `<li>${sign}</li>`;
                }).join("")}
            </ul>

            <p>
                <strong>Recommended action:</strong>
                Do not click unexpected links or share sensitive information.
                Verify the message using the organization's official website
                or a trusted contact method.
            </p>
        `;

    } else {

        analysisResult.classList.add("result-safe");

        resultHTML = `
            <h3>✅ No Common Warning Signs Detected</h3>

            <p>
                This tool did not find any of the warning patterns it checks.
            </p>

            <p>
                <strong>Important:</strong>
                This does not mean the message is safe. Sophisticated
                phishing messages may not contain obvious warning signs.
                Verify the sender and website independently.
            </p>
        `;

    }


    analysisResult.innerHTML = resultHTML;

}


checkMessageBtn.addEventListener("click", analyzeMessage);


clearMessageBtn.addEventListener("click", function () {

    messageInput.value = "";

    analysisResult.hidden = true;
    analysisResult.innerHTML = "";
    analysisResult.className = "analysis-result";

    messageInput.focus();

});


/* =========================
   PHISHING AWARENESS QUIZ
========================= */

const quizQuestions = [

    {
        question: "What should you do if you receive a suspicious email?",

        options: [
            "Click every link in the email",
            "Verify the sender and avoid suspicious links",
            "Share your password with the sender",
            "Forward it to all your contacts"
        ],

        answer: 1,

        explanation:
            "Always verify unexpected messages through a trusted channel."
    },

    {
        question: "What is phishing?",

        options: [
            "A computer cleaning process",
            "A method of backing up files",
            "A cyberattack that tricks people into revealing information",
            "A type of computer monitor"
        ],

        answer: 2,

        explanation:
            "Phishing uses deception to steal information or trick users into unsafe actions."
    },

    {
        question: "Which information should you never share with an unexpected caller?",

        options: [
            "Public weather information",
            "Your favorite color",
            "A public website address",
            "Your OTP or banking PIN"
        ],

        answer: 3,

        explanation:
            "Never share OTPs, passwords, or banking PINs with unexpected callers or messages."
    },

    {
        question: "What is the safest way to visit your bank's website?",

        options: [
            "Click an unknown SMS link",
            "Use the bank's official app or type its known website address",
            "Open a random advertisement",
            "Use any website with the bank's logo"
        ],

        answer: 1,

        explanation:
            "Use the official app or a known, independently verified website address."
    },

    {
        question: "What should you do if a message says your account will close immediately unless you click a link?",

        options: [
            "Click immediately without checking",
            "Enter your password to avoid losing access",
            "Verify the claim through the official service",
            "Send your OTP to the sender"
        ],

        answer: 2,

        explanation:
            "Urgent threats are a common phishing tactic. Verify the claim independently."
    }

];


const questionCounter = document.getElementById("questionCounter");
const currentScore = document.getElementById("currentScore");
const progressBar = document.getElementById("progressBar");
const questionText = document.getElementById("questionText");
const optionsContainer = document.getElementById("optionsContainer");
const quizFeedback = document.getElementById("quizFeedback");
const nextQuestionBtn = document.getElementById("nextQuestionBtn");
const quizFinalResult = document.getElementById("quizFinalResult");


let currentQuestionIndex = 0;
let score = 0;
let answerSelected = false;


function loadQuestion() {

    answerSelected = false;

    const currentQuestion = quizQuestions[currentQuestionIndex];

    questionCounter.textContent =
        `Question ${currentQuestionIndex + 1} of ${quizQuestions.length}`;

    currentScore.textContent = `Score: ${score}`;

    questionText.textContent = currentQuestion.question;

    progressBar.style.width =
        `${((currentQuestionIndex + 1) / quizQuestions.length) * 100}%`;

    optionsContainer.innerHTML = "";

    quizFeedback.textContent = "";

    nextQuestionBtn.disabled = true;

    nextQuestionBtn.textContent =
        currentQuestionIndex === quizQuestions.length - 1
            ? "View Results →"
            : "Next Question →";


    currentQuestion.options.forEach(function (option, index) {

        const button = document.createElement("button");

        button.type = "button";
        button.className = "option-btn";
        button.textContent = option;

        button.addEventListener("click", function () {
            selectAnswer(index);
        });

        optionsContainer.appendChild(button);

    });

}


function selectAnswer(selectedIndex) {

    if (answerSelected) {
        return;
    }

    answerSelected = true;

    const currentQuestion = quizQuestions[currentQuestionIndex];

    const optionButtons =
        optionsContainer.querySelectorAll(".option-btn");


    optionButtons.forEach(function (button) {
        button.disabled = true;
    });


    if (selectedIndex === currentQuestion.answer) {

        score++;

        optionButtons[selectedIndex].classList.add("correct");

        quizFeedback.textContent =
            `✅ Correct! ${currentQuestion.explanation}`;

    } else {

        optionButtons[selectedIndex].classList.add("incorrect");

        optionButtons[currentQuestion.answer].classList.add("correct");

        quizFeedback.textContent =
            `❌ Incorrect. ${currentQuestion.explanation}`;

    }


    currentScore.textContent = `Score: ${score}`;

    nextQuestionBtn.disabled = false;

}


function showFinalResult() {

    questionCounter.textContent = "Quiz Completed";

    currentScore.textContent =
        `Final Score: ${score}/${quizQuestions.length}`;

    questionText.textContent = "Your Phishing Awareness Results";

    optionsContainer.innerHTML = "";

    quizFeedback.textContent = "";

    nextQuestionBtn.hidden = true;

    quizFinalResult.hidden = false;


    const percentage = Math.round(
        (score / quizQuestions.length) * 100
    );


    let message = "";


    if (percentage === 100) {

        message =
            "Excellent! You answered every question correctly.";

    } else if (percentage >= 60) {

        message =
            "Good work! Review the safety tips to strengthen your knowledge.";

    } else {

        message =
            "Keep learning! Review the phishing awareness sections and try again.";

    }


    quizFinalResult.innerHTML = `
        <h3>${percentage}% — ${score}/${quizQuestions.length}</h3>

        <p>${message}</p>

        <button
            type="button"
            class="btn primary-btn"
            id="restartQuizBtn"
        >
            Try Again ↻
        </button>
    `;


    document.getElementById("restartQuizBtn").addEventListener(
        "click",
        restartQuiz
    );

}


function restartQuiz() {

    currentQuestionIndex = 0;

    score = 0;

    answerSelected = false;

    quizFinalResult.hidden = true;

    nextQuestionBtn.hidden = false;

    loadQuestion();

}


nextQuestionBtn.addEventListener("click", function () {

    if (!answerSelected) {
        return;
    }

    if (currentQuestionIndex < quizQuestions.length - 1) {

        currentQuestionIndex++;

        loadQuestion();

    } else {

        showFinalResult();

    }

});


/* =========================
   INITIALIZE QUIZ
========================= */

loadQuestion();