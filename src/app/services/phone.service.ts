import {HttpClient} from '@angular/common/http';
import {Injectable, signal} from '@angular/core';
import {PhoneValidation} from '../models/phone-validation.interface';
import {Observable, map, tap} from 'rxjs';
import {environment} from '../../environments/environment';
import {CONSTANTS} from '../shared/constants';

@Injectable({
  providedIn: 'root'
})
export class PhoneService {

  validationHistory = signal<PhoneValidation[]>([]);

  constructor(private http: HttpClient) {
  }

  validatePhone(phoneNumber: string, countryCode: string): Observable<PhoneValidation> {
    const params = {
      access_key: environment.accessKey,
      number: phoneNumber,
      country_code: countryCode,
      format: CONSTANTS.FORM.ONE
    };

    return this.http.get<PhoneValidation>(environment.apiUrl, {params}).pipe(
      map(response => ({
        ...response,
        id: Date.now()
      })),
      tap(validation => this.addToHistory(validation))
    );
  }

  private addToHistory(validation: PhoneValidation): void {
    this.validationHistory.update(history => [validation, ...history]);
  }

  deleteFromHistory(id: number): void {
    this.validationHistory.update(history =>
      history.filter(item => item.id !== id)
    );
  }

  clearHistory(): void {
    this.validationHistory.set([]);
  }

}
