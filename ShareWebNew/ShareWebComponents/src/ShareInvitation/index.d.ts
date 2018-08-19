declare namespace Components {
    namespace ShareInvitation {
        interface Props extends React.Props<void> {
            doc: Core.APIs.EACHTTP.EntryDoc | Core.APIs.EFSHTTP.Doc;

            swf: string;

            uploadSwf: string;
        }

        interface State {
            status: number;
            fullLink: string;
            invitationid: string;
            invitationendtime: number;
            perm: {
                allow: number
            };
            permendtime: number;
            descriptionDialog: boolean;
            image: string;
            description: string;
            uploadStatus: number;
            change: boolean;
            reqStatus: number;
            indefiniteperm: boolean;
        }

        interface Component extends React.Component<Props, State> {
        }
    }
}

