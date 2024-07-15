import {Component, OnInit} from '@angular/core';
import {NavbarTheme} from "twentyfive-style";
import {MenusectionService} from "../../services/menusection.service";
import {MenuItem, MenuSection} from "../../models/Menu";
import {MenuitemService} from "../../services/menuitem.service";
import {CategoryService} from "../../services/category.service";
import {Category} from "../../models/Category";
import {animate, state, style, transition, trigger} from "@angular/animations";

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
  animations: [
    trigger('cascadeInOut', [
      transition(':enter', [
        style({ height: 0, paddingTop: 0, paddingBottom: 0, overflow: 'hidden' }),
        animate('400ms cubic-bezier(0.35, 0, 0.25, 1)', style({ height: '*', paddingTop: '*', paddingBottom: '*' }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ height: 0, paddingTop: 0, paddingBottom: 0, overflow: 'hidden' }))
      ])
    ])
  ]
})
export class MenuComponent implements OnInit{

  sections: MenuSection[] = [];
  categories: {[sectionId: string]: Category[]} = {};
  items: {[categoryId: string]: MenuItem[]} = {};

  openSections: { [id: string]: boolean } = {};
  openCategories: { [id: string]: boolean } = {};

  constructor(private menuSectionService: MenusectionService,
              private categoryService: CategoryService,
              private menuItemsService: MenuitemService) {
  }

  ngOnInit() {
    this.getAllSections();
  }

  getAllSections() {
    this.menuSectionService.getAll().subscribe((res: any) => {
      this.sections = res;
      this.sections.forEach(section => {
        this.getCategoriesBySectionId(section.id);
      });
    })
  }

  getCategoriesBySectionId(sectionId: string) {
    this.categoryService.getAllByIdSection(sectionId).subscribe((res: any) => {
      this.categories[sectionId] = res;
      this.categories[sectionId].forEach(category => {
        this.getItemsByCategoryId(category.id);
      });
    });
  }

  toggleItems(categoryId: string) {
    this.openCategories[categoryId] = !this.openCategories[categoryId];
    if (!this.items[categoryId]) {
      this.getItemsByCategoryId(categoryId);
    }
  }

  getItemsByCategoryId(categoryId: string) {
    this.menuItemsService.getAllByIdCategory(categoryId).subscribe((res: any) => {
      this.items[categoryId] = res;
      console.log(this.items)
    });
  }
  isCollapsed(id: string, type: 'section' | 'category'): boolean {
    return type === 'section' ? this.openSections[id] : !this.openCategories[id];
  }


  protected readonly NavbarTheme = NavbarTheme;
}
