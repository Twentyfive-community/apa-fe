import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {ButtonSizeTheme, ButtonTheme, TableHeadTheme, TableTheme} from 'twentyfive-style';
import {OrderService} from "../../../../services/order.service";
import {Order, OrderDetails} from "../../../../models/Order";
import {ToastrService} from "ngx-toastr";
import {ActivatedRoute, Router} from "@angular/router";
import {TwentyfiveModalService} from "twentyfive-modal";

@Component({
  selector: 'app-order',
  templateUrl: './order-list.component.html',
  styleUrl: './order-list.component.scss'
})
export class OrderListComponent implements OnInit{

  @ViewChild('templateRef', { static: true }) templateRef!: TemplateRef<any>;

  dataDetails: any[] = [new OrderDetails()]
  orderDetails: OrderDetails = new OrderDetails();

  currentPage: number = 0;
  pageSize: number = 5
  maxSize: number = 5;
  collectionSize: number = 0;

  sortColumn: string = '';
  sortDirection: string = '';

  headers: any[] = [
    {name: 'ID', value: 'id', sortable: true},
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

  tableActions: any[] = [
    {
      icon: 'bi bi-pencil-square',
      action: async (myRow: any) => {
        this.router.navigate(['/dashboard/modifica-ordine/', myRow.id], {relativeTo: this.activatedRouteRoute});
      },
      actionName: 'Modifica',
      tooltipText: 'Modifica',
      placement: 'top',
      showFunction: () => {
        return true;
      }
    },
    {
      icon: 'bi bi-printer-fill',
      action: async (myRow: any) => {
        this.toastrService.info("FUNZIONE STAMPA DA AGGIUNGERE")
      },
      actionName: 'Stampa',
      tooltipText: 'Stampa Ordine',
      placement: 'top',
      showFunction: () => {
        return true;
      }
    },
    {
      icon: 'bi bi-check2',
      action: async (myRow: any) => {
        this.modalService.openModal(
          'Vuoi segnare questo ordine come Completato?',
          'Completa Ordine',
          'Annulla',
          'Conferma',
          {
            showIcon: true,
            size: 'md',
            onConfirm: (() => {
              this.completeOrder(myRow.id)
            })
          });
      },
      actionName: 'Completato',
      tooltipText: 'Completa Ordine',
      placement: 'top',
      showFunction: () => {
        return true;
      }
    },
    {
      icon: 'bi bi-x',
      action: async (myRow: any) => {
        this.modalService.openModal(
          'Sei sicuro di voler anullare questo ordine?',
          'Annulla Ordine',
          'Annulla',
          'Conferma',
          {
            showIcon: true,
            size: 'md',
            onConfirm: (() => {
              this.cancelOrder(myRow.id)
            })
          });
      },
      actionName: 'Annulla',
      tooltipText: 'Annulla Ordine',
      placement: 'top',
      showFunction: () => {
        return true;
      }
    },
  ]

  constructor( private router: Router,
               private orderService: OrderService,
               private toastrService: ToastrService,
               private activatedRouteRoute: ActivatedRoute,
               private modalService: TwentyfiveModalService,
             ) {
  }


  ngOnInit(): void {
    this.getAll();
  }

  getAll(page?: number) {
    this.orderService.getAll(page ? page : 0 , this.pageSize, this.sortColumn, this.sortDirection).subscribe((res: any) => {
      this.data = res.content;
      this.collectionSize = res.totalElements;
    })
  }

  getOrderDetails($event:any){
    let orderId = $event.id
    this.orderService.getOrderDetails(orderId).subscribe((res: any) => {
      this.orderDetails = res
    })
  }

  completeOrder(id: string) {
    this.orderService.completeOrder(id).subscribe({
      next: () => {
        this.toastrService.success('Ordine completato');
      },
      error: (err) => {
        const errorMessage = err.message;
        this.toastrService.error(errorMessage);
      },
      complete: () => {
        this.getAll();
      }
    });
  }

  cancelOrder(id: string) {
    this.orderService.cancelOrder(id).subscribe({
      next: () => {
        this.toastrService.success('Ordine annullato con successo');
      },
      error: (err) => {
        const errorMessage = err.message;
        this.toastrService.error(errorMessage);
      },
      complete: () => {
        this.getAll();
      }
    });
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
    this.getAll(this.currentPage-1);
  }

  protected readonly ButtonTheme = ButtonTheme;
  protected readonly ButtonSizeTheme = ButtonSizeTheme;
}
