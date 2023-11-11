+++
type = 'country'
+++

<link rel="stylesheet" href="/css/country.css">

# Since we’re targeting the European Council, we’ll use these 5 prominent political roles per Member State; See below: <span class="country-name"></span> <span class="country-flag"></span>

<div class="role-row">
  <div class="item role-name-0">Prime Minister</div>
  <div class="item role-name-1">AIAct Gov Representative</div>
  <div class="item role-name-2">Internal Affairs Minister</div>
  <div class="item role-name-3">Minister of Justice</div>
  <div class="item role-name-4">Minister of Defense</div>
</div>

<div class="role-row" id="registered-names">
  <div class="item" id="name-0"></div>
  <div class="item" id="name-1"></div>
  <div class="item" id="name-2"></div>
  <div class="item" id="name-3"></div>
  <div class="item" id="name-4"></div>
</div>

<div class="role-row" id="registered-faces">
  <div class="item" id="role-0"></div>
  <div class="item" id="role-1"></div>
  <div class="item" id="role-2"></div>
  <div class="item" id="role-3"></div>
  <div class="item" id="role-4"></div>
</div>


<span id="service">

_You can also **query biometric data of <span class="country-name"></span> politicians via [API](/swagger)**._

</span>

<div class="hidden" id="help-us-form">
  <button class="send-deny" id="send-help-button">Send!</button>
  <input id="input-form" type="text" placeholder="xxx" />
</div>

<div class="container" id="face-list"></div>

---

<div class="mx-auto mt-8 mb-8 md:mb-0 flex justify-center">

  <a class="px-4 py-2 mx-2 rounded-sm text-center border border-accent hover:border-accent-dark transition duration-300 ease-in-out no-underline hover:bg-accent-dark hover:text-secondary dark:hover:text-primary dark:text-primary" id="load-upload-form">
    Upload a new picture
  </a>

  <a class="px-4 py-2 mx-2 rounded-sm text-center border border-accent hover:border-accent-dark transition duration-300 ease-in-out no-underline hover:bg-accent-dark hover:text-secondary dark:hover:text-primary dark:text-primary" href="/about#contacts">
    Contact us to report any issue with the data
  </a>

</div>

<p><br></p> <!-- some space -->

<div id="upload-form-container"></div>

<script src="/js/lodash.min.js"></script>
<script src="/js/shared.js"></script>
<script src="/js/country.js"></script>
<script>
  document
    .getElementById('load-upload-form')
    .addEventListener('click', loadUploadForm);
  document
    .addEventListener('DOMContentLoaded', loadMaterial);
</script>
