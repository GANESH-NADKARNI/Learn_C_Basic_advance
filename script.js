// Global Variables
let currentQuestion = 0;
let score = 0;
let selectedOption = -1;
let quizCompleted = false;

// Quiz Questions Data
const quizQuestions = [
    {
        question: "What is the correct way to declare an integer variable in C?",
        options: ["int x;", "integer x;", "var x;", "num x;"],
        correct: 0,
        explanation: "In C, 'int' is the keyword used to declare integer variables."
    },
    {
        question: "Which header file is required for input/output operations in C?",
        options: ["<iostream>", "<stdio.h>", "<conio.h>", "<stdlib.h>"],
        correct: 1,
        explanation: "<stdio.h> contains declarations for standard input/output functions like printf() and scanf()."
    },
    {
        question: "What does the 'return 0;' statement indicate in the main function?",
        options: ["Error occurred", "Program executed successfully", "Function failed", "Memory allocation failed"],
        correct: 1,
        explanation: "return 0; indicates that the program executed successfully without errors."
    },
    {
        question: "Which loop is guaranteed to execute at least once?",
        options: ["for loop", "while loop", "do-while loop", "nested loop"],
        correct: 2,
        explanation: "do-while loop checks the condition after executing the loop body, so it runs at least once."
    },
    {
        question: "What is the size of 'char' data type in C?",
        options: ["2 bytes", "4 bytes", "1 byte", "8 bytes"],
        correct: 2,
        explanation: "The 'char' data type in C is 1 byte (8 bits) in size."
    }
];

// Code Examples with Expected Outputs
const codeOutputs = {
    hello: "Hello, World!",
    variables: "Age: 25\nHeight: 5.8\nGrade: A",
    conditions: "Grade: B",
    loops: "For loop:\nIteration 1\nIteration 2\nIteration 3\nIteration 4\nIteration 5\n\nWhile loop:\nCount: 1\nCount: 2\nCount: 3",
    functions: "Sum: 8\nHello, Alice!"
};

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Initialize Application
function initializeApp() {
    setupEventListeners();
    updateProgressBar();
    initializeQuiz();
    setupSmoothScrolling();
    setupIntersectionObserver();
}

// Setup Event Listeners
function setupEventListeners() {
    // Theme toggle
    const themeToggle = document.getElementById('themeToggle');
    themeToggle.addEventListener('click', toggleTheme);
    
    // Scroll event for progress bar
    window.addEventListener('scroll', updateProgressBar);
    
    // Navigation smooth scrolling
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

// Theme Toggle Functionality
function toggleTheme() {
    const body = document.body;
    const themeIcon = document.querySelector('#themeToggle i');
    
    body.classList.toggle('light-theme');
    
    if (body.classList.contains('light-theme')) {
        themeIcon.className = 'fas fa-sun';
        localStorage.setItem('theme', 'light');
    } else {
        themeIcon.className = 'fas fa-moon';
        localStorage.setItem('theme', 'dark');
    }
}

// Load saved theme
function loadTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.body.classList.add('light-theme');
        document.querySelector('#themeToggle i').className = 'fas fa-sun';
    }
}

// Progress Bar Update
function updateProgressBar() {
    const scrollTop = window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    
    document.getElementById('progressBar').style.width = scrollPercent + '%';
}

// Toggle Topic Content
function toggleTopic(topicId) {
    const content = document.getElementById(topicId);
    const header = content.previousElementSibling;
    
    content.classList.toggle('active');
    header.classList.toggle('active');
    
    // Add animation effect
    if (content.classList.contains('active')) {
        content.style.animation = 'fadeInUp 0.5s ease-out';
    }
}

// Run Code Examples
function runCode(codeId) {
    const outputElement = document.getElementById(codeId + '-output');
    const runButton = document.querySelector(`[onclick="runCode('${codeId}')"]`);
    
    // Show loading animation
    runButton.innerHTML = '<div class="loading"></div> Running...';
    runButton.disabled = true;
    
    // Simulate code execution delay
    setTimeout(() => {
        outputElement.innerHTML = codeOutputs[codeId] || 'Output not available';
        outputElement.classList.add('active');
        
        // Reset button
        runButton.innerHTML = '<i class="fas fa-play"></i> Run';
        runButton.disabled = false;
        
        // Add typing effect to output
        typeWriter(outputElement, codeOutputs[codeId] || 'Output not available');
    }, 1500);
}

// Typing Effect for Code Output
function typeWriter(element, text) {
    element.innerHTML = '';
    let i = 0;
    const speed = 50;
    
    function type() {
        if (i < text.length) {
            if (text.charAt(i) === '\n') {
                element.innerHTML += '<br>';
            } else {
                element.innerHTML += text.charAt(i);
            }
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Quiz Functionality
function initializeQuiz() {
    displayQuestion();
}

function displayQuestion() {
    if (currentQuestion >= quizQuestions.length) {
        showQuizResults();
        return;
    }
    
    const question = quizQuestions[currentQuestion];
    document.getElementById('questionNumber').textContent = currentQuestion + 1;
    document.getElementById('totalQuestions').textContent = quizQuestions.length;
    document.getElementById('questionText').textContent = question.question;
    
    const optionsContainer = document.getElementById('quizOptions');
    optionsContainer.innerHTML = '';
    
    question.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.className = 'option-btn';
        button.textContent = option;
        button.onclick = () => selectOption(index);
        optionsContainer.appendChild(button);
    });
    
    document.getElementById('nextBtn').disabled = true;
    selectedOption = -1;
}

function selectOption(optionIndex) {
    selectedOption = optionIndex;
    
    // Remove previous selections
    document.querySelectorAll('.option-btn').forEach(btn => {
        btn.classList.remove('selected', 'correct', 'incorrect');
    });
    
    // Highlight selected option
    const selectedBtn = document.querySelectorAll('.option-btn')[optionIndex];
    selectedBtn.classList.add('selected');
    
    // Enable next button
    document.getElementById('nextBtn').disabled = false;
    
    // Show correct answer after selection
    setTimeout(() => {
        showCorrectAnswer();
    }, 500);
}

function showCorrectAnswer() {
    const question = quizQuestions[currentQuestion];
    const options = document.querySelectorAll('.option-btn');
    
    options.forEach((btn, index) => {
        if (index === question.correct) {
            btn.classList.add('correct');
        } else if (index === selectedOption && index !== question.correct) {
            btn.classList.add('incorrect');
        }
        btn.disabled = true;
    });
    
    // Update score
    if (selectedOption === question.correct) {
        score++;
        showFeedback('Correct!', 'success');
    } else {
        showFeedback(`Incorrect. ${question.explanation}`, 'error');
    }
}

function showFeedback(message, type) {
    const feedback = document.createElement('div');
    feedback.className = `feedback ${type}`;
    feedback.textContent = message;
    feedback.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 1rem 2rem;
        border-radius: 10px;
        color: white;
        font-weight: bold;
        z-index: 1001;
        animation: slideInRight 0.5s ease-out;
        background: ${type === 'success' ? 'var(--success-color)' : 'var(--error-color)'};
    `;
    
    document.body.appendChild(feedback);
    
    setTimeout(() => {
        feedback.remove();
    }, 3000);
}

function nextQuestion() {
    currentQuestion++;
    
    if (currentQuestion >= quizQuestions.length) {
        showQuizResults();
    } else {
        displayQuestion();
    }
}

function showQuizResults() {
    document.getElementById('quizCard').style.display = 'none';
    const scoreElement = document.getElementById('quizScore');
    const finalScoreElement = document.getElementById('finalScore');
    const scoreMessageElement = document.getElementById('scoreMessage');
    
    scoreElement.style.display = 'block';
    finalScoreElement.textContent = score;
    
    // Score message and styling
    const percentage = (score / quizQuestions.length) * 100;
    let message, className;
    
    if (percentage >= 80) {
        message = "Excellent! You have a strong understanding of C programming basics!";
        className = "excellent";
    } else if (percentage >= 60) {
        message = "Good job! You're on the right track. Review the topics you missed.";
        className = "good";
    } else {
        message = "Keep practicing! Review the fundamentals and try again.";
        className = "needs-improvement";
    }
    
    scoreMessageElement.textContent = message;
    scoreMessageElement.className = `score-message ${className}`;
    
    document.getElementById('restartBtn').style.display = 'inline-block';
    quizCompleted = true;
    
    // Animate score display
    animateScore(finalScoreElement, score);
}

function animateScore(element, targetScore) {
    let current = 0;
    const increment = targetScore / 20;
    const timer = setInterval(() => {
        current += increment;
        if (current >= targetScore) {
            current = targetScore;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current);
    }, 50);
}

function restartQuiz() {
    currentQuestion = 0;
    score = 0;
    selectedOption = -1;
    quizCompleted = false;
    
    document.getElementById('quizCard').style.display = 'block';
    document.getElementById('quizScore').style.display = 'none';
    document.getElementById('restartBtn').style.display = 'none';
    
    displayQuestion();
}

// Smooth Scrolling Setup
function setupSmoothScrolling() {
    // Add smooth scrolling behavior to all internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Intersection Observer for Animations
function setupIntersectionObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                
                // Add stagger animation for cards
                if (entry.target.classList.contains('topic-card')) {
                    const cards = document.querySelectorAll('.topic-card');
                    cards.forEach((card, index) => {
                        setTimeout(() => {
                            card.style.animation = `fadeInUp 0.6s ease-out ${index * 0.1}s both`;
                        }, index * 100);
                    });
                }
            }
        });
    }, observerOptions);
    
    // Observe all sections and cards
    document.querySelectorAll('.content-section, .topic-card, .data-type-card').forEach(el => {
        observer.observe(el);
    });
}

// Utility Functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Navigation Active State
function updateActiveNavLink() {
    const sections = document.querySelectorAll('.content-section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

// Add scroll event for active nav links
window.addEventListener('scroll', debounce(updateActiveNavLink, 100));

// Keyboard Navigation
document.addEventListener('keydown', function(e) {
    // Quiz navigation with arrow keys
    if (document.getElementById('quiz').offsetParent !== null) {
        if (e.key === 'ArrowRight' && !document.getElementById('nextBtn').disabled) {
            nextQuestion();
        }
        
        // Number keys for option selection
        const num = parseInt(e.key);
        if (num >= 1 && num <= 4) {
            selectOption(num - 1);
        }
    }
    
    // Escape key to close any modals or reset states
    if (e.key === 'Escape') {
        // Reset any active states
        document.querySelectorAll('.topic-content.active').forEach(content => {
            content.classList.remove('active');
            content.previousElementSibling.classList.remove('active');
        });
    }
});

// Copy Code Functionality
function addCopyButtons() {
    document.querySelectorAll('.code-example pre').forEach((codeBlock, index) => {
        const copyButton = document.createElement('button');
        copyButton.className = 'copy-button';
        copyButton.innerHTML = '<i class="fas fa-copy"></i>';
        copyButton.title = 'Copy code';
        
        copyButton.addEventListener('click', () => {
            const code = codeBlock.textContent;
            navigator.clipboard.writeText(code).then(() => {
                copyButton.innerHTML = '<i class="fas fa-check"></i>';
                copyButton.style.background = 'var(--success-color)';
                
                setTimeout(() => {
                    copyButton.innerHTML = '<i class="fas fa-copy"></i>';
                    copyButton.style.background = '';
                }, 2000);
            });
        });
        
        const codeHeader = codeBlock.closest('.code-example').querySelector('.code-header');
        if (codeHeader) {
            codeHeader.appendChild(copyButton);
        }
    });
}

// Initialize copy buttons after DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(addCopyButtons, 500);
});

// Performance Optimization
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Error Handling
window.addEventListener('error', function(e) {
    console.error('An error occurred:', e.error);
    // Show user-friendly error message
    showFeedback('Something went wrong. Please refresh the page.', 'error');
});

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    loadTheme();
    lazyLoadImages();
    
    // Add some entrance animations
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100);
});

// Export functions for potential external use
window.CProgTutorial = {
    toggleTopic,
    runCode,
    selectOption,
    nextQuestion,
    restartQuiz,
    toggleTheme
};