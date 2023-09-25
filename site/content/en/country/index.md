+++
type = 'country'
+++

<h1 id="country-title"></h1>

---

### Below is a list of the images that have been collected, analysed and made freely available for our simulation of the biometrics market. It's something none of you should have to experience. That's why we're testing this distopian world on the politicians who can [finally ban it within the AIAct](//www.politico.eu/article/activists-urge-eu-to-ban-live-facial-recognition-in-public-spaces/).

<style>

.container {
  max-width: 100%; /* Updated from 800px to allow the container to expand to full width */
  margin: 0 auto;
  padding: 20px;
  box-sizing: border-box; /* This ensures padding doesn't add extra width */
}

.official-role {
  background-color: #d6ffd6;
  font-size: 0.8em;
  border-radius: 5px;
  padding: 3px;
}

.deepfake-label {
  background-color: #ead9ff;
  border-radius: 5px;
  padding: 3px;
  font-size: 0.7em;
  margin-bottom: 1em;
}

.picture-description {
  display: flex;
  flex-wrap: wrap; /* This will allow wrapping in case of small devices */
  align-items: center;
  margin-bottom: 20px;
  width: 100%;
}

.picture-description img {
  /* max-width: 150px; */
  width: 50%; /* Taking up 30% of container width, adjust if needed */
  margin-right: 10px;
  box-sizing: border-box; /* This ensures margins don't add extra width */
}

.picture-description p {
  width: 40%; /* Taking up the remaining 70% of the container width */
  box-sizing: border-box; /* This ensures padding doesn't add extra width */
}

/* Responsive adjustments */
@media only screen and (max-width: 600px) {
  .picture-description img {
    width: 40%; /* Adjust image width for smaller devices */
  }
  .picture-description p {
    width: 60%; /* Adjust description width for smaller devices */
  }
}

.alert {
  padding: 10px 20px;
  margin: 10px 0;
  border: 1px solid #c00;
  background-color: #f8d7da;
  color: #721c24;
  border-radius: 4px;
  font-weight: bold;
  font-size: 16px;
}

.alert.success {
  border-color: #28a745;
  background-color: #d4edda;
  color: #155724;
}

.alert.info {
  border-color: #17a2b8;
  background-color: #d1ecf1;
  color: #0c5460;
}

.alert.warning {
  border-color: #ffc107;
  background-color: #fff3cd;
  color: #664d03;
}

.alert.error {
  border-color: #dc3545;
  background-color: #f8d7da;
  color: #721c24;
}

</style>

<div class="container" id="face-list"></div>

---

<div class="mx-auto mt-8 mb-8 md:mb-0 flex justify-center">
  <a class="px-4 py-2 mx-2 rounded-sm text-center border border-accent hover:border-accent-dark transition duration-300 ease-in-out no-underline hover:bg-accent-dark hover:text-secondary dark:hover:text-primary dark:text-primary" id="load-upload-form">
    Upload a new picture
  </a>
</div>

<p><br></p> <!-- some space -->

<div id="upload-form-container"></div>

<script src="/js/lodash.min.js"></script>
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
