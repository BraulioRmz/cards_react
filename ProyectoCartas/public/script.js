const createCardDiv = (attibutes) => {
    const cardDiv = document.createElement('div');

    cardDiv.classList.add('card');
    Object.entries(attibutes).forEach(([key, value]) => {
        cardDiv.setAttribute(key, value);
    });
    return cardDiv;
}

const createCard = (card, flipped) => {
    const number = card.slice(0, -1);
    const symbol = card.slice(-1);
    const cardDiv = createCardDiv({ symbol, number });

    cardDiv.innerHTML = `
    <div class="container">
        ${createCardFront(`
            ${createCardCorner(number, symbol)}
            <div class="symbols">
                ${createCardSymbols(number, symbol)}
            </div>
            ${createCardCorner(number, symbol)}
        `)}           
        ${createCardBack()}
    </div>
    `;

    // FLIPPING update
    cardDiv.addEventListener('click', () => {

        if (cardDiv.classList.contains('flipped')) {
            cardDiv.classList.remove('flipped');
        } else {
            cardDiv.classList.add('flipped');
        }
    });

    if (flipped) {
        cardDiv.classList.add('flipped');
    }

    return cardDiv;
}

const createCardCorner = (number, symbol) => {
    return `<div class="card-corner">
                <div>${number}</div>
                <div>${symbol}</div>
            </div>`
}

const createCardSymbols = (number, symbol) => {
    const isNumber = !isNaN(number);

    if (number === 'A') {
        return (`<div>${symbol}</div>`);
    }

    if (number === 'J' || number === 'Q' || number === 'K') {
        return (`<div class='image'></div>`)
    }

    if (isNumber) {
        return `${new Array(parseInt(number))
            .fill(symbol)
            .map((cardSymbol) => `<div>${cardSymbol}</div>`)
            .join('')
            }`;
    }
    return `<div class="symbols">${symbols}</div>`;
}

const createCardFront = (content) => {
    return `<div class="front">${content}</div>`;
}

const createCardBack = () => {
    return `<div class="back"></div>`;
}

const createDeck = async (selector, path, flipped) => {
    const container = document.querySelector(selector);
    const cards = await (await fetch(path)).json();
    cards.forEach((card, index) => container.append(createCard(card, (index < flipped))));
}

const onClickElementById = (id, callback) => {
    document.getElementById(id).addEventListener('click', callback);
}

window.addEventListener('load', function () {(async () => {
        await createDeck('.deck.table', '/table', 2) //flipped on table
        const cardSize = 2; // payers hand
        await createDeck('.deck.hand', `/deck/${cardSize}`, cardSize)
    })();
});
