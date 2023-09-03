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
* **Biometric** identification **is currently protected** by GDPR.
* We are violating GDPR as an **act of civil disobedience** to talk in advance about the incumbet threat.
### ↓ [Map of European Faces](/rbi#euromap)
### ↓ [Upload new Faces](/rbi#nocoform)
### The European Council Biometric ↓[Open Data](/rbi#opendata)
"""

type = "rbi"
+++


<section id="nocoform">

## Upload new Faces

* **Don't try to upload your "cat" picture**, as we use this open source [Face Recognition](https://github.com/ageitgey/face_recognition) library, and if the face doesn't match the expected Politician, it gets automatically deleted.
* **Pictures with more than one face** gets automatically deleted too.
* If you want to upload a politician face that is not available in our index, check which are our criteria to [pick the meaningful five](/blog/five-selected-politicians-per-country). 

</section>


<section id="opendata">

## the European Council Biometric Open Data

</section>