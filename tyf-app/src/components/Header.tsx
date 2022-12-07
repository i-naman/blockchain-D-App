
import React from "react";
import styles from '../styles/Header.module.css';

interface HeaderProps {};

const Header = (props: HeaderProps) => {
    return (
        <div id='appHeader' className={styles.HeaderContainer}>
            {'Trust Your Fund'}
            {/* <HeaderLogo /> */}
            {/* {showLinks && <>
                <div id='linksContainer' className={styles.NavLinksContainer}><Navbar links={[...DefaultHeaderNavLinks, AdminPageNavLink]} /></div>
                <DownloadsController appStore={appStore} />
            </>}
            <UserProfile appStore={appStore} /> */}
        </div>
    );
}

export default Header;