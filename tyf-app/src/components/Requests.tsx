import React, { useState, useEffect } from 'react'
import styles from '../styles/Component.module.css';
import Table from 'rc-table';
import { IPropsWeb3, Request } from '../interfaces';
import { showToastUtil, TOAST_TYPE } from './ToastUtil';

const _TablColumns = [
    { title: 'Request ID', dataIndex: '_id', key: '_id', ellipsis: true },
    { title: 'Description', dataIndex: 'description', key: 'description', ellipsis: true },
    { title: 'Recipient Wallet', dataIndex: 'recipient', key: 'recipient', ellipsis: true },
    { title: 'Transfer Amount', dataIndex: 'value', key: 'value', ellipsis: true },
    { title: 'Unique Voter Count', dataIndex: 'numberOfVoters', key: 'numberOfVoters', ellipsis: true },
    { title: 'Completed', dataIndex: 'completed', key: 'completed', ellipsis: true, render: (value: boolean) => <span>{`${value}`}</span> },
];


const Requests = (props: IPropsWeb3) => {
    const { contract, web3 } = props;

    const [lenRequests, setLenRequests] = useState<number>(0);
    const getLenRequests = async (onClick?: boolean) => {
        try {
            let lenRequests = await contract.methods.getLengthRequests().call();
            setLenRequests(parseInt(lenRequests as string));
            onClick && showToastUtil({ status: TOAST_TYPE.SUCCESS, message: 'Updated successfully!' });
        } catch (e) {
            showToastUtil({ status: TOAST_TYPE.ERROR });
            console.error(e);
        }
    }

    const [allRequests, setRequests] = useState<Request[]>([]);
    const getRequests = async () => {
        try {
            let reqs: Request[] = [];
            for (let i = 0; i < lenRequests; i++) {
                let request = await contract.methods.requests(i).call();
                const req: Request = { _id: i, key: i, ...request };
                reqs.push(req);
            }
            setRequests(reqs)
        } catch (e) {
            showToastUtil({ status: TOAST_TYPE.ERROR });
            console.error(e);
        }
    }

    const voteForRequest = async (index: number) => {
        try {
            const [account, ...accs] = await web3.eth.getAccounts();
            await contract.methods.voteForRequest(index).send({ from: account, value: 0 });            
            getRequests();
            showToastUtil({ status: TOAST_TYPE.SUCCESS, message: 'Your vote was recorded successfully!' });
        } catch (e) {
            showToastUtil({ status: TOAST_TYPE.ERROR, message: 'Sorry! Encountered an error.\n(Note: WalletID must have contributed and can vote for a request only once.)' });
            console.error(e);
        }
    }

    useEffect(() => {
        getLenRequests();
    }, []);

    useEffect(() => {
        getRequests();
    }, [lenRequests]);

    const TablColumns = [
        ..._TablColumns,
        { title: 'Vote', dataIndex: '_id', key: '_vote', ellipsis: true, render: (value: number, row: any) => <button disabled={row?.completed} onClick={() => voteForRequest(value)}>{'Vote'}</button> },
    ];

    return (<>
        <div className={styles.Container}>
            <div className={styles.Row}>
                <div>{'Total number of Spending Requests:'}</div>
                <div>{lenRequests}{' (requests)'}</div>
                <button onClick={() => getLenRequests(true)}>{'Update'}</button>
            </div>
            <div className={styles.Table}>
                <Table
                    columns={TablColumns}
                    data={allRequests}
                />
            </div>
        </div>
    </>);
}

export default Requests;