import React, { useState, useEffect } from 'react'
import { IPropsWeb3 } from '../interfaces';
import styles from '../styles/Component.module.css';
import { showToastUtil, TOAST_TYPE } from './ToastUtil';

interface TyfNftData {
    name: string,
    symbol: string,
    totalSupply: number
    MAX_SUPPLY: number
    MAX_SUPPLY_USER: number
}

const NFT = (props: IPropsWeb3) => {
    const { contract, web3 } = props;

    const [nftData, setNftData] = useState<TyfNftData>({ name: '', symbol: '', totalSupply: 0, MAX_SUPPLY: 0, MAX_SUPPLY_USER: 0 });
    const getNftData = async () => {
        try {
            const name = await contract.methods.name().call();
            const symbol = await contract.methods.symbol().call();
            const totalSupply = await contract.methods.totalSupply().call();
            const MAX_SUPPLY = await contract.methods.MAX_SUPPLY().call();
            const MAX_SUPPLY_USER = await contract.methods.MAX_SUPPLY_USER().call();
            setNftData({ name, symbol, totalSupply, MAX_SUPPLY, MAX_SUPPLY_USER });
        } catch (e) {
            showToastUtil({ status: TOAST_TYPE.ERROR });
            console.error(e);
        }
    }

    const [inputId1, setInputId1] = useState<string>('');
    const [userTokenBal, setUserTokenBal] = useState<number | string>('');
    const [tokenIds, setTokenIds] = useState<string>('');
    const getUserTokenBal = async () => {
        try {
            const bal: number = await contract.methods.balanceOf(inputId1).call();
            setUserTokenBal(bal);
            let ids: string[] = [];
            for (let i = 0; i < bal; i++) {
                const tokenId = await contract.methods.tokenOfOwnerByIndex(inputId1, i).call();
                ids.push(tokenId);
            }
            setTokenIds(ids.join(', '));
            showToastUtil({ status: TOAST_TYPE.SUCCESS, message: 'Updated Token Balance and IDs successfully!' });
        } catch (e) {
            showToastUtil({ status: TOAST_TYPE.ERROR });
            console.error(e);
        }
    }

    const [inputId2, setInputId2] = useState<string>('');
    const [tokenUri, setTokenUri] = useState<string>('');
    const getTokenUri = async () => {
        try {
            const uri: string = await contract.methods.tokenURI(inputId2).call();
            setTokenUri(uri);
            showToastUtil({ status: TOAST_TYPE.SUCCESS, message: 'Retrieved Token Uri successfully!' });
        } catch (e) {
            showToastUtil({ status: TOAST_TYPE.ERROR });
            console.error(e);
        }
    }

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

    const [uri, setUri] = useState<string>('');
    const mintNft = async () => {
        try {
            // const ethers = web3.utils.toWei(amt, 'wei');
            const [account, ...accs] = await web3.eth.getAccounts();
            let res = await contract.methods.safeMint(account, uri).send({ from: account, value: 0 });
            console.log('res', res);
            showToastUtil({ status: TOAST_TYPE.SUCCESS, message: 'Minted successfully!' });
            getNftData();
        } catch (e) {
            showToastUtil({ status: TOAST_TYPE.ERROR });
            console.error(e);
        }
    }

    useEffect(() => {
        getNftData();
    }, []);


    return (<>
        <div className={styles.Container}>
            <div className={styles.Row}>
                <div>{`NFT Token Name: ${nftData.name}`}</div>
                <div>{`NFT Token Symbol: ${nftData.symbol}`}</div>
            </div>
            <div className={styles.Row}>
                <div>{`Total supply in circulation: ${nftData.totalSupply}`}</div>
                <div>{`Max Limit: ${nftData.MAX_SUPPLY}`}</div>
                <div>{`Max Limit per User: ${nftData.MAX_SUPPLY_USER}`}</div>
            </div>
            <div className={styles.Row}>
                <input value={inputId1} placeholder='Enter Wallet ID' onChange={e => setInputId1(e.target.value.trim())} ></input>
                <button onClick={() => getUserTokenBal()}>{'Check Token Balance and Token IDs'}</button>
                <div>{`Count: ${userTokenBal}`}</div>
                <div>{`Token IDs: ${tokenIds}`}</div>
            </div>
            <div className={styles.Row}>
                <input value={inputId2} placeholder='Enter Token ID' onChange={e => setInputId2(e.target.value.trim())} ></input>
                <button onClick={() => getTokenUri()}>{'Get Token URI'}</button>
                <div>{`URI: ${tokenUri}`}</div>
            </div>
            <div className={styles.Row}>
                <input value={uri} placeholder='Enter Asset URI' onChange={e => setUri(e.target.value.trim())} ></input>
                <button onClick={() => mintNft()}>{'Mint your own NFT!'}</button>
                <div>{'(We recommend you to use a IPFS asset URI)'}</div>
            </div>
        </div>
    </>);
}

export default NFT;