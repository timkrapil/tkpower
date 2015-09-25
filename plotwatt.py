import sys
args = sys.argv[1:]

from plotwattapi import Plotwatt

HOUSE_ID = XXXXXX
API_KEY = "XXXXXXXXXXXXXXXXXXXX"
pw = Plotwatt(HOUSE_ID, API_KEY)

import datetime

now = new datetime.now()
seconds = datetime.timedelta(seconds=1)
pw.push_readings(
  args[0],
  [(args[1])],
  [(args[2])]
)
