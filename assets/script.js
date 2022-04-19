// global Variables
var generationSelectEl = document.querySelector("#generation-select");
var typeSelectEl = document.querySelector("#select-type");
var textUserInputEl = document.querySelector("#pokemon");
var baseUrl = "https://pokeapi.co/api/v2/";
var baseGiphyURL = `https://api.giphy.com/v1/gifs`;
var giphyKey = "cRLAat2xLf4fcaSQWWaSNtv1DqYQ2sAu";
var giphyUrl = `${baseGiphyURL}/random?api_key=${giphyKey}&tag=&rating=pg-13`;
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
      // if (response.status === 404) {
      //   console.log("status", response.status);
      //   modalAlert();
      //   return;
      // }
      return response.json();
    })
    .then((data) => {
      console.log(data);
      generateCard(data);
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

function modalAlert() {
  console.log("modal");
  displayMeme();
  modalAlertEl.classList.add("is-active");

  function displayMeme() {
    // var baseGiphyURL = `https://api.giphy.com/v1/gifs`;
    // var giphyKey = "cRLAat2xLf4fcaSQWWaSNtv1DqYQ2sAu";
    // var giphyUrl = `${baseGiphyURL}/random?api_key=${giphyKey}&tag=&rating=pg-13`;
    modalMemeEl.innerHTML = `<p><img src="${giphyUrl}" alt="Randomly generated gif" height="100px" width="100px"></p>`;
    console.log(meme);
    fetch(giphyUrl)
      .then((response) => {
        console.log(response.status);
        return response.json();
      })
      .then((data) => {
        console.log("data", data);
        // modalMemeEl.
      })
      .catch((err) => {
        console.log("meme err", err);
      });
  }
}

function closeModal() {
  modalAlertEl.classList.remove("is-active");
}

closeModalEl.addEventListener("click", closeModal);

//generates pokemon results from "type" input

//generates pokemon results from "effective against" input

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

      var div = document.createElement("div");
      div.classList.add("card");
      div.classList.add("column");
      div.classList.add("is-2");
      div.classList.add("m-1");
      div.classList.add("is-flex-grow-1");
      div.classList.add("is-flex-shrink-0");
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

                  <div class="type-image title is-pulled-right is-4">` +
        pokemonTypes +
        `</div>    
              </div>
            </div>
            <div class="content">
            ${specData.flavor_text_entries[6].flavor_text}
            </div>
        </div>
        <button  class="button is-primary" data-name="${name}" data-img="${sprites.other["official-artwork"].front_default}" id="addPokemon">Add to Party!</button>
        <button  class="button is-primary" id= "clearParty">Clear Party!</button>`;

      //establishing the click function for the "add to party" button

      containerEl.appendChild(div);

      var addPokemon = document.getElementById("addPokemon");
      addPokemon.addEventListener("click", function (event) {
        alert("Added");
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
          alert("Removed");
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
          // displayPokemon();
        });

        // button.setAttribute("data-name", )
        // <button  class="button is-primary" id="removePokemon" data-name="${name}" data-img="${sprites.other["official-artwork"].front_default}">Remove from Party!</button>
        //var name = this.getAttribute("data-name");
        var image = this.getAttribute("data-img");
        pokemonParty.push({ name, image });
        localStorage.setItem("name", JSON.stringify(pokemonParty));
        displayPokemon(clone);
      });

      // displayPokemon();

      var clearParty = document.getElementById("clearParty");
      clearParty.addEventListener("click", function () {
        alert("Cleared Party");
        localStorage.clear("name");
      });
    });
}

function displayPokemon(clone) {
  //   containerGallery.innerHTML = ``;
  //   for (var i = 0; i < pokemonParty.length; i++) {
  //     containerGallery.innerHTML += `<h1>Pokemon Party</h1>
  //     <h1 class="Pokemon">${pokemonParty[i].name}</h1>
  //     <img src="${pokemonParty[i].image}" alt="" id="selectedPokemon">`;
  //   }
  containerGallery.appendChild(clone);
}

//     });
// }
// generatePokemon();
searchFormEl.addEventListener("submit", function (event) {
  //debugger
  event.preventDefault();

  //displayMeme();
  convertToID(textUserInputEl.value.toLowerCase());
});

generationSelectEl.addEventListener("click", function (event) {
  //debugger

  event.preventDefault();
  //console.log(event.target.value);

  findGeneration(event.target.value);
});

// closeModalEl.addEventListener("click", closeModal);
