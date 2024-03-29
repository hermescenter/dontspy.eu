
/* a kind of global variable to keep track the images index */
let currentIndex = 0;
let data = [];
async function loadCarousel() {

  const url = serverURL('individuals', { isfake: true });
  const response = await fetch(url);
  data = await response.json();

  console.log(data);

  /* this code need to change before going in prod */
  _.each(data, (item, index) => {
    const url = `https://dontspy.eu/${item.image}`;
    const boxurl = `https://dontspy.eu/${item.boxfile}`;
    if (url != 'https://dontspy.eu/data/photos/55-resized.jpg') {
      data[index].srcurl = url;
      data[index].img = new Image();
      data[index].img.src = url;

      data[index].box = new Image();
      data[index].box.src = boxurl;
    } else
      delete data[index];
  });

  data = _.compact(data);
  console.log(data);

  let touchStartX = 0;

  const imgContainer = document.getElementById('img-container');

  imgContainer.addEventListener('touchstart', function (e) {
    touchStartX = e.touches[0].clientX;
  });

  imgContainer.addEventListener('touchend', function (e) {
    let touchEndX = e.changedTouches[0].clientX;
    handleSwipe(touchStartX, touchEndX);
  });

  let startMouseY = 0;

  imgContainer.addEventListener('mousedown', function (e) {
    startMouseY = e.clientY;
    e.preventDefault(); // Prevenire il drag di default delle immagini
  });

  imgContainer.addEventListener('mouseup', function (e) {
    let endMouseY = e.clientY;
    handleSwipe(startMouseY, endMouseY);
  });

  imgContainer.addEventListener('click', function (e) {
    displayImage(data, 1);
  });

  displayImage(data, 1);

}

function displayImage(data, direction) {
  const imgContainer = document.getElementById('img-container');
  const descriptionContainer = document.getElementById('description-container');

  currentIndex += direction;
  if (currentIndex >= data.length) currentIndex = 0;
  if (currentIndex < 0) currentIndex = data.length - 1;

  const nation = data[currentIndex].Country;
  imgContainer.src = data[currentIndex].srcurl;
  descriptionContainer.innerHTML = 
    `${EUMS[nation]} ${data[currentIndex].Description} <span class="click-to-next">Click to next</span>`

  window.setTimeout(() => {
    imgContainer.src = data[currentIndex].box.src;

    window.setTimeout(() => {
      imgContainer.src = data[currentIndex].img.src;
    }, 400);

  }, 200); 

  document.querySelector('.click-to-next').addEventListener('click', function (e) {
    displayImage(data, 1);
  });
}

function handleSwipe(start, end) {
  /* this map if the swipe is left or right, so if the end is > start */
  if (start > end) {
    displayImage(data, 1);
  }
  else if (start < end) {
    displayImage(data, -1);
  }
}
