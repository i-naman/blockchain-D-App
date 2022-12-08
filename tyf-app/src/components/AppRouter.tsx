import React, { useEffect, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom';
import Navbar, { NavBarLinkProps } from './NavBar';
import { IPropsWeb3 } from '../interfaces';
import styles from '../styles/Main.module.css';
import Campaign from './Campaign';
import Contribute from './Contribute';
import Requests from './Requests';
import Admin from './Admin';
import { Toaster } from 'react-hot-toast';
import NFT from './NFT';
import ComingSoon from './ComingSoon';

export const RouteUrls = {
    Root: "/",
    Campaign: "campaign",
    Contribute: "contribute",
    Requests: "requests",
    Admin: "admin",
    Mint: "mint",
    Next: "next",
};

const navLinkClasses = {
    activeClassName: 'SubNavbarLinkActive',
    className: 'SubNavbarLink'
}
const NavLinks: NavBarLinkProps[] = [
    {
        ...navLinkClasses,
        text: "Campaign Info",
        to: RouteUrls.Campaign,
    },
    {
        ...navLinkClasses,
        text: "Contribute",
        to: RouteUrls.Contribute,
    },
    {
        ...navLinkClasses,
        text: "Approve Requests",
        to: RouteUrls.Requests,
    },
    {
        ...navLinkClasses,
        text: "TYF NFTs",
        to: RouteUrls.Mint,
    },
    {
        ...navLinkClasses,
        text: "Coming Soon (Beta)",
        to: RouteUrls.Next,
    }
];
const AdminLink: NavBarLinkProps = {
    ...navLinkClasses,
    text: "Admin",
    to: RouteUrls.Admin,
}


const SubPages = (params: IPropsWeb3 & {isAdmin: boolean}) => {
    const {isAdmin, ...props} = params;
    return (
        <Routes>
            <Route path={RouteUrls.Campaign} element={<Campaign {...props}></Campaign>} />
            <Route path={RouteUrls.Contribute} element={<Contribute {...props}></Contribute>} />
            <Route path={RouteUrls.Requests} element={<Requests {...props}></Requests>} />
            <Route path={RouteUrls.Mint} element={<NFT {...props}></NFT>} />
            <Route path={RouteUrls.Next} element={<ComingSoon {...props}></ComingSoon>} />
            {isAdmin && <Route path={RouteUrls.Admin} element={<Admin {...props}></Admin>} />}
            <Route path={`${RouteUrls.Root}*`} element={<Navigate to={RouteUrls.Contribute} replace={true} />} />
        </Routes>
    );
};

const AppRouter = (props: IPropsWeb3) => {
    const { web3, contract } = props;

    const [isAdmin, setAdmin] = useState<boolean>(false);

    useEffect(() => {
        const checkIfAdmin = async() => {
            try {
                const [account, ...accs] = await web3.eth.getAccounts();
                const adminAcc = await contract.methods.admin().call();
                setAdmin(account === adminAcc)
            } catch(e) {
                setAdmin(true)
                // setAdmin(false)
            }
        };
        checkIfAdmin()
    }, []);

    return (<>
        <div className={styles.Container}>
            <div className={styles.subNavHeaderContainer}>
                <div className={styles.subNavHeaderLinksContainer}>
                    <Navbar links={isAdmin ? [...NavLinks, AdminLink] : NavLinks} />
                </div>
            </div>
            <div className={styles.SubTabContentContainer}>
                <SubPages {...props} isAdmin={isAdmin} />
            </div>
            <Toaster />

        </div>
    </>);
}
export default AppRouter;