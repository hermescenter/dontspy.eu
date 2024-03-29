async function loadPoliticalFigures() {
    const response = await fetch(serverURL('figures'));
    const figures = await response.json();
    const figuresContainer = document.getElementById('figures--list');

    /* we need to rebuild a new list. The final number of elements 
     * need to be one for each EUMS variable (which contains country and flags).
     * Then, for each country, we need to count how many figures are 
     * available from the 'figures' array; if there are none we need 
     * to display it differently. if there are 5, means there are all we 
     * need, and we need to display it differetly. if there are 1 < x < 5
     * we need to list who is missing */
    const countries = Object.keys(EUMS);

    console.log(figures);
    const dsplvls = _.reduce(countries, (memo, c) => {
        const matching = _.filter(figures, { Country: c });
        console.log(matching);
        const o = {
            country: c,
            flag: EUMS[c],
            registered: matching.length,
        }
        if (matching.length < 5) {
            const missing = _.difference(displayOrder, _.map(matching, 'OfficialRole'));
            o.missing = missing;
        }
        memo.push(o);
        return memo;
    }, []);

    dsplvls.forEach(item => {
        console.log(item);
        const div = document.createElement('div');
        div.className = 'grid-item';

        if (item.missing) {
            div.innerHTML = `
                <span>${item.flag}</span>
                <span class="country-name">${item.country}</span>
                <span>${item.registered} of 5.</span> <b>Missing:</b>
                <br>
                <span class="missing">${item.missing.join(', ')
                    .replace(/Interior Minister/, "Internal Affairs Minister")
                    .replace(/Defense Minister/, "Minister of Defense")
                    .replace(/Justice Minister/, "Minister of Justice")
                }</span>
            `;
        } else {
            div.innerHTML = `
                <span>${item.flag}</span>
                <span class="country-name">${item.country}</span>
                <span class="highlight">5 out of 5!</span>
            `;
        }

        div.addEventListener('click', function () {
            window.location.href = `/country#${item.country}`;
        });

        figuresContainer.appendChild(div);
    });
}

function renderNocodb() {
    const iframe = document.createElement('iframe');
    iframe.src = "https://db.dontspy.eu/dashboard/#/nc/form/bf2949c3-56f3-4574-8d44-13b90551a995?embed";
    iframe.width = '100%';
    iframe.height = '1000';
    iframe.frameborder = "0";
    iframe.classList.add("nc-embed");
    iframe.style.background = "transparent";
    const destinationElement = document.getElementById('upload-form-container');
    destinationElement.appendChild(iframe);
    document.getElementById('upload-form-container').scrollIntoView({
        behavior: 'smooth', // Opzionale: rende lo scorrimento animato
        block: 'start' // Imposta il punto di ancoraggio in alto
    });
    const button = document.getElementById('clickable');
    button.remove();
    document.getElementById('upload-form-container').style.display = 'block';
}
