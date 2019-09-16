import { Component, ElementRef, Input, ViewChild, ViewChildren } from '@angular/core';
import { CustomizeParameter, CustomizeParameterGroup } from 'shared/models';
import { I18nService } from 'src/app/shared/services/i18n.service';
import { sum } from 'lodash';

@Component({
    selector: 'p-define-weights-by-group-colors',
    templateUrl: './define-weights-by-group-colors.component.html',
    styleUrls: ['./define-weights-by-group-colors.component.scss'],
})
export class DefineWeightsByGroupColorsComponent {
    constructor(private i18Service: I18nService) {}
    selectedGroup: CustomizeParameterGroup;
    @Input() groups: { previous: number; color: string; parameterGroups: CustomizeParameterGroup[] };
    private inMove: boolean;
    private isMove: boolean;

    ngOnInit() {
        this.selectedGroup = this.groups.parameterGroups[0];
        // this.groups.parameterGroups.forEach(group => {
        //     group.previous = group.percent;
        // });
    }

    private getTargetX(e) {
        const rect = e.currentTarget.getBoundingClientRect();
        return e.clientX - rect.left;
    }
    _headerCells: ElementRef[];
    totalWidth: number;
    @ViewChildren('headercell') set headerCells(cells) {
        this._headerCells = cells.toArray();
        setTimeout(() => {
            this.totalWidth = sum(this._headerCells.map(c => c.nativeElement.clientWidth));
        });
    }
    isResizeActive = false;
    @ViewChild('container', null) container: ElementRef;
    resizeTable(event, i) {
        const cells = this._headerCells;
        const elNextIndex = i + 1;
        // if (this.selectedGroup.name === this.groups.parameterGroups[!].name) {
        //     this.carrentGroup = true;
        // }
        if (this.inMove || !cells[elNextIndex] || !this.isResizeActive) {
            return;
        }
        this.inMove = true;
        const el = cells[i].nativeElement;
        const elStartWidth = el.clientWidth;
        const startX = event.pageX;
        const dir = this.i18Service.dir === 'ltr' ? 1 : -1;
        const elNextStartWidth = cells[elNextIndex].nativeElement.clientWidth;
        const nextCurrentPresent = this.groups.parameterGroups[elNextIndex].percent;
        const currentPresent = this.groups.parameterGroups[i].percent;

        const moveFn = (ev: any) => {
            const offset = (ev.pageX - startX) * dir;
            if (elStartWidth + offset < 0 || elNextStartWidth - offset < 0) {
                return;
            }
            this.groups.parameterGroups[i].percent = ((elStartWidth + offset) / this.totalWidth) * 100;
            this.groups.parameterGroups[elNextIndex].percent = ((elNextStartWidth - offset) / this.totalWidth) * 100;

            // this.resetPercent(this.groups.parameterGroups[i]);
            // this.resetPercent(this.groups.parameterGroups[elNextIndex]);
        };
        const upFn = () => {
            document.removeEventListener('mousemove', moveFn);
            document.removeEventListener('mouseup', upFn);
            this.inMove = false;
            this.isMove = true;
            this.groups.parameterGroups[i].previous = currentPresent;
            this.groups.parameterGroups[elNextIndex].previous = nextCurrentPresent;
        };
        document.addEventListener('mousemove', moveFn);
        document.addEventListener('mouseup', upFn);
    }

    mousemove(ev, i) {
        if (this.inMove) {
            return;
        }
        this.isResizeActive = false;
        const el = ev.currentTarget;
        const elWidth = el.clientWidth;
        let x = this.getTargetX(ev);
        if (this.i18Service.dir === 'rtl') {
            x = elWidth - x;
        }
        if (elWidth - x < 10) {
            this.isResizeActive = true;
        }
    }

    resetPercent(group: CustomizeParameterGroup) {
        const percent = 100 / group.activeParameters.length;
        group.activeParameters.forEach(p => (p.percent = percent));
    }

    getPercentFromTotal(group: CustomizeParameterGroup, parameter: CustomizeParameter) {
        return (parameter.percent * group.percent) / 100;
    }
}
