// fetch favourited pokémon from local storage and populate the page into cards
    //cards styling, copied presumably
const mainContent = document.getElementById("main");

showFavorites = () => {
    if(favorites) {
        
    }else
        mainContent.textContent = "There is nothing to show";

}

//function to remove favourited pokémon

let saveNotes = []; //defining array for saving notes to storage
let savedNotes = localStorage.getItem("note");
savedNotes = savedNotes ? JSON.parse(savedNotes) : [];


///////
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
        // Remove from favorites.
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
            "rounded-sm",
            "h-90",
            "w-60",
            "gap-2"
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

        const notesInput = document.createElement('input'); //will need to edit the pokécard height to make sure it fits
            notesInput.type = 'text';
            notesInput.placeholder = 'Add a note!';
            notesInput.classList.add(
                "px-4",
                "w-90%",
                "h-8",
                "overflow-y-scroll",
                "bg-white",
                "shadow-md",
                "rounded-lg",
                "border",
                "text-xs"
            );

        const addNotesButton = document.createElement('button');
        addNotesButton.textContent = " Save"
        addNotesButton.classList.add(
            "fa-regular",
            "fa-note-sticky",
            "cursor-pointer",
            "text-xs",
            "hover:text-[#bc7a25]",
            "text-[#f6eac5]",
            "font-bolder",
            "bg-[#90402c]",
            "px-2",
            "py-1",
            "m-1",
            "rounded-xl",
            "shadow-md"

        ); //will style later when it works

        const addNote = (note) => {
            const newNote = document.createElement('li');
            // newNote.id = note.id;
            newNote.classList.add("text-xs", "list-none", "inline");
            
            const notesContainer = document.createElement('span');
            notesContainer.textContent = note; //should make the text of the span be the li items?
            notesContainer.classList.add(
                "block",
                "text-xs",
                "text-[#90402c]",
                "overflow-x-auto", //currently doesnt do anything, nor the one below
                "scrollbar",

            );

            //creates delete button and removes element
            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Delete';
            deleteBtn.classList.add("text-red-500", "list-none", "inline", "pl-2", "hover:font-bold");
            deleteBtn.addEventListener('click', () => {
                // let updatedNotes = saveNotes.filter((note) => saveNotes - newNote.id); //deletes all of the notes :/
                // localStorage.setItem("note", JSON.stringify(updatedNotes));

                pokeCard.removeChild(notesContainer);
            });

            
            newNote.appendChild(deleteBtn);
            notesContainer.appendChild(newNote);
            pokeCard.appendChild(notesContainer);
        }


        addNotesButton.addEventListener('click', (e) => {
            console.log(e);
            const finalNote = notesInput.value.trim();
            //add note to card from input field
            if (finalNote) {
                saveNotes.push(finalNote);
                localStorage.setItem("note", JSON.stringify(saveNotes));
                addNote(finalNote);
                notesInput.value = '';
                notesInput.focus();
            } else {
                alert('You cannot submit an empty note.')
            }


        });
            

        // Append all elements to the card
    pokeCard.appendChild(pokeImg);
    pokeCard.appendChild(pokeName);
    pokeInfo.appendChild(pokemonId);
    pokeInfo.appendChild(pokeType);
    pokeInfo.appendChild(favoriteText); // Unfavorite button 
    pokeCard.appendChild(pokeInfo);
    pokeCard.appendChild(notesInput); //same as above
    pokeCard.appendChild(addNotesButton); //just testing if it works, delete later
    cardsContainer.appendChild(pokeCard);
    });
};

// Call the function to load favorites initially
loadFavorites();