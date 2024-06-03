import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { Order } from "../../../../models/Order";
import { CompletedorderService } from "../../../../services/completedorder.service";
import {ButtonTheme} from "twentyfive-style";
import {OrderService} from "../../../../services/order.service";
import {TwentyfiveModalService} from "twentyfive-modal";
declare var bootstrap: any;

@Component({
  selector: 'app-user-order',
  templateUrl: './user-order.component.html',
  styleUrls: ['./user-order.component.scss']
})
export class UserOrderComponent implements OnInit {
  activeOrders: string | null = '';
  customerId: string = '';

  orders: Order[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private completedOrderService: CompletedorderService,
    private router: Router,
    private orderService:OrderService,
    private modalService: TwentyfiveModalService,
  ) { }

  ngOnInit(): void {
    this.loadBootstrapJS();
    this.activeOrders = this.activatedRoute.snapshot.queryParamMap.get('activeOrders');
    this.customerId = this.activatedRoute.snapshot.paramMap.get('id')!;
    this.orders=[]
    if(this.customerId) {
      this.loadOrders();
    }
  }

  loadOrders(){
    if (this.activeOrders == 'true') {
      this.loadActiveOrders();

    } else
      this.loadCompletedOrders();
  }

  loadBootstrapJS(): void {
    if (!document.querySelector('script[src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"]')) {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js';
      script.async = true;
      document.head.appendChild(script);
    }
  }

  private loadCompletedOrders(): void {
    this.completedOrderService.getCompletedOrdersByCustomer(this.customerId).subscribe({
      next: (orders) => {
        console.log(orders);  // Aggiungi questo per controllare il dato ricevuto
        this.orders = orders;
      },
      error: (error) => {
        console.error('Failed to load orders:', error);
      }
    });
  }

  private loadActiveOrders(): void {
    this.orderService.getActiveOrdersByCustomer(this.customerId).subscribe({
      next: (orders) => {
        console.log(orders);  // Aggiungi questo per controllare il dato ricevuto
        this.orders = orders;
      },
      error: (error) => {
        console.error('Failed to load orders:', error);
      }
    });
  }

  close(): void {
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
        console.log(response);
        // Mostra una finestra modale di conferma email
        const orderCancelModal = new bootstrap.Modal(document.getElementById('cancelOrderModal'), {
          keyboard: false
        });
        console.log(this.orders);
        orderCancelModal.show();
        this.orders=[]
        if(this.customerId) {
          this.loadOrders();
        }
        console.log(this.orders);
      },
      error: (error) => {
        var status=error.status;
        if(status==400) {
          const impOrderCancelModal = new bootstrap.Modal(document.getElementById('impossibleCancelOrderModal'), {
            keyboard: false
          });
          impOrderCancelModal.show();

        }
      }
    });

  }

}
