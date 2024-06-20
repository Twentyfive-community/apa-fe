import {Component, OnInit} from '@angular/core';
import {TwentyfiveModalGenericComponentService} from "twentyfive-modal-generic-component";
import {ButtonSizeTheme, ButtonTheme, LabelTheme} from "twentyfive-style";
import {CompletedorderService} from "../../../../services/completedorder.service";
import {NgbDate} from "@ng-bootstrap/ng-bootstrap";
import {ToastrService} from "ngx-toastr";
import {OrderRedoReq} from "../../../../models/Order";

@Component({
  selector: 'app-order-redo',
  templateUrl: './order-redo.component.html',
  styleUrl: './order-redo.component.scss'
})
export class OrderRedoComponent implements OnInit{

  orderId: string | '';
  redoOrder: OrderRedoReq = new OrderRedoReq();
  timeslots: string[] = [
    "08:00",
    "08:30",
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "12:00",
    "12:30",
    "13:00",
    "13:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
    "17:00",
    "17:30",
    "18:00",
    "18:30",
    "19:00",
    "19:30",
    "20:00"
  ];
  note: string;
  selectedPickupDateTime: string = ''; // Variabile per la data e l'orario combinati
  ngOnInit(): void {
    this.redoOrder.id=this.orderId;
  }

  constructor(private modalService:TwentyfiveModalGenericComponentService,
              private completedOrderService: CompletedorderService,
              private toastrService: ToastrService) {
  }

  onDateChange(date: any) {
    this.redoOrder.pickupDate = date;
  }

  onTimeSelected(event: any) {
    this.redoOrder.pickupTime = event
  }

  onInputChange(event: any) {
    this.redoOrder.note=event.target.value;
  }

  save(){
    if(this.isValid()){
      this.completedOrderService.redoOrder(this.redoOrder).subscribe({
        error:(err)=>{
          console.error(err);
          this.toastrService.error("Error nel rifare l'ordine!");
        },
        complete:() =>{
          this.toastrService.success("Ordine ricreato con successo!");
        }
      }
      );
      this.close()
    } else {
      this.toastrService.error("inserire una data valida per il nuovo ordine!")
    }
  }

  close() {
    this.modalService.close();
  }
  private isValid(){
    return this.redoOrder.pickupDate && this.redoOrder.pickupTime;
  }

  protected readonly LabelTheme = LabelTheme;
  protected readonly ButtonTheme = ButtonTheme;
  protected readonly ButtonSizeTheme = ButtonSizeTheme;
}
