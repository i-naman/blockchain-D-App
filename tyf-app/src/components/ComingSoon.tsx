import React, { useState, useEffect } from 'react'
import { IPropsWeb3 } from '../interfaces';
import styles from '../styles/Component.module.css';
import { showToastUtil, TOAST_TYPE } from './ToastUtil';

const ComingSoon = (props: IPropsWeb3) => {
    const { contract, web3 } = props;

    const [inputId3, setInputId3] = useState<string>('');
    const [inputId4, setInputId4] = useState<string>('');
    const transferNft = async () => {
        try {
            const [account, ...accs] = await web3.eth.getAccounts();
            const res: string = await contract.methods.safeTransferFrom(account, inputId3, inputId4).call();
            showToastUtil({ status: TOAST_TYPE.SUCCESS, message: `Trasferred Token ID: ${inputId4} ownership successfully!` });
        } catch (e) {
            showToastUtil({ status: TOAST_TYPE.ERROR });
            console.error(e);
        }
    }

    return (<>
        <div className={styles.Container}>
            <div className={styles.Row}>
                <div>{`More Exciting Rewards and custom NFTs for TYF contributors coming soon`}</div>
            </div>
            <div className={styles.Row}>
                <div>{`Transfering NFT Ownership`}</div>
            </div>
            <div className={styles.Row}>
                <input value={inputId3} placeholder='Enter Recipient ID' onChange={e => setInputId3(e.target.value.trim())} ></input>
                <input value={inputId4} placeholder='Enter your TYF NFT Token ID' onChange={e => setInputId4(e.target.value.trim())} ></input>
                <button onClick={() => transferNft()}>{'Transfer Ownership of your NFT!'}</button>
            </div>
        </div>
    </>);
}

export default ComingSoon;