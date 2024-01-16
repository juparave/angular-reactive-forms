import { AfterViewInit, Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, AbstractControl } from '@angular/forms';
import { Tax } from '../../shared/tax';
import { Product } from '../../shared/product';
import { debounceTime, map, merge } from 'rxjs';


const exampleOrder = {
  orderName: 'Order 1',
  order: {
    products: [
      {
        productName: 'Fish',
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
      },
      {
        productName: 'Chips',
        price: 22,
        quantity: 1,
        total: 22,
        taxes: {
          tax: [
            {
              base: 22,
              rate: 0.1,
              tax: 2.2,
            },
          ],
        },
      }
    ],
    subTotal: 33,
    taxes: 3.3,
    total: 36.3,
  }
}


@Component({
  selector: 'app-nested-form',
  templateUrl: './nested-form.component.html',
  styleUrl: './nested-form.component.scss'
})
export class NestedFormComponent implements OnInit, AfterViewInit {

  private fb = inject(FormBuilder);
  form!: FormGroup;

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm(): void {
    this.form = this.fb.group({
      orderName: '',
      order: this.fb.group({
        products: this.fb.array<Product>([]),
        subTotal: 0,
        taxes: 0,
        total: 0,
      }),
    });

    // fill products
    const products: FormGroup[] = [];
    exampleOrder.order.products.forEach((product: Product) => {
      products.push(this.createProductFormGroup(product));
    });

    const fg = this.form.get(['order']) as FormGroup;
    fg.setControl('products', this.fb.array(products));


    // add valueChanges listeners
    // ref: https://stackoverflow.com/questions/53654938/how-to-identify-which-item-in-formarray-emitted-valuechanges-event
    const fa = this.form.get(['order', 'products']) as FormArray;
    merge(...fa.controls.map((control: AbstractControl, index: number) =>
      control.valueChanges.pipe(
        debounceTime(300),
        map(value => ({ index, control, value })))
    ))
      .subscribe(pfg => {
        // console.log('valueChanges', pfg);
        // console.log('value', pfg.value);
        pfg.control.get('total')?.setValue(
          pfg.control.get('price')?.value * pfg.control.get('quantity')?.value,
          { emitEvent: false });
        // update taxes
        const taxesFG: FormGroup[] = [];
        pfg.value.taxes.tax.forEach((tax: Tax) => {
          tax.base = pfg.control.get('total')?.value;
          // tax has two decimals only
          tax.rate = Math.round(tax.rate * 100) / 100;
          tax.tax = Math.round(tax.base * tax.rate * 100) / 100;
          taxesFG.push(this.createTaxFormGroup(tax));
        });
        const fg = pfg.control.get(['taxes']) as FormGroup;
        fg.setControl('tax', this.fb.array(taxesFG), { emitEvent: false });
        fg.updateValueAndValidity({ emitEvent: false });

        // update order totals
        let subTotal = 0;
        let taxes = 0;
        let total = 0;
        fa.controls.forEach((control: AbstractControl) => {
          subTotal += control.get('total')?.value;
          control.get(['taxes', 'tax'])?.value.forEach((tax: Tax) => {
            taxes += tax.tax;
          });
        });
        total = subTotal + taxes;
        const order = this.form.get(['order']) as FormGroup;
        order.get('subTotal')?.setValue(subTotal, { emitEvent: false });
        order.get('taxes')?.setValue(taxes, { emitEvent: false });
        order.get('total')?.setValue(total, { emitEvent: false });

      });

    this.form.patchValue(exampleOrder);
  }

  ngAfterViewInit() {
    console.log('afterViewInit');
  }

  get productsFormArray(): FormArray {
    // console.log(this.form.get(['order', 'products']));
    return this.form.get(['order', 'products']) as FormArray;
  }

  taxesFormArray(idx: number): FormArray {
    // console.log(this.form.get(['order', 'products', idx, 'taxes', 'tax']));
    return this.form.get(['order', 'products', idx, 'taxes', 'tax']) as FormArray;
  }


  customTrackBy(index: number): number {
    return index;
  }

  createProductFormGroup(product: Product): FormGroup {
    const formGroup = this.fb.group({
      productName: product.productName,
      price: product.price,
      quantity: product.quantity,
      total: product.total,
      taxes: this.fb.group({
        tax: this.fb.array<Tax>([]),
      }),
    });

    // fill taxes
    const taxes: FormGroup[] = [];
    product.taxes.tax.forEach((tax) => {
      taxes.push(this.createTaxFormGroup(tax));
    });

    const fg = formGroup.get(['taxes']) as FormGroup;
    fg.setControl('tax', this.fb.array(taxes));

    return formGroup;
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
