import * as React from 'react';
import ContactButtons from './ContactButtons/component.desktop';
import ContactGroups from './ContactGroups/component.desktop';
import ContactList from './ContactList/component.desktop';
import ContactSearch from './ContactSearch/component.desktop';
import ContactManagerBase from './component.base';
import * as styles from './styles.desktop.css';

export default class ContactManager extends ContactManagerBase {

    render() {
        let { lazyLoad, groups, persons, isLoading, groupSelection } = this.state;
        return (
            <div className={styles['contact-manager']}>
                <ContactButtons
                    groups={groups}
                    groupSelection={groupSelection}
                    onCreateGroup={this.props.onCreateGroup}
                    onModifyGroup={this.props.onModifyGroup}
                    onDeleteGroup={this.props.onDeleteGroup}
                    onBatchAddContacts={this.props.onBatchAddContacts}
                />

                <div className={styles['contact-search']}>
                    <ContactSearch
                        width={250}
                        onSelect={this.handleSelectSearchResult.bind(this)}
                    />
                </div>

                <div className={styles['contact-group']}>
                    <ContactGroups
                        groups={groups}
                        getDefaultSelection={this.handleGroupDefaultSelection.bind(this)}
                        onGroupSelectionChange={this.handleGroupSelectionChange.bind(this)}
                    />
                </div>

                <div className={styles['contact-list']}>
                    <ContactList
                        ref="persons"
                        persons={persons}
                        lazyLoad={lazyLoad}
                        isLoading={isLoading}
                        setKey={this.handleSetListKey.bind(this)}
                        setLocation={this.handleSetLocation.bind(this)}
                        onPageChange={this.handleLazyLoadList.bind(this)}
                        deleteContactPerson={this.handleDeleteContactPerson.bind(this)}
                        getDefaultSelection={this.handleListDefaultSelection.bind(this)}
                        onPersonSelectionChange={this.handlePersonSelectionChange.bind(this)}
                        getList={this.handleGetList.bind(this)}
                    />
                </div>


            </div>
        )
    }
}