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
* **Biometric identification** is currently protected by GDPR.
* We are violating GDPR as an **act of civil disobedience** to speak out in advance about the imminent threat.
* We don't encourage anyone to repeat this action outside of this campaign. **If you submit pictures to us, we protect your anonymity**.

### ↓ [Map of European Faces](/rbi#euromap)
### ↓ [Upload new Faces](/rbi#nocoform)
### The European Council Biometric ↓[Open Data](/rbi#opendata)
"""

type = "rbi"
+++


<section id="nocoform">

## Upload new Faces

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

<section id="opendata">

## the European Council Biometric Open Data

</section>
