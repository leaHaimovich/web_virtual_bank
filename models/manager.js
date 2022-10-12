const debug = require("debug")("mongo:model-manager");
const mongo = require("mongoose");


module.exports = db => {
    // create a schema
    let schema = new mongo.Schema({
        first_name: { type: String, required: true, unique: true, index: true },
        last_name: { type: String, required: true, unique: true, index: true },
        passward: {type: Number, required: true},
        //numOfCoins: {type: Number, required: true},
        date_of_birth:{type: Date, require: true},
        ID:{type: Number, require: true},
        phone_number:{type: Number, required: true},
        created_at: Date,
        updated_at: Date
    }, { autoIndex: false });

   
    schema.static.findById = async function(id){
       console.log(" im in findByID function")
       return this.find({ID: id});
    };

    schema.statics.CREATE = async function(manager) {
        return this.create({
            first_name: manager[0],
            last_name: manager[1],
            passward: manager[2],
            numOfCoins: manager[3],
            date_of_birth: manager[4],
            ID:manager[5],
            phone_number:manager[6]
            
        });
    };

    // on every save, add the date
    schema.pre('save', function(next) {
        // get the current date
        let currentDate = new Date();
        // change the updated_at field to current date
        this.updated_at = currentDate;
        // if created_at doesn't exist, add to that field
        if (!this.created_at)
            this.created_at = currentDate;
        next();
    });

    schema.statics.REQUEST = async function() {
        // no arguments - bring all at once
        const args =  [...arguments]; // Array.from(arguments);
        if (args.length === 0) {
            debug("request: no arguments - bring all at once");
            return this.find({}).exec();
        }

        // perhaps last argument is a callback for every single document
        let callback = arguments[arguments.length - 1];
        if (callback instanceof Function) {
            let asynch = callback.constructor.name === 'AsyncFunction';
            debug(`request: with ${asynch?'async':'sync'} callback`);
            args.pop();
            let cursor, user;
            try {
                cursor = await this.find(...args).cursor();
            } catch (err) { throw err; }
            try {
                while (null !== (user = await cursor.next())) {
                    if (asynch) {
                        try {
                            await callback(user);
                        } catch (err) { throw err; }
                    }
                    else {
                        callback(user);
                    }
                }
            } catch (err) { throw err; }
            return;
        }

        // request by id as a hexadecimal string
        if (args.length === 1 && typeof args[0] === "string") {
            debug("request: by ID");
            return this.findById(args[0]).exec();
        }

        // There is no callback - bring requested at once
        debug(`request: without callback: ${JSON.stringify(args)}`);
        return this.find(...args).exec();
    };

    // the schema is useless so far
    // we need to create a model using it
    // db.model('User', schema, 'User'); // (model, schema, collection)
    db.model('Manager', schema); // if model name as lowercase with suffix "s" === collection name: User => users
    debug("Manager model created");
};
