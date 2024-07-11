import { Component } from '@angular/core';
import {Customer} from "../../../../models/Customer";
import {CustomerService} from "../../../../services/customer.service";
import {ActivatedRoute, Router} from "@angular/router";
import {TwentyfiveModalService} from "twentyfive-modal";
import {ToastrService} from "ngx-toastr";
import {ButtonSizeTheme, ButtonTheme } from 'twentyfive-style';
import {SettingService} from "../../../../services/setting.service";

@Component({
  selector: 'app-employee-edit',
  templateUrl: './employee-edit.component.html',
  styleUrl: './employee-edit.component.scss'
})
export class EmployeeEditComponent {

  originalEmployee: Customer = new Customer()
  employee: Customer = new Customer()
  employeeId: string | null;
  roles: string[] = []
  selectedRole: string;

  private roleTranslations: { [key: string]: string } = {
    'baker': 'Pasticcere'
  };

  constructor(private customerService: CustomerService,
              private settingService: SettingService,
              private router: Router,
              private toastrService: ToastrService,
              private activatedRouteRoute: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.employeeId=this.activatedRouteRoute.snapshot.paramMap.get('id');
    this.getEmployee();
    this.getRoles()
  }
  getEmployee(){
    if(this.employeeId!=null){
      this.customerService.getCustomerDetails(this.employeeId).subscribe( (res:any) =>{
        this.employee = res
        this.originalEmployee = { ...this.employee };
        this.selectedRole = this.roleTranslations[this.employee.role] || this.employee.role;
      })
    }
  }

  getRoles() {
    this.settingService.getAllRoles().subscribe((res: any) => {
      this.roles = res.map((role: string) => this.roleTranslations[role] || role);
    })
  }

  onInputChange(event: any, type: string) {
    switch (type) {
      case 'name':
        this.employee.firstName = event.target.value;
        break;
      case 'surname':
        this.employee.lastName = event.target.value;
        break;
      case 'email':
        this.employee.email = event.target.value;
        break;
      case 'phoneNumber':
        this.employee.phoneNumber = event.target.value;
        break;
    }
  }

  selectRole(role: string) {
    this.selectedRole = role;
    this.employee.role = Object.keys(this.roleTranslations).find(key => this.roleTranslations[key] === this.selectedRole) || this.selectedRole;
  }

  saveEmployee() {
    if (this.isValid()){
      this.customerService.saveCustomer(this.employee).subscribe({
        error:(error) =>{
          console.error(error);
          this.toastrService.error("Errore nel salvataggio del dipendente!");
        },
        complete:() =>{
          this.toastrService.success("Dipendente salvato con successo!");
          this.router.navigate(['../dashboard/dipendenti']);
        }
      });
    }
  }

  private isValid() {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const phoneNumberRegex = /^\+?[1-9]\d{1,14}$/;

    if (!this.employee.firstName) {
      this.toastrService.error("Inserire un nome per il cliente!");
      return false;
    }
    if (!this.employee.lastName) {
      this.toastrService.error("Inserire un cognome per il cliente!");
      return false;
    }
    if (!this.employee.email) {
      this.toastrService.error("Inserire un email per il cliente!");
      return false;
    } else if (!emailRegex.test(this.employee.email)) {
      this.toastrService.error("Inserire un email valida per il cliente!");
      return false;
    }
    if (!this.employee.phoneNumber) {
      this.toastrService.error("Inserire un numero di telefono per il cliente!");
      return false;
    } else if (!phoneNumberRegex.test(this.employee.phoneNumber)) {
      this.toastrService.error("Inserire un numero di telefono valido per il cliente!");
      return false;
    } else if (!this.employee.role) {
      this.toastrService.error("Selezionare ruolo del dipendente");
      return false;
    }
    return true;
  }


  close() {
    // this.navigationType="back"
    this.router.navigate(['../dashboard/dipendenti']);
  }

  protected readonly ButtonTheme = ButtonTheme;
  protected readonly ButtonSizeTheme = ButtonSizeTheme;
}
