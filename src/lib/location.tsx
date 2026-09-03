import { createContext, useContext, useState } from "react";
import { deliveryLocations } from "./data";

type LocationContextValue = {
  location: string;
  setLocation: (value: string) => void;
  options: string[];
};

const LocationContext = createContext<LocationContextValue | null>(null);

export function LocationProvider({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useState<string>(
    deliveryLocations[0] ?? "KCA University, Nairobi",
  );
  return (
    <LocationContext.Provider value={{ location, setLocation, options: deliveryLocations }}>
      {children}
    </LocationContext.Provider>
  );
}

export function useDeliveryLocation() {
  const ctx = useContext(LocationContext);
  if (!ctx) throw new Error("useDeliveryLocation must be used inside LocationProvider");
  return ctx;
}
