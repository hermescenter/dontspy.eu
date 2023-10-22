/* shared vars because accessed by many functs */
const imageContainer = document.querySelector(".image-container");
const slider = document.querySelector('.image-slider');

document.addEventListener("DOMContentLoaded", function () {

  const buttons = document.querySelectorAll(".emotion-button");

  buttons.forEach(button => {
    button.addEventListener("click", async function (e) {
      const emotion = e.currentTarget.getAttribute("data-emotion");

      // Deseleziona tutti i bottoni
      deselectAllButtons();
   
      // Seleziona il bottone cliccato
      this.classList.add('selected');
      // fetch + popola l'HTML 
      await fetchByEmotion(emotion);
    });
  });

});

function deselectAllButtons() {
  document.querySelectorAll('.emotion-button').forEach(button => {
    button.classList.remove('selected');
  });
}

function selectButtonByText(text) {
  deselectAllButtons();  // Deseleziona tutti i bottoni prima di selezionare quello deiderato
  document.querySelectorAll('.emotion-button').forEach(button => {
    if (button.innerText.includes(text)) {
      button.classList.add('selected');
    }
  });
}

async function fetchByEmotion(emotionName) {

  const url = serverURL('emotion', emotionName);
  const response = await fetch(url);
  const data = await response.json()

  // Distruggi l'HTML esistente
  document.querySelector('.image-slider').innerHTML = "";

  data.forEach(imageData => {
    const slide = document.createElement('div');
    slide.className = 'slide';

    const img = document.createElement('img');
    img.src = imageData.url;
    img.alt = imageData.description;

    const caption = document.createElement('div');
    caption.className = 'slide-caption';
    caption.innerHTML = `${EUMS[imageData.nation]} ${imageData.fullName} <span class="percent">${imageData.percent}</span>`;

    slide.appendChild(caption);
    slide.appendChild(img);
    slider.appendChild(slide);
  });

}