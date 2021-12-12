import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import {MatDialogModule} from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import {MatCardModule} from '@angular/material/card';

import { MatCheckboxDefaultOptions, MatCheckboxModule, MAT_CHECKBOX_DEFAULT_OPTIONS } from '@angular/material/checkbox';
@NgModule({
    imports: [
        BrowserAnimationsModule,
        MatToolbarModule,
        MatSidenavModule,
        MatIconModule,
        MatDividerModule,
        MatButtonModule,
        MatDialogModule,
        MatRadioModule,
        MatSelectModule,
        MatCheckboxModule,
        MatCardModule
    ],
    exports:[
        MatToolbarModule,
        MatSidenavModule,
        MatIconModule,
        MatDividerModule,
        MatButtonModule,
        MatDialogModule,
        MatRadioModule,
        MatSelectModule,
        MatCheckboxModule,
        MatCardModule
    ],
    providers:[
        //{provide: MAT_CHECKBOX_DEFAULT_OPTIONS, useValue: { clickAction: 'noop' } as MatCheckboxDefaultOptions}
    ]
})
export class MaterialModule { }
  