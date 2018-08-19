import * as React from 'react'
import UIIcon from '../../UIIcon/ui.desktop'
import Slider from '../../Slider/ui.desktop'
import { secToHHmmss } from '../../../util/formatters/formatters'
import * as styles from './styles.desktop.css'

export default class Controls extends React.Component<any, any>{
    render() {
        let { style = {}, paused, ended, duration, fullScreen, currentTime, muted, volume, onPause, onPlay, onSetPosition, onMute, onSetVolume, onToggleFullScreen, definitions } = this.props
        return (
            <div className={styles['container']} style={style}>
                <div className={styles['left']}>
                    {
                        paused ?
                            <UIIcon code={'\uf034'} color="#fff" size={16} onClick={() => onPlay(ended ? 0 : currentTime)} className={styles['icon-button']} /> :
                            <UIIcon code={'\uf035'} color="#fff" size={16} onClick={onPause} className={styles['icon-button']} />
                    }
                    <span className={styles['time']}>{`${secToHHmmss(currentTime)} / ${secToHHmmss(duration)}`}</span>
                </div>
                <div className={styles['center']}>
                    <Slider min={0} max={duration} axis='x' value={currentTime} length={'100%'} step={1} onChange={onSetPosition} />
                </div>
                <div className={styles['right']}>
                    <UIIcon code={muted ? '\uf036' : '\uf037'} color="#fff" size={16} onClick={onMute} className={styles['icon-button']} />
                    <Slider min={0} max={1} axis='x' value={volume} length={100} step={1} onChange={onSetVolume} />
                    <UIIcon code={fullScreen ? '\uf039' : '\uf038'} color="#fff" size={16} onClick={onToggleFullScreen} className={styles['icon-button']} />
                </div>
            </div>
        )
    }
}