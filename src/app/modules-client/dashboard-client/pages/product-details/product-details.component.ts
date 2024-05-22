import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Category} from "../../../../models/Category";
import {TwentyfiveModalGenericComponentService} from "twentyfive-modal-generic-component";
import {CategoryService} from "../../../../services/category.service";
import {ButtonSizeTheme, ButtonTheme, DatePickerButtonTheme, DatePickerTheme, LabelTheme} from "twentyfive-style";
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {ProductService} from "../../../../services/product.service";
import {ProductDetails, ProductInPurchase, ProductKg, TrayDetails} from "../../../../models/Product";
import {Allergen} from "../../../../models/Allergen";
import {environment} from "../../../../../environments/environment";
import {BundleInPurchase} from "../../../../models/Bundle";
import {Measure} from "../../../../models/Measure";
import {SigningKeycloakService} from "twentyfive-keycloak-new";
import {CustomerDetails} from "../../../../models/Customer";
import {CustomerService} from "../../../../services/customer.service";
import {CartService} from "../../../../services/cart.service";

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss'
})
export class ProductDetailsComponent implements OnInit{
  @ViewChild('dropZone') dropZoneRef!: ElementRef;
  @ViewChild('fileInput') fileInputRef!: ElementRef;

  customer: CustomerDetails = new CustomerDetails();
  customerIdkc: string = '';
  productId: string | '';
  categoryType: string | '';
  categoryName: string | '';
  productDetails: ProductDetails = new ProductDetails();
  productInPurchase: ProductInPurchase = new ProductInPurchase();
  bundleInPurchase: BundleInPurchase = new BundleInPurchase();
  trayDetails: TrayDetails = new TrayDetails();
  selectedWeight: number;
  selectedMeasure: string;
  selectedMeasureLabel: string;
  weightOptions: number[] = [];
  measureOptions: Measure[] = [];
  file: File | null;
  deliveryDate: Date;

  constructor(private modalService: TwentyfiveModalGenericComponentService,
              private keycloackService: SigningKeycloakService,
              private productService: ProductService,
              private customerService: CustomerService,
              private cartService: CartService,
              private toastrService: ToastrService) {
  }

  ngOnInit(): void {
    this.getProductDetails(this.productId)
    this.getCustomer();
  }


  close() {
    this.modalService.close();
  }

  getProductDetails(id: string) {
    switch (this.categoryType) {
      case 'productKg':
        this.productService.getByIdKg(id).subscribe((response:any) =>{
          this.productDetails=response;
          this.initializeWeightOptions()
          this.selectedWeight=this.productDetails.weightRange?.minWeight
          this.productInPurchase.weight=this.productDetails.weightRange?.minWeight
        })
        break;
      case 'tray':
        this.productService.getByIdTray(id).subscribe((response:any) =>{
          this.trayDetails=response;
          this.initializeMeasureOptions()
          this.selectedMeasure=this.trayDetails.measuresList[0].weight.toString()
          this.selectedMeasureLabel=this.trayDetails.measuresList[0].label
        })
        break;
    }
  }

  getAllergensNames(){
    if (this.productDetails && Array.isArray(this.productDetails.allergens)) {
      let allergensNames: string[] = [];

      for (let allergen of this.productDetails.allergens) {
        if (allergen && allergen.name) {
          allergensNames.push(allergen.name);
        }
      }
      return allergensNames;
    } else {
      return [];
    }
  }

  initializeWeightOptions() {
    if (this.productDetails && this.productDetails.weightRange) {
      const { minWeight, maxWeight } = this.productDetails.weightRange;
      for (let weight = minWeight; weight <= maxWeight; weight += 0.5) {
        this.weightOptions.push(weight);
      }
    }
  }


  initializeMeasureOptions(){
    if(this.trayDetails && this.trayDetails.measuresList){
      for(let measure of this.trayDetails.measuresList)
        this.measureOptions.push(measure);
    }
  }

  selectWeight(weight: number) {
    this.selectedWeight = weight
    this.productDetails.weight = weight.toString();
    this.productInPurchase.weight = weight
  }

  selectMeasure(measure: Measure){
    this.selectedMeasure = measure.weight.toString();
    this.selectedMeasureLabel = measure.label
    this.trayDetails.measures = measure.weight.toString();
  }


  onInputChange(event: any) {
        this.productInPurchase.notes = event.target.value;
  }

  handleDragOver(event: DragEvent) {
    event.preventDefault(); // Impedisce il comportamento predefinito del browser
  }

  handleDrop(event: DragEvent) {
    event.preventDefault(); // Impedisce il comportamento predefinito del browser
    const files = event.dataTransfer?.files;
    if (files) {
      this.handleFiles(files);
    }
  }

  handleFileSelect(event: Event) {
    const target = event.target as HTMLInputElement;
    const files = target.files;
    if (files) {
      this.handleFiles(files);
    }
  }

  handleFiles(files: FileList) {
    this.file = files[0];
  }

  removeFile(event: Event) {
    event.stopPropagation();
    this.file = null;
    // Reimposta il valore dell'input del file a null per consentire la selezione dello stesso file
    this.fileInputRef.nativeElement.value = '';
  }

  uploadImage(){
    this.productService.uploadPic(this.file!).subscribe();
    this.productInPurchase.attachment = `${environment.ftpDownloadUrl}${this.file!.name}`
  }

  onSelectDate(event: any) {
    let data = new Date(event.getTime() - event.getTimezoneOffset() * 60000);
      this.productInPurchase.deliveryDate = data.toISOString().split('T')[0];
  }

  getRealPrice(){
    if(this.categoryName != 'Vassoi'){
      const priceString = this.productDetails.pricePerKg?.replace(/[^\d.-]/g, '');
      const price = parseFloat(priceString);
      this.productInPurchase.totalPrice=price*this.productInPurchase.weight
      return ('€ '+(price*this.productInPurchase.weight).toFixed(2))
    }
    else{
      const measure = parseFloat(this.selectedMeasure)
      this.bundleInPurchase.totalPrice=this.trayDetails.pricePerKg*measure
      return ('€ '+(this.bundleInPurchase.totalPrice).toFixed(2))
    }
  }

  getCustomer(){
    let keycloakService=(this.keycloackService)as any;
    this.customerIdkc=keycloakService.keycloakService._userProfile.id;
    if(this.customerIdkc!=null){
      this.customerService.getCustomerByKeycloakId(this.customerIdkc).subscribe((res: any) =>{
        this.customer=res;

      })
    }
  }

  saveNewProductInPurchase() {
      if (this.file) {
        this.uploadImage();
      }
      switch (this.categoryType) {
        case 'productKg':
         this.productInPurchase.id=this.productDetails.id
         this.productInPurchase.name = this.productDetails.name
         this.productInPurchase.quantity = 1
         this.cartService.addToCartProductInPurchase(this.customer.id, this.productInPurchase).subscribe({
            error: () => {
              this.toastrService.error("Errore nell'aggiunta del prodotto nel carrello!");
            },
            complete: () => {
              this.toastrService.success("Prodotto aggiunto al carrello con successo");
              this.close();
            }
          })
          break;
        case 'tray':
          this.bundleInPurchase.id=this.trayDetails.id
          this.bundleInPurchase.quantity = 1
          var measureForBundle = new Measure();
          measureForBundle.label=this.selectedMeasureLabel
          measureForBundle.weight=Number(parseFloat(this.selectedMeasure).toFixed(2))
          this.bundleInPurchase.measure=measureForBundle
          this.cartService.addToCartBundleInPurchase(this.customer.id, this.bundleInPurchase).subscribe({
            error: () => {
              this.toastrService.error("Errore nell'aggiunta del vassoio nel carrello!");
            },
            complete: () => {
              this.toastrService.success("Vassoio aggiunto al carrello con successo");
              this.close()
            }
          })
          break;
      }
  }


  protected readonly ButtonSizeTheme = ButtonSizeTheme;
  protected readonly ButtonTheme = ButtonTheme;

  protected readonly LabelTheme = LabelTheme;
  protected readonly DatePickerTheme = DatePickerTheme;
  protected readonly DatePickerButtonTheme = DatePickerButtonTheme;
}
