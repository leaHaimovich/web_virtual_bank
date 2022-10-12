const debug = require("debug")("mongo:model-transfers");
//const { colors } = require("debug/src/browser");
const mongo = require("mongoose");


module.exports = db => {
    // create a schema
    let schema = new mongo.Schema({
       from_ID: { type: String, required: true, unique: true, index: true },
       to_ID: { type: String, required: true, unique: true, index: true },
        numOfCoins: {type: Number, required: true},
        date_of_transfers:{type: Date, require: true},
        created_at: Date,
        updated_at: Date
    }, { autoIndex: false });

   
    

    schema.statics.CREATE = async function(transfers) {
        console.log("create loan")
        return this.create({
            from_ID: transfers[0],
            to_ID: transfers[1],
            numOfCoins: transfers[2],
            date_of_transfers: transfers[3]
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

    schema.statics.getAll = async function() {
      return this.find({}).sort({date_of_transfers:-1}).exec();
    }
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
    db.model('Transfers', schema); // if model name as lowercase with suffix "s" === collection name: User => users
    debug("Transfers model created");
};
