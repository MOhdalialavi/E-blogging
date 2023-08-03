import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatMenuModule } from '@angular/material/menu';

const materialModules = [MatFormFieldModule,
  MatButtonModule,
  MatInputModule,
  MatSnackBarModule
]
@NgModule({
  imports: [
    CommonModule,
    materialModules,
    MatMenuModule

  ],
  exports: [materialModules],
  declarations: []
})
export class MaterialModule { }
