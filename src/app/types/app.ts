export interface Location {
    locationId?: number | null;
  }
  
  export interface PublicServant {
    department?: string | null;
    position?: string | null;
  }
  export type IdType = string | number;
  export interface User {
    userId?: IdType;
    fullName?: string | null;
    email?: string | null;
    password ?: string | null;
    nationalId?: string | null;
    userType?: string | null; // Ensures valid user types
    location?: Location | null;
    publicServant?: PublicServant | null; // Optional, as it's only applicable for public servants
  }
  