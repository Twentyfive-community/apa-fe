import {AfterViewInit, Component, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {LocationReq, Order, OrderDetails} from "../../../../models/Order";
import {ProductInPurchase} from "../../../../models/Product";
import {ActivatedRoute, Router} from "@angular/router";
import {OrderService} from "../../../../services/order.service";
import {ToastrService} from "ngx-toastr";
import {TwentyfiveModalService} from "twentyfive-modal";
import {RxStompServiceService} from "../../../../services/rxstomp/rx-stomp-service.service";
import {SettingService} from "../../../../services/setting.service";
import {ButtonSizeTheme, ButtonTheme} from "twentyfive-style";

@Component({
  selector: 'app-baker-list',
  templateUrl: './baker-list.component.html',
  styleUrl: './baker-list.component.scss'
})
export class BakerListComponent implements OnInit, AfterViewInit, OnDestroy{

  @ViewChild('templateRef', { static: true }) templateRef!: TemplateRef<any>;
  @ViewChild('templateColumnRef', {static: true}) templateColumnRef!: TemplateRef<any>;

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
  locations:string[]=[]
  pIPs:ProductInPurchase[] = [];
  locationReq: LocationReq = new LocationReq();

  headers: any[] = [
    {name: 'ID', value: 'id', sortable: false},
    {name: 'Cognome', value: 'lastName', sortable: true},
    {name: 'Nome', value: 'firstName', sortable: true},
    {name: 'Data Ritiro', value: 'formattedPickupDate', sortable: true},
    {name: 'Completa', value: 'status', sortable: false},
  ];

  data: Order[] = []
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
    this.settingService.isAlertOn().subscribe((response: any) => {
      this.isAlertOn=response;
    });
    this.newSubscriptionText = this.rxStompService.watch('/in_preparation_apa_order').subscribe((message: any) => {
      if(this.isAlertOn){
        this.playNotificationSound();
      }
      this.toastrService.success(message.body, 'Ordine arrivato!', {
        timeOut: 0,               // Disabilita il timeout automatico
        tapToDismiss: true       // Richiede un click esplicito per chiudere
      });
      this.getAllInPreparation();
    });
    this.getAllLocations()
    this.getAllInPreparation();
  }
  ngAfterViewInit() {
    this.columnTemplateRefs['status'] = this.templateColumnRef;
  }
  getAllInPreparation(page?: number) {
    this.orderService.getAllWithStatus(page ? page : 0 , this.pageSize, this.sortColumn, this.sortDirection,'IN_PREPARAZIONE').subscribe({
      next:(res:any) =>{
        this.data = res.content
        this.collectionSize = res.totalElements;
      },
      error:(err) => {
        console.error(err);
        this.toastrService.error("Errore nel recuperare gli ordini in preparazione!");
      }
    })
  }
  getOrderDetails($event:any){
    let orderId = $event.id
    this.locationReq.orderId = orderId;
    this.orderService.getOrderDetails(orderId).subscribe((res: any) => {
      this.orderDetails = res
      this.pIPs = res.products;
    })
  }
  sortingColumn(event: any) {
    this.sortColumn = event.sortColumn;
    this.sortDirection = event.sortDirection;
    this.getAllInPreparation(this.currentPage-1)
  }

  changePage(event: number) {
    this.currentPage = event;
    this.getAllInPreparation(this.currentPage-1);
  }

  selectSize(event: any) {
    this.pageSize = event;
    this.getAllInPreparation(this.currentPage-1);
  }

  openImage(url:string) {
    window.open(url, '_blank');
  }

  private playNotificationSound() {
    this.newOrderAudio.play();
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
  getAllLocations() {
    this.settingService.getAllLocations().subscribe((res:any)=>{
      this.locations=['Nessun Luogo',...res];
    })
  }
  setLocation(location: any, product: any) {
    if (location == 'Nessun Luogo') {
      product.location = null;
    } else {
      product.location = location;
    }
    this.locationReq.position = this.pIPs.indexOf(product);
    this.locationReq.location = location;
    this.orderService.setLocationForKg(this.locationReq).subscribe({
      next:() => {
        this.toastrService.success("Luogo del prodotto inserito con successo!");
      },
      error:(err) => {
        this.toastrService.error("Errore nell\' inserire il luogo");
        console.error(err);
      }
    });
  }

  protected readonly ButtonSizeTheme = ButtonSizeTheme;
  protected readonly ButtonTheme = ButtonTheme;

  sendOrderToAdmin(id:string,event:Event) {
    event.stopPropagation();
    this.modalService.openModal(
    'Vuoi segnare questo ordine come completato?',
    'Completa Ordine',
    'Annulla',
    'Conferma',
    {
      showIcon: true,
      size: 'md',
      onConfirm: (() => {
        this.orderService.changeOrderStatus(id,'MODIFICATO_DA_PASTICCERIA').subscribe({
          next: () => {
            this.toastrService.success('Ordine completato!');
          },
          error: () => {
            this.toastrService.error('Error fetching order');
          },
          complete: () => {
            this.getAllInPreparation(this.currentPage-1);
          }
        });
      })
    });
  }
}
