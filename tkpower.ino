// EmonLibrary examples openenergymonitor.org, Licence GNU GPL V3

#include "EmonLib.h"                   // Include Emon Library
EnergyMonitor emon1;                   // Create an instance
EnergyMonitor emon0;

void setup()
{
  Serial.begin(9600);

  emon1.current(1, 19.5);             // Current: input pin, calibration.
  emon0.current(0, 19.5);
}

void loop()
{
  double Irms1 = emon1.calcIrms(3410);  // Calculate Irms only
  double Irms0 = emon0.calcIrms(3410);
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
