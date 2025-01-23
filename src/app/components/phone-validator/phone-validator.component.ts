import {Component, computed, signal} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {PhoneService} from '../../services/phone.service';
import {MatCard, MatCardContent, MatCardHeader, MatCardTitle} from '@angular/material/card';
import {MatIcon} from '@angular/material/icon';
import {NgClass} from '@angular/common';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatError, MatFormField} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {CONSTANTS} from '../../shared/constants';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {NotificationService} from '../../services/notification.service';
import {MatDialog} from '@angular/material/dialog';
import {ConfirmationDialogComponent} from '../../shared/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-phone-validator',
  imports: [
    MatCard,
    MatCardContent,
    MatIcon,
    NgClass,
    MatIconButton,
    MatFormField,
    MatButton,
    MatError,
    ReactiveFormsModule,
    MatInput,
    MatCardTitle,
    MatCardHeader,
    MatPaginator
  ],
  templateUrl: './phone-validator.component.html',
  standalone: true,
  styleUrl: './phone-validator.component.scss'
})
export class PhoneValidatorComponent {

  GLOBAL_CONSTANTS = CONSTANTS;
  validateForm: FormGroup;
  loading = false;
  error: string | null = null;

  pageSizeOptions = [2, 3, 5, 10, 20];
  currentPage = signal(0);
  pageSize = signal(2);

  constructor(
    private fb: FormBuilder,
    private notificationService: NotificationService,
    public phoneService: PhoneService,
    public dialog: MatDialog
  ) {
    this.validateForm = this.fb.group({
      phoneNumber: [this.GLOBAL_CONSTANTS.FORM.STRING_EMPTY, [Validators.required, Validators.minLength(10)]],
      countryCode: [this.GLOBAL_CONSTANTS.FORM.COUNTRY_CODE_DEFAULT, [Validators.required, Validators.minLength(2), Validators.maxLength(2)]]
    });
  }

  paginatedHistory = computed(() => {
    const start = this.currentPage() * this.pageSize();
    const end = start + this.pageSize();
    return this.phoneService.validationHistory().slice(start, end);
  });

  onPageChange(event: PageEvent): void {
    this.currentPage.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
  }

  validate(): void {
    if (this.validateForm.valid) {
      this.loading = true;
      this.error = null;

      this.phoneService.validatePhone(
        this.validateForm.get('phoneNumber')?.value,
        this.validateForm.get('countryCode')?.value
      ).subscribe({
        next: () => {
          this.loading = false;
          this.validateForm.reset({
            countryCode: this.GLOBAL_CONSTANTS.FORM.COUNTRY_CODE_DEFAULT
          });
          this.notificationService.showNotification(this.GLOBAL_CONSTANTS.FORM.PHONE_NUMBER_VALIDATED_SUCCESS_MESSAGE,
            this.GLOBAL_CONSTANTS.SNACKBAR.ACCEPT_BUTTON_LABEL);
        },
        error: (err) => {
          this.loading = false;
          this.error = this.GLOBAL_CONSTANTS.FORM.VALIDATION_ERROR;
          console.error(this.GLOBAL_CONSTANTS.FORM.VALIDATION_ERROR_TRACK, err);
        }
      });
    }
  }

  deleteValidation(id: number): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        message: this.GLOBAL_CONSTANTS.CONFIRMATION_DIALOG.CONFIRM_DELETE_ELEMENT_MESSAGE
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.phoneService.deleteFromHistory(id);
      }
    });
  }

  clearHistory(): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        message: this.GLOBAL_CONSTANTS.CONFIRMATION_DIALOG.CONFIRM_DELETE_ALL_HISTORY_MESSAGE
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.phoneService.clearHistory();
      }
    })
  }

}
