function fetchAPI() {
    fetch("travel_recommendation_api.json")
        .then(response => response.json())
        .then(data => {
            console.log("Travel Related Details are: ");

            // Directly access and log properties
            console.log("Countries: ");
            data.countries.forEach(country => {
                console.log(`${country.name}`);
                country.cities.forEach(city => {
                    console.log(`${city.name}: ${city.description}`);
                });
            });

            console.log("Temples: ");
            data.temples.forEach(temple => {
                console.log(`${temple.name}: ${temple.description}`);
            });

            console.log("Beaches: ");
            data.beaches.forEach(beach => {
                console.log(`${beach.name}: ${beach.description}`);
            });
        })
        .catch(error => {
            console.error("Error fetching JSON data: ", error);
        });
}

fetchAPI();

function searchPlace() {
    const input = document.getElementById('browse_place').value.toLowerCase().trim();
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = '';

    const normalizedInput = normalizeInput(input);

    fetch('travel_recommendation_api.json')
        .then(response => response.json())
        .then(data => {
            let found = false;

            // Check for "beach" keyword
            if (normalizedInput === 'beach' || normalizedInput === 'beaches') {
                displayMultipleResults(data.beaches, resultDiv);
                found = true;
            }

            // Check for "temple" keyword
            else if (normalizedInput === 'temple' || normalizedInput === 'temples') {
                displayMultipleResults(data.temples, resultDiv);
                found = true;
            }

            // Check for "country" keyword
            else if (normalizedInput === 'country' || normalizedInput === 'countries') {
                data.countries.forEach(country => {
                    country.cities.slice(0, 2).forEach(city => { // Display only two cities per country
                        resultDiv.innerHTML += `<h2>${city.name}</h2>`;
                        resultDiv.innerHTML += `<img src="${city.imageUrl}" alt="${city.name}">`;
                        resultDiv.innerHTML += `<p>${city.description}</p>`;
                    });
                });
                found = true;
            }

            // General search in cities, temples, and beaches
            else {
                // Search in countries
                data.countries.forEach(country => {
                    country.cities.forEach(city => {
                        if (matchesInput(city.name, normalizedInput)) {
                            resultDiv.innerHTML += `<h2>${city.name}</h2>`;
                            resultDiv.innerHTML += `<img src="${city.imageUrl}" alt="${city.name}">`;
                            resultDiv.innerHTML += `<p>${city.description}</p>`;
                            found = true;
                        }
                    });
                });

                // Search in temples
                data.temples.forEach(temple => {
                    if (matchesInput(temple.name, normalizedInput)) {
                        resultDiv.innerHTML += `<h2>${temple.name}</h2>`;
                        resultDiv.innerHTML += `<img src="${temple.imageUrl}" alt="${temple.name}">`;
                        resultDiv.innerHTML += `<p>${temple.description}</p>`;
                        found = true;
                    }
                });

                // Search in beaches
                data.beaches.forEach(beach => {
                    if (matchesInput(beach.name, normalizedInput)) {
                        resultDiv.innerHTML += `<h2>${beach.name}</h2>`;
                        resultDiv.innerHTML += `<img src="${beach.imageUrl}" alt="${beach.name}">`;
                        resultDiv.innerHTML += `<p>${beach.description}</p>`;
                        found = true;
                    }
                });
            }

            if (!found) {
                resultDiv.innerHTML = 'Place not found.';
            }
        })
        .catch(error => {
            console.error("Error", error);
            resultDiv.innerHTML = "An error occurred while fetching data.";
        });
}

function normalizeInput(input){
    if(input.endsWith('es')){
        return input.slice(0, -2);
    } else if(input.endsWith('s')){
        return input.slice(0, -1);
    }
    return input;
}

function matchesInput(name, normalizedInput){
    return name.toLowerCase().includes(normalizedInput) || name.toLowerCase().includes(normalizedInput+'s');
}

function displayMultipleResults(places, resultDiv) {
    places.slice(0, 2).forEach(place => { // Displaying only two results
        resultDiv.innerHTML += `<h2>${place.name}</h2>`;
        resultDiv.innerHTML += `<img src="${place.imageUrl}" alt="${place.name}">`;
        resultDiv.innerHTML += `<p>${place.description}</p>`;
    });
}

// Add event listener to the search button
document.getElementById('search_place').addEventListener('click', searchPlace);


function clear_items(){
	document.getElementById('result').innerHTML = "";
}

document.getElementById('clicked').addEventListener('click', clear_items);