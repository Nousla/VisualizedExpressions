import { Component, ViewChild, ElementRef, ViewEncapsulation } from '@angular/core';
import {DialogModule} from 'primeng/primeng';

@Component({
    selector: 'modal-success',
    templateUrl: './modal-success.component.html', 
    encapsulation: ViewEncapsulation.None
})

export class ModalSuccessComponent {
    display: boolean = false;

    showDialog() {
        this.display = true;

    }
}