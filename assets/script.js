// global Variables
var generationSelectEl = document.querySelector("#generation-select");
var typeSelectEl = document.querySelector("#select-type");
var textUserInputEl = document.querySelector("#pokemon");
var baseUrl = "https://pokeapi.co/api/v2/";
var searchFormEl = document.querySelector("#search-form");
var containerEl = document.querySelector("#container");
var modalAlertEl = document.querySelector("#modal-js-example");
var closeModalEl = document.querySelector("#close-modal");
var modalMemeEl = document.querySelector("#modal-meme");
var meme = document.querySelector("#meme");
var pokemonParty = [];
var containerGallery = document.querySelector(".containerGallery");

if (localStorage.getItem("name")) {
  pokemonParty = JSON.parse(localStorage.getItem("name"));
}

// Moment.JS
var currentDay = document.querySelector("#currentDay");
currentDay.textContent = moment().format("LLLL");
var currentHour = moment().hour();

//functions that perform search citeria ------------------------->
//Generates pokemon result from the input in the Search bar
function generatePokemon(pokemon) {
  var baseUrl = `https://pokeapi.co/api/v2/pokemon/${pokemon}/`;
  console.log(pokemon);
  console.log("generate pokemon");
  fetch(baseUrl)
    .then((response) => {
      console.log("status");
      return response.json();
    })
    .then((data) => {
      console.log(data);

      //Checks if any specific type is selected or not
      if (typeSelectEl.value === "any") {
        generateCard(data);
      } else {
        //debugger
        data.types.forEach((element) => {
          if (element.type.name === typeSelectEl.value.toLowerCase()) {
            console.log("Pokemon result: " + data.name);
            generateCard(data);
          }
        });
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

//converts name to id THEN calls generatePokemon
function convertToID(pokemon) {
  var baseUrl = `https://pokeapi.co/api/v2/pokemon-species/${pokemon}/`;
  console.log(pokemon);

  fetch(baseUrl)
    .then((response) => {
      console.log(response.status);
      if (response.status === 404) {
        console.log("status", response.status);
        modalAlert();
        return;
      }
      return response.json();
    })
    .then((data) => {
      console.log(data);
      generatePokemon(data.id);
    })
    .catch((err) => {
      console.log(err);
    });
}

//Gets pokemon form each generation
function findGeneration(generation) {
  var baseUrl = `https://pokeapi.co/api/v2/generation/${generation}/`;
  console.log(generation);

  fetch(baseUrl)
    .then((response) => {
      console.log(response);
      return response.json();
    })
    .then((data) => {
      console.log(data.pokemon_species);

      data.pokemon_species.forEach((element) => {
        console.log(element.name);
        convertToID(element.name);
      });
    });
}

//Loops throught find generation
function getAllGenerations() {
  for (var i = 2; i < generationSelectEl.length; i++) {
    console.log(generationSelectEl[i].value);
    findGeneration(generationSelectEl[i].value);
  }
}

function modalAlert() {
  console.log("modal");
  displayMeme();
  modalAlertEl.classList.add("is-active");

  function displayMeme(giphyUrl) {
    var baseGiphyURL = `https://api.giphy.com/v1/gifs`;
    var giphyKey = "cRLAat2xLf4fcaSQWWaSNtv1DqYQ2sAu";
    var giphyUrl = `${baseGiphyURL}/random?api_key=${giphyKey}&tag=&rating=pg-13`;

    fetch(giphyUrl)
      .then((response) => {
        console.log(response.status);
        return response.json();
      })
      .then((data) => {
        modalMemeEl.src = data.data.embed_url;
      })
      .catch((err) => {
        console.log("meme err", err);
      });
  }
  displayMeme();
}

function closeModal() {
  modalAlertEl.classList.remove("is-active");
}

closeModalEl.addEventListener("click", closeModal);

// grabs parent div to generate card from given types of search options
function generateCard({ id, name, sprites, types }) {
  // clears out previous results23e
  containerEl.innerHTML = "";

  //Fetch call to get the pokedex description
  var baseUrl = `https://pokeapi.co/api/v2/pokemon-species/${id}/`;
  console.log(name);
  fetch(baseUrl)
    .then((response) => {
      console.log(response);
      return response.json();
    })
    .then((specData) => {
      console.log(specData);

      //Small loop to cycle through the types array
      var pokemonTypes = "";
      types.forEach((element) => {
        console.log(element.type.name);

        pokemonTypes += `<p class="type ${element.type.name}">${element.type.name}</p>`;
        console.log(pokemonTypes);
      });

      //Loop to find the lates english versions of the pokedex descriptions
      var englishPokeDescript = "";
      specData.flavor_text_entries.forEach((element) => {
        if (element.language.name === "en") {
          englishPokeDescript = element.flavor_text;
        }
      });

      var div = document.createElement("div");
      div.classList.add("card");
      div.classList.add("column");
      div.classList.add("is-2");
      div.classList.add("m-1");
      // div.classList.add("is-flex-grow-1");
      // div.classList.add("is-flex-shrink-0");
      div.innerHTML =
        `
        <div class="card-image">
          <figure class="image is-4by3">
              <img src=${sprites.other["official-artwork"].front_default} alt="${name}">
          </figure>
        </div>
        <div class="card-content">
            <div id="pokemon-title" class="media">
              <div class="media-left">
                  <p class="title">${name}</p>
                  <p class="subtitle ">${specData.genera[7].genus}</p>
              </div>
              <div class="media-content ">
                  <div class="type-image is-pulled-right is-4">` +
        pokemonTypes +
        `</div>    
              </div>
            </div>
            <div class="content">` +
        englishPokeDescript +
        `</div>
        </div>
        <button  class="button is-primary" data-name="${name}" data-img="${sprites.other["official-artwork"].front_default}" id="addPokemon">Add to Party!</button>
        <button  class="button is-primary" id= "clearParty">Clear Party!</button>`;

      //establishing the click function for the "add to party" button

      containerEl.appendChild(div);

      var addPokemon = document.getElementById("addPokemon");

      addPokemon.addEventListener("click", function (event) {
        // alert("Added");
        var card = event.target.closest(".card");
        console.log(card);
        var clone = card.cloneNode(true);
        clone.querySelector("#addPokemon").remove();

        var button = document.createElement("button");
        var name = event.target.getAttribute("data-name");
        button.setAttribute("data-name", name);
        button.classList = "button is-primary";
        button.innerText = "Remove Pokemon";
        clone.appendChild(button);

        // var removePokemon = document.getElementById("removePokemon");
        button.addEventListener("click", function (event) {
          // alert("Removed");
          var pokemonName = this.getAttribute("data-name");
          var newName = pokemonParty.filter(function (pokemon) {
            console.log("pokemon LS", pokemon);
            return pokemon.name !== pokemonName;
          });

          console.log(newName);
          localStorage.setItem("name", JSON.stringify(newName));
          pokemonParty = newName;
          console.log(event.target.closest(".card"));
          event.target.closest(".card").remove();
        });

        var image = this.getAttribute("data-img");
        pokemonParty.push({ name, image });
        localStorage.setItem("name", JSON.stringify(pokemonParty));
        displayPokemon(clone);
      });

      var clearParty = document.getElementById("clearParty");
      clearParty.addEventListener("click", function () {
        // alert("Cleared Party");
        localStorage.clear("name");
      });
    });
}

function displayPokemon(clone) {
  containerGallery.appendChild(clone);
}

searchFormEl.addEventListener("submit", function (event) {
  //debugger
  event.preventDefault();
  //Search function that scheck if any name is writen in the
  // searchbar, if not, checks if any generation is selected
  if (textUserInputEl.value !== "") {
    //Default result through the search bar
    console.log("Search result: " + textUserInputEl.value.toLowerCase());
    convertToID(textUserInputEl.value.toLowerCase());
  } else {
    if (generationSelectEl.value === "any") {
      if (typeSelectEl.value === "any") {
        //Search all!!!
        getAllGenerations();
      } else {
        //Go though all generation by filter by each type
        console.log("Pokemon type: " + typeSelectEl.value.toLowerCase());
        getAllGenerations();
      }
    } else if (typeSelectEl.value === "any") {
      //Itterate through specifit generation
      console.log("Generation: " + generationSelectEl.value);
      findGeneration(generationSelectEl.value);
    } else {
      console.log("Generation: " + generationSelectEl.value);
      console.log("Pokemon type: " + typeSelectEl.value.toLowerCase());
      findGeneration(generationSelectEl.value);
    }
  }
});

//PLAN TO REWRITE WINDOW ALERTS TO MODAL ALERTS:

// 1. Ctrl + F, search "alert" within the script.js file. Find the results that show the alert() method (line 254, line 233, and line 218)

// 2. Edit alert() and rewrite it as modalAlert() for these three lines.

// 3. Go to test browser, it should now display the 404 error modal when clicking on add, remove, and clear from party buttons.

// 4. From here, just need to add divs to html, with id's that correspond to the button names. Declare these as global variables in the script.js as well as the new matching ids on the html.

// 5. Profit??? Pokemon???????
