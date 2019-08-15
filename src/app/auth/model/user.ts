import {Utils} from '../../utils';

export class User {

    userName;
    userPassword;
    group;

    constructor(userName, userPassword, group) {
        this.userName = userName;
        this.userPassword = userPassword;
        this.group = group;
    }

}
