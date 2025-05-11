import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DialogService {


  private openAddCityDialogSource = new Subject<void>();
  openAddCityDialog$ = this.openAddCityDialogSource.asObservable();

  constructor() {
  }

  openAddCityDialog() {
    this.openAddCityDialogSource.next();
  }
}
