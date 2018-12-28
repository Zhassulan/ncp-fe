export class User {

    userName: string;
    userPassword: string;
    group: string;

    constructor(userName: string, userPassword: string, group: string) {
        this.userName = userName;
        this.userPassword = userPassword;
        this.group = group;
    }

}
