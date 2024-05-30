import {AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import {TwentyfiveModalGenericComponentService} from "twentyfive-modal-generic-component";
import {ProductService} from "../../../../services/product.service";
import {ProductWeighted, ProductWeightedDetails, TrayDetails} from "../../../../models/Product";
import {BundleInPurchase, PieceInPurchase} from "../../../../models/Bundle";
import {Measure} from "../../../../models/Measure";
import {ButtonSizeTheme, ButtonTheme} from "twentyfive-style";
import {SigningKeycloakService} from "twentyfive-keycloak-new";
import {CustomerService} from "../../../../services/customer.service";
import {Customer} from "../../../../models/Customer";
import {CartService} from "../../../../services/cart.service";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-tray-customized',
  templateUrl: './tray-customized.component.html',
  styleUrl: './tray-customized.component.scss'
})
export class TrayCustomizedComponent implements OnInit,AfterViewInit{

  @ViewChild('modalContent', { static: false }) modalContent!: ElementRef;

  trayDetails: TrayDetails = new TrayDetails();
  bundleInPurchase: BundleInPurchase = new BundleInPurchase();
  productListWeighted: ProductWeighted[]=[new ProductWeighted()];
  productWeighted: ProductWeightedDetails = new ProductWeightedDetails();
  currentStep = 1;
  page =0;
  size =10;
  customerIdkc: string = '';
  customer: Customer = new Customer();
  hasMoreProducts = true; // Flag to check if more products are available


  ngOnInit(): void {
    this.getCustomer();
    this.productService.getByIdTray('664c677cdb11452a067bbdf5').subscribe((response:any)=> {
      this.trayDetails = response;
      this.bundleInPurchase.id = response.id;
      this.bundleInPurchase.totalWeight = 0;
    });
    this.getAllCustomizedTray();
  }

  ngAfterViewInit(): void {
    this.modalContent.nativeElement.addEventListener('scroll', this.onScroll.bind(this));
  }

  constructor(private modalService:TwentyfiveModalGenericComponentService,
              private productService:ProductService,
              private keycloakService: SigningKeycloakService,
              private customerService: CustomerService,
              private cartService: CartService,
              private toastrService: ToastrService
              ) {
  }

  onScroll(event: any): void {
    const element = event.target;
    if (this.currentStep === 2 && element.scrollHeight - element.scrollTop === element.clientHeight) {
      if(this.hasMoreProducts){
        this.size+=10;
        this.getAllCustomizedTray()
      }
    }
  }

  nextStep() {
    this.currentStep++;
  }

  previousStep() {
    this.currentStep--;
    this.bundleInPurchase.totalWeight=0;
    this.bundleInPurchase.weightedProducts=[];
  }

  selectMeasure(measure:Measure) {
    this.bundleInPurchase.measure=measure;
    this.bundleInPurchase.totalPrice=this.trayDetails.pricePerKg*measure.weight;
    this.nextStep();
  }

  updateResult(quantity: number, id: string, realWeight: number) {
    const existingPieceIndex = this.bundleInPurchase.weightedProducts.findIndex(piece => piece.id === id);
    const existingPiece = this.bundleInPurchase.weightedProducts[existingPieceIndex];

    if (quantity === 0 && existingPieceIndex === -1) {
      return; // Esci se la quantità è 0 e il pezzo non esiste già
    }

    const oldPieceWeight = existingPiece ? existingPiece.quantity * realWeight : 0;

    // Calcola il nuovo peso totale
    let newTotalWeight = this.bundleInPurchase.totalWeight - oldPieceWeight + (quantity * realWeight);

    // Controlla se il nuovo peso totale supera il peso massimo
    if (newTotalWeight > this.bundleInPurchase.measure.weight) {
      alert("Il peso totale non può eccedere il peso massimo consentito!");
      return;
    }

    if (existingPieceIndex !== -1) {
      if (quantity <= 0) {
        // Rimuovi il pezzo dalla lista
        this.bundleInPurchase.weightedProducts.splice(existingPieceIndex, 1);
      } else {
        // Aggiorna la quantità di quel pezzo in lista
        existingPiece.quantity = quantity;
      }
    } else {
      // Aggiungi il pezzo alla lista se non esiste
      this.bundleInPurchase.weightedProducts.push(new PieceInPurchase(id, quantity));
    }

    // Aggiorna il peso totale
    this.bundleInPurchase.totalWeight = parseFloat(newTotalWeight.toFixed(2));
  }

  getCustomer(){
    let keycloakService=(this.keycloakService)as any;
    this.customerIdkc=keycloakService.keycloakService._userProfile.id;
    if(this.customerIdkc!=null){
      this.customerService.getCustomerByKeycloakId(this.customerIdkc).subscribe((res: any) =>{
        this.customer=res;

      })
    }
  }

  getAllCustomizedTray() {
    this.productService.getAllForCustomizedTray('664361ed09aa3a0e1b249988', this.page, this.size).subscribe(
      (response: any) => {
        this.productListWeighted=response.content;
        this.productListWeighted.forEach((product: any) => {
          product.quantity = 0;
        });
        console.log(response.totalElements < this.size);
        if(response.totalElements < this.size) this.hasMoreProducts = false;
      }
    );
  }

  onInputChange(event: any) {
    this.bundleInPurchase.quantity=event.target.value;
  }

  saveTray(){
    this.cartService.addToCartBundleInPurchase(this.customer.id, this.bundleInPurchase).subscribe({
      error: () => {
        this.toastrService.error("Errore nell'aggiunta del vassoio nel carrello!");
      },
      complete: () => {
        this.toastrService.success("Vassoio aggiunto al carrello con successo");
        this.close()
      }
    })
  }
  close(){
    this.modalService.close();
  }

  protected readonly ButtonTheme = ButtonTheme;
  protected readonly ButtonSizeTheme = ButtonSizeTheme;
}
