// fetch favourited pokémon from local storage and populate the page into cards
    //cards styling, copied presumably

//function to remove favourited pokémon

let saveNotes = JSON.parse(localStorage.getItem("note")) || [];


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

    saveNotes = saveNotes.filter((note) => note.pokemonID !== pokemon.id);
    localStorage.setItem("note", JSON.stringify(saveNotes)); // Update notes in localStorage

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
        pokeInfo.classList.add("flex-col", "gap-2", "text-sm", "block");

        const pokemonId = document.createElement('h5');
        pokemonId.textContent = `ID: #${pokemonData.id}`;
        pokemonId.classList.add("font-bold", "text-[#bc7a25]");

        const pokeType = document.createElement('p');
        pokeType.textContent = `Type: ${pokemonData.types.map(typeInfo => typeInfo.type.name).join(", ")}`;
        pokeType.classList.add("text-[#bc7a25]");

        // Favorite icon (remove from favorites on click)
        const favoriteText = document.createElement("i");
        favoriteText.id = `favorite-${pokemonData.id}`;
        favoriteText.classList.add("fa","fa-heart","text-lg","cursor-pointer","text-red-400","block", "m-1");
        favoriteText.addEventListener("click", () => removeFromFavorites(pokemonData));

        const addNoteContainer = document.createElement("div");
        addNoteContainer.classList.add("flex","justify-center");

        const notesInput = document.createElement('input'); //will need to edit the pokécard height to make sure it fits
            notesInput.type = 'text';
            notesInput.placeholder = 'Add a note!';
            notesInput.classList.add(
                "px-4",
                "w-[90%]",
                "h-8",
                "bg-white",
                "shadow-md",
                "rounded-lg",
                "border",
                "text-xs",
                "m-1",
                "inline-block",
                "relative",
                "-mr-[9px]"
            );

        const addNotesButton = document.createElement('i');
        //addNotesButton.textContent = " Save"
        addNotesButton.classList.add(
            "fa-solid",
            "fa-check",
            "cursor-pointer",
            "text-[#008913]",
            "font-bold",
            "relative",
            "right-[12px]",
            "top-[12px]"

        ); //will style later when it works

        const noteUl = document.createElement("ul");
        noteUl.classList.add("list-none","w-full","px-5");
        const addNote = (note) => {
            const newNote = document.createElement('li');
            newNote.setAttribute("id", note.id);
            // newNote.textContent = note.text;
            newNote.classList.add("text-xs","flex","justify-between","my-2","items-center", "bg-[#EFE9D0]");
            
            const notesContainer = document.createElement('span');
            notesContainer.textContent = note.text; //should make the text of the span be the li items?
            notesContainer.classList.add(
                "block",
                "text-[#90402c]",
                "overflow-x-auto", //currently doesnt do anything, nor the one below
                "scrollbar",
                
            );

            //creates delete button and removes element
            const deleteBtn = document.createElement('i');
            //deleteBtn.textContent = 'Delete';
            deleteBtn.classList.add("fa-solid","fa-trash", "hover:font-bold","text-[#e30000]","cursor-pointer");
            deleteBtn.addEventListener('click', () => {
                saveNotes = saveNotes.filter((note) => note.id !== newNote.id);
                localStorage.setItem("note", JSON.stringify(saveNotes));

                noteUl.removeChild(newNote);
            });

            newNote.appendChild(notesContainer);
            newNote.appendChild(deleteBtn);
            noteUl.appendChild(newNote);
        }


        addNotesButton.addEventListener('click', (e) => {
            console.log(pokemonData.id);
            const finalNote = notesInput.value.trim();
            //add note to card from input field
            if (finalNote) {
                let noteObject = {
                    id: `${new Date().getTime()}${finalNote}`,
                    pokemonID: pokemonData.id,
                    text: finalNote
                }
                saveNotes.push(noteObject);
                localStorage.setItem("note", JSON.stringify(saveNotes));
                addNote(noteObject);
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
    addNoteContainer.appendChild(notesInput); //same as above
    addNoteContainer.appendChild(addNotesButton); //just testing if it works, delete later
    pokeCard.appendChild(addNoteContainer);
    pokeCard.appendChild(noteUl);

    saveNotes.forEach((note) => {
        if(note.pokemonID == pokemonData.id) {
            addNote(note);
        }
    })


    cardsContainer.appendChild(pokeCard);
    });
};

// Call the function to load favorites initially
loadFavorites();