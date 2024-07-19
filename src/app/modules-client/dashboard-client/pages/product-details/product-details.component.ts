import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {TwentyfiveModalGenericComponentService} from "twentyfive-modal-generic-component";
import {ButtonSizeTheme, ButtonTheme} from "twentyfive-style";
import {ToastrService} from "ngx-toastr";
import {ProductService} from "../../../../services/product.service";
import {Customization, ProductDetails, ProductInPurchase, TrayDetails} from "../../../../models/Product";
import {environment} from "../../../../../environments/environment";
import {BundleInPurchase} from "../../../../models/Bundle";
import {Measure} from "../../../../models/Measure";
import {SigningKeycloakService} from "twentyfive-keycloak-new";
import {CustomerDetails} from "../../../../models/Customer";
import {CustomerService} from "../../../../services/customer.service";
import {CartService} from "../../../../services/cart.service";
import {ItemInPurchase} from "../../../../models/Cart";

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss'
})
export class ProductDetailsComponent implements OnInit{
  @ViewChild('dropZone') dropZoneRef!: ElementRef;
  @ViewChild('fileInput') fileInputRef!: ElementRef;

  noContent ='http://80.211.123.141:8106/TwentyfiveMediaManager/twentyfiveserver/downloadkkk/apa/template/no-img-paceholder.jpg';

  colorOptions = ['Nero','Rosso','Blu','Viola','Giallo'];

  fromEdit: boolean = false; //segnala che si tratta di una modifica
  productToEdit: ItemInPurchase = new ItemInPurchase(); //prodotto ricevuto dalla modale di modifica
  index: number | undefined;

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

  decorativeText: string[] = [''];
  selectedColor: string[] = [''];

  loading: boolean = true;

  constructor(private modalService: TwentyfiveModalGenericComponentService,
              private keycloackService: SigningKeycloakService,
              private productService: ProductService,
              private customerService: CustomerService,
              private cartService: CartService,
              private toastrService: ToastrService) {
  }

  ngOnInit(): void {
    if (this.fromEdit) {
      this.setProductDetailsForEdit();
    } else {
      this.getProductDetails(this.productId);
      this.getCustomer();
    }
  }


  close() {
    this.modalService.close();
  }

  getProductDetails(id: string) {
    switch (this.categoryType) {
      case 'productKg':
        this.productService.getByIdKg(id).subscribe({
          next:(response:any) =>{
            this.productDetails=response;
            this.initializeWeightOptions()
            this.selectedWeight=this.productDetails.weightRange?.minWeight
            this.productInPurchase.weight=this.productDetails.weightRange?.minWeight
          },
          error:(error:any) =>{
            console.error(error);
            this.loading = false;
          },
          complete:()=>{
            this.loading = false;
          }
        })
        break;
      case 'tray':
        this.productService.getByIdTray(id).subscribe({
          next:(response:any) =>{
            this.trayDetails=response;
            this.initializeMeasureOptions()
            this.selectedMeasure=this.trayDetails.measuresList[0].weight.toString()
            this.selectedMeasureLabel=this.trayDetails.measuresList[0].label
          },
          error:(error:any) =>{
            console.error(error);
            this.loading = false;
          },
          complete:()=>{
            this.loading = false;
          }
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
    this.decorativeText[0] = event.target.value;
  }

  selectColor(color: string) {
    this.selectedColor[0] = color;
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
    this.productService.uploadPic(this.file!,this.productInPurchase.name).subscribe();
    this.productInPurchase.attachment = `${environment.ftpDownloadUrl}${this.productInPurchase.name}`+'/'+`${this.file!.name}`
  }


  getRealPrice(){
    if(this.categoryName != 'Vassoi' || this.categoryType == 'productKg') {
      const priceString = this.productDetails.pricePerKg?.replace(/[^\d.-]/g, '');
      const price = parseFloat(priceString);
      if (this.fromEdit) {
        this.productInPurchase.totalPrice=(price*this.productInPurchase.weight)*this.productToEdit.quantity
        return (((price*this.productInPurchase.weight)*this.productToEdit.quantity).toFixed(2));
      } else {
        this.productInPurchase.totalPrice=price*this.productInPurchase.weight
        return ('€ '+(price*this.productInPurchase.weight).toFixed(2))
      }
    } else {
      if (this.fromEdit) {
        const measure = parseFloat(this.selectedMeasure)
        this.bundleInPurchase.totalPrice=(measure*this.trayDetails.pricePerKg)*this.productToEdit.quantity
        return (((measure*this.trayDetails.pricePerKg)*this.productToEdit.quantity).toFixed(2))
      } else {
        const measure = parseFloat(this.selectedMeasure)
        this.bundleInPurchase.totalPrice=this.trayDetails.pricePerKg*measure
        return ('€ '+(this.bundleInPurchase.totalPrice).toFixed(2))
      }
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
    this.loading = true;
    if (this.file) {
      this.uploadImage();
    }
    if (this.decorativeText[0]) {
      this.productInPurchase.customization.push(new Customization("Testo Decorativo", this.decorativeText))
       if (this.selectedColor[0]!==''){
        this.productInPurchase.customization.push(new Customization("Colore Testo", this.selectedColor))
      } else {
        this.selectedColor[0]='Nero';
        this.productInPurchase.customization.push(new Customization("Colore Testo", this.selectedColor))
     }
    }
      switch (this.categoryType) {
        case 'productKg':
         this.productInPurchase.id=this.productDetails.id
         this.productInPurchase.name = this.productDetails.name
         this.productInPurchase.quantity = 1
         this.cartService.addToCartProductInPurchase(this.customer.id, this.productInPurchase).subscribe({
           error: (error:any) => {
             console.error(error);
             this.loading = false;
             this.toastrService.error("Errore nell'aggiunta del prodotto nel carrello!");
          },
           complete: () => {
            this.toastrService.success("Prodotto aggiunto al carrello con successo");
             this.loading = false;
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
            error: (error:any) => {
              console.error(error);
              this.loading = false;
              this.toastrService.error("Errore nell'aggiunta del vassoio nel carrello!");
            },
            complete: () => {
              this.loading = false;
              this.toastrService.success("Vassoio aggiunto al carrello con successo");
              this.close()
            }
          })
          break;
      }
  }



  setProductDetailsForEdit() {
    if (this.categoryType === 'productKg') {
      this.getProductDetails(this.productToEdit.id)
      this.productDetails.name  = this.productToEdit.name;
      this.productDetails.imageUrl = this.productToEdit.imageUrl;
      this.productDetails.pricePerKg = this.productToEdit.price;
      this.productInPurchase.notes = this.productToEdit.notes;
      this.productInPurchase.attachment = this.productToEdit.attachment
      this.initializeWeightOptions();
      this.selectedWeight = this.productToEdit.weight;
    } else if (this.categoryType === 'tray') {
      this.categoryName = 'Vassoi'
      this.getProductDetails(this.productToEdit.id)
      this.trayDetails.name =  this.productToEdit.name;

      this.trayDetails.imageUrl ; this.productToEdit.imageUrl

      this.selectedMeasure = this.productToEdit.measure.weight.toString();
      this.selectedMeasureLabel = this.productToEdit.measure.label;
      this.bundleInPurchase = this.productToEdit;
      this.initializeMeasureOptions();
    }
  }




  protected readonly ButtonSizeTheme = ButtonSizeTheme;
  protected readonly ButtonTheme = ButtonTheme;

  updateProduct() {
    this.loading = true;
    switch (this.categoryType) {
      case 'productKg':
        this.productToEdit.weight = this.selectedWeight;
        this.productToEdit.notes = this.productInPurchase.notes
        this.productToEdit.attachment = this.productInPurchase.attachment
        this.productToEdit.totalPrice = Number(this.getRealPrice())
        this.cartService.modifyPipInCart(this.customer.id, this.index!, this.productToEdit).subscribe({
          next: () => {
            this.toastrService.success("Prodotto modificato con successo!");
          },
          error: (error:any) => {
            console.error(error)
            this.loading = false;
            this.toastrService.error("Impossibile modificare prodotto!")
          },
          complete: () => {
            this.loading = false;
            this.close()
          }
        })
        break
      case 'tray':
        var measureForBundle = new Measure();
        measureForBundle.label=this.selectedMeasureLabel
        measureForBundle.weight=Number(parseFloat(this.selectedMeasure).toFixed(2))
        this.productToEdit.measure=measureForBundle
        this.cartService.modifyBipInCart(this.customer.id, this.index!, this.productToEdit).subscribe({
          next: () => {
            this.toastrService.success("Prodotto modificato con successo!");
          },
          error: (error:any) => {
            console.error(error)
            this.loading = false;
            this.toastrService.error("Impossibile modificare prodotto!")
          },
          complete: () => {
            this.loading = false;
            this.close()
          }
        })
        break;
    }
  }
}
