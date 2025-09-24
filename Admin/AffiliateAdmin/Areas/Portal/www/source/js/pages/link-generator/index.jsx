import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import ClaimPrincipal from '../../modules/claim';
import SubMenuList from '../common/components/SubMenuList';
import { menus } from './libs/menus';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import ErrorBoundary from '@/components/ErrorBoundary';

const App = () => {
    const getRenderMenuItems = () => {
        const claims = ClaimPrincipal.currentClaimPrincipal;
        const renderMenuList = menus.filter((menu) => menu.renderClaim === undefined || claims.hasClaim(menu.renderClaim));
        return renderMenuList;
    }

    const renderMenuList = getRenderMenuItems();
    const imgSrc = 'Areas/Portal/www/dist/imgs/i_landing.png';
    const firstMenu = renderMenuList[0];

    return (
        <ErrorBoundary>
            <Router forceRefresh={true}>
                <SubMenuList
                    img={imgSrc}
                    menus={renderMenuList.map((menu) => { return { label: menu.label, href: menu.href } })}
                    menuTitle="Link Generator"
                />
                <Suspense fallback={<div>Loading...</div>}>
                    <Switch>
                        {renderMenuList.map((menu, index) => (
                            <Route
                                key={`route_${index}`}
                                path={menu.href}
                                component={menu.component}
                                exact
                            />
                        ))}
                        {firstMenu && <Redirect from="/" to={firstMenu.href} exact />}
                    </Switch>
                </Suspense>
                <ToastContainer className="link-generator-toast-container" />
            </Router>
        </ErrorBoundary>
    );
};

ReactDOM.render(<App />, document.getElementById("root"));