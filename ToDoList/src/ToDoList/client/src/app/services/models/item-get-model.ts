export class ItemGetModel {
  toDoItemId: number = 0;
  title: string = ''
  description: string = ''
  isCompleted: boolean = false;
  createdAt: Date = new Date(); 
  dueDate: Date = new Date();   
}