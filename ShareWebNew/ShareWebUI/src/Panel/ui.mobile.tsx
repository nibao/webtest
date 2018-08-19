import * as React from 'react';
import PanelMain from '../Panel.Main/ui.mobile';
import PanelFooter from '../Panel.Footer/ui.mobile';
import PanelButton from '../Panel.Button/ui.mobile';

const Panel: UI.Panel.Component = function Panel({ children }) {
    return (
        <div>
            {
                children
            }
        </div>
    )
} as UI.Panel.Component

Panel.Main = PanelMain;

Panel.Footer = PanelFooter;

Panel.Button = PanelButton;

export default Panel;