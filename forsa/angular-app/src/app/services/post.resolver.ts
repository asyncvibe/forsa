import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { map } from 'rxjs/operators'
import { UserService } from './user.service';
import { PostService } from './post.service';

@Injectable({
    providedIn: 'root'
})

export class PostResolverService implements Resolve<any>{

    constructor(private post: PostService) { }
    
    resolve() {
        return this.post.findPropertyStats().pipe(map(stats => stats))
    }
}
