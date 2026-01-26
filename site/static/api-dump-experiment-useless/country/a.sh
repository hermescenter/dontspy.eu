#!/bin/sh

x="Austria Belgium Bulgaria Croatia Cyprus Czechia Denmark Estonia Finland France Germany Greece Hungary Ireland Italy Latvia Lithuania Luxembourg Malta Netherlands Poland Portugal Romania Slovakia Slovenia Spain Sweden"

for i in $x; do wget "https://dontspy.hermescenter.org/api/individuals/%7B%22Country%22:%22$i%22%7D"; done
