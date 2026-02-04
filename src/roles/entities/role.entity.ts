export class RoleEntity{
    id:string;
    name:string;
    description:string;
    isActive:boolean;

    constructor(partial:Partial<RoleEntity>){
        Object.assign(this,partial);
    }

    canBeAssigned():boolean{
        return this.isActive;
    }
}