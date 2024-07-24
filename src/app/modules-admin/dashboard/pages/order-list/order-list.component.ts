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
  @ViewChild('readStatus', { static: true}) readStatus: TemplateRef<any>

  dataDetails: any[] = [new OrderDetails()]
  orderDetails: OrderDetails = new OrderDetails();

  columnTemplateRefs: {[key: string]: TemplateRef<any>} = {};
  currentPage: number = 0;
  pageSize: number = 25
  maxSize: number = 5;
  collectionSize: number = 0;

  sortColumn: string = '';
  sortDirection: string = '';

  newSubscriptionText: any;
  cancelSubscriptionText: any;
  isAlertOn: boolean;
  newOrderAudio:HTMLAudioElement;
  cancelOrderAudio:HTMLAudioElement;

  unreadStatus: { [key: string]: boolean } = {}; // tiene traccia dello stato "unread" temporaneo

  headers: any[] = [
    {name: '', value: 'readStatus', sortable: false},
    {name: 'ID', value: 'id', sortable: false},
    {name: 'Cognome', value: 'lastName', sortable: true},
    {name: 'Nome', value: 'firstName', sortable: true},
    {name: 'Data Ritiro', value: 'formattedPickupDate', sortable: true},
    {name: 'Prezzo', value: 'price', sortable: true},
    {name: 'Status', value: 'status', sortable: true},
  ];
  data: Order[] = []
  statuses: string[] = [];
  extras: any[] = [
    {name: 'ordine', value: 'orderDetails'},
  ]

  paginationElements: any[] = [
    {
      actionName: '25',
      value: '25'
    },
    {
      actionName: '50',
      value: '50'
    },
    {
      actionName: '100',
      value: '100'
    }
  ];

  tableActions: any[] = [
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
    this.orderService.getAllStatuses().subscribe((response:any) =>{
      this.statuses=response;
    });
    this.settingService.isAlertOn().subscribe((response: any) => {
      this.isAlertOn=response;
    });
    this.newSubscriptionText = this.rxStompService.watch('/new_apa_order').subscribe((message: any) => {
      if(this.isAlertOn){
        this.playNotificationSound('new');
      }
      this.toastrService.success(message.body, 'Ordine arrivato!', {
        timeOut: 0,               // Disabilita il timeout automatico
        tapToDismiss: true       // Richiede un click esplicito per chiudere
      });
      this.getAll();
    });
    this.cancelSubscriptionText = this.rxStompService.watch('/cancel_apa_order').subscribe((message: any) => {
      if(this.isAlertOn){
        this.playNotificationSound('cancel');
      }
      this.toastrService.error(message.body, 'Ordine cancellato!', {
        timeOut: 0,               // Disabilita il timeout automatico
        tapToDismiss: true       // Richiede un click esplicito per chiudere
      });
      this.getAll();
    });
    this.getAll();
  }

  ngAfterViewInit() {
    this.columnTemplateRefs['status'] = this.templateColumnRef;
    this.columnTemplateRefs['readStatus'] = this.readStatus;
  }

  getAll(page?: number) {
    this.orderService.getAll(page ? page : 0 , this.pageSize, this.sortColumn, this.sortDirection).subscribe({
      next:(res:any) =>{
        this.data = res.content
        this.collectionSize = res.totalElements;
        this.updateUnreadStatus();
      },
        error:(err) => {
        console.error(err);
        this.toastrService.error("Errore nel recuperare gli ordini attivi!");
      }
    })
  }

  updateUnreadStatus() {
    this.data.forEach(order => {
      this.unreadStatus[order.id] = order.unread;
    });
    console.log('unread status', this.unreadStatus)
  }

  isUnread = (orderId: string): boolean => {
    return this.unreadStatus[orderId];
  }

  rowStyles = (data: any): { [key: string]: string } => {
    if (this.isUnread(data.id)) {
      return { 'font-weight': 'bold' };
    } else {
      return {};
    }
  }

  getOrderDetails($event:any){
    let orderId = $event.id
    this.unreadStatus[orderId] = false;
    this.orderService.getOrderDetails(orderId).subscribe((res: any) => {
      this.orderDetails = res
      console.log(this.orderDetails.products[0].customization)
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
    this.getAll(this.currentPage-1);
  }

  openImage(url:string) {
    window.open(url, '_blank');
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

  stopPropagation(event: Event) {
    event.stopPropagation();
  }

  changeStatus(id:string,status:string) {
    event!.stopPropagation();
    switch(status){
      case 'COMPLETO':
        this.modalService.openModal(
          'Vuoi segnare questo ordine come completato?',
          'Completa Ordine',
          'Annulla',
          'Conferma',
          {
            showIcon: true,
            size: 'md',
            onConfirm: (() => {
              this.orderService.changeOrderStatus(id,status).subscribe({
                next: () => {
                  this.toastrService.success('Ordine completato!');
                },
                error: () => {
                  this.toastrService.error('Error fetching order');
                },
                complete: () => {
                  this.getAll(this.currentPage-1);
                }
              });
            })
          });
        break;
      case 'ANNULLATO':
        this.modalService.openModal(
          'Sei sicuro di voler annullare questo ordine?',
          'Annulla Ordine',
          'Annulla',
          'Conferma',
          {
            showIcon: true,
            size: 'md',
            onConfirm: (() => {
              this.orderService.changeOrderStatus(id,status).subscribe({
                next: () => {
                  this.toastrService.success('Ordine annullato con successo');
                },
                error: () => {
                  this.toastrService.error('Error fetching order');
                },
                complete: () => {
                  this.getAll(this.currentPage-1);
                }
              });
            })
          });
        break;
      default:
        this.orderService.changeOrderStatus(id,status).subscribe({
          next: () => {
            this.toastrService.success(`Ordine aggiornato con successo!`);
          },
          error: () => {
            this.toastrService.error('Error fetching order');
          },
          complete: () => {
            this.getAll(this.currentPage-1);
          }
        });
    }
  }
}
