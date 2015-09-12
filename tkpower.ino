// EmonLibrary examples openenergymonitor.org, Licence GNU GPL V3

#include "EmonLib.h"                   // Include Emon Library
EnergyMonitor emon1;                   // Create an instance
EnergyMonitor emon0; 

void setup()
{  
  Serial.begin(9600);
  
  emon1.current(1, 100);             // Current: input pin, calibration.
  emon0.current(0, 100); 
}

void loop()
{
  double Irms1 = emon1.calcIrms(7680);  // Calculate Irms only
  
  Serial.println("pin1");
  Serial.print(Irms1*122.0);         // Apparent power
  Serial.print(" ");
  Serial.println(Irms1);           // Irms
  double Irms0 = emon0.calcIrms(7680);
  Serial.println("pin0");
  Serial.print(Irms0*122.0);         // Apparent power
  Serial.print(" ");
  Serial.println(Irms0);           // Irms

  
}
