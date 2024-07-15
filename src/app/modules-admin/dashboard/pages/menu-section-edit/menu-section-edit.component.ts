import {Component, OnInit} from '@angular/core';
import {ToastrService} from "ngx-toastr";
import {TwentyfiveModalGenericComponentService} from "twentyfive-modal-generic-component";
import {ButtonSizeTheme, ButtonTheme, InputTheme, LabelTheme} from "twentyfive-style";
import {MenuSection} from "../../../../models/Menu";
import {MenusectionService} from "../../../../services/menusection.service";

@Component({
  selector: 'app-menu-section-edit',
  templateUrl: './menu-section-edit.component.html',
  styleUrl: './menu-section-edit.component.scss'
})
export class MenuSectionEditComponent implements OnInit{

  title = 'Aggiungi menu';
  menuSection: MenuSection;
  menuName: string;
  constructor(private toastr: ToastrService,
              private modalService: TwentyfiveModalGenericComponentService,
              private menusectionService: MenusectionService) {

  }
  ngOnInit() {
    if(!(this.menuSection)){
      this.menuSection = new MenuSection();
    } else {
      this.menuName = this.menuSection.name;
    }
  }

  onInputChange($event: any) {
    this.menuName = $event.target.value;

  }

  close() {
    this.modalService.close();
  }

  createMenu() {
    if (!this.menuName) {
      this.toastr.error('Compilare tutti i campi obbligatori');
      return;
    }
    this.menuSection.name=this.menuName;
    this.menusectionService.save(this.menuSection).subscribe({
      error: (err: any) => {
        console.error(err);
        this.toastr.error("Errore nella modifica o creazione della sezione");
      },
      complete: () => {
        this.toastr.success("Sezione creata con successo!")
        this.close();

      }
    });
  }
  protected readonly ButtonSizeTheme = ButtonSizeTheme;
  protected readonly ButtonTheme = ButtonTheme;
  protected readonly InputTheme = InputTheme;
  protected readonly LabelTheme = LabelTheme;
}
