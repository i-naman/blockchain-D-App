import React, { useState, useEffect } from 'react'
import styles from '../styles/Component.module.css';
import { IPropsWeb3 } from '../interfaces';
import { showToastUtil, TOAST_TYPE } from './ToastUtil';

const Contribute = (props: IPropsWeb3) => {
    const { contract, web3 } = props;

    const [inputVal, setInputValue] = useState<string>('');

    const contributeAmount = async () => {
        try {
            const ethers = web3.utils.toWei(inputVal, 'wei');
            const [account, ...accs] = await web3.eth.getAccounts();
            await contract.methods.contribute().send({ from: account, value: ethers });
            showToastUtil({ status: TOAST_TYPE.SUCCESS, message: 'Your contribution was recieved successfully!' });
            showToastUtil({ status: TOAST_TYPE.INFO_MINT });
        } catch (e) {
            showToastUtil({ status: TOAST_TYPE.ERROR });
            console.error(e);
        }
    }

    return (<>
        <div className={styles.Container}>
            <div className={styles.Row}>
                <input value={inputVal} placeholder='Enter Contribution Amount (Wei)' onKeyPress={(e) => !/[0-9]/.test(e.key) && e.preventDefault()}
                    onChange={e => setInputValue(e.target.value)}
                ></input>
                <button onClick={contributeAmount}>{'Contribute Amount'}</button>
            </div>
        </div>
    </>);
}

export default Contribute;