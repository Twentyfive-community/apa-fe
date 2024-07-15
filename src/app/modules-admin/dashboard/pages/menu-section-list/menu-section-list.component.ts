import {Component, OnInit} from '@angular/core';
import {MenusectionService} from "../../../../services/menusection.service";
import {TwentyfiveModalGenericComponentService} from "twentyfive-modal-generic-component";
import {TwentyfiveModalService} from "twentyfive-modal";
import {ToastrService} from "ngx-toastr";
import {Router} from "@angular/router";
import {MenuSection} from "../../../../models/Menu";
import {OrderRedoComponent} from "../order-redo/order-redo.component";
import {MenuSectionEditComponent} from "../menu-section-edit/menu-section-edit.component";

@Component({
  selector: 'app-menu-section',
  templateUrl: './menu-section-list.component.html',
  styleUrl: './menu-section-list.component.scss'
})
export class MenuSectionListComponent implements OnInit{

  boxAction: any[] = [
    {
      action: async (myRow: any) => {
        this.editMenu(myRow);
      },
      actionName: 'Rinomina',
    },
    {
      action: async (myRow: any) => {
        this.disableAction(myRow);
      },
      actionName: 'Attiva / Disattiva',
    },
    {
      action: async (myRow: any) => {
        this.deleteAction(myRow);
      },
      actionName: 'Elimina',
    },
  ];

  menuList: MenuSection[] = [];

  constructor(private menusectionService:MenusectionService,
              private customModalService: TwentyfiveModalGenericComponentService,
              private modalService: TwentyfiveModalService,
              private toastr: ToastrService,
              private router: Router){}

  ngOnInit() {
    this.reloadAll();
  }

  reloadAll() {
    this.menusectionService.getAll().subscribe({
      next: (res: any) => {
        this.menuList = res;
      }
    });
  }

  disableAction(myRow: any) {
    this.modalService.openModal(
      myRow.menuEnabled ? 'Vuoi davvero disattivare questo menu?' : 'Vuoi riattivare questo menu?',
      'Attenzione!',
      'Annulla',
      'Conferma',
      {
        size: 'md',
        showIcon: true,
        onConfirm: (() => {
          myRow.active = !myRow.active;

          this.menusectionService.updateById(myRow.id, myRow).subscribe({
            next: () => {
              this.toastr.success(myRow.menuEnabled ? 'Menu riattivato con successo!' : 'Menu disattivato con successo!');
            },
            error: () => {
              this.toastr.error('Si è verificato un problema in fase di aggiornamento del menu');
            },
            complete: () => {
              this.reloadAll();
            }
          });
        })
      });
  }

  deleteAction(myRow: any) {
    this.modalService.openModal(
      'Vuoi davvero eliminare questo menu? L\'operazione non può essere annullata. Sei sicuro di voler procedere?',
      'Attenzione!',
      'Annulla',
      'Conferma',
      {
        size: 'md',
        showIcon: true,
        onConfirm: (() => {
          this.menusectionService.deleteById(myRow.id).subscribe({
            next: () => {
              this.toastr.success('Menu eliminato con successo!');
            },
            error: () => {
              this.toastr.error('Si è verificato un problema in fase di aggiornamento del menu');
            },
            complete: () => {
              this.reloadAll();
            }
          })
        })
      });
  }
  editMenu(menuSection?:MenuSection) {
    let r = this.customModalService.open(MenuSectionEditComponent, "md", {});
    r.componentInstance.menuSection = menuSection ? menuSection : null;
    r.result.finally(() => {
      this.reloadAll();
    })
  }
  navigateToDetail(m: any) {
    this.router.navigate(['/dashboard/menu/', m.id])
  }
}
