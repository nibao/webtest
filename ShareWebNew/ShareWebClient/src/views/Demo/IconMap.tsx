import * as React from 'react'
import UIIcon from '../../../ui/UIIcon/ui.desktop'
import Grid from '../../../ui/Grid/ui.desktop'

export default class IconMap extends React.Component<any, any>{

    state = {
        startHex: 'f000',
        endHex: 'f0a0',
        icons: [],
        cols: 0,
        marginRight: 0
    }

    componentDidMount() {
        this.list()
        this.calGrid()
        window.addEventListener('resize', this.calGrid)
    }

    handleChange(state) {
        this.setState(state)
    }

    calGrid = () => {
        const container = this.refs['container']
        if (container) {
            this.setState({
                cols: Math.floor(container.offsetWidth / 100),
                marginRight: container.offsetWidth % 100
            })
        }
    }

    list(e?) {
        e && e.preventDefault()
        const { startHex, endHex } = this.state
        let start = parseInt(startHex, 16),
            end = parseInt(endHex, 16)
        this.setState({
            icons: Array.from({ length: end - start + 1 }, (icon, i) => {
                let hex = (start + i).toString(16),
                    code = unescape(`%u${hex}`)
                return { hex, code }
            })
        })
    }

    render() {
        const { startHex, endHex } = this.state
        return (
            <div style={{height: '100%', overflow: 'auto'}}>
                <form onSubmit={this.list.bind(this)}>
                    <label style={{ marginRight: 10 }}>
                        start: <input type='text' value={startHex} onChange={e => this.handleChange({ startHex: e.target.value })} />
                    </label>
                    <label style={{ marginRight: 10 }}>
                        end: <input type='text' value={endHex} onChange={e => this.handleChange({ endHex: e.target.value })} />
                    </label>
                    <button type='submit'>OK</button>
                </form>
                <div ref="container">
                    <div style={{ marginRight: this.state.marginRight, borderTop: '1px solid #c0c0c0', borderLeft: '1px solid #c0c0c0' }}>
                        <Grid cols={this.state.cols}>
                            {
                                this.state.icons.map(({ hex, code }) => (
                                    <div style={{ width: 100, padding: '20px 0', textAlign: 'center' }}>
                                        <UIIcon code={code} size={40} />
                                        <div style={{ lineHeight: '30px' }} >{hex}</div>
                                    </div>
                                ))
                            }
                        </Grid>
                    </div>
                </div>
            </div>
        )
    }
}