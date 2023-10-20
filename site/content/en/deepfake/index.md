+++
type = "deepfake"
+++

<link rel="stylesheet" href="/css/deepfake.css">

<p id="description-container"></p>
<img
    id="img-container"
    src="/img/image-placeholder-500-500.jpg"
    alt="Deepfakes of Politicians" />


#### Deepfakes work thanks to face biometry authentication – a type of AI software «that uses the face/head of an individual via their facial  biometric pattern to verify their identity by collecting the unique biometric data associated with their face and expression» (definition by Innovatrics).

#### The data obtained by the same type of software can be distorted to produce false images/videos matching those of a non-consenting individual, potentially resulting in harmful real-life consequences for that person.

#### The EU currently has the power to forbid the use of face biometry in the AI Act. To know more on how the AI Act can prevent the spread of deepfakes, you can read [this informative piece](/blog/why-deepfake) we’ve prepared – with some input from ChatGPT. Or, you can also

<div style="text-align:center">
  <button>
    <a id="clickable" onclick="renderNocodb()" >Upload a deepfake of your fave Minister!</a>
  </button>
</div>


<div id="upload-rules-description" style="display:none">

<br>

# What is a deepfake?

Deepfake is a term – a _blend word_, to be specific – that identifies **digitally altered content** (images, videos, audio recordings).

“Deep” stands for **deep (machine) learning** and “fake”… well, we all know what that means.

Deepfakes usually consist of **hyper-realistic representations** of people we’ll never get to meet in our everyday life, as they are the result of AI attaching, “gluing” together somebody’s face to somebody else’s body.

<br>

# A viral trend

Faces are often chosen among **politicians or celebrities,** so that it’s easier for their deepfakes to get recognized online and eventually become viral.

Remember **Keanu Reeves** dancing in the total comfort of his home? Well, that wasn’t the Matrix’s star, but his deepfake alias, uploaded on Tik Tok by **Metaphysic.ai** co-founder Miles Fischer.

The “fun” part is when Internet users realize that they’ve been looking all the time at a fake version of their favorite movie star doing things he/she may have **no intention to do** in real life. 

<br>

# What’s wrong with deepfakes?

So yeah, deepfakes can be pretty cool. But it’s not all sunshine and rainbows when we look at the **privacy aspect.** Let’s see how.

Deepfakes-generating software is the same software used to carry out **surveillance** activity.

That’s because the **source code** that extracts and processes biometric data can be used in multiple ways – including for surveillance purpose.

Its unrestrained diffusion, with no regulation in place, can create a bunch of problems, among which massive **disinformation** and **personal damage.**

Imagine if the company that just hired you came across a deepfake of yourself shaking hands or hanging out with the CEO of their **major competitor.** How could they react? Your **career** would be at stake, event though every piece of context in the picture was fake (except for your face).

<br>

---

## Upload new Deepfakes

* Don't try to upload your "cat" picture, as we use this [open source face recognition library](//github.com/ageitgey/face_recognition), and if the face doesn't match the expected politician, it will be automatically deleted.
* **Pictures with more than one face** will also be automatically deleted.
* If you want to upload a politician's face that is not available in our index, check what our criteria are to [pick the five most meaningful](/blog/five-meaningful-figures/) ones.


</div>

<br>
<br>
<br>

<div id="upload-form-container"></div>


<!-- page dependent scripts -->

<script src="/js/lodash.min.js"></script>
<script src="/js/shared.js"></script>
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

  document.getElementById('upload-form-container').style.display = 'block';
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
