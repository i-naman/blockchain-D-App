import toast from 'react-hot-toast';

export enum TOAST_TYPE {
    SUCCESS,
    ERROR,
    INFO_MINT
}

export interface ToastUtilParams {
    status: TOAST_TYPE,
    message ?: string
}

export const showToastUtil = (params: ToastUtilParams) => {
    const { status, message } = params;
    switch (status) {
        case TOAST_TYPE.SUCCESS:
            const successMsg = message ?? 'Success!'
            toast.success(successMsg, {
                duration: 10000,
                position: 'top-right',
                style: {
                    border: '1px solid #713200',
                    padding: '20x',
                    backgroundColor: '#aff59a',
                },
            });        
            break;
        case TOAST_TYPE.INFO_MINT:
            const infoMintMsg = 'Thank you for your contribution!\n Check out the TYF NFT section to get your own TYF NFTs.'
            toast.success(infoMintMsg, {
                duration: 10000,
                position: 'top-right',
                style: {
                    border: '1px solid #713200',
                    padding: '20x',
                    backgroundColor: '#9fd4ed',
                },
            });        
            break;
        case TOAST_TYPE.ERROR:
        default:
            let errorMsg = message ?? 'Sorry! Encountered an error.\nPlease check inputs and try again.'
            toast.error(errorMsg, {
                duration: 10000,
                position: 'top-right',
                style: {
                    border: '1px solid #713200',
                    padding: '20x',
                    backgroundColor: '#f28888',
                },
            });        
            break;
    }
}
