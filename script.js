$(document).ready(function() {
    const words = ["javascript", "jquery", "html", "css", "svg"];
    let selectedWord = words[Math.floor(Math.random() * words.length)];
    let guessedLetters = [];
    let mistakes = 0;
    const maxMistakes = 6;

    function updateWordDisplay() {
        let displayWord = selectedWord.split('').map(letter => guessedLetters.includes(letter) ? letter : "_").join(' ');
        $('#word-container').text(displayWord);
    }

    function updateHangman() {
        // Update SVG based on mistakes
        $('#hangman-svg').html(`
            ${mistakes > 0 ? '<circle cx="100" cy="50" r="20" />' : ''}
            ${mistakes > 1 ? '<line x1="100" y1="70" x2="100" y2="130" />' : ''}
            ${mistakes > 2 ? '<line x1="100" y1="90" x2="70" y2="110" />' : ''}
            ${mistakes > 3 ? '<line x1="100" y1="90" x2="130" y2="110" />' : ''}
            ${mistakes > 4 ? '<line x1="100" y1="130" x2="70" y2="160" />' : ''}
            ${mistakes > 5 ? '<line x1="100" y1="130" x2="130" y2="160" />' : ''}
        `);
    }

    function checkGameStatus() {
        if (mistakes >= maxMistakes) {
            $('#message').text(`Przegrałeś! Słowo to: ${selectedWord}`);
            $('#letters-container').off('click', 'button');
        } else if (!$('#word-container').text().includes('_')) {
            $('#message').text('Wygrałeś!');
            $('#letters-container').off('click', 'button');
        }
    }

    function createLetterButtons() {
        const alphabet = "abcdefghijklmnopqrstuvwxyz".split('');
        alphabet.forEach(letter => {
            $('#letters-container').append(`<button>${letter}</button>`);
        });
    }

    $('#letters-container').on('click', 'button', function() {
        let letter = $(this).text();
        $(this).prop('disabled', true);
        if (selectedWord.includes(letter)) {
            guessedLetters.push(letter);
            updateWordDisplay();
        } else {
            mistakes++;
            updateHangman();
        }
        checkGameStatus();
    });

    updateWordDisplay();
    createLetterButtons();
});
