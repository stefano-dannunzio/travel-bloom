const btnSearch = document.querySelector('.btn-search');
const btnClear = document.querySelector('.btn-clear');
const resultContainer = document.getElementById('result-container');

function searchCondition(e) {
    if (e) e.preventDefault();

    const input = document.getElementById('search-bar').value.toLowerCase();
    resultContainer.innerHTML = '';

    fetch('travel_recommendation_api.json')
        .then(response => response.json())
        .then(data => {
            if (input === 'beach' || input === 'beaches') {
                displayResults(data.beaches);
            } else if (input === 'temple' || input === 'temples') {
                displayResults(data.temples);
            } else {
                const country = data.countries.find(c => c.name.toLowerCase() === input);
                if (country) {
                    displayResults(country.cities);
                } else {
                    resultContainer.innerHTML = '<p class="error-msg">No results found. Try "beaches", "temples", or a country.</p>';
                }
            }
        })
        .catch(error => console.error('Error:', error));
}

function displayResults(results) {
    results.forEach(item => {
        const resultDiv = document.createElement('div');
        resultDiv.classList.add('result-card');

        let tz = 'UTC';
        if (item.name.includes('Australia')) tz = 'Australia/Sydney';
        if (item.name.includes('Japan')) tz = 'Asia/Tokyo';
        if (item.name.includes('Brazil')) tz = 'America/Sao_Paulo';

        const options = { timeZone: tz, hour12: true, hour: 'numeric', minute: 'numeric', second: 'numeric' };
        const localTime = new Date().toLocaleTimeString('en-US', options);

        resultDiv.innerHTML = `
            <img src="${item.imageUrl}" alt="${item.name}">
            <div class="card-content">
                <h3>${item.name}</h3>
                <p class="time-info">Local Time: ${localTime}</p>
                <p>${item.description}</p>
                <button class="btn-visit">Visit</button>
            </div>
        `;
        resultContainer.appendChild(resultDiv);
    });
}

btnClear.addEventListener('click', () => {
    document.getElementById('search-bar').value = '';
    resultContainer.innerHTML = '';
    console.log("Results cleared");
});

btnSearch.addEventListener('click', searchCondition);