import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class Store<T> {
    private STATE: BehaviorSubject<T>;
    stateObs: Observable<T>;

    constructor(initialState: T) {
        this.STATE = new BehaviorSubject(initialState);
        this.stateObs = this.STATE.asObservable();
    }

    protected get state(): T {
        return this.STATE.getValue();
    }

    protected setState(nextState: T): void {
        this.STATE.next(nextState);
    }
}
