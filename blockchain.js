
let Block = require('./block.js');

 class BlockChain { // Our Blockchain Object
    constructor() {
        this.blockchain = [this.startGenesisBlock()] // Initialize a new array of blocks, starting with a genesis block
    }
    startGenesisBlock() {
        return new Block({}) // Create an empty block to start
    }
    obtainLatestBlock() {
        return this.blockchain[this.blockchain.length - 1] // Get last block on the chain
    }
    addNewBlock(newBlock) { // Add a new block
        newBlock.prevHash = this.obtainLatestBlock().hash // Set its previous hash to the correct value
        newBlock.hash = newBlock.computeHash() // Recalculate its hash with this new prevHash value
        this.blockchain.push(newBlock) // Add the block to our chain
    }
    checkChainValidity() { // Check to see that all the hashes are correct and the chain is therefore valid
        for(let i = 1; i < this.blockchain.length; i++) { // Iterate through, starting after the genesis block
            const currBlock = this.blockchain[i]
            const prevBlock = this.blockchain[i -1]
            
            // Is the hash correctly computed, or was it tampered with?
            if(currBlock.hash !== currBlock.computeHash()) { 
                return false
            }
          
            // Does it have the correct prevHash value?; ie: What a previous block tampered with?
            if(currBlock.prevHash !== prevBlock.hash) {                 
              return false
            }
            
        }
        return true // If all the blocks are valid, return true
    }
}

module.exports = BlockChain;

// Create two test blocks with some sample data
let a = new Block({from: "Joe", to: "Jane"})
let b = new Block({from: "Jane", to: "Joe"})

 
let chain = new BlockChain() // Init our chain
chain.addNewBlock(a) // Add block a
chain.addNewBlock(b) // Add block b
console.log(chain) // Print out the blockchain
console.log("Validity: " + chain.checkChainValidity()) // Check our chain for validity