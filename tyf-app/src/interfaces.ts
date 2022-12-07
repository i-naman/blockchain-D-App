import Web3 from "web3"

/* */
export interface IPropsWeb3 {
    contract: any
    web3: Web3
}

export interface Request {
    _id: number
    key: number
    description: string
    value: number
    recipient: string
    completed: boolean
    numberOfVoters: number
    voters: any
}
