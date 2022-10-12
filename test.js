const debug = require("debug")("mongo:test");

const Client = require("./models")("Client");
const manager = require("./models")("Manager");
const loan = require("./models")("Loan");
const levcoin = require("./models")("LevCoin");

const { Db } = require("mongodb");
//const client = require('./models/client');
const prompt = require("./prompt");
const { all } = require("./routes/loansRout");
const timeout = require("./timeout");

(async () => {
  let user;
  while (true) {
    console.clear();
    await timeout(500);
    console.log("Choose action from the menu:");
    console.log("1. Inquire user by username");
    console.log("2. Inquire user by _id and make it dude");
    console.log(
      "3. Inquire users by chained query (admin's created during last month)"
    );
    console.log("4. Do a chain of parallel requests");
    console.log("5. Add a client (different ways)");
    console.log("6. Add a manager (different ways)");
    console.log("7. Inquire flower by flowername ");
    console.log("8. Add a supplier");
    console.log("9. Add a item ");
    console.log("0. Exit");
    let choice = parseInt(await prompt("> "));
    switch (choice) {
      case 0:
        process.exit(0); /*
                case 1: // get a user by username
                    try {
                        console.log(await client.REQUEST(
                       {username: await prompt('Please enter username: ')}));   }
                    catch (err) { console.log(`Failure ${err}`); }
                    break;
                    case 2: // get a user by ID
                    let user1 = null;
                    let id = await prompt('Please enter user _ID: ');
                    try {
                        user1 = await client.REQUEST(id);
                        console.log(user1);
                    } catch (err) { console.log(`Failure ${err}`); }
                    if (user1 !== null) {
                        user1.dudify();
                        console.log(user1);
                        try {
                            await user1.save();
                        } catch (err) {
                            console.log(`Failure ${err}`);
                        }
                        try {
                            user1 = await User.REQUEST(id);
                            console.log(user1);
                        } catch (err) {
                            console.log(`Failure ${err}`);
                        }
                    }
                    break;
                case 3:
                    // get any admin that was created in the past month
                    // get the date 1 month ago
                    await prompt("Please press enter to continue to chain request...");
                    let monthAgo = new Date();
                    monthAgo.setMonth(monthAgo.getMonth() - 1);
                    try {

                        console.log(
                                            await User.find({admin: true}).where('created_at').gt(monthAgo).exec());
                    } catch (err) { console.log(`Failure ${err}`); }
                    break;
   
                case 4:
   
                    // Update a user
                    let queryToUpdateLocation = client.findOne(
                            {name: await prompt("Please enter a name of user to update location: ")}
                        ).exec();

                    let queryAndUpdatePassword = User.findOneAndUpdate(
                            {username: await prompt("Please enter a username to change password: ")},
                            {password: await prompt("Please enter new password: ")}
                        ).exec();

                    let queryForDelete = client.findOne(
                            {name: await prompt("Please enter a name of user to delete: ")}
                        ).exec();
       

                    let userToUpdateLocation, userPasswordUpdated, userToDelete,
                          updateLocation, removing;

                    try {
                        [userToUpdateLocation, userPasswordUpdated, userToDelete] =
                                                await Promise.all([queryToUpdateLocation,
                                                                                  queryAndUpdatePassword,
                                                                                  queryForDelete]);
                        console.log("Queries done");
                    } catch (err) { console.log(`Failure ${err}`); }

                    if (userToUpdateLocation) {
                        console.log(`Updating Location of ${userToUpdateLocation.username}`);
                        // change the users location
                        userToUpdateLocation.location = 'il';
                        // save the user
                        updateLocation = userToUpdateLocation.save();
                    }
                    else
                        console.log(`Can't update location: user does not exist!`);
                    if (userPasswordUpdated)
                        console.log(`Password updated for ${userPasswordUpdated.username}` );
                    else
                        console.log(`Can't update password: user does not exist!`);
                    if (userToDelete) {
                        console.log(`Deleting user ${userToDelete.username}`);
                        // change the users location
                        removing =client.remove();// user.remove();
                    }
                    else
                        console.log(`Can't delete: user does not exist!`);

                    try {
                        let [res1, res3] = await Promise.all([updateLocation, removing]);
                        console.log("Users location updated and removed successfully");
                    } catch (err) { console.log(`Failure ${err}`); }
                    break;
    */
      case 5:
        let inputf = {
          first_name: await prompt("Enter client name: "),
          last_name: await prompt("Enter  last name: "),
          password: await prompt("Enter password: "),
          numOfCoins: await prompt("Enter num of coins"),
          date_of_birth: await prompt("enter birth date"),
          ID: await prompt("enterID"),
          phone_number: await prompt("enter phone number"),
        };
        const c = new Client(inputf);
        c.save();
        //let result1 = Client.CREATE(inputf);
        try {
          await result1;
          console.log("client created");
        } catch (err) {
          debug(`Failed: ${err}`);
        }
        break;
      case 6:
        let inputf_ = {
          first_name: await prompt("Enter manager name: "),
          last_name: await prompt("Enter manager last name: "),
          passward: await prompt("Enter password: "),
          date_of_birth: await prompt("enter birth date"),
          ID: await prompt("enterID"),
          phone_number: await prompt("enter phone number"),
        };
        const m = new manager(inputf_);
        m.save();

        //let result_ = manager.create(inputf_);
        try {
          await result_;
          console.log("manager created");
        } catch (err) {
          debug(`Failed: ${err}`);
        }
        break;
      case 7:
        let inputf_1 = {
          lender_name: await prompt("Enter lender name: "),
          borrower_name: await prompt("Enter  borrower name: "),
          numOfCoins: await prompt("Enter numOfCoins: "),
          date_of_loan: await prompt("enter date_of_loan"),
        };
        const l = new loan(inputf_1);
        l.save();
        break;
      case 8:
        let id = await prompt("enter id for delete");
        Client.deleteOne({ ID: id }, function (err) {
          if (err) console.log(err);
        });
        console.log("delete succed");
        break;
      case 9:
        let id_ = await prompt("enter id ");
        console.log(await Client.REQUEST({ ID: id_ }));
      /*console.log(  Client.find({ID: id_}, function(err){
                        if(err) console.log(err);
                        else{
                            
                        }                       
                        })); */
      case 10:
        let i = {
          dolar_value: 1,
          num_of_all_coins: 0,
        };
        const l11 = new levcoin(i);
        l11.save();
        console.log(await levcoin.REQUEST());
        break;

      case 11:
        var numOfClinents = await Client.find().count();
        console.log("numOfClinents: " + numOfClinents);
        // update lev coin value
        let [dd] = await levcoin.REQUEST();
        let d = dd.dolar_value;
        let noac = dd.num_of_all_coins;
        let allCoins = noac + 1;
        let dv = 1 - numOfClinents * 0.01;
        console.log("dv: " + dv + " allcoins: " + allCoins);
        let lc = { dolar_value: dv, num_of_all_coins: allCoins };

        levcoin.deleteOne(
          { num_of_all_coins: noac, dolar_value: d },
          function (err) {
            if (err) console.log(err);
          }
        );
        console.log("lev coin deleted");
        const l1 = new levcoin(lc);
        l1.save();
        console.log("lev coin created");

        break;
    }

    await prompt("Press Enter to return to the menu");
  }
})();
