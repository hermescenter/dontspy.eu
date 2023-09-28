+++
type = "deepfake"
+++

<style>
#clickable {
    color: black;
    background-color: #ffff01;
    padding: 1em;
    border-radius: 20px;
    border: 1px solid red;
}
</style>

# Deepfakes work because Face Biometry derives unique facial features. The same data points can be abused to produce false image matching that of a non consenting subject.

<div id="carousel-1" class="deep-fake-carousel"></div>

<link rel="stylesheet" href="/css/deepfake.css">

---

<div class="carousel">
    <div class="carousel-item">
        <img class="carousel--image" src="" alt="">
        <span class="info">
            <span class="official">Official Role</span>
            <span class="country">Country</span>
            <p class="description"></p>
        </span>
    </div>
</div>

---

# The EU can forbid the use of Face Biometry in the AI Act. This would limit the use of these technologies in the EU market by policy.

<button>
    <a id="clickable" onclick="renderNocodb()" >Upload a deepfake of your Minister today!</a>
</button>

# It is the way to get their attention!

---

# And what if RBI is allowed in the AIAct? Deepfakes would help us as the last defense against massive internet surveillance … by “polluting” our profiles with false images!

Know more with the infographic below, or read [How Deepfake works and how bad is the problem](/todo1), and [How the European Union can influence the world of surveillance](/todo2).

![](/img/deepfake_infographic.jpeg)

---

## Upload new Deepfakes

* Don't try to upload your "cat" picture, as we use this [open source face recognition library](//github.com/ageitgey/face_recognition), and if the face doesn't match the expected politician, it will be automatically deleted.
* **Pictures with more than one face** will also be automatically deleted.
* If you want to upload a politician's face that is not available in our index, check what our criteria are to [pick the five most meaningful](/blog/five-meaningful-figures/) ones.


<p><br></p> <!-- some space -->

<div id="upload-form-container"></div>


<!-- page dependent scripts -->

<script src="/js/lodash.min.js"></script>
<script src="/js/carousel.js"></script>

<script>
function renderNocodb() {

  const iframe = document.createElement('iframe');
  iframe.src = 'https://db.dontspy.eu/dashboard/#/nc/form/c3b84882-e7b4-4839-a4ff-71661a59b2f7?embed';
  iframe.width = '100%';
  iframe.height = '1000';
  iframe.frameborder = "0";
  iframe.classList.add("nc-embed");
  iframe.style.background = "transparent";
  const destinationElement = document.getElementById('upload-form-container');
  destinationElement.appendChild(iframe);

  document.getElementById('upload-form-container').scrollIntoView({
    behavior: 'smooth', // Opzionale: rende lo scorrimento animato
    block: 'start' // Imposta il punto di ancoraggio in alto
  });

  const button = document.getElementById('clickable');
  button.remove();
}

document.addEventListener('DOMContentLoaded', loadCarousel);

</script>

<!-- commented below -->
<!--
* i Deepfake sono possibili perchè prima viene estratta l'impronta biometrica facciale dalla vittima, e poi questa viene incollata in un nuovo corpo (che agisce come un contenitore). Il problema è che spesso questo non succede perchè la persona ha voluto o ha acconsentito, per questo ci riferiamo a loro come vittima.
* Il riconoscimento biometrico dovrebbe essere bannato, perchè a parte il chiaro possibile abuso nel campo della sorveglianza, è anche abilitate e necessaria per la creazione di deepfake. E' infatti l'utilizzo di codice che estrae e tratta feature biometriche parte del problema\*, è la sua diffusione avulsa dall'analisi del rischio ad aver creato questa situazione.
* Se l'RBI (Identificazione Biometrica Remota) diventa legittima, questo include anche l'accesso a banche dati digitali. Sistemi come Clearview or PimEyes, citati esempi nell'infografica sottostanti, agiscono sulla base di questa possibilità. Una soluzione avversariale, ma alla portata di tutti a quel punto, sarebbe quella di inquinare i portali fotografici con foto false, in modo da far si che il business di profilazione facciale venga danneggiato al punto di non rendere questi prodotti affidabili sul mercato. Sarebbe un caso limite che speriamo di non dover raggiungere, ma stiamo provando tool e spiegazioni che vadano a giustificare questa azione.
* i deepfake sono, a buona ragione, associate a delle pratiche nocive di disinformazione e di aggressione alle vittime di questi prodotti. Noi fermamente condanniamo questi abusi, e per questo prendiamo come ipotetiche vittime cinque delle persone più potenti, difese, e responsabili per questo, affinchè sollevare il problema senza nuocere effettivamente a queste persone.
* **Deepfake is possible because a facial fingerprint is extracted from the victim** and then pasted onto a new host. The problem is when the victim does not consent and is unaware.
* **Facial fingerprinting should be banned** because, besides the abuse of targeted surveillance, it enables the production of deepfakes, or more abstractly, the production of other quasi-realistic human features[*](/deepfake#not-just-faces).
* **If RBI is allowed to exist, the only solution would be to pollute the Internet with fake faces**, as explained in the infographic below. We hope society never gets to that point!
* Deepfakes are often associated with unfair practices. They also pose a serious problem in the information ecosystem, as fact-checking is an after-the-fact action, and falsehoods are easily spread. **We firmly condemn such abuses**.

<section id="not-just-faces">

`*` In this regard, we can assume that any human characteristic that can be used to identify a person by digital or natural means should be equally protected. Tools that produce a subject's voice are used to defraud their families and colleagues. A comprehensive AIAct should see these highly personal and persistent characteristics as those that can only be used strictly under the consent and control of the data subject.

# Italiano

`*` In astratto è possibile assumere che ogni caratteristica umana, legata indissolubilmente all'individuo (il volto, la voce) vada distinta da altri dati personali identificativi e vada protetta quanto l'impronta facciale. Del resto ci sono già in circolazione strumenti che permettono l'emulazione di queste caratteristiche e sono utilizzati per produrre frodi. Un AIAct che consideri queste tendenze e tuteli dall'estrazione, il processo, e la riproduzione di queste feature identificativi, sarebbe in grado di catturare l'essenza del problema.
</section>
-->
