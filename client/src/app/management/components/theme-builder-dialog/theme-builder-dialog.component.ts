import { AfterViewInit, Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { Theme } from 'app/shared/models/theme/theme';

import { OrganizationService } from '../../../core/core-services/organization.service';
import { ColorService } from '../../../core/ui-services/color.service';
import { ComponentServiceCollector } from '../../../core/ui-services/component-service-collector';
import { ThemeService } from '../../../core/ui-services/theme.service';
import { BaseComponent } from '../../../site/base/components/base.component';

type ThemeBuilderDialogData = {
    [K in keyof Theme]?: string;
};

@Component({
    selector: `os-theme-builder-dialog`,
    templateUrl: `./theme-builder-dialog.component.html`,
    styleUrls: [`./theme-builder-dialog.component.scss`]
})
export class ThemeBuilderDialogComponent extends BaseComponent implements AfterViewInit {
    public paletteBuilderForm: FormGroup;

    public _paletteKeys: string[] = [`500`];
    private _themePalettes: ThemePalette[] = [`primary`, `accent`, `warn`];

    private _currentPalettes: { [formControlName: string]: string } = {};

    public constructor(
        componentServiceCollector: ComponentServiceCollector,
        protected translate: TranslateService,
        private dialogRef: MatDialogRef<ThemeBuilderDialogComponent>,
        private fb: FormBuilder,
        private colorService: ColorService,
        private themeService: ThemeService,
        private organizationService: OrganizationService,
        @Inject(MAT_DIALOG_DATA) private data: ThemeBuilderDialogData
    ) {
        super(componentServiceCollector, translate);
    }

    public ngAfterViewInit(): void {
        setTimeout(() => {
            this.paletteBuilderForm = this.createForm();
            for (const paletteName of this._themePalettes) {
                const formUpdate = this.data ?? this.createFormUpdate(paletteName);
                this.paletteBuilderForm.patchValue(formUpdate);
                Object.keys(formUpdate).forEach(key => (this._currentPalettes[key] = formUpdate[key])); // Set the initial values
            }
            this.paletteBuilderForm.patchValue({ name: this.getNextThemeName() });
        });
    }

    public resetField(formControlName: string | ThemePalette): void {
        if (formControlName === `primary` || formControlName === `accent` || formControlName === `warn`) {
            this.paletteBuilderForm.patchValue(this.createFormUpdate(formControlName));
        } else {
            this.paletteBuilderForm.patchValue({ [formControlName]: this._currentPalettes[formControlName] });
        }
    }

    public onClose(): void {
        for (const palette of this._themePalettes) {
            this.resetField(palette);
        }
        this.dialogRef.close(null);
    }

    public onConfirm(): void {
        this.dialogRef.close({
            ...this.paletteBuilderForm.value
        });
    }

    public createFormControlName(paletteName: ThemePalette, paletteKey: string): string {
        return `${paletteName}_${paletteKey}`;
    }

    private createForm(): FormGroup {
        const formGroup = {
            name: [``, Validators.required]
        };
        for (const paletteName of this._themePalettes) {
            for (const paletteKey of this._paletteKeys) {
                formGroup[`${paletteName}_${paletteKey}`] = [``];
            }
        }
        return this.fb.group(formGroup);
    }

    // Combine createForm with createFormUpdate
    private createFormUpdate(paletteName: ThemePalette, hex?: string): { [formControlName: string]: string } {
        const nextColor = hex || this.themeService.getDefaultColorByPalette(paletteName);
        const palette = this.colorService.generateColorPaletteByHex(nextColor);
        const updateForm = {};
        for (const definition of palette) {
            const paletteKey = `${paletteName}_${definition.name}`;
            updateForm[paletteKey] = definition.hex;
        }
        return updateForm;
    }

    private getNextThemeName(): string {
        if (this.data) {
            return this.data.name;
        } else {
            const currentThemeAmount = this.organizationService.organization.theme_ids.length;
            return `${this.organizationService.organization.name} Theme (${currentThemeAmount + 1})`;
        }
    }
}
