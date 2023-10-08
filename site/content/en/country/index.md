+++
type = 'country'
+++

<h1 id="country-title"></h1>

---

### Below is a list of the images that have been collected, analysed and made freely available for our simulation of the biometrics market. It's something none of you should have to experience. That's why we're testing this distopian world on the politicians who can [finally ban it within the AIAct](//www.politico.eu/article/activists-urge-eu-to-ban-live-facial-recognition-in-public-spaces/).

<link rel="stylesheet" href="/css/country.css">
<div class="container" id="face-list"></div>

---

<div class="mx-auto mt-8 mb-8 md:mb-0 flex justify-center">

  <a class="px-4 py-2 mx-2 rounded-sm text-center border border-accent hover:border-accent-dark transition duration-300 ease-in-out no-underline hover:bg-accent-dark hover:text-secondary dark:hover:text-primary dark:text-primary" id="load-upload-form">
    Upload a new picture
  </a>

  <a class="px-4 py-2 mx-2 rounded-sm text-center border border-accent hover:border-accent-dark transition duration-300 ease-in-out no-underline hover:bg-accent-dark hover:text-secondary dark:hover:text-primary dark:text-primary" href="/about#contacts">
    Contact us to register a missing politician
  </a>

</div>

<p><br></p> <!-- some space -->

<div id="upload-form-container"></div>

<script src="/js/lodash.min.js"></script>
<script src="/js/shared.js"></script>
<script src="/js/country.js"></script>
<script>
  document.getElementById('load-upload-form').addEventListener('click', function() {
    const iframe = document.createElement('iframe');
    iframe.src = "https://db.dontspy.eu/dashboard/#/nc/form/bf2949c3-56f3-4574-8d44-13b90551a995?embed";
    iframe.width = '100%';
    iframe.height = '1000';
    iframe.frameborder = "0";
    iframe.classList.add("nc-embed");
    iframe.style.background = "transparent";
    const destinationElement = document.getElementById('upload-form-container');
    destinationElement.appendChild(iframe);
    const button = document.getElementById('load-upload-form');
    button.remove();
  });
  document.addEventListener('DOMContentLoaded', loadMaterial);
</script>
