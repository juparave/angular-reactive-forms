# ReactiveForms

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 17.0.9.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Simple Form

Updates taxes if price or quantity are modified.

Gets the form element `total` and listens to changes, then gets the `tax` control from the `taxes` `FormArray`

```ts
this.form.get('total')?.valueChanges.subscribe((value: any) => {
  // update taxes
  const fg = this.form.get(['taxes', 'tax']) as FormArray;
  fg.controls.forEach((control) => {
    control.get('base')?.setValue(value);
    control.get('tax')?.setValue(value * (control.get('rate')?.value || 0));
  })
})
```

## Nested Form

Updates taxes if price or quantity are modified and updates the total.

Gets the `FormArray` order => products and listens to changes, then gets the `tax` control from the `taxes` `FormArray`

```ts
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

        // update order
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
```

## References

- [Angular FormArray: Complete Guide](https://blog.angular-university.io/angular-form-array/)
- [How to identify which item in FormArray emitted valueChanges event?](https://stackoverflow.com/questions/53654938/how-to-identify-which-item-in-formarray-emitted-valuechanges-event)