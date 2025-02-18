const cardsContainer = document.getElementById('cards-container');
let favorites;

const fetchPokemon = async (id) => {
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
        const pokemonJson = await response.json();
        return pokemonJson;
    } catch (error) {
        console.error("You caught a wild error!", error);
    }
};

// // Remove from favorites 
const removeFromFavorites = (pokemon) => {
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    const index = favorites.findIndex(fav => fav.id === pokemon.id);

    if (index !== -1) {
        // Remove from favorites
        favorites.splice(index, 1);
        console.log(`${pokemon.name} removed from favorites`);
    }

    // Save the updated favorites array to localStorage
    localStorage.setItem("favorites", JSON.stringify(favorites));

    // Reload favorites to reflect the change
    loadFavorites();
};
const loadFavorites = async () => {
    // Ensure the container exists
    if (!cardsContainer) return;

    // Clear the current display
    cardsContainer.innerHTML = '';

    // Get the updated favorites array from localStorage
     favorites = JSON.parse(localStorage.getItem("favorites")) || [];

    // Fetch all Pokémon data concurrently
    const pokemonDataArray = await Promise.all(favorites.map(fav => fetchPokemon(fav.id)));

    pokemonDataArray.forEach((pokemonData) => {
        if (!pokemonData) return;

        // Create the Pokémon card
        const pokeCard = document.createElement('div');
        pokeCard.classList.add(
            "flex-col",
            "justify-items-center",
            "bg-[#f6eac4]",
            "text-center",
            "shadow-lg",
            "bg-[url('../images/cards-background.png')]",
            "bg-cover",
            "min-h-[200px]",
            "rounded-sm"
        );

        const pokeImg = document.createElement('img');
        pokeImg.src = pokemonData.sprites.front_default;
        pokeImg.alt = pokemonData.name;
        pokeImg.classList.add("mb-4");

        const pokeName = document.createElement('h3');
        pokeName.textContent = pokemonData.name.toUpperCase();
        pokeName.classList.add(
            "font-bold",
            "text-[#bc7a25]",
            "tracking-wider",
            "-skew-x-10"
        );

        const pokeInfo = document.createElement('span');
        pokeInfo.classList.add("flex-col", "gap-2", "text-sm");

        const pokemonId = document.createElement('h5');
        pokemonId.textContent = `ID: #${pokemonData.id}`;
        pokemonId.classList.add("font-bold", "text-[#bc7a25]");

        const pokeType = document.createElement('p');
        pokeType.textContent = `Type: ${pokemonData.types.map(typeInfo => typeInfo.type.name).join(", ")}`;
        pokeType.classList.add("text-[#bc7a25]");

        // Favorite icon (remove from favorites on click)
        const favoriteText = document.createElement("span");
        favoriteText.id = `favorite-${pokemonData.id}`;
        favoriteText.textContent = "Unfavorite"; // Unfavorite
        favoriteText.classList.add("cursor-pointer", "text-red-400", "font-bold", "text-lg");
        favoriteText.addEventListener("click", () => removeFromFavorites(pokemonData));

        // Append all elements to the card
        pokeCard.appendChild(pokeImg);
        pokeCard.appendChild(pokeName);
        pokeInfo.appendChild(pokemonId);
        pokeInfo.appendChild(pokeType);
        pokeInfo.appendChild(favoriteText); // Unfavorite button 
        pokeCard.appendChild(pokeInfo);
        cardsContainer.appendChild(pokeCard);
    });
};

// Call the function to load favorites initially
loadFavorites();
