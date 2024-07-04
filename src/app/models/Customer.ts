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

  private static roleTranslationMap: { [key: string]: string } = {
    'admin': 'Amministratore',
    'baker': 'Pasticcere',
    'customer': 'Cliente'
  };
  constructor(id: string = '',
              idKeycloak: string = '',
              firstName: string = '',
              lastName: string = '',
              email: string = '',
              phoneNumber: string = '',
              role: string = '',
              note: string = '',
              enabled: boolean = true) {
    this.id = id;
    this.idKeycloak = idKeycloak;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.phoneNumber = phoneNumber;
    this.role = Customer.roleTranslationMap[role] || role;
    this.note = note;
    this.enabled = enabled;
  }
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
