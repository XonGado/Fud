var Customer = /** @class */ (function () {
    function Customer(name, username, email) {
        this.name = name;
        this.username = username;
        this.email = email;
    }
    Customer.prototype.setName = function (name) {
        this.name = name;
    };
    Customer.prototype.setUsername = function (username) {
        this.username = username;
    };
    Customer.prototype.setEmail = function (email) {
        this.email = email;
    };
    Customer.prototype.changeName = function (name) {
        this.name = name;
        // Query to firebase.
    };
    Customer.prototype.changeUsername = function (username) {
        this.username = username;
        //Query to firebase.
    };
    Customer.prototype.changeEmail = function (email) {
        this.email = email;
        //Query to firebase.
    };
    Customer.prototype.getFavorites = function () {
        // Queries from the database of the user's favorite diners.
    };
    return Customer;
}());
export { Customer };
//# sourceMappingURL=customer.model.js.map