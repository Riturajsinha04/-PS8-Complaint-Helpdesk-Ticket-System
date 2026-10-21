const mongoose = require ('mongoose');

const ticketSchema = new mongoose.Schema({
    ticketId : {type:String, required :true ,unique : true},
    title : {type:String, required : true},
    category : {type:String, required : true},
    priority : {type:String, enum : ['Low', 'Medium', 'High'], default : 'Medium'},
    description : {type:String, required : true},
    screenshotUrl : {type:String},
    status : {type:String, enum : ['Open', 'In Progress', 'Resolved', 'Closed'], default : 'Open'},
    customer : {type : mongoose.Schema.Types.ObjectId, ref : 'User', required : true},
    assignedDepartment : {type : mongoose.Schema.Types.ObjectId, ref : 'Department'},
    reopenCount : {type:Number, default : 0}
}, {timestamps : true});

module.exports = mongoose.model('Ticket', ticketSchema);
