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
    $('.hint').text(`Kategoria: ${selectedCategory.category}`);
    
    let selectedWord = selectedCategory.words[Math.floor(Math.random() * selectedCategory.words.length)];
    // let selectedWord = "don kichot";
    // alert(selectedWord);
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
        if (mistakes > 0 && mistakes <= hangmanParts.length) {
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
            const keyboardRow = $('<div></div>'); // Tworzymy nowy div dla każdego rzędu
            row.split(' ').forEach(letter => {
                keyboardRow.append(`<button>${letter.toUpperCase()}</button>`); // Dodajemy przyciski do rzędu
            });
            $('#letters-container').append(keyboardRow); // Dodajemy rząd do kontenera
        });
    }
    
    
    function updateWordDisplay() {
        let displayWord = selectedWord.split(' ').map(word => {
            // Przetwarzanie każdego słowa
            let displayLetters = word.split('').map(letter => {
                return `<span class="letter" style="width: 1ch; text-align: center;">${guessedLetters.includes(letter) ? letter : "_"}</span>`;
            }).join(''); // Nie dołączamy spacji między literami
    
            // Każde słowo zwraca się otoczone przez span
            return `<span class="word" style="display: inline-flex; gap: 1.5vw;">${displayLetters}</span>`;
        }).join(' '); // Odstęp między słowami
    
        $('#word-container').html(displayWord.toUpperCase()); // Używamy .html(), aby dodać tagi
    }
    
    function resetHangman() {
        hangmanParts.forEach(part => {
            $(part).css('display', 'none');
        });
    }

    function checkGameStatus() {
        if (mistakes >= maxMistakes) {
            $('#message').text(`Przegrałeś! Słowo to: ${selectedWord}`);
            $('#letters-container').off('click', 'button');
            $('#restart-game').show();
        } else if (!$('#word-container').text().includes('_')) {
            $('#message').text('Wygrałeś!');
            $('#letters-container').off('click', 'button');
            $('#restart-game').show();
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
        $(this).hide();
        updateWordDisplay();
        createLetterButtons();
        $('.hint').text(`Kategoria: ${selectedCategory.category}`);
        $('#letters-container').on('click', 'button', function() {
            let letter = $(this).text().toLowerCase();
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
    });

    $('#letters-container').on('click', 'button', function() {
        let letter = $(this).text().toLowerCase();
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

    resetHangman();
    updateWordDisplay();
    createLetterButtons();
});
