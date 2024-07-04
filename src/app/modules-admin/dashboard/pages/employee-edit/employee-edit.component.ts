import { Component } from '@angular/core';
import {Customer} from "../../../../models/Customer";
import {CustomerService} from "../../../../services/customer.service";
import {ActivatedRoute, Router} from "@angular/router";
import {TwentyfiveModalService} from "twentyfive-modal";
import {ToastrService} from "ngx-toastr";
import {ButtonSizeTheme, ButtonTheme } from 'twentyfive-style';

@Component({
  selector: 'app-employee-edit',
  templateUrl: './employee-edit.component.html',
  styleUrl: './employee-edit.component.scss'
})
export class EmployeeEditComponent {

  originalEmployee: Customer = new Customer()
  employee: Customer = new Customer()
  employeeId: string | null;

  constructor(private customerService: CustomerService,
              private router: Router,
              private modalService: TwentyfiveModalService,
              private toastrService: ToastrService,
              private activatedRouteRoute: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.employeeId=this.activatedRouteRoute.snapshot.paramMap.get('id');
    this.getEmployee();
  }

  //ToDo: non arriva role da res
  getEmployee(){
    if(this.employeeId!=null){
      this.customerService.getCustomerDetails(this.employeeId).subscribe( (res:any) =>{
        console.log(res)
        this.employee = new Customer(
          res.id,
          res.idKeycloak,
          res.firstName,
          res.lastName,
          res.email,
          res.phoneNumber,
          res.role,
          res.note,
          res.enabled
        );
        this.originalEmployee = { ...this.employee };

        console.log(this.employee);
        console.log(this.originalEmployee)
      })
    }
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
      case 'note':
        this.employee.note = event.target.value;
        break;
    }
  }

  saveEmployee() {

  }

  close() {
    // this.navigationType="back"
    this.router.navigate(['../dashboard/dipendenti']);
  }

  protected readonly ButtonTheme = ButtonTheme;
  protected readonly ButtonSizeTheme = ButtonSizeTheme;
}
