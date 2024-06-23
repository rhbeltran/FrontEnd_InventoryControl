import React, {useEffect, useState} from "react";
import { useLocation } from "react-router-dom";

const MaybeShowNavBar = ({ children }) => {
 const location = useLocation();
const [showNavBar, setShowNavBar] = useState(true);

 useEffect(() => {
    console.log( 'this is location: ', location.pathname);
    if(location.pathname === '/login') {
        setShowNavBar(false);
    } else {
        setShowNavBar(true);
    }
    }, [location]);

    return (
        <div>{showNavBar && children}</div>
    );  
};

export default MaybeShowNavBar;