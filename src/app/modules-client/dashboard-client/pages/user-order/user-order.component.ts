import {Component, OnDestroy, OnInit} from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { Order } from "../../../../models/Order";
import { CompletedorderService } from "../../../../services/completedorder.service";
import {ButtonTheme} from "twentyfive-style";
import {OrderService} from "../../../../services/order.service";
import {TwentyfiveModalService} from "twentyfive-modal";
import {RxStompServiceService} from "../../../../services/rxstomp/rx-stomp-service.service";
import {ToastrService} from "ngx-toastr";
declare var bootstrap: any;

@Component({
  selector: 'app-user-order',
  templateUrl: './user-order.component.html',
  styleUrls: ['./user-order.component.scss']
})
export class UserOrderComponent implements OnInit, OnDestroy {
  activeOrders: string | null = '';
  customerId: string = '';
  customerSubscriptionText: any;



  orders: Order[] = [];


  currentPage: number = 1;
  itemsPerPage: number = 15;
  totalPages: number = 1;

  loading: boolean = true;

  constructor(
    private activatedRoute: ActivatedRoute,
    private completedOrderService: CompletedorderService,
    private router: Router,
    private orderService:OrderService,
    private modalService: TwentyfiveModalService,
    private rxStompService: RxStompServiceService,
    private toastrService: ToastrService,
  ) { }

  ngOnInit(): void {
    this.loadBootstrapJS();
    this.activeOrders = this.activatedRoute.snapshot.queryParamMap.get('activeOrders');
    this.customerId = this.activatedRoute.snapshot.paramMap.get('id')!;
    this.orders=[]
    this.customerSubscriptionText = this.rxStompService.watch(`/${this.customerId}`).subscribe((message:any) =>{
      this.loadOrders();
    });
    if(this.customerId) {
      this.loadOrders();
    }

  }

  loadOrders() {
    this.loading = true;
    if (this.activeOrders == 'true') {
      this.loadActiveOrders(this.currentPage - 1, this.itemsPerPage);
    } else {
      this.loadCompletedOrders(this.currentPage - 1, this.itemsPerPage);
    }
  }

  loadBootstrapJS(): void {
    if (!document.querySelector('script[src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"]')) {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js';
      script.async = true;
      document.head.appendChild(script);
    }
  }

  private loadCompletedOrders(page: number, size: number): void {
    this.completedOrderService.getCompletedOrdersByCustomer(this.customerId, page, size).subscribe({
      next: (response) => {
        console.log(response);
        this.orders = response.content;
        this.setupPagination(response.totalPages);
        this.loading = false;
      },
      error: (error) => {
        this.close();
        console.error('Failed to load orders:', error);
        this.loading = false;
      },
      complete:() =>{
        this.loading = false;
      }
    });
  }

  private loadActiveOrders(page: number, size: number): void {
    this.orderService.getActiveOrdersByCustomer(this.customerId, page, size).subscribe({
      next: (response) => {
        console.log('active');
        try{
          this.orders = response.content;
          this.setupPagination(response.totalPages);

        }catch(e){
          this.close();
        }

      },
      error: (error) => {
        this.close();
        console.error('Failed to load orders:', error);
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  setupPagination(totalPages: number) {
    this.totalPages = totalPages;
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadOrders();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadOrders();
    }
  }

  close(): void {
    this.loadOrders();
  }

  goBack(): void{
    this.router.navigate(['../catalogo/profilo']);
  }

  protected readonly ButtonTheme = ButtonTheme;

  goToDetail(orderId:string) {
    this.router.navigate(['../catalogo/dettaglio-ordine',orderId],{queryParams:{activeOrders:this.activeOrders,customerId:this.customerId}});

  }

  cancelOrder(id: string) {
    // Apre una finestra modale di conferma
    this.modalService.openModal(
      'Se continui, l\'ordine con id #' + id + ' verrà annullato. Vuoi procedere?',
      'Annulla l\'ordine',
      'Annulla',
      'Conferma',
      {
        size: 'md',
        onConfirm: () => {
          console.log('Richiesta di cancellamento per l\'ordine con id ' + id);

          this.handleCancel(id);

        }
      }
    );
  }

  handleCancel(id:string){
    this.orderService.cancelOrderUser(id).subscribe({
      next: (response) => {
        // Mostra una finestra modale di conferma email
        const orderCancelModal = new bootstrap.Modal(document.getElementById('cancelOrderModal'), {
          keyboard: false
        });
        this.orders=[]
        if(this.customerId) {
          this.loadOrders();
        }
        if(this.orders.length==0){
          this.close();
        }
        else{
          orderCancelModal.show();

        }
      },
      error: (error) => {
        var status=error.status;
        if(status==400) {
          const impOrderCancelModal = new bootstrap.Modal(document.getElementById('impossibleCancelOrderModal'), {
            keyboard: false
          });
          impOrderCancelModal.show();
        }
      },
      complete:() => {
        this.toastrService.success("L'ordine è stato annullato con successo!");
        this.loadOrders();
      }
    });

  }

  ngOnDestroy(): void {
    if (this.customerSubscriptionText) {
      this.customerSubscriptionText.unsubscribe();
    }
  }

}
