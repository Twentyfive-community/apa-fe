import {AfterViewInit, Component, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {ButtonSizeTheme, ButtonTheme, TableHeadTheme, TableTheme} from 'twentyfive-style';
import {OrderService} from "../../../../services/order.service";
import {Order, OrderDetails} from "../../../../models/Order";
import {ToastrService} from "ngx-toastr";
import {ActivatedRoute, Router} from "@angular/router";
import {TwentyfiveModalService} from "twentyfive-modal";
import {RxStompServiceService} from "../../../../services/rxstomp/rx-stomp-service.service";
import {SettingService} from "../../../../services/setting.service";

@Component({
  selector: 'app-order',
  templateUrl: './order-list.component.html',
  styleUrl: './order-list.component.scss'
})
export class OrderListComponent implements OnInit, AfterViewInit, OnDestroy{

  @ViewChild('templateRef', { static: true }) templateRef!: TemplateRef<any>;
  @ViewChild('templateColumnRef', {static: true}) templateColumnRef!: TemplateRef<any>;

  dataDetails: any[] = [new OrderDetails()]
  orderDetails: OrderDetails = new OrderDetails();

  columnTemplateRefs: {[key: string]: TemplateRef<any>} = {};
  currentPage: number = 0;
  pageSize: number = 5
  maxSize: number = 5;
  collectionSize: number = 0;

  sortColumn: string = '';
  sortDirection: string = '';

  newSubscriptionText: any;
  cancelSubscriptionText: any;
  isCheckedList: boolean[] = [];
  isAlertOn: boolean;
  newOrderAudio:HTMLAudioElement;
  cancelOrderAudio:HTMLAudioElement;


  headers: any[] = [
    {name: 'ID', value: 'id', sortable: false},
    {name: 'Cognome', value: 'lastName', sortable: true},
    {name: 'Nome', value: 'firstName', sortable: true},
    {name: 'Data Ritiro', value: 'formattedPickupDate', sortable: true},
    {name: 'Prezzo', value: 'price', sortable: true},
    {name: 'Status', value: 'status', sortable: true},
    {name: 'Completo', value: 'complete'}
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
        this.downloadPdf(myRow.id)
      },
      actionName: 'Stampa',
      tooltipText: 'Stampa Ordine',
      placement: 'top',
      showFunction: () => {
        return true;
      }
    },
    {
      icon: 'bi bi-x',
      action: async (myRow: any) => {
        this.modalService.openModal(
          'Sei sicuro di voler annullare questo ordine?',
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
    }
  ]

  constructor( private router: Router,
               private orderService: OrderService,
               private toastrService: ToastrService,
               private activatedRouteRoute: ActivatedRoute,
               private modalService: TwentyfiveModalService,
               private rxStompService: RxStompServiceService,
               private toastr: ToastrService,
               private settingService: SettingService
             ) {
    this.newOrderAudio = new Audio();
    this.newOrderAudio.src = 'assets/sounds/order-arrived.mp3';
    this.cancelOrderAudio = new Audio();
    this.cancelOrderAudio.src = 'assets/sounds/order-canceled.mp3';
  }


  ngOnInit(): void {
    this.settingService.isAlertOn().subscribe((response: any) => {
      this.isAlertOn=response;
    });
    this.newSubscriptionText = this.rxStompService.watch('/new_apa_order').subscribe((message: any) => {
      if(this.isAlertOn){
        this.playNotificationSound('new');
      }
      this.toastr.success(message.body);
      this.getAll();
    });
    this.cancelSubscriptionText = this.rxStompService.watch('/cancel_apa_order').subscribe((message: any) => {
      if(this.isAlertOn){
        this.playNotificationSound('cancel');
      }
      this.toastr.error(message.body);
      this.getAll();
    });
    this.getAll();
  }

  ngAfterViewInit() {
    this.columnTemplateRefs['complete'] = this.templateColumnRef;

  }

  getAll(page?: number) {
    this.orderService.getAll(page ? page : 0 , this.pageSize, this.sortColumn, this.sortDirection).subscribe((res: any) => {
      this.data = res.content;
      this.data.forEach(() => this.isCheckedList.push(false));
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
        this.getAll(this.currentPage-1);
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
        this.getAll(this.currentPage-1);
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

  openImage(url:string) {
    window.open(url, '_blank');
  }

  checkComplete(myRow:any){
      this.modalService.openModal(
        'Vuoi segnare questo ordine come completato?',
        'Completa Ordine',
        'Annulla',
        'Conferma',
        {
          showIcon: true,
          size: 'md',
          onConfirm: (() => {
            this.completeOrder(myRow)
          }),
          onClose: (() => {
            this.getAll(this.currentPage-1);
          })
        });
  }
  private playNotificationSound(type:string) {
    switch(type){
      case 'new':
        this.newOrderAudio.play();
        break;
      case 'cancel':
        this.cancelOrderAudio.play();
        break;
    }
  }

  downloadPdf(id: string) {
    this.orderService.print(id).subscribe(response => {
      const url = window.URL.createObjectURL(response);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${id}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    });
  }

  ngOnDestroy(): void {
    if (this.newSubscriptionText) {
      this.newSubscriptionText.unsubscribe();
    }
    if (this.cancelSubscriptionText) {
      this.cancelSubscriptionText.unsubscribe();
    }
  }

  protected readonly ButtonTheme = ButtonTheme;
  protected readonly ButtonSizeTheme = ButtonSizeTheme;
}
