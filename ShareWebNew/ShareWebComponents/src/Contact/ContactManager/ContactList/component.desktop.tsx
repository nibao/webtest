import * as React from 'react';
import { noop } from 'lodash';
import DataGrid from '../../../../ui/DataGrid/ui.desktop';
import Text from '../../../../ui/Text/ui.desktop';
import UIIcon from '../../../../ui/UIIcon/ui.desktop';
import Icon from '../../../../ui/Icon/ui.desktop';
import Centered from '../../../../ui/Centered/ui.desktop';
import __ from './locale';
import * as loading from '../assets/loading.gif';
import * as empty from '../assets/empty.png';
import * as styles from './styles.desktop.css';


const ContactList: React.StatelessComponent<Components.ContactList.Props> = function ContactList({
    persons = [],
    lazyLoad = true,
    isLoading = false,
    getKey = noop,
    getList = noop,
    setLocation = noop,
    onPageChange = noop,
    deleteContactPerson = noop,
    getDefaultSelection = noop,
    onPersonSelectionChange = noop,
}) {
    let EmtpyComponent =
        <Centered>
            <div className={styles['loading-box']} >
                <Icon
                    url={empty}
                    size={64}
                />
                {
                    <div className={styles['loading-message']}>{__('您还没有添加联系人')}</div>
                }
            </div>
        </Centered>

    return (
        <div className={styles['container']}>
            {

                isLoading ?
                    <div className={styles['loading']}>
                        <Centered>
                            <div className={styles['loading-box']}>
                                <Icon
                                    url={loading}
                                    size={48}
                                />
                                <div className={styles['loading-message']} >
                                    {__('正在加载，请稍候......')}
                                </div>
                            </div>
                        </Centered>
                    </div>
                    :
                    null
            }

            {
                lazyLoad ?
                    <DataGrid
                        ref={(ref) => getList(ref)}
                        data={persons}
                        select={true}
                        headHeight={30}
                        located={true}
                        getKey={getKey}
                        height={'100%'}
                        lazyLoad={lazyLoad}
                        locator={setLocation}
                        onPageChange={onPageChange}
                        EmtpyComponent={!isLoading && EmtpyComponent}
                        onSelectionChange={(selection) => onPersonSelectionChange([selection])}
                        getDefaultSelection={getDefaultSelection}
                    >
                        <DataGrid.Field
                            label={__('显示名')}
                            field="username"
                            width="30"
                            formatter={(username, person) => (
                                <Text
                                    className={styles['text-lineheight']}
                                    ellipsizeMode={'tail'}
                                    numberOfChars={20}
                                >
                                    {username}
                                </Text>
                            )}
                        />

                        <DataGrid.Field
                            label={__('邮箱地址')}
                            field="email"
                            width="30"
                            formatter={(email, person) => (
                                <Text
                                    className={styles['text-lineheight']}
                                    ellipsizeMode={'tail'}
                                    numberOfChars={25}
                                >
                                    {email}
                                </Text>
                            )}
                        />

                        <DataGrid.Field
                            label={__('部门')}
                            field="departname"
                            width="30"
                            formatter={(departname, person) => (
                                <Text
                                    className={styles['text-lineheight']}
                                    ellipsizeMode={'tail'}
                                    numberOfChars={25}
                                >
                                    {departname.join(',')}
                                </Text>
                            )}
                        />

                        <DataGrid.Field
                            label={__('操作')}
                            field="operation"
                            width="10"
                            formatter={(operation, person) => (
                                <span>
                                    <UIIcon
                                        code={'\uf046'}
                                        size="14px"
                                        onClick={() => deleteContactPerson(person)}
                                    />
                                </span>

                            )}
                        />

                    </DataGrid>
                    :
                    null
            }


        </div >
    );
}
export default ContactList;