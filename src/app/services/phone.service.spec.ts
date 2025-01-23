import {TestBed} from '@angular/core/testing';
import {HttpTestingController, provideHttpClientTesting} from '@angular/common/http/testing';
import {PhoneService} from './phone.service';
import {PhoneValidation} from '../models/phone-validation.interface';
import {environment} from '../../environments/environment';
import {CONSTANTS} from '../shared/constants';
import {provideHttpClient} from '@angular/common/http';

describe('PhoneService', () => {
  let service: PhoneService;
  let httpMock: HttpTestingController;

  const mockPhoneValidation: PhoneValidation = {
    international_format: '+573137741964',
    country_name: 'Colombia',
    carrier: 'Tigo',
    valid: true,
    id: Date.now(),
    number: '3137741964',
    country_code: 'CO',
    local_format: '0X, 04XX3137741964',
    location: '',
    line_type: 'Mobile',
    country_prefix: '+57'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        PhoneService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ]
    });

    service = TestBed.inject(PhoneService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('validatePhone', () => {
    it('should return a PhoneValidation object and update history', () => {
      service.validatePhone('3137741964', 'CO').subscribe((validation) => {
        expect(validation).toBeTruthy();
        expect(validation.id).toBeDefined();
        expect(validation.international_format).toBe('+573137741964');
        expect(validation.country_name).toBe('Colombia');
      });

      const req = httpMock.expectOne((req) => req.url === environment.apiUrl);
      expect(req.request.method).toBe('GET');
      expect(req.request.params.has('access_key')).toBeTrue();
      expect(req.request.params.get('number')).toBe('3137741964');
      expect(req.request.params.get('country_code')).toBe('CO');
      expect(req.request.params.get('format')).toBe(CONSTANTS.FORM.ONE);

      req.flush(mockPhoneValidation);

      expect(service.validationHistory()[0].number).toEqual(mockPhoneValidation.number);
    });

    it('should handle error response gracefully', () => {
      const errorResponse = {
        status: 500,
        statusText: 'Internal Server Error'
      };

      service.validatePhone('3137741964', 'CO').subscribe({
        next: () => fail('Expected error, but got success'),
        error: (error) => {
          expect(error.status).toBe(500);
          expect(error.statusText).toBe('Internal Server Error');
        }
      });

      const req = httpMock.expectOne((req) => req.url === environment.apiUrl);
      req.flush('Error', errorResponse);
    });
  });

  describe('addToHistory', () => {
    it('should add validation to the history', () => {
      service['addToHistory'](mockPhoneValidation);
      expect(service.validationHistory()).toEqual([mockPhoneValidation]);
    });

    it('should handle adding multiple entries to history', () => {
      const anotherValidation: PhoneValidation = {
        ...mockPhoneValidation,
        id: Date.now() + 1,
        number: '3141234567',
      };
      service['addToHistory'](mockPhoneValidation);
      service['addToHistory'](anotherValidation);
      expect(service.validationHistory()).toEqual([anotherValidation, mockPhoneValidation]);
    });
  });

  describe('deleteFromHistory', () => {
    it('should delete the validation from history', () => {
      service['addToHistory'](mockPhoneValidation);
      // @ts-ignore
      service.deleteFromHistory(mockPhoneValidation.id);
      expect(service.validationHistory()).toEqual([]);
    });

    it('should not delete any item if the id does not exist', () => {
      service['addToHistory'](mockPhoneValidation);
      service.deleteFromHistory(123456789);
      expect(service.validationHistory()).toEqual([mockPhoneValidation]);
    });
  });

  describe('clearHistory', () => {
    it('should clear the validation history', () => {
      service['addToHistory'](mockPhoneValidation);
      service.clearHistory();
      expect(service.validationHistory()).toEqual([]);
    });

    it('should handle clearing an already empty history', () => {
      service.clearHistory();
      expect(service.validationHistory()).toEqual([]);
    });
  });
});
