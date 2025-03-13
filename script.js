document.addEventListener('DOMContentLoaded', function() {
    let questions = [
        { text: "What does HTML stand for?", image: "html.jpg", options: ["Hyper Text Markup Language", "High Tech Modern Language", "Home Tool Markup Language", "Hyperlink and Text Markup Language"], correct: 0 },
        { text: "Which tag is used to create a hyperlink in HTML?", image: "html.jpg", options: ["<link>", "<a>", "<href>", "<hyperlink>"], correct: 1 },
        { text: "Which HTML tag is used for inserting an image?", image: "html.jpg", options: ["<img>", "<image>", "<pic>", "<src>"], correct: 0 },
        { text: "Which HTML tag is used for creating a table?", image: "html.jpg", options: ["<table>", "<tab>", "<tr>", "<td>"], correct: 0 },
        { text: "Which HTML element is used for the largest heading?", image: "html.jpg", options: ["<h6>", "<h3>", "<h1>", "<heading>"], correct: 2 },
        { text: "Which tag is used to create a numbered list in HTML?", image: "html.jpg", options: ["<ul>", "<ol>", "<list>", "<li>"], correct: 1 },
        { text: "What is the correct HTML tag for inserting a line break?", image: "html.jpg", options: ["<break>", "<br>", "<lb>", "<newline>"], correct: 1 },
        { text: "Which tag is used to define a footer in HTML?", image: "html.jpg", options: ["<foot>", "<bottom>", "<footer>", "<end>"], correct: 2 },
        { text: "Which attribute is used to define inline styles in HTML?", image: "html.jpg", options: ["style", "class", "id", "css"], correct: 0 },
        { text: "Which tag is used for defining a division in HTML?", image: "html.jpg", options: ["<section>", "<div>", "<span>", "<container>"], correct: 1 }
    ];

    questions = questions.sort(() => Math.random() - 0.5);

    let currentQuestionIndex = 0;
    let score = 0;
    let answeredQuestions = 0;
    let timer;
    const totalQuestions = questions.length;
    const questionTime = 30;

    const questionNumberEl = document.getElementById('question-number');
    const questionTimerEl = document.getElementById('question-timer');
    const questionImageEl = document.getElementById('question-image');
    const questionTextEl = document.getElementById('question-text');
    const answersContainerEl = document.getElementById('answers-container');
    const nextQuestionBtn = document.getElementById('next-question-btn');
    const quizContainerEl = document.getElementById('quiz-container');
    const quizResultEl = document.getElementById('quiz-result');
    const finalScoreEl = document.getElementById('final-score');
    const progressBarEl = document.getElementById('progress-bar');
    const questionProgressEl = document.getElementById('question-progress');
    const storeAllQuestionsBtn = document.getElementById('store-all-questions-btn');
    const storeUnansweredQuestionsBtn = document.getElementById('store-unanswered-questions-btn');
    const storeAnsweredQuestionsBtn = document.getElementById('store-answered-questions-btn');
    const tryAgainBox = document.getElementById('try-again-box');
    const storedQuestionsBox = document.getElementById('stored-questions-box');
    const storedQuestionsList = document.getElementById('stored-questions-list');

    function startQuiz() {
        localStorage.clear(); // Clear previous quiz data
        showQuestion(currentQuestionIndex);
        startTimer();
    }

    function showQuestion(index) {
        const question = questions[index];
        questionNumberEl.textContent = `Question ${index + 1}/${totalQuestions}`;
        questionImageEl.src = question.image;
        questionTextEl.textContent = question.text;
        answersContainerEl.innerHTML = '';

        question.options.forEach((option, i) => {
            const label = document.createElement('label');
            label.classList.add('flex', 'items-center', 'bg-white', 'shadow-lg', 'p-4', 'rounded', 'border', 'border-gray-300');
            label.style.border = "2px solid #ccc";
            const input = document.createElement('input');
            input.type = 'radio';
            input.name = 'answer';
            input.value = i;
            input.classList.add('mr-2');
            label.appendChild(input);
            label.appendChild(document.createTextNode(option));
            answersContainerEl.appendChild(label);
        });
    }

    function startTimer() {
        let timeLeft = questionTime;
        questionTimerEl.textContent = `Time: ${timeLeft}s`;
        timer = setInterval(() => {
            timeLeft--;
            questionTimerEl.textContent = `Time: ${timeLeft}s`;
            if (timeLeft <= 0) {
                clearInterval(timer);
                checkAnswer(true); // Time ended
            }
        }, 1000);
    }

    function checkAnswer(timeEnded = false) {
        const selectedOption = document.querySelector('input[name="answer"]:checked');
        const question = questions[currentQuestionIndex];

        if (selectedOption) {
            const answer = parseInt(selectedOption.value);
            localStorage.setItem(`question_${currentQuestionIndex}`, answer);
            if (answer === question.correct) {
                score++;
            }
        } else {
            localStorage.setItem(`question_${currentQuestionIndex}`, null);
        }

        answeredQuestions++;
        const percentage = (answeredQuestions / totalQuestions) * 100;
        progressBarEl.style.width = `${percentage}%`;
        questionProgressEl.textContent = `${percentage}%`;

        currentQuestionIndex++;
        if (currentQuestionIndex < totalQuestions) {
            showQuestion(currentQuestionIndex);
            startTimer();
        } else {
            endQuiz(timeEnded);
        }
    }

    function endQuiz(timeEnded = false) {
        clearInterval(timer);
        quizContainerEl.classList.add('hidden');
        quizResultEl.classList.remove('hidden');
        finalScoreEl.textContent = `Your final score is: ${score}/${totalQuestions}`;

        if (timeEnded) {
            finalScoreEl.textContent += " - Time ended! Try again.";
            tryAgainBox.classList.remove('hidden');
        }

        const unansweredQuestions = [];
        for (let i = 0; i < totalQuestions; i++) {
            if (localStorage.getItem(`question_${i}`) === null) {
                unansweredQuestions.push(i + 1);
            }
        }

        if (unansweredQuestions.length > 0) {
            finalScoreEl.textContent += ` Unanswered questions: ${unansweredQuestions.join(', ')}`;
        }

        storeAllQuestionsBtn.addEventListener('click', storeAllQuestions);
        storeUnansweredQuestionsBtn.addEventListener('click', storeUnansweredQuestions);
        storeAnsweredQuestionsBtn.addEventListener('click', storeAnsweredQuestions);
    }

    function displayStoredQuestions(questions) {
        storedQuestionsList.innerHTML = '';
        questions.forEach((question, index) => {
            const li = document.createElement('li');
            li.textContent = `${index + 1}. ${question.text}`;
            storedQuestionsList.appendChild(li);
        });
        storedQuestionsBox.classList.remove('hidden');
    }

    function storeAllQuestions() {
        localStorage.setItem('all_questions', JSON.stringify(questions));
        displayStoredQuestions(questions);
    }

    function storeUnansweredQuestions() {
        const unansweredQuestions = questions.filter((_, index) => localStorage.getItem(`question_${index}`) === null);
        localStorage.setItem('unanswered_questions', JSON.stringify(unansweredQuestions));
        displayStoredQuestions(unansweredQuestions);
    }

    function storeAnsweredQuestions() {
        const answeredQuestions = questions.filter((_, index) => localStorage.getItem(`question_${index}`) !== null);
        localStorage.setItem('answered_questions', JSON.stringify(answeredQuestions));
        displayStoredQuestions(answeredQuestions);
    }

    nextQuestionBtn.addEventListener('click', function() {
        clearInterval(timer);
        checkAnswer();
    });

    startQuiz();
});
