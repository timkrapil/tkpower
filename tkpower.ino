// EmonLibrary examples openenergymonitor.org, Licence GNU GPL V3

#include "EmonLib.h"                   // Include Emon Library
EnergyMonitor emon1;                   // Create an instance
EnergyMonitor emon0;

void setup()
{
  Serial.begin(9600);

  emon1.current(1, 90.91);             // Current: input pin, calibration.
  emon0.current(0, 90.91);
}

void loop()
{
  double Irms1 = emon1.calcIrms(5920);  // Calculate Irms only
  double Irms0 = emon0.calcIrms(5920);
  Serial.print ("pin1 ");
  Serial.print(Irms1*122.0);         // Apparent power
  Serial.print(" ");
  Serial.print(Irms1);
  Serial.print(" ");
  Serial.print("pin0 ");
  Serial.print(Irms0*122.0);         // Apparent power
  Serial.print(" ");
  Serial.print(Irms0);
  Serial.print(" ");
  Serial.print((Irms0*122.0)+(Irms1*122.0));
  Serial.print(" ");
  Serial.println(Irms0+Irms1);
  
 

}
