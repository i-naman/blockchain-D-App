import React, { useState, useEffect } from 'react'
import styles from '../styles/Component.module.css';
import { IPropsWeb3 } from '../interfaces';
import { showToastUtil, TOAST_TYPE } from './ToastUtil';

const Campaign = (props: IPropsWeb3) => {
    const { contract, web3 } = props;

    const [totalAmtRaised, setTotalAmtRaised] = useState<string>('');
    const getTotalAmtRaised = async (onClick?: boolean) => {
        try {
            let totalAmtRaised = await contract.methods.getTotalFundsRaised().call();
            totalAmtRaised = web3.utils.fromWei(totalAmtRaised, 'ether');
            setTotalAmtRaised(totalAmtRaised);
            onClick && showToastUtil({ status: TOAST_TYPE.SUCCESS, message: 'Updated successfully!' });
        } catch (e) {
            showToastUtil({ status: TOAST_TYPE.ERROR });
            console.error(e);
        }
    }

    const [uniqueContributors, setUniqueContributors] = useState<string>('');
    const getUniqueContributors = async (onClick?: boolean) => {
        try {
            let uniqueContributors = await contract.methods.getUniqueContributors().call();
            setUniqueContributors(uniqueContributors);
            onClick && showToastUtil({ status: TOAST_TYPE.SUCCESS, message: 'Updated successfully!' });
        } catch (e) {
            showToastUtil({ status: TOAST_TYPE.ERROR });
            console.error(e);
        }
    }

    const [contractBalance, setContractBalance] = useState<string>('');
    const getContractBalance = async (onClick?: boolean) => {
        try {
            // let balance = await web3.eth.getBalance(contract.options.address);
            let balance = await contract.methods.getFundBalance().call();
            balance = web3.utils.fromWei(balance, 'ether');
            setContractBalance(balance);
            onClick && showToastUtil({ status: TOAST_TYPE.SUCCESS, message: 'Updated successfully!' });
        } catch (e) {
            showToastUtil({ status: TOAST_TYPE.ERROR });
            console.error(e);
        }
    }

    const [contributionVal, setContributionVal] = useState<string>('');
    const [inputAddress, setInputAddress] = useState<string>('')
    const getContributionsMap = async () => {
        try {
            let contributionVal = await contract.methods.contributions(inputAddress).call();
            contributionVal = web3.utils.fromWei(contributionVal, 'ether');
            setContributionVal(contributionVal);
            showToastUtil({ status: TOAST_TYPE.SUCCESS, message: 'Fetched contribution successfully!' })
        } catch (e) {
            showToastUtil({ status: TOAST_TYPE.ERROR });
            console.error(e);
        }
    }

    useEffect(() => {
        getTotalAmtRaised();
        getUniqueContributors();
        getContractBalance();
    }, []);

    return (<>
        <div className={styles.Container}>
            <div className={styles.Row}>
                <div>{'Total Amount Raised:'}</div>
                <div>{totalAmtRaised}{' (ether)'}</div>
                <button onClick={() => getTotalAmtRaised(true)}>{'Update'}</button>
            </div>
            <div className={styles.Row}>
                <div>{'Total no. of Unique Contributers:'}</div>
                <div>{uniqueContributors}{' (count)'}</div>
                <button onClick={() => getUniqueContributors(true)}>{'Update'}</button>
            </div>
            <div className={styles.Row}>
                <div>{'Contract Balance (Current):'}</div>
                <div>{contractBalance}{' (ether)'}</div>
                <button onClick={() => getContractBalance(true)}>{'Update'}</button>
            </div>
            <div className={styles.Row}>
                <input value={inputAddress} placeholder='Enter User Wallet address'
                    onChange={e => setInputAddress(e.target.value)}
                ></input>
                <button onClick={getContributionsMap}>{'Get Total Contribution by User'}</button>
                <div>{contributionVal}{' (ether)'}</div>
            </div>
        </div>
    </>);
}

export default Campaign;