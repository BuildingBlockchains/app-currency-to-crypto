const Web3 = require('web3');
const { 
    NETWORK_URL, 
    PRIVATE_KEY,
} = require('./credentials')
const { ERC20_ADDRESS, ERC20_ABI } = require('./contractInfo')

const web3 = new Web3(new Web3.providers.HttpProvider(NETWORK_URL));

const txHash = async () => {
    const acc = await web3.eth.accounts.privateKeyToAccount(PRIVATE_KEY);
    const nonce = await web3.eth.getTransactionCount(acc.address);
    const erc20Instance = await new web3.eth.Contract(ERC20_ABI, ERC20_ADDRESS);
    const transferMethod = erc20Instance.methods.transfer(acc.address, 1000);
    const gasPrice = await web3.eth.getGasPrice();
    const gas = await transferMethod.estimateGas(acc.address, 1000, {
        from: acc.address
      });
    

    const tx = {
        from: acc.address,
        to: ERC20_ADDRESS,
        gas, 
        gasPrice,
        nonce,
        data: transferMethod.encodeABI()
    }


    const signedTransaction = await acc.signTransaction(tx);

    const transactionReceipt = await web3.eth.sendSignedTransaction(signedTransaction.rawTransaction);

    console.log(transactionReceipt);

    
    
}

txHash();