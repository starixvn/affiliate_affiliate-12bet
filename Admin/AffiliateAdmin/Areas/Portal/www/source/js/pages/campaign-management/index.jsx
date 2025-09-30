import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import ClaimPrincipal from '@/modules/claim';
import SubMenuList from '@/pages/common/components/SubMenuList';
import { menuKey, relativePath } from './constants/menu';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

const AllCampaigns = React.lazy(() => import('./pages/all-campaign/index'));
const ComponentManagement = React.lazy(() => import('./pages/component-management/index'));

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{ padding: '20px' }}>
                    <h2>Something went wrong.</h2>
                    <details style={{ whiteSpace: 'pre-wrap' }}>
                        <summary>Error details</summary>
                        {this.state.error && this.state.error.toString()}
                    </details>
                </div>
            );
        }

        return this.props.children;
    }
}

const menus = [
    { key: menuKey.allCampaigns, label: 'All Campaigns', href: relativePath.allCampaigns, component: AllCampaigns },
    { key: menuKey.componentManagement, label: 'Component Management', href: relativePath.componentManagement, component: ComponentManagement },
];

const App = () => {
    const getRenderMenuItems = () => {
        const claims = ClaimPrincipal.currentClaimPrincipal;
        const renderMenuList = menus.filter((menu) => menu.renderClaim === undefined || claims.hasClaim(menu.renderClaim));
        return renderMenuList;
    }

    const renderMenuList = getRenderMenuItems();
    const imgSrc = 'Areas/Portal/www/dist/imgs/i_campaign_management.png';
    const firstMenu = renderMenuList[0];

    return (
        <ErrorBoundary>
            <Router>
                <SubMenuList
                    img={imgSrc}
                    menus={renderMenuList.map((menu) => { return { label: menu.label, href: menu.href } })}
                    menuTitle="Campaign Management"
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
                        {firstMenu && <Redirect exact from="/" to={firstMenu.href} />}
                    </Switch>
                </Suspense>
                <ToastContainer className="campaign-management-toast-container" />
            </Router>
        </ErrorBoundary>
    );
};

ReactDOM.render(<App />, document.getElementById("root"));
