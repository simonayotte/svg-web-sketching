// Reponse d'une requete http
export class HttpResponse {
    status:string;
    message:string;
    constructor(status:string,message:string){
        this.status = status;
        this.message = message;
    }
}
