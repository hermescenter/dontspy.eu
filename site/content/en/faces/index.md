+++

# Nota per Alessandra, possiamo mettere titoli
# E Sottotitoli a questa cosa
show_title = "false"
title = "Face Recognition or Remote Biometric Identification"

# In homepage c'è solo un titolo, e con l'uso del
# show_[title|subtitle] possiamo controllare se
# farlo apparire o no
show_subtitle = "false"
subtitle = "subtitle"

# Questo appare prima di ogni mappa, in questo file
# che è nel folder '/rbi' stiamo definendo la pagina
# Specializzata. Mentre in homepage questo blocco
# non c'è.
before_map = """
### ↓ [Map of European Politicians' Faces](/faces#euromap)
### ↓ [Why simulating RBI](/faces#why-simulating-rbi)
### ↓ [Upload new Faces](/faces#nocoform)
### ↓ [The Registered Politicians](/faces#database)
"""

type = "rbi"
+++

<br>
<br>

# Scanning politicians' faces – EU interactive map

European politicians' faces, along with their personal information and **_AI-determined_ age/gender/emotional state**, will be displayed after you **browse** our interactive map, **select** a country and **click** on it. To upload new faces, follow the **instructions [at the bottom of this page](/faces#upload-new-faces)**.

<br>

<section id="why-simulating-rbi">

# Why simulating RBI?

Ready to see what **RBI (Remote Biometric Identification)** would do, if ever applied to your country’s politicians’ faces?

We picked some of the **most prominent political figures** in all EU Member States (up to 5 ministers/national representatives), and ran an open-source **RBI face recognition algorithm** on them.

Why? Because many of them are currently involved in the EU **Artificial Intelligence Act’s** negotiations (_trialogues_) and their vote could drastically alter the course of how AI is regulated and used.

Now more than ever, it's crucial that they understand the **harms and implications** of RBI technology.

<br>

# What's wrong with RBI?

An RBI-free Europe is still a mirage, since the proposed version of the AI Act **fails to call** for a **comprehensive ban** on biometry. Indeed, invasive **AI policing** is admitted, which undermines the citizens’ right to **privacy** and could lead to **discrimination** and abuse of power.

**Migrants** at the EU border also run the risk of being discriminated against/wrongfully detained by **border agencies** and authorities, since the AI Act does not explicitly prohibit biometric surveillance in those instances.

Let’s make pro-RBI legislators **change their mind** on AI surveillance.

Before proceeding, please **make sure you read our “[About](/about)” section** detailing Don’t Spy EU’s main scope and motives.

<br>

# ⚠ Keep in mind that...

* Although biometric recognition is currently banned in **some EU Member States** (Italy being one of them), a total ban at the European level has not been considered yet. The **General Data Protection Regulation (GDPR)** does exist, but can only regulate isolated cases, resulting in limited range of action (see the [Clearview case](https://edpb.europa.eu/news/national-news/2022/facial-recognition-italian-sa-fines-clearview-ai-eur-20-million_en));

* Wait, so… If RBI IS to be banned, are we some sort of _criminals_? Well, technically speaking, ours is an act of **civil disobedience**. Through this simulation, we want to make sure our voice is heard – loud and clear, as all citizens are facing an imminent threat and Europeans’ **digital future** looks scary.

* **We do not encourage anyone** to repeat this action outside of this campaign. Please keep in mind that if you decide to submit any data or images **we’ll protect your anonymity**. Always.

</section>



---

<section id="nocoform">

<br>

# Upload new Faces

We can only accept pictures with faces that belong to politicians already registered in our database.

* Here's the [open source face recognition library](//github.com/ageitgey/face_recognition) we use. If the face in the picture you upload doesn't match the expected politician, it will be automatically deleted.

* **Pictures with more than one face** will also be automatically deleted.

* If you want to upload the face of a politician who happens to be **missing** from our index, check out our [criteria](/blog/five-meaningful-figures/).

* Only trusted individuals with a private link can insert a politician in our index. **🙏 [Reach out to us](/about#contacts) 🙏 if you think you can be that person**.

</section>
<br>

<!-- this block is a button that is replaced with NocoDB -->
<style>
  #clickable {
    color: black;
    background-color: #ffff01;
    padding: 1em;
    border-radius: 20px;
    border: 1px solid red;
    text-decoration-line: none;
  }
  #clickable:hover {
    cursor: pointer;
    border: 3px solid red;
  }
</style>
<div style="text-align:center">
  <button>
    <a id="clickable" onclick="renderNocodb()" >Open the upload form</a>
  </button>
</div>
<div id="upload-form-container"></div>


<br>
<section id="database">

# _Don't Spy EU_ – Database

Below are all the European politicians' faces & info we've managed to collect and insert in our database. Each country can feature a maximum of **five politicians**, but you'll notice some countries only have 1 or 2 politicians.

You can help us build a more complete database, if you want. We are looking for the following roles: **Prime Minister, AI Act Gov. Representative, Justice Minister, Interior Minister and Defense Minister**. To add new politicians, keep scrolling.

</section>

<br>
<br>

<link rel="stylesheet" href="/css/figures.css">
<div class="grid-container" id="figures--list"></div>
<script src="/js/lodash.min.js"></script>
<script src="/js/figures.js"></script>

<script>
  document.addEventListener('DOMContentLoaded', loadPoliticalFigures);

  const starting = _.sample(['Sadness', 'Digusted', 'Angry', 'Fearful'])
  selectButtonByText(starting);
</script>
