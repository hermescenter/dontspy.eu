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
### ↓ [Map of European Faces](/rbi#euromap)
### ↓ [Why simulating RBI](/rbi/#why-simulating-rbi)
### ↓ [Who do we have so far?](/rbi/#who-do-we-have-so-far)
### ↓ [Upload new Faces](/rbi#nocoform)
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

Let’s make legislators **change their mind** on AI surveillance.

Before proceeding, please **make sure you read our “[About](/about)” section** detailing Don’t Spy EU’s main scope and motives.

<br>

# ⚠ Keep in mind that...

* Biometric identification is currently banned as per the **General Data Protection Regulation (GDPR)**;

* Wait, so… Are we some sort of _criminals_? Well, technically speaking, ours is an act of **civil disobedience**. We want to make sure our voice is heard – loud and clear, as all citizens are facing an imminent threat and Europeans’ **digital future** looks scary.

* **We do not encourage anyone** to repeat this action outside of this campaign. Please keep in mind that if you decide to submit any data or images **we’ll protect your anonymity**. Always.

<br>

# _Don't Spy EU_ – Database

Below are all the European politicians' faces & info we've managed to collect and insert in our database. Each country can feature a maximum of **five politicians**, but you'll notice some countries only have 1 or 2 politicians.

You can help us build a more complete database, if you want. We are looking for the following roles: **Prime Minister, AI Act Gov. Representative, Justice Minister, Interior Minister and Defense Minister**. To add new politicians, keep scrolling.

<br>
<br>

<link rel="stylesheet" href="/css/figures.css">
<div class="grid-container" id="figures--list"></div>

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

<iframe class="nc-embed"
  src="https://db.dontspy.eu/dashboard/#/nc/form/bf2949c3-56f3-4574-8d44-13b90551a995?embed"
  frameborder="0"
  width="100%"
  height="1000"
  style="background: transparent"></iframe>

</section>

<script src="/js/lodash.min.js"></script>
<script src="/js/shared.js"></script>
<script src="/js/figures.js"></script>
<script>
  document.addEventListener('DOMContentLoaded', loadPoliticalFigures);
</script>
