export interface PhoneValidation {
  id?: number;
  number: string;
  country_code: string;
  valid: boolean;
  local_format: string;
  international_format: string;
  country_name: string;
  location: string;
  carrier: string;
  line_type: string;
  country_prefix: string;
}
