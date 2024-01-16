import { AfterViewInit, Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { Tax } from '../../shared/tax';


let exampleProduct = {
  productName: 'Coke',
  price: 11,
  quantity: 1,
  total: 11,
  taxes: {
    tax: [
      {
        base: 11,
        rate: 0.1,
        tax: 1.1,
      },
    ],
  },
};


@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss'
})
export class FormComponent implements OnInit, AfterViewInit {

  private fb = inject(FormBuilder);
  form!: FormGroup;


  ngOnInit(): void {
    this.buildForm();
  }

  buildForm(): void {
    this.form = this.fb.group({
      productName: '',
      price: 0,
      quantity: 0,
      total: 0,
      taxes: this.fb.group({
        tax: this.fb.array<Tax>([]),
      }),
    });

    // add valueChanges listeners
    this.form.get('price')?.valueChanges.subscribe((value: any) => {
      if (this.form.get('quantity')?.value) {
        this.form
          .get('total')
          ?.setValue(value * (this.form.get('quantity')?.value || 0));
      }
    });
    this.form.get('quantity')?.valueChanges.subscribe((value: any) => {
      if (this.form.get('price')?.value) {
        this.form
          .get('total')
          ?.setValue(value * (this.form.get('price')?.value || 0));
      }
    });
    this.form.get('total')?.valueChanges.subscribe((value: any) => {
      // update taxes
      const fg = this.form.get(['taxes', 'tax']) as FormArray;
      fg.controls.forEach((control) => {
        control.get('base')?.setValue(value);
        control.get('tax')?.setValue(value * (control.get('rate')?.value || 0));
      })
    })

    // fill taxes
    const taxes: FormGroup[] = [];
    exampleProduct.taxes.tax.forEach((tax) => {
      taxes.push(this.createTaxFormGroup(tax));
    });

    const fg = this.form.get(['taxes']) as FormGroup;
    fg.setControl('tax', this.fb.array(taxes));

    this.form.patchValue(exampleProduct);
  }

  ngAfterViewInit() {
    console.log('afterViewInit');
  }

  get taxesFormArray(): FormArray {
    console.log(this.form.get(['taxes', 'tax']));
    return this.form.get(['taxes', 'tax']) as FormArray;
  }


  customTrackBy(index: number): number {
    return index;
  }

  createTaxFormGroup(tax: Tax): FormGroup {
    const formGroup = this.fb.group({
      base: tax.base,
      rate: tax.rate,
      tax: tax.tax,
    });
    return formGroup;
  }

}
