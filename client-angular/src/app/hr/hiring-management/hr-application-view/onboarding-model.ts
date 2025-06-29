export interface Address {
  building: string;
  street: string;
  city: string;
  state: string;
  zip: string;
}

export interface Visa {
  type: string;
  title?: string;
  startDate: string;
  endDate: string;
}

export interface Car {
  make: string;
  model: string;
  color: string;
}

export interface Reference {
  firstName: string;
  middleName?: string;
  lastName: string;
  relationship: string;
  phone: string;
  email: string;
}

export interface EmergencyContact {
  firstName: string;
  middleName?: string;
  lastName: string;
  phone: string;
  email: string;
  relationship: string;
}

export interface DriversLicense {
  number: string;
  expirationDate: string;
}

export interface OnboardingApplication {
  _id: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  preferredName: string;
  email: string;
  ssn: string;
  dob: string;
  gender: string;
  address: Address;
  cellPhone: string;
  workPhone: string;
  car?: Car;
  isCitizen: boolean;
  residencyType?: string;
  visa?: Visa;
  hasLicense?: boolean;
  driversLicense?: DriversLicense;
  reference?: Reference;
  emergencyContacts?: EmergencyContact[];
  onboardingStatus: 'Pending' | 'Approved' | 'Rejected';
  hrFeedback?: string;
  documents: { name: string; url: string }[];
}