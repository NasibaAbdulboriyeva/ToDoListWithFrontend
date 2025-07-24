import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Observable, map, tap } from 'rxjs';
import { ItemApiService } from '../api/item-api-service';
import { ItemCreateModel } from './models/item-create-model';
import { ItemCreateDto } from '../api/interfaces/item-create-dto';
import { ItemGetDto } from '../api/interfaces/item-get-dto';
import { ItemGetModel } from './models/item-get-model';

@Injectable({ providedIn: 'root' })
export class ItemService {
    router: any;
    constructor(private itemApiService: ItemApiService) { }

    public addItem(model: ItemCreateModel): Observable<number> {
        const dto = this.convertItemCreateModelToDto(model);
        return this.itemApiService.addItem(dto);
    }

    public getAllItems(): Observable<ItemGetModel[]> {
        return this.itemApiService.getAllItems().pipe(
            map((dtoList: ItemGetDto[]) => dtoList.map(dto => this.convertItemGetDtoToModel(dto)))
        );
    }

    private convertItemCreateModelToDto(model: ItemCreateModel): ItemCreateDto {
        return {
            title: model.title,
            description: model.description,
            dueDate: model.dueDate.toString(),
        };
    }

    private convertItemGetDtoToModel(dto: ItemGetDto): ItemGetModel {
        return {
            toDoItemId: dto.toDoItemId,
            title: dto.title,
            description: dto.description,
            isCompleted: dto.isCompleted,
            createdAt: new Date(dto.createdAt),
            dueDate: new Date(dto.dueDate)
        };
    }
}
