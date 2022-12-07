import React, { useState, useEffect } from 'react'
import { IPropsWeb3 } from '../interfaces';
import styles from '../styles/Component.module.css';

const Admin = (props: IPropsWeb3) => {
    const { contract, web3 } = props;

    const [desc, setDesc] = useState<string>('');
    const [recipient, setRecipient] = useState<string>('');
    const [amt, setAmt] = useState<string>('');
    const createSpendingRequest = async () => {
        try {
            const ethers = web3.utils.toWei(amt, 'wei');
            const [account, ...accs] = await web3.eth.getAccounts();
            await contract.methods.createSpendingRequest(desc, recipient, ethers).send({ from: account, value: 0 });
        } catch (e) {
            console.error(e);
        }
    }

    const [reqID, setReqID] = useState<string>('');
    const approveRequest = async () => {
        try {
            const [account, ...accs] = await web3.eth.getAccounts();
            await contract.methods.makePayment(parseInt(reqID)).send({ from: account, value: 0 });
        } catch (e) {
            console.error(e);
        }
    }


    return (<>
        <div className={styles.Container}>
            <div className={styles.Row}>
                <input value={desc} placeholder='Enter Description for Spending Request' onChange={e => setDesc(e.target.value)} ></input>
                <input value={recipient} placeholder='Enter Recipient Wallet Address' onChange={e => setRecipient(e.target.value)} ></input>
                <input value={amt} placeholder='Enter Contribution Amount (Wei)' onKeyPress={(e) => !/[0-9]/.test(e.key) && e.preventDefault()}
                    onChange={e => setAmt(e.target.value)}
                ></input>
                <button onClick={createSpendingRequest}>{'Create Spending Request'}</button>
            </div>
            <div className={styles.Row}>
                <input value={reqID} placeholder='Enter Request ID' onKeyPress={(e) => !/[0-9]/.test(e.key) && e.preventDefault()}
                    onChange={e => setReqID(e.target.value)}
                ></input>
                <button onClick={approveRequest}>{'Try Approve Request and Make Payment'}</button>
            </div>
        </div>
    </>);
}

export default Admin;