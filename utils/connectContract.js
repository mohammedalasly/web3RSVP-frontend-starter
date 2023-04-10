import abiJSON from "./Web3RSVP.json"
import { ethers } from "ethers"

function connectContract() {
    const contractAddress = "0xb9c70D7ED5E9F137c4deD2971E883Bf3678be962"
    const contractABI = abiJSON.abi
    let rsvpContract
    try {
        const { ethereum } = window

        if (ethereum) {
            //checking for eth object in the window
            const provider = new ethers.providers.Web3Provider(ethereum)
            const signer = provider.getSigner()
            rsvpContract = new ethers.Contract(contractAddress, contractABI, signer) // instantiating new connection to the contract
        } else {
            console.log("Ethereum object doesn't exist!")
        }
    } catch (error) {
        console.log("ERROR:", error)
    }
    return rsvpContract
}

export default connectContract
