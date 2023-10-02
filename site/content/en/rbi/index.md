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

<section id="why-simulating-rbi">

# Why simulating RBI?

Ready to see what RBI (Remote Biometric Identification) would do, if ever applied to your country’s politicians’ faces?

Yes, we picked some of the most prominent political figures in all EU Member States (up to 5 ministers/national representatives), and ran an open-source RBI face recognition algorithm on them.

Why? Because many of them are currently involved in the EU Artificial Intelligence Act’s negotiations (“trialogues”) and their vote could drastically alter the course of how AI is regulated and used.

# How so?

A RBI-free Europe is still a mirage, since the proposed version of the AI Act fails to call for a comprehensive ban on biometrics. In fact, invasive AI policing is admitted, which undermines the citizens’ right to privacy and could lead to discrimination and abuse of power.

Migrants at the EU border also run the risk of being discriminated against/wrongfully detained by border agencies and authorities, because the Act does not explicitly prohibit biometric surveillance in those instances.

Let’s make legislators change their mind on AI surveillance. Before proceeding, please make sure you read our “[About](/about)” section detailing Don’t Spy EU’s main scope and motives.

# ⚠ Keep in mind that

* Biometric identification is currently banned as per the General Data Protection Regulation (GDPR);
* Wait, so… Are we some sort of “criminals”? Well, technically speaking, ours is an act of civil disobedience. We want to make sure our voice is heard – loud and clear, as all citizens are facing an imminent threat and Europeans’ digital future looks pretty scary.
* We do not encourage anyone to repeat this action outside of this campaign. Please keep in mind that if you decide to submit any data or image we’ll protect your anonymity. Always.

# Who do we have so far?

We can only accept pictures with faces that belong to the political figure. There is a process of "initial setup" where trusted individual with a non public link can register a political person. **🙏 [Reach out to us](/about#contacts) 🙏 if you think you can be that person**. Currently we have available these politician registered:

<style>
  .grid-container {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem; /* spazio tra gli elementi */
  }

  .grid-item {
    flex: 1 1 calc(33.333% - 1rem); /* larghezza di base per 3 elementi per riga */
    box-sizing: border-box;
    padding: 0.5rem;

    transition: transform 400ms, box-shadow 400ms; /* transizione di 400 ms */
    cursor: pointer; /* cursore a mano per indicare la cliccabilità */
    box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.1); /* ombra iniziale */
  }

  .grid-item:active {
    transform: scale(0.95); /* riduci leggermente la dimensione dell'elemento quando premuto */
    box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.2); /* ombra più profonda quando premuto */
  }

  .country-name {
    padding-left: 1em;
  }

  .missing {
    font-size: 0.8em;
    color: darkgrey;
  }

  .highlight {
    font-weight: bolder;
    background-color: lightpink;
    padding: 3px;
    border-radius: 3px;
  }

  /* Responsive: su schermi più piccoli, mostra 2 elementi per riga */
  @media (max-width: 768px) {
    .grid-item {
        flex: 1 1 calc(50% - 1rem);
    }
  }

/* Responsive: su dispositivi mobili, mostra 1 elemento per riga */
  @media (max-width: 480px) {
    .grid-item {
        flex: 1 1 100%;
    }
  }
</style>

<div class="grid-container" id="figures--list"></div>

</section>

---

<section id="nocoform">

# Upload new Faces

* Don't try to upload your "cat" picture, as we use this [open source face recognition library](//github.com/ageitgey/face_recognition), and if the face doesn't match the expected politician, it will be automatically deleted.
* **Pictures with more than one face** will also be automatically deleted.
* If you want to upload a politician's face that is not available in our index, check what our criteria are to [pick the five most meaningful](/blog/five-meaningful-figures/) ones.

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