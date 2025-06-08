import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { map } from 'rxjs/operators'
import { UserService } from './user.service';

@Injectable({
    providedIn: 'root'
})

export class ResolverService implements Resolve<any>{

    constructor(private user: UserService) { }
    
    resolve() {
        return this.user.findUsersStats().pipe(map(stats => stats))
    }
}
