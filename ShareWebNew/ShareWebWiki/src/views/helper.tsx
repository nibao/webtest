import * as React from 'react';
import Chip from '../../ui/Chip/ui.desktop';
import * as styles from './styles.css';

/**
 * 格式化数据类型
 * @param type 数据类型
 */
export function typeFormatter(type) {

    const types = Array.isArray(type) ? type : [type];

    if (Array.isArray(type)) {
        return type.map(t => (
            <div className={ styles['chip-wrap'] }>
                <Chip className={ styles['chip-option'] }>{ t }</Chip>
            </div>
        ))
    } else {
        return types.map(type => {
            switch (type) {
                case String:
                    return (
                        <div className={ styles['chip-wrap'] }>
                            <Chip className={ styles['chip-type'] }>string</Chip>
                        </div>
                    );

                case Number:
                    return (
                        <div className={ styles['chip-wrap'] }>
                            <Chip className={ styles['chip-type'] }>number</Chip>
                        </div>
                    );

                case Boolean:
                    return (
                        <div className={ styles['chip-wrap'] }>
                            <Chip className={ styles['chip-type'] }>boolean</Chip>
                        </div>
                    );

                case Object:
                    return (
                        <div className={ styles['chip-wrap'] }>
                            <Chip className={ styles['chip-type'] }>Object</Chip>
                        </div>
                    );

                case Array:
                    return (
                        <div className={ styles['chip-wrap'] }>
                            <Chip className={ styles['chip-type'] }>Array</Chip>
                        </div>
                    );

                case Function:
                    return (
                        <div className={ styles['chip-wrap'] }>
                            <Chip className={ styles['chip-type'] }>Function</Chip>
                        </div>
                    );

                default:
                    return type
            }
        })
    }
}