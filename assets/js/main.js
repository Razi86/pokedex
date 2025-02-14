// fetch pokécard info

const cardsContainer = document.getElementById('cards-container');

const fetchPokemon = async (pokeId) => {
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokeId}`);
        const pokemonJson = await response.json();
        return pokemonJson;

    } catch (error) {
        console.error("You caught a wild error!", error);
    };
};

// Function to save a Pokémon to favorites
const addToFavorites = (pokemon) => {
    let favorites = JSON.parse(localStorage.getItem("favorites")) ;
    if (!favorites.some(fav => fav.id === pokemon.id)) {
      favorites.push({ id: pokemon.id, name: pokemon.name, image: pokemon.sprites.front_default });
      localStorage.setItem("favorites", JSON.stringify(favorites));
      alert(`${pokemon.name} added to favorites!`);
    } else {
      alert(`${pokemon.name} is already in favorites.`);
    }
  };
const displayPokemon = async () => {
    for(let i = 1; i <= 151; i++) {
        const pokemon = await fetchPokemon(i);
        console.log(i);

        if (pokemon) {
            const pokeCard = document.createElement('div');
            pokeCard.classList.add(
                "flex-col",
                "justify-items-center",
                "bg-[#f6eac4]",
                "text-center",
                "shadow-lg",
                "bg-[url('assets/images/cards-background.png')]",
                "bg-cover",
                "min-h-[200px]",
                "rounded-sm",
            )
            

            const pokeImg = document.createElement('img');
            pokeImg.src = pokemon.sprites.front_default;
            pokeImg.alt = pokemon.name;
            pokeImg.classList.add();
            // add margins/padding/size

            const pokeName = document.createElement('h3');
            pokeName.textContent = pokemon.name.toUpperCase(); //lets see what this does
            pokeName.classList.add(
                "font-bold",
                "text-[#bc7a25]",
                "tracking-wider",
                "-skew-x-10"

            )
            //add styling

            const pokeInfo = document.createElement('span');
            pokeInfo.classList.add("flex-col", "gap-2", "text-sm");

            const pokemonId = document.createElement('h5');
            pokemonId.textContent = `ID: #${pokemon.id}`;
            pokemonId.classList.add("font-bold", "text-[#bc7a25]")
            //add styling

            const pokeType = document.createElement('p');
            pokeType.textContent = `Type: ${pokemon.types.map((typeInfo) => typeInfo.type.name).join(", ")}`; //see what that does
            pokeType.classList.add("text-[#bc7a25]")

            //maybe add background colours changed depending on pokemon type
          /// favoriteButton
            const favoriteButton = document.createElement("button");
            favoriteButton.textContent = "Add to Favorites";
            favoriteButton.classList.add("mt-2", "bg-blue-500", "text-white", "px-4", "py-2", "rounded");
            favoriteButton.addEventListener("click", () => addToFavorites(pokemon));
             
        pokeCard.appendChild(pokeImg);
        pokeCard.appendChild(pokeName);
        pokeInfo.appendChild(pokemonId);
        pokeInfo.appendChild(pokeType);
        pokeCard.appendChild(pokeInfo);
        pokeInfo.appendChild(favoriteButton);
        cardsContainer.appendChild(pokeCard);


        }
    }


};


displayPokemon();



    //style the card


//button to favourite
    //save favourited pokémon to an array in local storage

//search bar function. maybe left for last since it will need to call the fetched stuff