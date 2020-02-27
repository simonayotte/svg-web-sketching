import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable()
export class Store<T> {
    private state_: BehaviorSubject<T>;
    stateObs: Observable<T>;

    constructor(initialState: T) {
        this.state_ = new BehaviorSubject(initialState);
        this.stateObs = this.state_.asObservable();
    }

    protected get state(): T {
        return this.state_.getValue();
    }

    protected setState(nextState: T): void {
        this.state_.next(nextState);
    }
}
