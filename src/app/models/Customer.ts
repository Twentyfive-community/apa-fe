export class Customer{
  id: string;// Unique identifier for the customer
  idKeycloak: string;
  firstName: string;         // First name of the customer
  lastName: string;          // Last name of the customer
  email: string;             // Email address of the customer
  phoneNumber: string;       // Phone number of the customer
  role: string;              // Customer role
  note: string;
  enabled: boolean;
}

export class CustomerDetails{
  id: string                // Unique identifier for the customer
  idKeycloak: string
  firstName: string         // First name of the customer
  lastName: string          // Last name of the customer
  email: string             // Email address of the customer
  note: string              // Note
  phoneNumber: string       // Phone number of the customer
  activeOrdersCount: string           // Number of orders the customer has made
  completedOrdersCount: string           // Number of orders the customer has made
  totalSpent: string

}
