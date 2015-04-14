
var Table = function(capacity, id) {
    this.table_id = id;
    this.capacity = capacity;
    this.num_occupants = 0;
    this.time_left = 0;
    this.customer_details = null;

    this.assignCustomer = function(details, occupants) {
        this.setCustomerDetails(details);
        this.time_left = 60;
        this.num_occupants = occupants;
    }

    this.setCustomerDetails = function(details) {
        this.customer_details = details;
    }

}

var RestaurantModel = function() {
    this.tables = [];

    this.addTable = function(table) {
        this.tables.push(table);
    }
}
