+++
type = 'country'
+++

<link rel="stylesheet" href="/css/country.css">

Since we’re targeting the European Council, we picked [5 prominent political roles per Member State](/blog/five-meaningful-figures/), and this page is about:

# <span class="policymaker-name"></span> <span class="policymaker-role"></span> of <span class="country-flag"></span> <a href="" class="country-link"><span class="country-name"></span></a>

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
<script src="/js/policymaker.js"></script>
<script>
  document
    .getElementById('load-upload-form')
    .addEventListener('click', loadUploadForm);
  document
    .addEventListener('DOMContentLoaded', loadIndividual);
</script>
