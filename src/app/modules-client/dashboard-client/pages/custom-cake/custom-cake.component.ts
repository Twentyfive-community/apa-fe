import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {TwentyfiveModalGenericComponentService} from "twentyfive-modal-generic-component";
import {SigningKeycloakService} from "twentyfive-keycloak-new";
import {ProductService} from "../../../../services/product.service";
import {CustomerService} from "../../../../services/customer.service";
import {CartService} from "../../../../services/cart.service";
import {ToastrService} from "ngx-toastr";
import {IngredientService} from "../../../../services/ingredient.service";
import {Ingredient} from "../../../../models/Ingredient";
import {ProductDetails, ProductInPurchase} from "../../../../models/Product";
import {environment} from "../../../../../environments/environment";
import {ButtonSizeTheme, ButtonTheme} from "twentyfive-style";
import {CustomerDetails} from "../../../../models/Customer";
import {Measure} from "../../../../models/Measure";

@Component({
  selector: 'app-custom-cake',
  templateUrl: './custom-cake.component.html',
  styleUrl: './custom-cake.component.scss'
})
export class CustomCakeComponent implements OnInit{
  @ViewChild('dropZone') dropZoneRef!: ElementRef;
  @ViewChild('fileInput') fileInputRef!: ElementRef;

  constructor(private modalService: TwentyfiveModalGenericComponentService,
              private keycloackService: SigningKeycloakService,
              private productService: ProductService,
              private ingredientService: IngredientService,
              private customerService: CustomerService,
              private cartService: CartService,
              private toastrService: ToastrService) {
  }

 productDetails: ProductDetails;
 productInPurchase: ProductInPurchase = new ProductInPurchase();

  steps = ['Tipologia','Base', 'Peso', 'Forma', 'Farcitura', 'Bagna', 'Frutta e Gocce',
     'Granelle', 'Copertura', 'Decorazioni'];

  ingredientsObject: Ingredient[];

  stepCompleted: boolean[] = new Array(this.steps.length).fill(false);


  customer: CustomerDetails = new CustomerDetails();
  customerIdkc: string = '';

  currentStep = -1;
  currentWeight: number;
  selectedType: string = 'Torta classica';
  selectedWeight: number;
  selectedBase: string = '';
  selectedForma: string = '';
  selectedBagna: string = '';
  selectedFarciture: string[] = [];
  selectedCopertura: string = '';
  selectedFrutta: string[] = [];
  selectedGocce: string[] = [];
  selectedGranelle: string[] = [];

  note: string='';
  file: File | null;
  price: string='';
  realPrice: number = 0;

  cakeId: string = "664f6efbc19b9d5754fa6ff3";


  selectionOptions: string[] = ['Torta classica', 'Torta a forma', 'Drip Cake'];
  weightOptions: number[] = [];
  baseOptions: string[] = [];
  formaOptions: string[] = [];
  bagnaOptions: string[] = [];
  farcitureOptions: string[] = [];
  coperturaOptions: string[] = [];
  fruttaOptions: string[] = [];
  gocceOptions: string[] = [];
  granelleOptions: string[] = [];

  customization: Map<string,string> = new Map<string,string>();
  //AGGIUNGI DECORAZIONI DOPO




  ngOnInit() {
    this.stepCompleted[0]=true;
    this.productService.getByIdKg(this.cakeId).subscribe((res: any) =>{
      this.productDetails = res
      this.price = this.productDetails.pricePerKg?.replace(/[^\d.-]/g, '');
    })
    this.getCustomer();
  }

  goToStep(index: number) {
    this.currentStep = index;
  }

  goToNextStep(index: number){
    this.stepCompleted[index]=true;
    if(this.currentStep < this.steps.length -1){
      this.currentStep +=1
    }
  }
  close() {
    this.modalService.close();
  }

  getBaseOptions(){
    switch(this.selectedType){
      case 'Torta classica':
        this.ingredientService.getAllByNameCategories('Basi di Torte', 'ingredienti').subscribe((response: any) =>{
          this.ingredientsObject=response;
          this.baseOptions=[];
          for(let ingrediente of this.ingredientsObject){
            this.baseOptions.push(ingrediente.name);
          }
          this.selectedBase = this.baseOptions[0];
        })
        break;

      case 'Drip Cake':
        this.baseOptions=[];
        this.baseOptions.push('Pan di Spagna Classico');
        this.baseOptions.push('Pan di Spagna al Cacao');
        this.selectedBase = this.baseOptions[0];
        break;

      case 'Torta a forma':
        this.baseOptions=[];
        this.baseOptions.push('Pan di Spagna Classico');
        this.baseOptions.push('Pan di Spagna al Cacao');
        this.baseOptions.push('Millefoglie');
        this.selectedBase = this.baseOptions[0];
        break;
    }

  }

  getWeightOptions(){
   switch(this.selectedType){
     case 'Drip Cake':
       this.currentWeight=1.5;
       this.weightOptions = [];
       this.weightOptions.push(Number(this.currentWeight.toFixed(3)) );
       break;

     case 'Torta a forma':
       this.currentWeight=0.5;
       this.weightOptions = [];
       while (this.currentWeight < 3) {
         this.weightOptions.push(Number(this.currentWeight.toFixed(3)));
         this.currentWeight += 0.25;
       }

       while (this.currentWeight <= 4) {
         this.weightOptions.push(Number(this.currentWeight.toFixed(3)));
         this.currentWeight += 0.5;
       }
       break;

     case 'Torta classica':
       if(this.selectedBase == 'Mimosa'){
         this.currentWeight=0.75;
         this.weightOptions = [];
         while (this.currentWeight < 3) {
           this.weightOptions.push(Number(this.currentWeight.toFixed(3)));
           this.currentWeight += 0.25;
         }
         while (this.currentWeight <= 4) {
           this.weightOptions.push(Number(this.currentWeight.toFixed(3)));
           this.currentWeight += 0.5;
         }
       }

       else if(this.selectedBase == 'Saint Honorè'){
         this.currentWeight=1;
         this.weightOptions = [];
         while (this.currentWeight < 3) {
           this.weightOptions.push(Number(this.currentWeight.toFixed(3)));
           this.currentWeight += 0.25;
         }
         while (this.currentWeight <= 4) {
           this.weightOptions.push(Number(this.currentWeight.toFixed(3)));
           this.currentWeight += 0.5;
         }
       }

       else if(this.selectedBase == 'Red Velvet'){
         this.currentWeight=0.5;
         this.weightOptions = [];
         while (this.currentWeight < 3) {
           this.weightOptions.push(Number(this.currentWeight.toFixed(3)));
           this.currentWeight += 0.25;
         }
         while (this.currentWeight <= 5) {
           this.weightOptions.push(Number(this.currentWeight.toFixed(3)));
           this.currentWeight += 0.5;
         }
       }

       else if(this.selectedBase == 'Millefoglie'){
         this.currentWeight=0.5;
         this.weightOptions = [];
         while (this.currentWeight < 3) {
           this.weightOptions.push(Number(this.currentWeight.toFixed(3)));
           this.currentWeight += 0.25;
         }
         while (this.currentWeight <= 8) {
           this.weightOptions.push(Number(this.currentWeight.toFixed(3)));
           this.currentWeight += 0.5;
         }
       }

       else{
         this.currentWeight=0.5;
         this.weightOptions = [];
         while (this.currentWeight < 3) {
           this.weightOptions.push(Number(this.currentWeight.toFixed(3)));
           this.currentWeight += 0.25;
         }
         while (this.currentWeight <= 10) {
           this.weightOptions.push(Number(this.currentWeight.toFixed(3)));
           this.currentWeight += 0.5;
         }
       }
       break;
   }
    this.selectedWeight=this.weightOptions[0]
  }

  getFormeOptions(){

   switch(this.selectedType) {
     case 'Drip Cake':
       this.formaOptions = ['Rotonda'];
       this.selectedForma = this.formaOptions[0]
       break;

     case 'Torta a forma':
       this.formaOptions = ['Cuore'];
       this.selectedForma = this.formaOptions[0]
       if (this.selectedWeight >= 1.5) {
         this.formaOptions = ['Cuore', 'Numero', 'Lettera']
         this.selectedForma = this.formaOptions[0]
       }
       break;

     case 'Torta classica':
       if (this.selectedBase == 'Mimosa' || this.selectedBase == 'Saint Honorè' || this.selectedBase == 'Red Velvet') {
         this.formaOptions = ['Rotonda'];
         this.selectedForma = this.formaOptions[0]
       }
       else{
         if(this.selectedWeight<=1.25){
           this.formaOptions = ['Rotonda'];
           this.selectedForma = this.formaOptions[0]
         }
         else if(this.selectedWeight>=1.5 && this.selectedWeight<=4){
           this.formaOptions = ['Rotonda','Rettangolare'];
           this.selectedForma = this.formaOptions[0]
         }
         else{
           this.formaOptions = ['Rettangolare'];
           this.selectedForma = this.formaOptions[0]
         }
       }
       break;
   }
  }

  getFarcitureOptions(){
    this.ingredientService.getAllByNameCategories('Crema', 'ingredienti').subscribe((response: any) =>{
      this.ingredientsObject=response;
      for(let ingrediente of this.ingredientsObject){
        this.farcitureOptions.push(ingrediente.name);
      }
      var ingredientToRemove = this.farcitureOptions.indexOf("Marmellata di Albicocca");
      this.farcitureOptions.splice(ingredientToRemove);
      ingredientToRemove = this.farcitureOptions.indexOf("Marmellata di Amarene");
      this.farcitureOptions.splice(ingredientToRemove);
      ingredientToRemove = this.farcitureOptions.indexOf("Marmellata ai Frutti di Bosco");
      this.farcitureOptions.splice(ingredientToRemove);
    })
  }

  getBagneOptions(){
    if(this.selectedBase == 'Millefoglie' || this.selectedBase == 'Red Velvet'){
      this.bagnaOptions=['NO BAGNE'];
      this.selectedBagna = this.bagnaOptions[0];
    }
    else{
      this.ingredientService.getAllByNameCategories('Bagne', 'ingredienti').subscribe((response: any) =>{
        this.ingredientsObject=response;
        for(let ingrediente of this.ingredientsObject){
          this.bagnaOptions.push(ingrediente.name);
        }
        this.selectedBagna = this.bagnaOptions[0];
      })

    }
  }

  getFruttaOptions(){
    this.ingredientService.getAllByNameCategories('Frutta', 'ingredienti').subscribe((response: any) =>{
      this.ingredientsObject=response;
      for(let ingrediente of this.ingredientsObject){
        this.fruttaOptions.push(ingrediente.name);
      }
    })
  }

  getGocceOptions(){
    this.ingredientService.getAllByNameCategories('Gocce', 'ingredienti').subscribe((response: any) =>{
      this.ingredientsObject=response;
      for(let ingrediente of this.ingredientsObject){
        this.gocceOptions.push(ingrediente.name);
      }
    })
  }

  getGranelleOptions(){

    if(this.selectedType=='Torta a forma' || this.selectedType=='Drip Cake'){
      this.granelleOptions = ['NO GRANELLE'];
    }
    else if(this.selectedType=='Torta classica'){
      if(this.selectedBase=='Mimosa' || this.selectedBase=='Saint Honorè' || this.selectedBase=='Red Velvet'){
        this.granelleOptions = ['NO GRANELLE'];
      }
      else{
        this.ingredientService.getAllByNameCategories('Granelle', 'ingredienti').subscribe((response: any) =>{
          this.ingredientsObject=response;
          for(let ingrediente of this.ingredientsObject){
            this.granelleOptions.push(ingrediente.name);
          }
        })
      }
    }
  }

  getCopertureOptions() {
    switch(this.selectedType){
      case 'Drip Cake':
        this.coperturaOptions=['Frutta e Colata di cioccolato Azzurro','Frutta e Colata di cioccolato Rosa','Frutta e Colata di cioccolato Nero'];
        break;
      case 'Torta a forma':
        if(this.selectedBase=='Millefoglie'){
          this.coperturaOptions=['Cream tart (Fiori, Frutta e Macaron)'];
        }
        else{
          this.coperturaOptions=['Panna','Cream tart (Fiori, Frutta e Macaron)'];
        }
        break;
      case 'Torta classica':
        if(this.selectedBase=='Millefoglie'){
          this.coperturaOptions=['NO COPERTURE'];
        }
        else if(this.selectedBase=='Diplomatica'){
          this.coperturaOptions=['Zucchero a velo'];
        }
        else if(this.selectedBase=='Mimosa'){
          this.coperturaOptions=['Pan di Spagna sbriciolato']
        }
        else if(this.selectedBase=='Red Velvet'){
          this.coperturaOptions=['Panna'];
        }
        else{
          this.ingredientService.getAllByNameCategories('Coperture', 'ingredienti').subscribe((response: any) =>{
            this.ingredientsObject=response;
            for(let ingrediente of this.ingredientsObject){
              this.coperturaOptions.push(ingrediente.name);
            }
          })
          this.coperturaOptions.push('Crema Chantilly Leggera');
        }
        break;
    }
    this.selectedCopertura=this.coperturaOptions[0];
  }

  getPrice(){
    this.realPrice = this.selectedWeight * parseFloat(this.price);
  }

  selectType(type: string){
    this.selectedType = type;
    //this.stepCompleted[1]=true;
    this.getBaseOptions();
    this.goToNextStep(1)
  }

  selectBase(base: string){
    this.selectedBase = base;
    //this.stepCompleted[2]=true;
    this.getWeightOptions();
    this.goToNextStep(2)
  }

  selectWeight(weight: number){
    this.selectedWeight = weight;
    this.getPrice();
    //this.stepCompleted[3]=true;
    this.getFormeOptions();
    this.goToNextStep(3)
  }

  selectForma(forma: string){
    this.selectedForma=forma;
    //this.stepCompleted[4]=true;
    this.getFarcitureOptions();
    this.goToNextStep(4)
  }

  selectFarcitura(farcitura: string) {
    if (!this.selectedFarciture.includes(farcitura) && this.selectedFarciture.length < 2) {
      this.selectedFarciture.push(farcitura);
    }
    if(this.selectedFarciture.length>0){
      this.stepCompleted[5]=true;
      this.getBagneOptions()
    }
  }

  removeFarcitura(farcitura: string) {
    const index = this.selectedFarciture.indexOf(farcitura);
    if (index > -1) {
      this.selectedFarciture.splice(index, 1);
    }
  }

  selectBagna(bagna: string){
    this.selectedBagna=bagna;
    //this.stepCompleted[6]=true;
    this.getFruttaOptions();
    this.getGocceOptions();
    this.goToNextStep(6)

  }

  selectFrutta(frutta: string) {
    if (!this.selectedFrutta.includes(frutta) && (this.selectedFrutta.length + this.selectedGocce.length )< 3) {
      this.selectedFrutta.push(frutta);
    }
    if(this.selectedFrutta.length>0 || this.selectedGocce.length>0){
      this.stepCompleted[7]=true;
      this.getGranelleOptions()
    }
  }

  removeFrutta(frutta: string) {
    const index = this.selectedFrutta.indexOf(frutta);
    if (index > -1) {
      this.selectedFrutta.splice(index, 1);
    }
  }

  selectGoccia(goccia: string){
    if (!this.selectedGocce.includes(goccia) && (this.selectedFrutta.length + this.selectedGocce.length)< 3) {
      this.selectedGocce.push(goccia);
    }
    if(this.selectedFrutta.length>0 || this.selectedGocce.length>0){
      this.stepCompleted[7]=true;
      this.getGranelleOptions()
    }
  }

  removeGoccia(goccia: string) {
    const index = this.selectedGocce.indexOf(goccia);
    if (index > -1) {
      this.selectedGocce.splice(index, 1);
    }
  }

  selectGranella(granella: string) {
    if (!this.selectedGranelle.includes(granella) && this.selectedGranelle.length < 2) {
      this.selectedGranelle.push(granella);
    }
    if(this.selectedGranelle.length>0){
      this.stepCompleted[8]=true;
      this.getCopertureOptions()
    }
  }

  removeGranella(granella: string) {
    const index = this.selectedGranelle.indexOf(granella);
    if (index > -1) {
      this.selectedGranelle.splice(index, 1);
    }
  }

  selectCopertura(copertura: string){
    this.selectedCopertura=copertura;
    this.stepCompleted[9]=true;
    this.goToNextStep(9)
  }


  onInputChange(event: any) {
    this.note = event.target.value;
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
    this.productInPurchase.id=this.cakeId!
    this.productInPurchase.name = this.productDetails.name
    this.productInPurchase.quantity = 1
    this.productInPurchase.notes = this.note;
    this.productInPurchase.weight=this.selectedWeight
    this.productInPurchase.shape=this.selectedForma
    this.productInPurchase.totalPrice=this.realPrice //la quantità è 1 di default, basta peso * priceAlKG
    //le customizzazioni sono base, farciture, frutte, bagna, gocce, copertura, granelle)
    this.productInPurchase.customization = {};

    this.productInPurchase.customization.Base = this.selectedBase;
    this.productInPurchase.customization.Copertura = this.selectedCopertura;
    this.productInPurchase.customization.Bagna = this.selectedBagna;

    let farciture = this.selectedFarciture.join(', ');
    this.productInPurchase.customization.Farciture = farciture;

    let frutta = this.selectedFrutta.join(', ');
    this.productInPurchase.customization.Frutta = frutta;

    let gocce = this.selectedGocce.join(', ');
    this.productInPurchase.customization.Gocce = gocce;

    let granelle = this.selectedGranelle.join(', ');
    this.productInPurchase.customization.Granelle = granelle;


    if(this.productInPurchase.weight < 0.5 || this.productInPurchase.shape == ''
      || this.productInPurchase.customization.Farciture== ''
      || (this.productInPurchase.customization.Frutta == '' && this.productInPurchase.customization.Gocce =='')
      || this.productInPurchase.customization.Granelle== '' ||
      this.productInPurchase.customization.Base== '' || this.productInPurchase.customization.Copertura== ''
      || this.productInPurchase.customization.Bagna== '')
    {
      this.toastrService.error("Compilare tutti i campi necessari");
    }
    else{
      this.cartService.addToCartProductInPurchase(this.customer.id, this.productInPurchase).subscribe({
        error: () => {
          this.toastrService.error("Errore nell'aggiunta del prodotto nel carrello!");
        },
        complete: () => {
          this.toastrService.success("Prodotto aggiunto al carrello con successo");
          this.close();
        }
      })
    }
  }


  protected readonly ButtonSizeTheme = ButtonSizeTheme;
  protected readonly ButtonTheme = ButtonTheme;
}