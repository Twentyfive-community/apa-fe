import {Component, OnInit} from '@angular/core';
import {CompletedorderService} from "../../../../services/completedorder.service";
import {ButtonTheme} from "twentyfive-style";
import {Order, OrderDetails} from "../../../../models/Order";
import {ToastrService} from "ngx-toastr";
import {TwentyfiveModalService} from "twentyfive-modal";
import {RxStompServiceService} from "../../../../services/rxstomp/rx-stomp-service.service";
import {Subscription} from "rxjs";

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

  sortColumn: string = '';
  sortDirection: string = '';

  headers: any[] = [
    {name: 'ID', value: 'id', sortable: false},
    {name: 'Cognome', value: 'lastName', sortable: true},
    {name: 'Nome', value: 'firstName', sortable: true},
    {name: 'Data Ritiro', value: 'formattedPickupDate', sortable: true},
    {name: 'Prezzo', value: 'price', sortable: true},
    {name: 'Status', value: 'status', sortable: true}
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
        return myRow.status === 'ANNULLATO' && this.isCurrentDateBefore(myRow.pickupDate);
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
  now: string;

  constructor(private toastrService: ToastrService,
              private modalService: TwentyfiveModalService,
              private completedOrderService: CompletedorderService) {
  }

  ngOnInit() {
    this.getAll();
  }

  getAll(page?: number) {
    this.completedOrderService.getAll(page ? page : 0 , this.pageSize, this.sortColumn, this.sortDirection).subscribe((res: any) => {
      this.data = res.content
      this.collectionSize = res.totalElements;
    })
  }

  getOrderDetails($event: any){
    let orderId = $event.id
    this.completedOrderService.getOrderDetails(orderId).subscribe((res: any) => {
      this.orderDetails = res
      console.log(this.orderDetails);
    })
  }

  restoreOrder(id: string) {
    this.completedOrderService.restoreOrder(id).subscribe({
      error: () => {
        this.toastrService.error("Impossibile riattivare l'ordine!")
      },
      complete: () => {
        this.toastrService.success("Ordine Riattivato!")
        this.getAll();
      }
    })

  }

  sortingColumn(event: any) {
    this.sortColumn = event.sortColumn;
    this.sortDirection = event.sortDirection;

    this.getAll(this.currentPage-1)
  }

  changePage(event: number) {
    this.currentPage = event;
    this.getAll(this.currentPage-1);
  }

  selectSize(event: any) {
    this.pageSize = event;
    this.getAll();
  }


  openImage(url: string) {
    window.open(url, '_blank');
  }

  isCurrentDateBefore(dateString:string){
    const currentDate = new Date();
    const comparisonDate = new Date(dateString);
    return currentDate < comparisonDate;
  }

  protected readonly ButtonTheme = ButtonTheme;
}
