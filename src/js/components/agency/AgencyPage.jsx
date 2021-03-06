/**
 * AgencyPage.jsx
 * Created by Kevin Li 6/8/17
 */

import React from 'react';
import PropTypes from 'prop-types';

import { agencyPageMetaTags } from 'helpers/metaTagHelper';

import Footer from 'containers/Footer';
import MetaTags from 'components/sharedComponents/metaTags/MetaTags';
import Header from 'components/sharedComponents/header/Header';
import StickyHeader from 'components/sharedComponents/stickyHeader/StickyHeader';

import AgencyLoading from './AgencyLoading';
import AgencyError from './AgencyError';

import AgencyContent from './AgencyContent';

const propTypes = {
    loading: PropTypes.bool,
    error: PropTypes.bool,
    id: PropTypes.string,
    agency: PropTypes.object,
    lastUpdate: PropTypes.string
};

export default class AgencyPage extends React.Component {
    render() {
        let content = <AgencyContent {...this.props} />;
        if (this.props.loading) {
            content = (<AgencyLoading />);
        }
        else if (this.props.error) {
            content = (<AgencyError />);
        }

        return (
            <div className="usa-da-agency-page">
                <MetaTags {...agencyPageMetaTags} />
                <Header />
                <StickyHeader>
                    <div className="sticky-header__title">
                        <h1 tabIndex={-1} id="main-focus">
                            Agency Profile
                        </h1>
                    </div>
                </StickyHeader>
                <main
                    id="main-content"
                    className="main-content">
                    {content}
                </main>
                <Footer />
            </div>
        );
    }
}

AgencyPage.propTypes = propTypes;
