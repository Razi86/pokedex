let favorites = localStorage.getItem("favorites");
favorites = favorites ? JSON.parse(favorites) : [];
// fetch pokécard info

const cardsContainer = document.getElementById('cards-container');
const pokeNames = [];
const pokeIds = [];

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
                "max-h-fit",
                "rounded-sm",
                "h-60",
                "w-60"
            );
            

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

            );

            const pokeInfo = document.createElement('span');
            pokeInfo.classList.add("flex-col", "gap-2", "text-sm");

            const pokemonId = document.createElement('h5');
            pokemonId.textContent = `ID: #${pokemon.id}`;
            pokemonId.classList.add(
                "font-bold",
                "text-[#bc7a25]"
            );

            const pokeType = document.createElement('p');
            pokeType.textContent = `Type: ${pokemon.types.map((typeInfo) => typeInfo.type.name).join(", ")}`; //see what that does
            pokeType.classList.add(
                "text-[#bc7a25]"
            );
            


            const notesInput = document.createElement('input'); //will need to edit the pokécard height to make sure it fits
            notesInput.type = 'text';
            notesInput.placeholder = 'Placeholder';
            notesInput.classList.add("px-4", "w-80%", "h-10", "overflow-y-scroll", "bg-white", "shadow-md", "rounded", "border");

            const addNotesButton = document.createElement('button');
            addNotesButton.textContent = " Save"
            addNotesButton.classList.add("fa-regular", "fa-note-sticky", "cursor-pointer", "text-sm"); //will style later when it works

            const addNote = (note) => {
                const newNote = document.createElement('li');
                newNote.classList.add("text-sm");
            
                const notesContainer = document.createElement('span');
                notesContainer.textContent = note; //should make the text of the span be the li items?
                notesContainer.classList.add("flex-grow");
            
                const deleteBtn = document.createElement('button');
                deleteBtn.textContent = 'Delete';
                deleteBtn.classList.add("text-red-500");
                deleteBtn.addEventListener('click', () => deleteNewNote(newNote));
            
                pokeCard.appendChild(notesContainer);
                newNote.appendChild(deleteBtn);
                notesContainer.appendChild(newNote);
            }

            addNotesButton.addEventListener('click', (e) => {
                // e.preventDefault();
                console.log(e);
                const finalNote = notesInput.value.trim();
                if (finalNote) {
                    addNote(finalNote);
                    notesInput.value = '';
                    notesInput.focus();
                } else {
                    alert('You cannot submit an empty note.')
                }
                localStorage.setItem("note", JSON.stringify(finalNote));
            });
            
          /// favoriteIcon
            const favoriteIcon = document.createElement("i");
            favoriteIcon.classList.add("fa-regular","fa-heart","text-lg","cursor-pointer","text-red-400");
            favoriteIcon.addEventListener("click", () => addToFavorites(pokemon));
             
        pokeCard.appendChild(pokeImg);
        pokeCard.appendChild(pokeName);
        pokeInfo.appendChild(pokemonId);
        pokeInfo.appendChild(pokeType);
        pokeCard.appendChild(pokeInfo);
        pokeInfo.appendChild(favoriteIcon);
        pokeCard.appendChild(notesInput); //same as above
        pokeCard.appendChild(addNotesButton); //just testing if it works, delete later
        cardsContainer.appendChild(pokeCard);

        pokeNames.push(pokeName);
        pokeIds.push(pokemonId);
        }

    }

};


displayPokemon();








    //style the card


//button to favourite
    //save favourited pokémon to an array in local storage

//search bar function. maybe left for last since it will need to call the fetched stuff
const searchElement = document.querySelector("#search-bar input");

searchElement.addEventListener("keyup" , function(e) {
    const searchText = e.target.value;

     if(!isNaN(searchText))
        searchById(searchText);
    else
        searchByName(searchText);
});


const searchByName = (searchName) => {
    pokeNames.forEach(pokeName => {
        if(!pokeName.textContent.includes(searchName.toUpperCase()))
            pokeName.parentElement.classList.add("hidden");
        else
        pokeName.parentElement.classList.remove("hidden");
    })
}

const searchById = (searchId) => {
    pokeIds.forEach(pokeId => {

        if(pokeId.textContent.includes(searchId))
            pokeId.parentElement.parentElement.classList.remove("hidden");
        else
        pokeId.parentElement.parentElement.classList.add("hidden");
    })
}