module.exports = async function timeout(time) {
    try {
        await ((() => new Promise(r => setTimeout(r, time)))());
    } catch (err) { debug(`timeout ERROR: ${e}`); }
};
