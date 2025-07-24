import { Component, OnInit } from '@angular/core';
import { ItemService } from '../../services/item.service';
import { ItemGetModel } from '../../services/models/item-get-model';
import { ItemCreateModel } from '../../services/models/item-create-model';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-todo-list',
  standalone: false,
  templateUrl: './todo-list.component.html',
  styleUrl: './todo-list.component.css'
})

export class TodoListComponent implements OnInit {
  public items: ItemGetModel[] = [];
  public currentItem: ItemCreateModel = new ItemCreateModel();
  public isEditMode: boolean = false;
  public modalTitle: string = 'Create ToDo Item';
  public isModalOpen: boolean = false;  

  constructor(private itemService: ItemService, private authService: AuthService) {}

  ngOnInit(): void {
    this.loadItems();
  }

  public loadItems(): void {
    this.itemService.getAllItems().subscribe({
      next: (data) => this.items = data,
      error: (err) => console.error(err)
    });
  }

  public logout() {
    this.authService.logout();
  }

  public openCreateModal(): void {
    this.currentItem = new ItemCreateModel();
    this.isEditMode = false;
    this.modalTitle = 'Create ToDo Item';
    this.openModal();
  }

  public openEditModal(item: ItemGetModel): void {
    this.currentItem = {
      title: item.title,
      description: item.description,
      dueDate: item.dueDate
    };
    this.isEditMode = true;
    this.modalTitle = 'Edit ToDo Item';
    this.openModal();
  }

  public saveItem(): void {
    if (this.isEditMode) {
      // call update API here
    } else {
      this.itemService.addItem(this.currentItem).subscribe({
        next: () => {
          this.loadItems();
          this.closeModal();
        },
        error: err => console.error(err)
      });
    }
  }

  public openModal(): void {
    const modal = document.getElementById('itemModal');
    this.isModalOpen = true;
  }

  public closeModal(): void {
    const modalEl = document.getElementById('itemModal');
    this.isModalOpen = false;
  }
}