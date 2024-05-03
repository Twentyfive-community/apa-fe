import {Component, OnInit} from '@angular/core';
import {CompletedorderService} from "../../../../services/completedorder.service";
import {ButtonTheme} from "twentyfive-style";
import {Order, OrderDetails} from "../../../../models/Order";
import {ToastrService} from "ngx-toastr";
import {TwentyfiveModalService} from "twentyfive-modal";

@Component({
  selector: 'app-completed-order',
  templateUrl: './completed-order.component.html',
  styleUrl: './completed-order.component.scss'
})
export class CompletedOrderComponent implements OnInit{

  dataDetails: any[] = [new OrderDetails()]
  orderDetails: OrderDetails = new OrderDetails();

  pageSize: number = 5
  currentPage: number = 0;
  maxSize: number = 5;
  collectionSize: number = 0;

  headers: any[] = [
    {name: 'ID', value: 'id'},
    {name: 'Cognome', value: 'lastName'},
    {name: 'Nome', value: 'firstName'},
    {name: 'Data Ritiro', value: 'pickupDate'},
    {name: 'Ora Ritiro', value: 'pickupTime'},
    {name: 'Prezzo', value: 'price'},
    {name: 'Status', value: 'status'}
  ];
  data: Order[] = []

  extras: any[] = [
    {name: 'ordine', value: 'orderDetails'},
  ]

  tableActions: any[] = [
    {
      icon: 'bi bi-arrow-counterclockwise',
      action: async (myRow: any) => {
        this.modalService.openModal(
          'Vuoi riattivare quest\'ordine?',
          'Riattiva',
          'Annulla',
          'Conferma',
          {
            showIcon: true,
            size: 'md',
            onConfirm: (() => {
              this.restoreOrder(myRow.id)
            })
          });
      },
      actionName: 'Riattiva',
      tooltipText: 'Riattiva Ordine',
      placement: 'top',
      showFunction: (myRow: any) => {
        return myRow.status === 'ANNULLATO';
      }
    },
  ]

  paginationElements: any[] = [
    {
      actionName: '5',
      value: '5'
    },
    {
      actionName: '10',
      value: '10'
    },
    {
      actionName: '25',
      value: '25'
    }
  ];

  constructor(private toastrService: ToastrService,
              private modalService: TwentyfiveModalService,
              private completedOrderService: CompletedorderService) {
  }

  ngOnInit() {
    console.log('ngOnInit() called'); // Aggiungi questo log per monitorare quando viene chiamato il metodo ngOnInit()
    this.getAll();
  }

  getAll() {
    console.log('getAll() called'); // Aggiungi questo log per monitorare quando viene chiamata la funzione getAll()
    this.completedOrderService.getAll(this.currentPage, this.pageSize).subscribe((res: any) => {
      this.data = res.content
      this.collectionSize = res.totalElements;
      console.log(this.collectionSize)
    })
  }

  getOrderDetails($event: any){
    let orderId = $event.id
    this.completedOrderService.getOrderDetails(orderId).subscribe((res: any) => {
      this.orderDetails = res
      console.log(res)
    })
  }

  restoreOrder(id: string) {
    this.completedOrderService.restoreOrder(id).subscribe({
      error: (err) => {
        this.toastrService.error("Impossibile riattivare l'ordine!")
        console.log(err)
      },
      complete: () => {
        this.toastrService.success("Ordine Riattivato!")
        this.getAll();
      }
    })

  }

  changePage(event: number) {
    this.currentPage = event - 1;
    this.getAll();
  }

  selectSize(event: any) {
    this.pageSize = event;
    this.getAll();
  }

  protected readonly ButtonTheme = ButtonTheme;
}
