$(document).ready(function() {
    const categories = [
        {
            category: "Superbohaterowie",
            words: ["superman", "batman", "ironman", "spiderman", "wolverine"]
        },
        {
            category: "Planety",
            words: ["merkury", "wenus", "ziemia", "mars", "jowisz"]
        },
        {
            category: "Instrumenty",
            words: ["fortepian", "skrzypce", "saksofon", "klawesyn", "akordeon"]
        },
        {
            category: "Mitologia",
            words: ["posejdon", "herkules", "atena", "afrodyta", "dionizos"]
        },
        {
            category: "Literatura",
            words: ["hamlet", "makbet", "odyseja", "don kichot", "frankenstein"]
        }
    ];
    
    let selectedCategory = categories[Math.floor(Math.random() * categories.length)];
    $('.hint').html(`Kategoria: <span class="roboto-bold">${selectedCategory.category}</span>`);
    
    let selectedWord = selectedCategory.words[Math.floor(Math.random() * selectedCategory.words.length)];
    let guessedLetters = [];
    let mistakes = 0;
    const maxMistakes = 6;
    const hangmanParts = [
        '#head', 
        '#body', 
        '#left-arm', 
        '#right-arm', 
        '#left-leg', 
        '#right-leg'
    ];    
    
    function updateHangman() {
        if (mistakes <= hangmanParts.length) {
            $(hangmanParts[mistakes - 1]).css('display', 'block');
        }
    }

    function createLetterButtons() {
        const keyboardLayout = [
            "q w e r t y u i o p",
            "a s d f g h j k l",
            "z x c v b n m"
        ];
    
        keyboardLayout.forEach(row => {
            const keyboardRow = $('<div class="keyboard-row"></div>');
            row.split(' ').forEach(letter => {
                keyboardRow.append(`<button>${letter.toUpperCase()}</button>`); // append(element) dodaje element wewnątrz kontenera na końcu
            });
            $('#letters-container').append(keyboardRow);
            $('.keyboard-row').css({"display":"inline-flex", "gap":"1.5vw", "justify-content":"center"});
        });
    }
    
    
    function updateWordDisplay() {
        let displayWord = selectedWord.split(' ').map(word => { 
            let displayLetters = word.split('').map(letter => {
                return `<span class="letter" style="width: 1ch; text-align: center;">${guessedLetters.includes(letter) ? letter : "_"}</span>`;
            }).join(''); 
    
            return `<span class="word" style="display: inline-flex; gap: 1.2vw;">${displayLetters}</span>`;
        }).join(' '); 
    
        $('#word-container').html(displayWord.toUpperCase()); //  .html() dodaje tagi
    }
    
    function resetHangman() {
        hangmanParts.forEach(part => {
            $(part).css('display', 'none');
        });
    }

    function checkGameStatus() {
        if (mistakes >= maxMistakes) {
            $('#message').html(`Przegrałeś! Słowo to: <span class="roboto-bold">${selectedWord.toUpperCase()}</span>`);
            $('#letters-container').off('click', 'button');
            $('#restart-game').css('display','inline-flex');
        } else if (!$('#word-container').text().includes('_')) {
            $('#message').text('Wygrałeś!');
            $('#letters-container').off('click', 'button');
            $('#restart-game').css('display','inline-flex');
        }
    }
    
    $('#restart-game').on('click', function() {
        selectedCategory = categories[Math.floor(Math.random() * categories.length)];
        selectedWord = selectedCategory.words[Math.floor(Math.random() * selectedCategory.words.length)];
        guessedLetters = [];
        mistakes = 0;
        $('#message').empty();
        $('#letters-container').empty();
        resetHangman();
        $(this).css('display','none');
        updateWordDisplay();
        createLetterButtons();
        $('.hint').html(`Kategoria: <span class="roboto-bold">${selectedCategory.category}</span>`);
        $('#letters-container').on('click', 'button', function() {
            let letter = $(this).text().toLowerCase();
            $(this).prop('disabled', true);
        
            if (selectedWord.includes(letter)) {
                // Ustawienie stylów dla prawidłowej litery
                $(this).css({
                    "transform": "translateY(2px)",
                    'background-color': '#b2d8b2',
                    'border-color': '#6b8f6b',
                    'color': '#2f4f2f', 
                    'box-shadow': '0 2px #6b8f6b, 0 4px 0 2px #4d6b4d',
                    'cursor': 'default'
                });
                guessedLetters.push(letter);
                updateWordDisplay();
            } else {
                // Ustawienie stylów dla błędnej litery
                $(this).css({
                    "transform": "translateY(2px)",
                    'background-color': '#e0b2b2', 
                    'border-color': '#8f6b6b', 
                    'color': '#4f2f2f',
                    'box-shadow': '0 2px #8f6b6b, 0 4px 0 2px #6b4d4d',
                    'cursor': 'default'
                });
                mistakes++;
                updateHangman();
            }
        
            checkGameStatus();
        });
    });

    $('#letters-container').on('click', 'button', function() {
        let letter = $(this).text().toLowerCase();
        $(this).prop('disabled', true);
    
        if (selectedWord.includes(letter)) {
            // Ustawienie stylów dla prawidłowej litery
            $(this).css({
                "transform": "translateY(2px)",
                'background-color': '#b2d8b2', 
                'border-color': '#6b8f6b', 
                'color': '#2f4f2f', 
                'box-shadow': '0 2px #6b8f6b, 0 4px 0 2px #4d6b4d', 
                'cursor': 'default' 
            });
            guessedLetters.push(letter);
            updateWordDisplay();
        } else {
            // Ustawienie stylów dla błędnej litery
            $(this).css({
                "transform": "translateY(2px)",
                'background-color': '#e0b2b2', 
                'border-color': '#8f6b6b', 
                'color': '#4f2f2f', 
                'box-shadow': '0 2px #8f6b6b, 0 4px 0 2px #6b4d4d', 
                'cursor': 'default' 
            });
            mistakes++;
            updateHangman();
        }
    
        checkGameStatus();
    });

    let canPressKey = true; // Flaga kontrolująca opóźnienie

    $(document).on('keydown', function(event) {
        if (!canPressKey) return; 
        canPressKey = false; 

        setTimeout(() => {canPressKey = true;}, 500); // setTimeout(code, delay)

        const key = event.key.toLowerCase();

        if (key >= 'a' && key <= 'z') {
            activateLetterButton(key);
        } else if (event.code === 'Space') {
            event.preventDefault(); // Aby nie zachodziła domyślna funkcja spacji
            activateRestartButton();
        }
    });

    function activateLetterButton(letter) {
        let button = $(`#letters-container button:contains(${letter.toUpperCase()})`);
        if (button.length && !button.prop('disabled')) {
            button.click(); 
        }
    }

    function activateRestartButton() {
        if ($('#restart-game').css('display') !== 'none') {
            $('#restart-game').click();
        }
    }

    resetHangman();
    updateWordDisplay();
    createLetterButtons();
});
