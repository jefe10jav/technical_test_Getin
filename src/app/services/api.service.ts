import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  getAssignedStore():Observable<any>{
    return this.http.get("https://jefe10jav.github.io/technical_test_Getin/assets/data/assignedStore.json");
  }

  
  getBrandDateData():Observable<any>{
    return this.http.get("https://jefe10jav.github.io/technical_test_Getin/assets/data/brandDateData.json");
  }
}
