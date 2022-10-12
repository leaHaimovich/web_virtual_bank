const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
rl.on('SIGINT', () => process.exit(0));
rl.prompt(true); // preserve the cursor on the same line

function exitIfEnd(str) { if (str === 'end') process.exit(0) }

module.exports = str =>  {
    return new Promise(resolve => {
        rl.question(str, answer => {
            exitIfEnd(answer);
            resolve(answer);
        });
    });
};
