import { AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { TwentyfiveModalGenericComponentService } from 'twentyfive-modal-generic-component';
import { ProductService } from '../../../../services/product.service';
import { ProductWeighted, ProductWeightedDetails, TrayDetails } from '../../../../models/Product';
import { BundleInPurchase, PieceInPurchase } from '../../../../models/Bundle';
import { Measure } from '../../../../models/Measure';
import { ButtonSizeTheme, ButtonTheme, InputTheme, LabelTheme } from 'twentyfive-style';
import { SigningKeycloakService } from 'twentyfive-keycloak-new';
import { CustomerService } from '../../../../services/customer.service';
import { Customer } from '../../../../models/Customer';
import { CartService } from '../../../../services/cart.service';
import { ToastrService } from 'ngx-toastr';
import { switchMap, debounceTime, Subject } from 'rxjs';

@Component({
  selector: 'app-tray-customized',
  templateUrl: './tray-customized.component.html',
  styleUrls: ['./tray-customized.component.scss']
})
export class TrayCustomizedComponent implements OnInit {

  @ViewChild('modalContent', { static: false }) modalContent!: ElementRef;

  trayDetails: TrayDetails = new TrayDetails();
  bundleInPurchase: BundleInPurchase = new BundleInPurchase();
  productListWeighted: ProductWeighted[] = [];
  productWeighted: ProductWeightedDetails = new ProductWeightedDetails();
  currentStep = 1;
  customerIdkc: string = '';
  customer: Customer = new Customer();
  value: string = '';
  private searchTerms = new Subject<string>();
  private productQuantities: { [id: string]: number } = {}; // Mappa per memorizzare le quantità

  constructor(
    private modalService: TwentyfiveModalGenericComponentService,
    public productService: ProductService,
    private keycloakService: SigningKeycloakService,
    private customerService: CustomerService,
    private cartService: CartService,
    private toastrService: ToastrService
  ) {}

  ngOnInit(): void {
    this.getCustomer();
    this.productService.getByIdTray('664c677cdb11452a067bbdf5').subscribe((response: any) => {
      this.trayDetails = response;
      this.bundleInPurchase.id = response.id;
      this.bundleInPurchase.totalWeight = 0;
    });
    this.getAllCustomizedTray();

    this.searchTerms.pipe(
      debounceTime(300), // Attendi 300ms dopo ogni tasto premuto
      switchMap((term: string) => this.productService.search(term))
    ).subscribe(
      (response: any) => {
        this.updateProductList(response);
      }
    );
  }

  updateProductList(newProductList: any) {
    // Mappa i nuovi prodotti mantenendo la quantità esistente se presente
    this.productListWeighted = newProductList.map((data: any) => this.mapToProductWeighted(data));
  }

  nextStep() {
    this.currentStep++;
  }

  previousStep() {
    this.currentStep--;
    this.bundleInPurchase.totalWeight = 0;
    this.bundleInPurchase.weightedProducts = [];
  }

  selectMeasure(measure: Measure) {
    this.bundleInPurchase.measure = measure;
    this.bundleInPurchase.totalPrice = this.trayDetails.pricePerKg * measure.weight;
    this.nextStep();
  }

  updateResult(quantity: number, id: string, realWeight: number) {
    const existingPieceIndex = this.bundleInPurchase.weightedProducts.findIndex(piece => piece.id === id);
    const existingPiece = this.bundleInPurchase.weightedProducts[existingPieceIndex];

    if (quantity === 0 && existingPieceIndex === -1) {
      return;
    }

    const oldPieceWeight = existingPiece ? existingPiece.quantity * realWeight : 0;
    let newTotalWeight = this.bundleInPurchase.totalWeight - oldPieceWeight + (quantity * realWeight);

    if (newTotalWeight > this.bundleInPurchase.measure.weight) {
      alert("Il peso totale non può eccedere il peso massimo consentito!");
      return;
    }

    if (existingPieceIndex !== -1) {
      if (quantity <= 0) {
        this.bundleInPurchase.weightedProducts.splice(existingPieceIndex, 1);
      } else {
        existingPiece.quantity = quantity;
      }
    } else {
      this.bundleInPurchase.weightedProducts.push(new PieceInPurchase(id, quantity));
    }

    this.bundleInPurchase.totalWeight = parseFloat(newTotalWeight.toFixed(2));
    this.productQuantities[id] = quantity; // Aggiorna la quantità nel dizionario
  }

  getCustomer() {
    let keycloakService = (this.keycloakService) as any;
    this.customerIdkc = keycloakService.keycloakService._userProfile.id;
    if (this.customerIdkc != null) {
      this.customerService.getCustomerByKeycloakId(this.customerIdkc).subscribe((res: any) => {
        this.customer = res;
      });
    }
  }

  getAllCustomizedTray() {
    this.productService.search(this.value).subscribe(
      (response: any) => {
        this.updateProductList(response);
      }
    );
  }

  onInputChange(event: any) {
    this.bundleInPurchase.quantity = event.target.value;
  }

  saveTray() {
    this.cartService.addToCartBundleInPurchase(this.customer.id, this.bundleInPurchase).subscribe({
      error: () => {
        this.toastrService.error("Errore nell'aggiunta del vassoio nel carrello!");
      },
      complete: () => {
        this.toastrService.success("Vassoio aggiunto al carrello con successo");
        this.close();
      }
    });
  }

  onSearch(event: any): void {
    this.searchTerms.next(event.target.value);
  }

  close() {
    this.modalService.close();
  }

  private mapToProductWeighted(data: any): ProductWeighted {
    const product = new ProductWeighted(data);
    if (this.productQuantities[product.id] !== undefined) {
      product.quantity = this.productQuantities[product.id];
    }
    return product;
  }

  protected readonly ButtonTheme = ButtonTheme;
  protected readonly ButtonSizeTheme = ButtonSizeTheme;
}
