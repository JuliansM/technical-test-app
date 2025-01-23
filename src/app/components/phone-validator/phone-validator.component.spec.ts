import {ComponentFixture, TestBed} from '@angular/core/testing';
import {PhoneValidatorComponent} from './phone-validator.component';
import {PhoneService} from '../../services/phone.service';
import {NotificationService} from '../../services/notification.service';
import {MatDialog} from '@angular/material/dialog';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {ReactiveFormsModule} from '@angular/forms';
import {of, throwError} from 'rxjs';
import {ConfirmationDialogComponent} from '../../shared/confirmation-dialog/confirmation-dialog.component';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {provideHttpClient} from '@angular/common/http';
import {provideHttpClientTesting} from '@angular/common/http/testing';
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';

describe('PhoneValidatorComponent', () => {
  let component: PhoneValidatorComponent;
  let fixture: ComponentFixture<PhoneValidatorComponent>;
  let phoneService: PhoneService;
  let notificationService: NotificationService;
  let dialog: MatDialog;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        MatCardModule,
        MatPaginator,
        MatButtonModule,
        MatIconModule,
        MatInputModule,
        PhoneValidatorComponent,
        ConfirmationDialogComponent
      ],
      providers: [
        PhoneService,
        NotificationService,
        MatDialog,
        provideHttpClient(),
        provideHttpClientTesting(),
        provideAnimationsAsync()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PhoneValidatorComponent);
    component = fixture.componentInstance;
    phoneService = TestBed.inject(PhoneService);
    notificationService = TestBed.inject(NotificationService);
    dialog = TestBed.inject(MatDialog);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('validate()', () => {
    it('should validate phone number and show success message', () => {
      const mockResponse = {
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

      spyOn(phoneService, 'validatePhone').and.returnValue(of(mockResponse));
      spyOn(notificationService, 'showNotification');

      component.validateForm.setValue({
        phoneNumber: '3137741964',
        countryCode: 'CO',
      });

      component.validate();

      expect(component.loading).toBeFalse();
      expect(notificationService.showNotification).toHaveBeenCalledWith(
        component.GLOBAL_CONSTANTS.FORM.PHONE_NUMBER_VALIDATED_SUCCESS_MESSAGE,
        component.GLOBAL_CONSTANTS.SNACKBAR.ACCEPT_BUTTON_LABEL
      );
    });

    it('should handle error when validation fails', () => {
      spyOn(phoneService, 'validatePhone').and.returnValue(throwError('error'));
      spyOn(notificationService, 'showNotification');

      component.validateForm.setValue({
        phoneNumber: '3137741964',
        countryCode: 'CO',
      });

      component.validate();

      expect(component.loading).toBeFalse();
      expect(component.error).toBe(component.GLOBAL_CONSTANTS.FORM.VALIDATION_ERROR);
    });

    it('should not submit if form is invalid', () => {
      component.validateForm.setValue({
        phoneNumber: '',
        countryCode: 'CO',
      });

      spyOn(phoneService, 'validatePhone');
      component.validate();

      expect(phoneService.validatePhone).not.toHaveBeenCalled();
    });
  });

  describe('Pagination', () => {
    it('should update page and page size on pagination change', () => {
      const pageEvent = {pageIndex: 1, pageSize: 3} as PageEvent;

      component.onPageChange(pageEvent);

      expect(component.currentPage()).toBe(1);
      expect(component.pageSize()).toBe(3);
    });
  });

  describe('deleteValidation()', () => {
    it('should open delete confirmation dialog and delete validation when confirmed', () => {
      const dialogRef = {afterClosed: () => of(true)} as any;
      spyOn(dialog, 'open').and.returnValue(dialogRef);
      spyOn(phoneService, 'deleteFromHistory');

      component.deleteValidation(1);

      expect(dialog.open).toHaveBeenCalledWith(ConfirmationDialogComponent, {
        data: {message: component.GLOBAL_CONSTANTS.CONFIRMATION_DIALOG.CONFIRM_DELETE_ELEMENT_MESSAGE}
      });
      expect(phoneService.deleteFromHistory).toHaveBeenCalledWith(1);
    });

    it('should not delete validation if dialog is cancelled', () => {
      const dialogRef = {afterClosed: () => of(false)} as any;
      spyOn(dialog, 'open').and.returnValue(dialogRef);
      spyOn(phoneService, 'deleteFromHistory');

      component.deleteValidation(1);

      expect(dialog.open).toHaveBeenCalledWith(ConfirmationDialogComponent, {
        data: {message: component.GLOBAL_CONSTANTS.CONFIRMATION_DIALOG.CONFIRM_DELETE_ELEMENT_MESSAGE}
      });
      expect(phoneService.deleteFromHistory).not.toHaveBeenCalled();
    });
  });

  describe('clearHistory()', () => {
    it('should clear history after confirmation', () => {
      const dialogRef = {afterClosed: () => of(true)} as any;
      spyOn(dialog, 'open').and.returnValue(dialogRef);
      spyOn(phoneService, 'clearHistory');

      component.clearHistory();

      expect(dialog.open).toHaveBeenCalledWith(ConfirmationDialogComponent, {
        data: {message: component.GLOBAL_CONSTANTS.CONFIRMATION_DIALOG.CONFIRM_DELETE_ALL_HISTORY_MESSAGE}
      });
      expect(phoneService.clearHistory).toHaveBeenCalled();
    });

    it('should not clear history if dialog is cancelled', () => {
      const dialogRef = {afterClosed: () => of(false)} as any;
      spyOn(dialog, 'open').and.returnValue(dialogRef);
      spyOn(phoneService, 'clearHistory');

      component.clearHistory();

      expect(dialog.open).toHaveBeenCalledWith(ConfirmationDialogComponent, {
        data: {message: component.GLOBAL_CONSTANTS.CONFIRMATION_DIALOG.CONFIRM_DELETE_ALL_HISTORY_MESSAGE}
      });
      expect(phoneService.clearHistory).not.toHaveBeenCalled();
    });
  });
});
