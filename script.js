/* ==========================================
   SECUREPASS
   Gerador e Validador de Senhas
   ========================================== */


/* ==========================================
   ELEMENTOS DO GERADOR
   ========================================== */

const generatedPassword =
    document.getElementById("generatedPassword");

const generateButton =
    document.getElementById("generateButton");

const copyButton =
    document.getElementById("copyButton");

const lengthSlider =
    document.getElementById("length");

const lengthValue =
    document.getElementById("lengthValue");

const uppercase =
    document.getElementById("uppercase");

const lowercase =
    document.getElementById("lowercase");

const numbers =
    document.getElementById("numbers");

const symbols =
    document.getElementById("symbols");

const generatorError =
    document.getElementById("generatorError");

const generatorStrengthBar =
    document.getElementById("generatorStrengthBar");

const generatorStrengthText =
    document.getElementById("generatorStrengthText");


/* ==========================================
   ELEMENTOS DO VALIDADOR
   ========================================== */

const passwordInput =
    document.getElementById("passwordInput");

const togglePassword =
    document.getElementById("togglePassword");

const clearButton =
    document.getElementById("clearButton");

const validatorStrengthBar =
    document.getElementById("validatorStrengthBar");

const validatorStrengthText =
    document.getElementById("validatorStrengthText");

const requirementCount =
    document.getElementById("requirementCount");


/* ==========================================
   TOAST
   ========================================== */

const toast =
    document.getElementById("toast");


/* ==========================================
   CONJUNTOS DE CARACTERES
   ========================================== */

const characterSets = {

    uppercase:
        "ABCDEFGHIJKLMNOPQRSTUVWXYZ",

    lowercase:
        "abcdefghijklmnopqrstuvwxyz",

    numbers:
        "0123456789",

    symbols:
        "!@#$%^&*()-_=+[]{};:,.?/<>~"

};


/* ==========================================
   SENHAS COMUNS
   ========================================== */

const commonPasswords = new Set([

    "12345678",
    "123456789",
    "1234567890",
    "password",
    "password123",
    "senha",
    "senha123",
    "qwerty",
    "qwerty123",
    "abc123",
    "admin",
    "admin123",
    "letmein",
    "welcome",
    "iloveyou",
    "11111111",
    "00000000",
    "12341234",
    "abcdefgh"

]);


/* ==========================================
   ATUALIZAR TAMANHO
   ========================================== */

lengthSlider.addEventListener("input", () => {

    lengthValue.textContent =
        lengthSlider.value;

});


/* ==========================================
   ESCOLHER ÍNDICE ALEATÓRIO SEGURO
   ========================================== */

function secureRandomIndex(max) {

    const randomArray =
        new Uint32Array(1);

    crypto.getRandomValues(randomArray);

    return randomArray[0] % max;
}


/* ==========================================
   ESCOLHER CARACTERE ALEATÓRIO
   ========================================== */

function randomCharacter(characters) {

    const index =
        secureRandomIndex(characters.length);

    return characters[index];
}


/* ==========================================
   EMBARALHAR ARRAY
   ========================================== */

function secureShuffle(array) {

    for (let i = array.length - 1; i > 0; i--) {

        const j =
            secureRandomIndex(i + 1);

        [array[i], array[j]] =
            [array[j], array[i]];
    }

    return array;
}


/* ==========================================
   GERAR SENHA
   ========================================== */

function generatePassword() {

    generatorError.textContent = "";

    const length =
        Number(lengthSlider.value);

    let selectedSets = [];

    if (uppercase.checked) {
        selectedSets.push(characterSets.uppercase);
    }

    if (lowercase.checked) {
        selectedSets.push(characterSets.lowercase);
    }

    if (numbers.checked) {
        selectedSets.push(characterSets.numbers);
    }

    if (symbols.checked) {
        selectedSets.push(characterSets.symbols);
    }


    /* Nenhuma opção selecionada */

    if (selectedSets.length === 0) {

        generatedPassword.value = "";

        generatorError.textContent =
            "Selecione pelo menos um tipo de caractere.";

        generatorStrengthBar.style.width = "0%";

        generatorStrengthText.textContent = "—";

        return;
    }


    /* Não permite tamanho menor que a quantidade
       de tipos selecionados */

    if (length < selectedSets.length) {

        generatorError.textContent =
            "Aumente o tamanho da senha para incluir todos os tipos.";

        return;
    }


    let passwordCharacters = [];


    /*
       Primeiro colocamos um caractere
       de cada categoria selecionada.
    */

    selectedSets.forEach(set => {

        passwordCharacters.push(
            randomCharacter(set)
        );

    });


    /*
       Criamos um conjunto contendo
       todos os caracteres permitidos.
    */

    const allCharacters =
        selectedSets.join("");


    /*
       Preenchemos o restante da senha.
    */

    while (passwordCharacters.length < length) {

        passwordCharacters.push(
            randomCharacter(allCharacters)
        );

    }


    /*
       Embaralhamos para que os caracteres
       obrigatórios não fiquem sempre no início.
    */

    secureShuffle(passwordCharacters);


    const password =
        passwordCharacters.join("");


    generatedPassword.value =
        password;


    generatedPassword.classList.remove(
        "password-generated"
    );


    void generatedPassword.offsetWidth;


    generatedPassword.classList.add(
        "password-generated"
    );


    updateGeneratorStrength(password);

}


/* ==========================================
   CALCULAR FORÇA
   ========================================== */

function calculateStrength(password) {

    if (!password) {
        return 0;
    }


    let score = 0;


    /* Comprimento */

    if (password.length >= 8)
        score++;

    if (password.length >= 12)
        score++;

    if (password.length >= 16)
        score++;


    /* Maiúscula */

    if (/[A-Z]/.test(password))
        score++;


    /* Minúscula */

    if (/[a-z]/.test(password))
        score++;


    /* Número */

    if (/[0-9]/.test(password))
        score++;


    /* Símbolo */

    if (/[^A-Za-z0-9\s]/.test(password))
        score++;


    /* Variedade */

    const characterTypes = [

        /[A-Z]/.test(password),

        /[a-z]/.test(password),

        /[0-9]/.test(password),

        /[^A-Za-z0-9\s]/.test(password)

    ].filter(Boolean).length;


    if (characterTypes >= 3)
        score++;


    /*
       Penaliza senhas muito comuns.
    */

    if (
        commonPasswords.has(
            password.toLowerCase()
        )
    ) {
        score = Math.min(score, 1);
    }


    /*
       Penaliza sequências repetitivas.
    */

    if (
        /(.)\1{3,}/.test(password)
    ) {
        score = Math.max(0, score - 2);
    }


    return Math.min(score, 8);
}


/* ==========================================
   ATUALIZAR FORÇA DO GERADOR
   ========================================== */

function updateGeneratorStrength(password) {

    const score =
        calculateStrength(password);

    updateStrengthVisual(
        score,
        generatorStrengthBar,
        generatorStrengthText
    );

}


/* ==========================================
   ATUALIZAR VISUAL DA FORÇA
   ========================================== */

function updateStrengthVisual(
    score,
    bar,
    text
) {

    const levels = [

        {
            name: "Muito fraca",
            width: "20%",
            className: "very-weak"
        },

        {
            name: "Fraca",
            width: "35%",
            className: "weak"
        },

        {
            name: "Média",
            width: "55%",
            className: "medium"
        },

        {
            name: "Forte",
            width: "78%",
            className: "strong"
        },

        {
            name: "Muito forte",
            width: "100%",
            className: "very-strong"
        }

    ];


    if (score === 0) {

        bar.style.width = "0%";

        text.textContent =
            "Digite uma senha";

        return;
    }


    let level;


    if (score <= 1) {

        level = levels[0];

    } else if (score <= 3) {

        level = levels[1];

    } else if (score <= 5) {

        level = levels[2];

    } else if (score <= 7) {

        level = levels[3];

    } else {

        level = levels[4];

    }


    bar.style.width =
        level.width;


    text.textContent =
        level.name;


    /*
       Usamos cores via CSS inline
       apenas para indicar visualmente
       o nível.
    */

    const colors = {

        "very-weak": "#ff4f70",
        "weak": "#ff8a4f",
        "medium": "#ffd24f",
        "strong": "#52e39a",
        "very-strong": "#20d9ff"

    };


    bar.style.background =
        colors[level.className];

    text.style.color =
        colors[level.className];
}


/* ==========================================
   BOTÃO GERAR
   ========================================== */

generateButton.addEventListener(
    "click",
    generatePassword
);


/* ==========================================
   COPIAR SENHA
   ========================================== */

copyButton.addEventListener(
    "click",
    async () => {

        const password =
            generatedPassword.value;


        if (!password) {

            return;
        }


        try {

            await navigator.clipboard.writeText(
                password
            );

            showToast();

        } catch (error) {

            /*
               Alternativa para navegadores
               que não permitem Clipboard API.
            */

            generatedPassword.select();

            document.execCommand("copy");

            showToast();

        }

    }
);


/* ==========================================
   MOSTRAR TOAST
   ========================================== */

function showToast() {

    toast.classList.add("show");


    setTimeout(() => {

        toast.classList.remove("show");

    }, 2200);

}


/* ==========================================
   VALIDAÇÃO
   ========================================== */

function validatePassword(password) {

    const requirements = {

        length:
            password.length >= 8,

        uppercase:
            /[A-Z]/.test(password),

        lowercase:
            /[a-z]/.test(password),

        number:
            /[0-9]/.test(password),

        symbol:
            /[^A-Za-z0-9\s]/.test(password),

        noSpace:
            !/\s/.test(password),

        notCommon:
            password.length > 0 &&
            !commonPasswords.has(
                password.toLowerCase()
            ),

        variety:
            getCharacterTypes(password) >= 3

    };


    return requirements;
}


/* ==========================================
   CONTAR TIPOS DE CARACTERES
   ========================================== */

function getCharacterTypes(password) {

    let types = 0;


    if (/[A-Z]/.test(password))
        types++;


    if (/[a-z]/.test(password))
        types++;


    if (/[0-9]/.test(password))
        types++;


    if (/[^A-Za-z0-9\s]/.test(password))
        types++;


    return types;
}


/* ==========================================
   ATUALIZAR REQUISITOS
   ========================================== */

function updateRequirements(password) {

    const requirements =
        validatePassword(password);


    const mapping = {

        length: "req-length",

        uppercase: "req-uppercase",

        lowercase: "req-lowercase",

        number: "req-number",

        symbol: "req-symbol",

        noSpace: "req-space",

        notCommon: "req-common",

        variety: "req-variety"

    };


    let completed = 0;


    Object.entries(mapping).forEach(
        ([key, elementId]) => {

            const element =
                document.getElementById(elementId);

            const status =
                element.querySelector(".status");


            if (requirements[key]) {

                element.classList.add("valid");

                status.textContent = "✓";

                completed++;

            } else {

                element.classList.remove("valid");

                status.textContent = "×";

            }

        }
    );


    requirementCount.textContent =
        `${completed}/8`;

}


/* ==========================================
   DIGITAÇÃO NO VALIDADOR
   ========================================== */

passwordInput.addEventListener(
    "input",
    () => {

        const password =
            passwordInput.value;


        updateRequirements(password);


        const score =
            calculateStrength(password);


        updateStrengthVisual(

            score,

            validatorStrengthBar,

            validatorStrengthText

        );

    }
);


/* ==========================================
   MOSTRAR / OCULTAR SENHA
   ========================================== */

togglePassword.addEventListener(
    "click",
    () => {

        if (
            passwordInput.type ===
            "password"
        ) {

            passwordInput.type =
                "text";

            togglePassword.textContent =
                "🙈";

        } else {

            passwordInput.type =
                "password";

            togglePassword.textContent =
                "👁️";

        }

    }
);


/* ==========================================
   LIMPAR VALIDADOR
   ========================================== */

clearButton.addEventListener(
    "click",
    () => {

        passwordInput.value = "";

        passwordInput.type =
            "password";

        togglePassword.textContent =
            "👁️";


        updateRequirements("");


        validatorStrengthBar.style.width =
            "0%";


        validatorStrengthText.textContent =
            "Digite uma senha";

        validatorStrengthText.style.color =
            "";


        requirementCount.textContent =
            "0/8";

    }
);


/* ==========================================
   GERAR SENHA INICIAL
   ========================================== */

generatePassword();