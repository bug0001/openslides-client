import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { E2EImportsModule } from 'e2e-imports.module';

import { CountdownDialogComponent, CountdownDialogData } from './countdown-dialog.component';

describe(`CountdownDialogComponent`, () => {
    let component: CountdownDialogComponent;
    let fixture: ComponentFixture<CountdownDialogComponent>;

    const dialogData: CountdownDialogData = {
        title: ``,
        description: ``,
        duration: ``
    };

    beforeEach(
        waitForAsync(() => {
            TestBed.configureTestingModule({
                imports: [E2EImportsModule],
                declarations: [CountdownDialogComponent],
                providers: [
                    { provide: MatDialogRef, useValue: {} },
                    {
                        provide: MAT_DIALOG_DATA,
                        useValue: dialogData
                    }
                ]
            }).compileComponents();
        })
    );

    beforeEach(() => {
        fixture = TestBed.createComponent(CountdownDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it(`should create`, () => {
        expect(component).toBeTruthy();
    });
});
